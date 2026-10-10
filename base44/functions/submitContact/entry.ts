import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const name = (body?.name || '').toString().trim();
    const email = (body?.email || '').toString().trim();
    const message = (body?.message || '').toString().trim();

    if (!name || !email || !message) {
      return Response.json({ error: 'Please fill in your name, email, and message.' }, { status: 400 });
    }
    if (name.length > 100 || email.length > 150 || message.length > 5000) {
      return Response.json({ error: 'One or more fields are too long.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
    if (!admins || admins.length === 0) {
      return Response.json({ error: 'No contact recipient is configured yet.' }, { status: 500 });
    }

    const subject = `New contact message from ${name}`;
    const textBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
    ].join('\n');
    const htmlBody = [
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Message:</strong></p>`,
      `<p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    ].join('');

    await Promise.allSettled(
      admins.map((a) =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: a.email,
          subject,
          text: textBody,
          html: htmlBody,
        })
      )
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}