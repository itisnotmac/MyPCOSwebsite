import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const answerId = (body?.answer_id || '').toString().trim();
    if (!answerId) return Response.json({ error: 'answer_id is required' }, { status: 400 });

    const sr = base44.asServiceRole;
    const answer = await sr.entities.Answer.get(answerId);
    if (!answer) return Response.json({ error: 'Answer not found' }, { status: 404 });

    const question = await sr.entities.Question.get(answer.question_id);
    if (!question) return Response.json({ error: 'Question not found' }, { status: 404 });

    const isOwner = question.created_by_id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return Response.json({ error: 'Only the person who asked the question can mark answers helpful' }, { status: 403 });
    }

    const updated = await sr.entities.Answer.update(answerId, { helpful: !answer.helpful });
    return Response.json({ ok: true, helpful: updated.helpful });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}