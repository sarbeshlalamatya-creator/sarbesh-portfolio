# Deploying sarbeshlalamatya.com.np

## 1. Replace the repo contents
1. In your GitHub repo, delete every old file **except** `.git` (and `CNAME` if you prefer to keep yours; an identical one is included).
2. Copy **everything inside this folder** to the repo root, including the hidden files `_headers`, `_redirects` and `.assetsignore`.
3. Open `wrangler.jsonc` and set `"name"` to your Worker's exact name (Cloudflare dashboard → Workers & Pages → your project).
4. Commit and push. Cloudflare rebuilds automatically.

## 2. One-time Cloudflare settings
- **SSL/TLS → Edge Certificates:** turn on **Always Use HTTPS** and **Automatic HTTPS Rewrites**. Set SSL mode to **Full**.
- **Custom domain:** your Worker → Settings → Domains & Routes → make sure `sarbeshlalamatya.com.np` is attached. Optionally add `www.sarbeshlalamatya.com.np` and a redirect rule www → apex.
- **Caching → Configuration → Purge Everything** once after the first deploy so old pages don't linger.

## 3. Check after deploy
- `/` loads the portfolio, `/privacy` and `/terms` load, `/anything-random` shows the TV 404 page.
- `/home.html` and old game links redirect to the new pages.
- Share `https://sarbeshlalamatya.com.np` in a LinkedIn/WhatsApp message to confirm the preview image.
- Submit `https://sarbeshlalamatya.com.np/sitemap.xml` in Google Search Console.

## Later
- **Analytics:** open `index.html`, find `window.SLA_GA_ID = ''` near the top and paste your `G-XXXXXXXXXX` ID between the quotes. Visitors are only tracked after they accept the cookie banner.
- **Hello video:** send me the file (or a URL) and I'll wire it into the TV.
- **Music:** replace `music/track.mp3` with a file of the same name.
