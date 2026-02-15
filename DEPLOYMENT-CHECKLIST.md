# Deployment Checklist

## Pre-Deployment

### Backend Setup
- [ ] Backend API is running and accessible
- [ ] Database is set up and connected
- [ ] Environment variables are configured
- [ ] CORS is configured for frontend domain
- [ ] Cloudinary credentials are set up
- [ ] Admin user is created in database
- [ ] API endpoints are tested with Postman

### Frontend Configuration
- [ ] `.env` file is created with correct API URL
- [ ] All dependencies are installed (`npm install`)
- [ ] Build runs successfully (`npm run build`)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] All tests pass (`npm run test`)

### Testing
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Products load from API
- [ ] Cart operations work
- [ ] Order creation works
- [ ] Admin panel is accessible
- [ ] Product CRUD operations work
- [ ] Order management works
- [ ] QR code upload works

## Environment Variables

### Development
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Production
```env
VITE_API_BASE_URL=https://api.yoursite.com
```

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm run test
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Build
```bash
npm run preview
```

## Deployment Options

### Option 1: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Project Settings > Environment Variables
   - Add `VITE_API_BASE_URL`

5. **Configure Domain**
   - Add custom domain in Vercel dashboard
   - Update DNS records

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site Settings > Environment Variables
   - Add `VITE_API_BASE_URL`

5. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Option 3: AWS S3 + CloudFront

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Configure bucket policy

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Configure SSL certificate
   - Set up custom domain

5. **Configure Environment**
   - Build with production env vars
   - Rebuild and redeploy on changes

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
     listen 80;
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Build Image**
   ```bash
   docker build -t black-potheads-frontend .
   ```

4. **Run Container**
   ```bash
   docker run -p 80:80 black-potheads-frontend
   ```

## Post-Deployment

### Verification
- [ ] Website loads correctly
- [ ] All pages are accessible
- [ ] API calls work
- [ ] Images load properly
- [ ] Forms submit successfully
- [ ] Admin panel is accessible
- [ ] Authentication works
- [ ] Cart functionality works
- [ ] Orders can be created
- [ ] Admin operations work

### Performance
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify image optimization
- [ ] Test on mobile devices
- [ ] Check different browsers

### Security
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] CORS is properly configured
- [ ] API keys are not exposed
- [ ] Admin routes are protected

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up log aggregation

## DNS Configuration

### For Custom Domain

1. **Add A Record**
   ```
   Type: A
   Name: @
   Value: [Your server IP]
   ```

2. **Add CNAME Record**
   ```
   Type: CNAME
   Name: www
   Value: yourdomain.com
   ```

3. **Wait for Propagation**
   - Can take up to 48 hours
   - Check with `dig yourdomain.com`

## SSL Certificate

### Using Let's Encrypt (Free)

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Auto-Renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

### Using Cloudflare (Free)

1. Add site to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full)
4. Enable Always Use HTTPS

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Plan

### If Deployment Fails

1. **Revert to Previous Version**
   ```bash
   vercel rollback
   # or
   netlify rollback
   ```

2. **Check Logs**
   - Review deployment logs
   - Check error messages
   - Verify environment variables

3. **Fix Issues**
   - Fix code issues
   - Update configuration
   - Test locally

4. **Redeploy**
   - Build again
   - Deploy to staging first
   - Test thoroughly
   - Deploy to production

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review and fix security vulnerabilities
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Backup database regularly
- [ ] Review and optimize images
- [ ] Update documentation

### Emergency Contacts
- Backend Developer: [Contact]
- DevOps Engineer: [Contact]
- Project Manager: [Contact]

## Troubleshooting

### Common Issues

**Build Fails**
- Check Node version
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify environment variables

**API Calls Fail**
- Verify API URL is correct
- Check CORS configuration
- Verify API is running
- Check network tab in browser

**Images Not Loading**
- Check image paths
- Verify Cloudinary configuration
- Check CORS for images
- Verify image URLs

**Admin Panel Not Accessible**
- Check admin credentials
- Verify admin token
- Check route configuration
- Review authentication logic

## Success Criteria

- [ ] All pages load without errors
- [ ] API integration works correctly
- [ ] Admin panel is fully functional
- [ ] Performance score > 90 (Lighthouse)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] SSL certificate valid
- [ ] Monitoring is active
- [ ] Backups are configured

## Documentation

Ensure these files are up to date:
- [ ] README.md
- [ ] API-INTEGRATION-README.md
- [ ] ADMIN-PANEL-GUIDE.md
- [ ] QUICK-START.md
- [ ] This checklist

## Final Steps

1. **Announce Launch**
   - Notify stakeholders
   - Update status page
   - Send announcement email

2. **Monitor Closely**
   - Watch error logs
   - Monitor performance
   - Check user feedback
   - Be ready for hotfixes

3. **Celebrate! 🎉**
   - Document lessons learned
   - Thank the team
   - Plan next iteration

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Version:** 1.0.0
**Status:** [ ] Complete
