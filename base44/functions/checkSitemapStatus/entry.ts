import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_search_console');

    // 1. List all verified sites in Search Console
    const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(15000),
    });
    const sitesData = await sitesRes.json();

    if (!sitesRes.ok) {
      return Response.json({ error: 'Failed to list sites', details: sitesData }, { status: 502 });
    }

    const siteEntries = sitesData.siteEntry || [];
    const results = [];

    // 2. For each site, fetch its sitemaps
    for (const site of siteEntries) {
      const encodedSiteUrl = encodeURIComponent(site.siteUrl);
      const sitemapsRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/sitemaps`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          signal: AbortSignal.timeout(15000),
        }
      );
      const sitemapsData = await sitemapsRes.json();
      results.push({
        siteUrl: site.siteUrl,
        permissionLevel: site.permissionLevel,
        sitemaps: sitemapsData.sitemap || [],
        sitemapsError: !sitemapsRes.ok ? sitemapsData : null,
      });
    }

    return Response.json({ sites: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}