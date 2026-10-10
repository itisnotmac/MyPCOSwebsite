import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const type = (body?.type || '').toString().trim();
    const sr = base44.asServiceRole;

    // Derive author identity server-side from the caller's profile — client-supplied
    // author_* fields are ignored, so they cannot be used to impersonate another member.
    const profiles = await sr.entities.Profile.filter({ user_id: user.id });
    const profile = (profiles && (profiles.items ? profiles.items[0] : profiles[0])) || null;
    const authorName = profile?.display_name || user.full_name || 'Member';
    const authorAvatar = profile?.avatar_url || '';
    const author = { author_name: authorName, author_avatar_url: authorAvatar, author_id: user.id };

    if (type === 'question') {
      const title = (body?.title || '').toString().trim();
      const qbody = (body?.body || '').toString().trim();
      const tags = Array.isArray(body?.tags) ? body.tags : [];
      if (!title || !qbody) return Response.json({ error: 'Title and body are required' }, { status: 400 });
      if (title.length > 200 || qbody.length > 5000) return Response.json({ error: 'Question is too long' }, { status: 400 });
      const created = await sr.entities.Question.create({ title, body: qbody, tags, ...author });
      return Response.json(created);
    }

    if (type === 'answer') {
      const questionId = (body?.question_id || '').toString().trim();
      const ansBody = (body?.body || '').toString().trim();
      if (!questionId || !ansBody) return Response.json({ error: 'question_id and body are required' }, { status: 400 });
      if (ansBody.length > 5000) return Response.json({ error: 'Answer is too long' }, { status: 400 });
      const question = await sr.entities.Question.get(questionId);
      if (!question) return Response.json({ error: 'Question not found' }, { status: 404 });
      const created = await sr.entities.Answer.create({ question_id: questionId, body: ansBody, ...author });
      // Notify the question author server-side (derived content, legitimate recipient only)
      if (question.author_id && question.author_id !== user.id) {
        await sr.entities.Notification.create({
          to_user_id: question.author_id,
          type: 'new_answer',
          content: `${authorName} answered your question "${question.title}"`,
          related_id: questionId,
          read: false
        });
      }
      return Response.json(created);
    }

    if (type === 'community_message') {
      const content = (body?.content || '').toString().trim();
      if (!content) return Response.json({ error: 'Content is required' }, { status: 400 });
      if (content.length > 2000) return Response.json({ error: 'Message is too long' }, { status: 400 });
      const created = await sr.entities.CommunityMessage.create({
        content, author_name: authorName, author_avatar_url: authorAvatar
      });
      return Response.json(created);
    }

    return Response.json({ error: 'Unknown post type' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}