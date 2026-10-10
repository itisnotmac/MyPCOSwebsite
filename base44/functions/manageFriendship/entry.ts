import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const action = (body?.action || '').toString().trim();
    const targetUserId = (body?.to_user_id || '').toString().trim();
    if (!action || !targetUserId) return Response.json({ error: 'action and to_user_id are required' }, { status: 400 });
    if (targetUserId === user.id) return Response.json({ error: 'Cannot perform this action on yourself' }, { status: 400 });

    const sr = base44.asServiceRole;

    // Resolve display names server-side from profile records (never trust client-supplied identity)
    const myProfiles = await sr.entities.Profile.filter({ user_id: user.id });
    const myProfile = (myProfiles && (myProfiles.items ? myProfiles.items[0] : myProfiles[0])) || null;
    const myName = myProfile?.display_name || user.full_name || 'Member';
    const targetProfiles = await sr.entities.Profile.filter({ user_id: targetUserId });
    const targetProfile = (targetProfiles && (targetProfiles.items ? targetProfiles.items[0] : targetProfiles[0])) || null;
    const targetName = targetProfile?.display_name || 'Member';

    if (action === 'follow') {
      const existing = await base44.entities.Friendship.filter({
        from_user_id: user.id, to_user_id: targetUserId, status: 'following'
      });
      const list = existing.items || existing || [];
      if (list.length === 0) {
        await base44.entities.Friendship.create({
          from_user_id: user.id,
          to_user_id: targetUserId,
          from_user_name: myName,
          to_user_name: targetName,
          status: 'following'
        });
        await sr.entities.Notification.create({
          to_user_id: targetUserId,
          type: 'new_follow',
          content: `${myName} started following you`,
          related_id: user.id,
          read: false
        });
      }
      return Response.json({ ok: true });
    }

    if (action === 'request') {
      const existing = await base44.entities.Friendship.filter({
        $or: [
          { from_user_id: user.id, to_user_id: targetUserId },
          { from_user_id: targetUserId, to_user_id: user.id }
        ],
        status: { $in: ['pending', 'accepted'] }
      });
      const list = existing.items || existing || [];
      if (list.length === 0) {
        await base44.entities.Friendship.create({
          from_user_id: user.id,
          to_user_id: targetUserId,
          from_user_name: myName,
          to_user_name: targetName,
          status: 'pending'
        });
        await sr.entities.Notification.create({
          to_user_id: targetUserId,
          type: 'friend_request',
          content: `${myName} sent you a friend request`,
          related_id: user.id,
          read: false
        });
      }
      return Response.json({ ok: true });
    }

    if (action === 'accept') {
      // Only the recipient can accept: the pending request must be addressed to the caller.
      const pending = await base44.entities.Friendship.filter({
        from_user_id: targetUserId, to_user_id: user.id, status: 'pending'
      });
      const list = pending.items || pending || [];
      if (list.length === 0) return Response.json({ error: 'No pending request to accept' }, { status: 404 });
      await base44.entities.Friendship.update(list[0].id, { status: 'accepted' });
      await sr.entities.Notification.create({
        to_user_id: targetUserId,
        type: 'friend_accepted',
        content: `${myName} accepted your friend request`,
        related_id: user.id,
        read: false
      });
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}