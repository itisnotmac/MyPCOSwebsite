import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

    // Prevent duplicate display names (case-insensitive). Excludes the caller's
    // own profile so keeping or re-casing the same name is always allowed.
    const escapedName = escapeRegex(displayName);
    const dupResult = await sr.entities.Profile.filter(
      { display_name: { $regex: `^${escapedName}$`, $options: 'i' }, user_id: { $ne: user.id } },
      { limit: 1 }
    );
    const dupItems = dupResult?.items || (Array.isArray(dupResult) ? dupResult : []);
    if (dupItems.length > 0) {
      return Response.json({ error: 'That display name is already taken. Please choose another.' }, { status: 409 });
    }

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