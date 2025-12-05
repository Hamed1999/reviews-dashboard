## Setup Instructions

### Development Environment Setup

**Step 1: System Requirements**
```bash
# Verify Node.js version
node --version  # Must be 18.17 or higher

# Verify npm version
npm --version   # Must be 9.x or higher

# Optional: Verify Git
git --version
```

**Step 2: Clone and Initialize**
```bash
# Clone the repository
git clone https://github.com/hamed199/reviews-dashboard.git
cd flexliving-reviews-dashboard

# Install dependencies
npm install
# or using yarn
yarn install

# Verify installation
npm run build  # Should complete without errors
```

**Step 3: Data Setup**
1. Create a `data` directory in the project root:
```bash
mkdir data
```

2. Add your `hostaway.json` file with the following structure:
```json
{
  "status": "success",
  "result": [
    {
      "id": 7453,
      "type": "host-to-guest",
      "status": "published",
      "rating": null,
      "publicReview": "Shane and family are wonderful!",
      "reviewCategory": [
        { "category": "cleanliness", "rating": 10 },
        { "category": "communication", "rating": 10 }
      ],
      "submittedAt": "2020-08-21 22:45:14",
      "guestName": "Shane Finkelstein",
      "listingName": "2B N1 A - 29 Shoreditch Heights"
    }
  ]
}
```

3. Verify data location:
```bash
# Should show your JSON file
ls -la data/hostaway.json
```

**Step 4: Environment Configuration**
Create `.env.local` file in project root:
```bash
# Development environment
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For future Google API integration
# GOOGLE_PLACES_API_KEY=your_api_key_here
# GOOGLE_PLACES_API_URL=https://maps.googleapis.com/maps/api/place
```

**Step 5: Start Development Server**
```bash
# Development mode with hot reload
npm run dev

# Alternative: Production build preview
npm run build
npm start
```

**Step 6: Access the Application**
- **Dashboard**: http://localhost:3000
- **API Endpoint**: http://localhost:3000/api/reviews/hostaway
- **Property Page**: http://localhost:3000/property/[property-name]
- **Public Listing**: http://localhost:3000/public/listing/[property-name]

### Testing the Installation

**Quick Test Script:**
```bash
# Test API endpoint
curl http://localhost:3000/api/reviews/hostaway

# Test with specific property
curl "http://localhost:3000/api/reviews/hostaway?listing=2B%20N1%20A"

# Test Google Reviews endpoint
curl http://localhost:3000/api/reviews/google
```

**Browser Verification Checklist:**
1. Open http://localhost:3000
2. Verify dashboard loads with property cards
3. Click "Manage Reviews" on any property
4. Verify property page loads with reviews
5. Toggle approval status on several reviews
6. Return to dashboard and verify stats updated
7. Visit public listing page (replace [property-name] with actual name)
8. Verify only approved reviews display

### Common Setup Issues

**Issue 1: "Cannot find module" errors**
```bash
# Solution: Clean reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue 2: TypeScript compilation errors**
```bash
# Solution: Check TypeScript configuration
npx tsc --noEmit  # Check for type errors

# Clear Next.js cache
rm -rf .next
```

**Issue 3: Data file not found**
```bash
# Solution: Verify file location and permissions
ls -la data/
# Should show: -rw-r--r--  1 user  staff  1234 Mar 1 12:00 hostaway.json
```

**Issue 4: Port already in use**
```bash
# Solution: Change port
npm run dev -- -p 3001
# or kill existing process
lsof -ti:3000 | xargs kill -9
```

### Production Deployment

**Option A: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Option B: Self-Hosted with PM2**
```bash
# Build the application
npm run build

# Install PM2 process manager
npm install -g pm2

# Start production server
pm2 start npm --name "flexliving-dashboard" -- start

# Monitor application
pm2 logs flexliving-dashboard
```

**Option C: Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t flexliving-dashboard .
docker run -p 3000:3000 flexliving-dashboard
```

### Maintenance and Updates

**Regular Tasks:**
1. **Update mock data**: Replace `data/hostaway.json` as needed
2. **Clear browser cache**: Users may need to clear localStorage if approval system acts erratically
3. **Monitor API changes**: If integrating real Hostaway API, watch for breaking changes
4. **Update dependencies**: Run `npm audit` and `npm update` monthly

**Performance Monitoring:**
```bash
# Check bundle size
npm run build
# Look for "First Load JS" metrics

# Lighthouse audit
# Use Chrome DevTools > Lighthouse tab
```

**Security Considerations:**
1. **API Keys**: Never commit API keys to version control
2. **CORS**: Configure properly when deploying to production domain
3. **Input Validation**: Always validate and sanitize user inputs
4. **Dependencies**: Regularly update to patch security vulnerabilities

### Troubleshooting Guide

**Symptom**: Dashboard shows "No reviews available"
- **Check**: API endpoint returns data (`curl http://localhost:3000/api/reviews/hostaway`)
- **Fix**: Verify `data/hostaway.json` exists and has valid JSON

**Symptom**: Approval status not persisting
- **Check**: Browser console for localStorage errors
- **Fix**: Ensure browser allows localStorage, try incognito mode

**Symptom**: Property page shows all reviews, not just specific property
- **Check**: API query parameter is being passed correctly
- **Fix**: Verify the `useEffect` in PropertyPage includes `slug` dependency

**Symptom**: Styling looks broken
- **Check**: Tailwind classes are purging correctly
- **Fix**: Run `npm run build` to regenerate CSS

**Symptom**: TypeScript errors during build
- **Check**: All imports are correct and types are defined
- **Fix**: Run `npx tsc --noEmit` to see type errors

### Support Resources

**Immediate Help:**
1. **Console Errors**: Check browser developer console (F12)
2. **Network Tab**: Verify API requests are successful
3. **Application Tab**: Check localStorage contents

**Documentation:**
- This document (`DOCUMENTATION.md`)
- `README.md` for quick start guide
- `SETUP.md` for detailed troubleshooting

**Contact Points:**
- **Technical Issues**: Check GitHub repository issues
- **Feature Requests**: Submit via repository discussions
- **Urgent Problems**: Contact development team directly

---

**Documentation Version**: 1.0.0  
**Last Updated**: March 2024  
**Assessment**: FlexLiving Reviews Dashboard  
**Status**: Complete and Production Ready