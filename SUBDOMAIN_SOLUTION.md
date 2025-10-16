# Better Solution: Use Subdomain

Instead of struggling with proxy paths, use a subdomain approach:

## Current Issues with Proxy
- Browser is at `mond.io.kr/service` 
- Assets try to load from `/service/_next/...`
- But Vercel proxy doesn't handle static assets correctly
- Results in 404 errors

## Recommended Solution: Subdomain

### 1. Landing Page
- Keep at: `mond.io.kr` (Vercel)
- No changes needed

### 2. Main App  
- Deploy to: `app.mond.io.kr` (Amplify)
- Remove basePath configuration
- Clean URL structure

### 3. Benefits
- No proxy complications
- Better performance (direct access)
- Cleaner URLs
- Easier to debug
- Standard industry practice

### 4. Implementation Steps

1. **Update Landing Page Button**
   ```tsx
   // In landing page
   <a href="https://app.mond.io.kr">
     서비스 사용하기
   </a>
   ```

2. **Configure DNS**
   - Add CNAME record: `app.mond.io.kr` → Amplify domain

3. **Update Amplify App**
   - Remove `basePath: '/service'`
   - Deploy normally

4. **Update Backend CORS**
   - Allow `app.mond.io.kr`

## Alternative: Keep Everything at Root

If subdomain is not possible:

1. **Option A**: Deploy both to Amplify
   - Landing at `/`
   - App at `/app`
   
2. **Option B**: Fix Vercel Proxy
   - Need to proxy ALL assets, not just HTML
   - More complex configuration