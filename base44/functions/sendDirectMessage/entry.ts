import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const toUserId = (body?.to_user_id || '').toString().trim();
    const content = (body?.content || '').toString().trim();
    if (!toUserId || !content) return Response.json({ error: 'Recipient and message are required' }, { status: 400 });
    if (toUserId === user.id) return Response.json({ error: 'You cannot message yourself' }, { status: 400 });
    if (content.length > 2000) return Response.json({ error: 'Message is too long' }, { status: 400 });

    const sr = base44.asServiceRole;

    // Verify an accepted friendship exists in either direction
    const q = {
      status: 'accepted',
      $or: [
        { from_user_id: user.id, to_user_id: toUserId },
        { from_user_id: toUserId, to_user_id: user.id }
      ]
    };
    const res = await sr.entities.Friendship.filter(q);
    const found = (res.items || res || []).length > 0;
    if (!found) return Response.json({ error: 'You can only send messages to friends' }, { status: 403 });

    const dm = await sr.entities.DirectMessage.create({ to_user_id: toUserId, content, read: false });
    await sr.entities.Notification.create({
      to_user_id: toUserId,
      type: 'new_dm',
      content: 'You received a new message',
      related_id: user.id,
      read: false
    });

    return Response.json({ ok: true, id: dm.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}