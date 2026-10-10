import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Saves the caller's profile (create or update). Derives `is_admin` from the
// authenticated user's role server-side so it can never be spoofed from the
// client. Also persists the member's chosen `selected_badge`.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const sr = base44.asServiceRole;

    const displayName = (body?.display_name || '').toString().trim();
    if (!displayName) return Response.json({ error: 'Display name is required' }, { status: 400 });

    const bio = (body?.bio || '').toString().trim();
    if (bio.length > 1000) return Response.json({ error: 'Bio is too long' }, { status: 400 });

    const avatarUrl = (body?.avatar_url || '').toString().trim();
    const location = (body?.location || '').toString().trim();
    const interests = Array.isArray(body?.interests) ? body.interests : [];
    const selectedBadge = body?.selected_badge ? (body.selected_badge).toString() : null;
    const profileId = (body?.profile_id || '').toString().trim();

    // Admin status is derived from the authenticated role — never trusted from input.
    const isAdmin = user.role === 'admin';

    const payload = {
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
      interests,
      location,
      selected_badge: selectedBadge,
      is_admin: isAdmin,
    };

    if (profileId) {
      const updated = await sr.entities.Profile.update(profileId, payload);
      return Response.json(updated);
    }

    // Create path — stamp the user_id server-side so it always matches the caller.
    const created = await sr.entities.Profile.create({
      user_id: user.id,
      ...payload,
    });
    return Response.json(created);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}