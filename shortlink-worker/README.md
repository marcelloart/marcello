# MarcelloArt Shortlink Worker

This service powers the form at \`https://marcelloart.site/link/\` and serves redirects at \`https://go.marcelloart.site/<kode>\`.

The public site remains on GitHub Pages. The short links use a Cloudflare Worker and a D1 database because GitHub Pages cannot create persistent redirects from browser input by itself.

## What it does

- Accepts only \`http://\` and \`https://\` destination URLs.
- Creates an 8-character random code or a custom 3–24 character alias.
- Redirects short links with HTTP 302.
- Requires Cloudflare Turnstile verification before creating a link.
- Does not store click counts or visitor IP addresses.

## One-time Cloudflare setup

The Worker custom domain needs an active Cloudflare zone for \`marcelloart.site\`. If the domain is still using Namecheap DNS, moving DNS to Cloudflare requires updating the nameservers in Namecheap. Import and verify all existing DNS records first so the GitHub Pages website and any email records keep working. Do not change nameservers until those records are checked. Cloudflare documents that Worker custom domains are attached to a hostname inside an active Cloudflare zone.

1. Add \`marcelloart.site\` as a zone in the Cloudflare account. Review the imported DNS records and make sure the current GitHub Pages records and any mail records are present.
2. Create a D1 database named \`marcelloart-shortlinks\`.
3. Copy the database ID returned by Cloudflare into \`database_id\` in \`wrangler.toml\`.
4. Create a Turnstile widget allowing the hostname \`marcelloart.site\`. Copy its site key into \`TURNSTILE_SITE_KEY\` in \`wrangler.toml\`.
5. From this folder, install Wrangler and authenticate:
   \`\`\`sh
   npm install --save-dev wrangler
   npx wrangler login
   \`\`\`
6. Apply the schema and store the Turnstile secret:
   \`\`\`sh
   npx wrangler d1 migrations apply marcelloart-shortlinks --remote
   npx wrangler secret put TURNSTILE_SECRET
   \`\`\`
7. Deploy:
   \`\`\`sh
   npx wrangler deploy
   \`\`\`

The custom-domain route in \`wrangler.toml\` attaches the Worker to \`go.marcelloart.site\`. Cloudflare provisions the DNS record and certificate once the zone is active and the Worker is deployed.

## Check locally

Run the lightweight unit tests with Node.js:

\`\`\`sh
node --test src/index.test.mjs
\`\`\`

The Worker Free plan currently includes up to 100,000 requests per day; D1 Free includes up to 5 million rows read and 100,000 rows written per day. Check the current Cloudflare dashboard usage before broad public promotion.
