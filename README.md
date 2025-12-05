# FlexLiving Reviews Dashboard

A modern, intuitive dashboard for property managers to monitor, manage, and showcase guest reviews across multiple properties, built for the FlexLiving developer assessment.

## 🚀 Features

### 📊 Manager Dashboard
- **Property Overview**: Group reviews by property with key metrics
- **Advanced Filtering**: Search by review content, guest name, or minimum rating
- **Sorting Options**: Sort by newest or highest-rated reviews
- **Real-time Stats**: Track total reviews, average ratings, and approval status
- **Quick Actions**: One-click navigation to property management pages
- **Trend Analysis**: Visual charts showing rating trends, category performance, and recurring issues

### 🏠 Property Management
- **Detailed Review View**: See all reviews for a specific property
- **Approval System**: Select which reviews appear on public website
- **Live Preview**: See how approved reviews will display to visitors
- **Bulk Actions**: Reset all approvals or filter by approval status
- **Category Analysis**: View performance across cleanliness, communication, value, etc.

### 🌐 Public Display
- **Professional Layout**: Clean, modern design matching FlexLiving brand
- **Category Ratings**: Visual breakdown of performance metrics
- **Verified Reviews**: Only manager-approved reviews displayed
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔌 API Integration
- **Hostaway API**: Real integration with fallback to mock data
- **Google Reviews Exploration**: Complete feasibility analysis and documentation
- **Multiple Endpoints**: Reviews, statistics, and listing-specific endpoints

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.3
- **Icons**: React Icons 4.11 (Feather icons set)
- **Build Tool**: Turbopack (development)
- **State Management**: React Hooks with localStorage synchronization

## 📁 Project Structure

```
my-reviews-dashboard/
├── app/
│   ├── layout.tsx                  # Root layout with metadata
│   ├── page.tsx                    # Main dashboard
│   ├── property/
│   │   └── [slug]/page.tsx         # Property management page
│   ├── public/
│   │   └── listing/
│   │       └── [slug]/page.tsx     # Public property page
│   └── api/
│       └── reviews/
│           ├── hostaway/route.ts    # Hostaway API integration
│           └── google/route.ts      # Google Reviews exploration
├── components/
│   └── TrendAnalysis.tsx           # Trend analysis component
├── lib/
│   ├── approval.ts                 # Basic approval functions
│   └── useApprovalState.ts         # React hook for approval state
├── data/
│   └── hostaway.json               # Mock review data (25+ reviews)
├── scripts/
│   └── test-hostaway-api.js        # API testing script
├── public/                         # Static assets
├── README.md                       # This file
├── DOCUMENTATION.md                # Detailed technical documentation
└── SETUP.md                        # Setup and troubleshooting guide
```

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/flexliving-reviews-dashboard.git
   cd flexliving-reviews-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add data files**
   - Create a `data` folder in the project root if it doesn't exist
   - Add the extended `hostaway.json` file with 25+ reviews (provided in the project)
   - Ensure the JSON follows the structure shown in the assessment document

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Routes

### `/api/reviews/hostaway`
- **Method**: GET
- **Purpose**: Fetch and normalize Hostaway review data
- **Parameters**:
  - `listing` (optional): Filter reviews by property name (case-insensitive)
- **Response**: Normalized review data with calculated ratings
- **Example**: `GET /api/reviews/hostaway?listing=2B%20N1%20A`

### `/api/reviews/google`
- **Method**: GET
- **Purpose**: Exploration of Google Reviews integration
- **Response**: Mock data with comprehensive integration documentation
- **Example**: `GET /api/reviews/google`

### `/api/reviews/stats`
- **Method**: GET
- **Purpose**: Get review statistics and analytics
- **Response**: Aggregated statistics including trends and category averages

### `/api/reviews/listings`
- **Method**: GET
- **Purpose**: Get list of all properties with review counts and ratings
- **Response**: Array of properties with summary statistics

## 🔐 Approval System

The dashboard uses a sophisticated client-side approval system:

- **Storage**: Uses `localStorage` to persist approval decisions
- **Sync**: Custom hook (`useApprovalState`) syncs approval status across components
- **Events**: Custom events trigger re-renders when approvals change
- **Cross-tab Support**: Changes in one browser tab reflect in others

**Note**: For production deployment, consider moving to a database-backed solution with user authentication for cross-device synchronization.

## 📊 Extended Dataset Features

The project includes an enhanced dataset with **25+ reviews** across **5 properties**:

### Properties:
1. **2B N1 A - 29 Shoreditch Heights** (6 reviews, avg rating: 8.3)
2. **Studio 4B - Camden** (4 reviews, avg rating: 7.0)
3. **3C N2 B - 45 Hackney Road** (5 reviews, avg rating: 8.0)
4. **Loft 5D - Brixton** (4 reviews, avg rating: 8.5)
5. **Penthouse A - Canary Wharf** (5 reviews, avg rating: 8.2)

### Time Range:
- Reviews span from **August 2020** to **June 2023**
- Allows for meaningful trend analysis over nearly 3 years

### Review Categories:
- 12+ different categories including cleanliness, communication, location, value, amenities, and more
- Realistic distribution of ratings (5-10 stars)
- Mixed positive and constructive feedback

## 📈 Trend Analysis Component

The dashboard includes a comprehensive `TrendAnalysis` component that provides:

### Monthly Trends
- Visual bar chart showing average ratings over time
- 6-month trend visualization
- Color-coded performance indicators

### Category Performance
- Progress bars for each review category
- Ranking from strongest to weakest categories
- Actionable insights for improvement

### Recurring Issues
- Word cloud of common issues mentioned in low-rated reviews
- Frequency counts for each issue
- Filtered from reviews rated 7 or below

### Rating Distribution
- Breakdown of excellent (9-10), good (7-8), average (5-6), and poor (0-4) reviews
- Visual percentage bars for each category
- Quick summary statistics

### Key Insights
- Automated recommendations based on data analysis
- Identification of strongest and weakest areas
- Trend direction indicators (improving/declining/stable)

## 🎨 Design Decisions

### UI/UX
- **Clean Interface**: Minimalist design with clear visual hierarchy
- **Responsive Grid**: Flexible layout adapting to all screen sizes
- **Visual Feedback**: Hover effects, transitions, and status indicators
- **Accessibility**: Semantic HTML with proper contrast ratios and ARIA labels
- **Consistent Branding**: Matches FlexLiving's professional aesthetic

### Data Handling
- **Normalization**: Transforms nested Hostaway data into flat, usable structure
- **Client-side Filtering**: Fast filtering without server round-trips
- **Memoization**: Optimized performance with React's `useMemo`
- **Error Handling**: Graceful degradation when data is missing or malformed

### State Management
- **Local Storage**: Simple persistence without backend requirements
- **Event-driven Updates**: Components react to approval changes via custom events
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Server-side Safe**: All functions check for `window` object before using browser APIs

## 🔌 Hostaway API Integration

### Real API Integration
The project attempts to connect to the real Hostaway API using provided credentials:
- **Account ID**: `61148`
- **API Key**: `f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152`

### Fallback Strategy
If the real API connection fails, the system automatically falls back to:
1. **Cached responses** (if available from previous successful calls)
2. **Mock data** from `data/hostaway.json`
3. **Empty array** as last resort

### Testing the API
A test script is included to verify API connectivity:
```bash
node scripts/test-hostaway-api.js
```

## 📈 Google Reviews Integration Findings

### Requirements
1. **Google Cloud Account** with billing enabled
2. **Places API Enabled** on the project
3. **API Key** with Places API restriction
4. **Place IDs** for each property

### Limitations
- **Read-only access**: Cannot respond to reviews via API
- **Limited history**: Typically 5-10 most recent reviews available
- **Filtered content**: Google may filter certain reviews from API
- **No direct attribution**: Can't verify if reviewer actually stayed

### Recommended Approach
- **Phase 1**: Use embedded Google Reviews widgets for public display
- **Phase 2**: Implement API integration for high-priority properties
- **Phase 3**: Full integration across all properties with caching

## 🔄 Development Workflow

### Adding New Features
1. Create component in appropriate directory
2. Add TypeScript interfaces for data structures
3. Implement with responsive Tailwind classes
4. Test across device sizes (mobile, tablet, desktop)
5. Update documentation as needed

### Data Updates
1. Update `hostaway.json` with new review data
2. API automatically normalizes new structure
3. Dashboard reflects changes immediately
4. No code changes required for new properties

### Styling Updates
1. Modify Tailwind classes in components
2. Use FlexLiving color palette (blues, grays, accents)
3. Maintain consistent spacing and typography
4. Test in both light and dark modes

## 🧪 Testing

### Manual Testing Checklist
- [ ] **Dashboard loads** with property cards
- [ ] **Filtering works** (search, rating, sort)
- [ ] **Property page shows** only relevant reviews
- [ ] **Approval toggles work** and sync across pages
- [ ] **Public page shows** only approved reviews
- [ ] **Responsive design works** on mobile/tablet
- [ ] **Stats update correctly** when approvals change
- [ ] **Trend analysis displays** with sufficient data
- [ ] **API endpoints return** expected data structure
- [ ] **Error handling works** for missing data

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Self-Hosting
```bash
# Build for production
npm run build

# Start production server
npm start

# Using PM2 for process management
pm2 start npm --name "flexliving-dashboard" -- start
```

### Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For Hostaway API integration
HOSTAWAY_API_URL=https://api.hostaway.com
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152

# For Google API integration (future)
# GOOGLE_PLACES_API_KEY=your_key_here
```

## 📝 Documentation

Complete documentation is available in:
- **`DOCUMENTATION.md`**: Detailed technical specifications, architecture decisions, and API documentation
- **`SETUP.md`**: Comprehensive setup instructions and troubleshooting guide

Key documentation sections include:
- System architecture and component diagrams
- API response formats and error codes
- State management flowcharts
- Performance optimization strategies
- Security considerations
- Future enhancement roadmap

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with descriptive commits
4. **Test thoroughly** across different devices
5. **Submit a pull request** with clear description of changes

### Code Style Guidelines
- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Ensure responsive design principles
- Test in multiple browsers

## 📄 License

This project was developed as part of the FlexLiving Developer Assessment. All rights reserved by FlexLiving.

## 🙏 Acknowledgements

- **FlexLiving** for the assessment opportunity and design inspiration
- **Hostaway** for the review data structure and API specification
- **Next.js and Tailwind teams** for excellent development tools
- **React Icons** for the beautiful icon set
- **The open-source community** for invaluable resources and inspiration

## 📞 Support

For questions or issues:
1. Check the [documentation](DOCUMENTATION.md)
2. Review [setup instructions](SETUP.md)
3. Examine browser console for errors
4. Contact the development team if issues persist

---

**Built with ❤️ for the FlexLiving team | Assessment completed December 2025**

*Last updated: March 2024 | Version: 2.0.0 | Reviews: 25+ | Properties: 5*# FlexLiving Reviews Dashboard

A modern, intuitive dashboard for property managers to monitor, manage, and showcase guest reviews across multiple properties, built for the FlexLiving developer assessment.

## 🚀 Features

### 📊 Manager Dashboard
- **Property Overview**: Group reviews by property with key metrics
- **Advanced Filtering**: Search by review content, guest name, or minimum rating
- **Sorting Options**: Sort by newest or highest-rated reviews
- **Real-time Stats**: Track total reviews, average ratings, and approval status
- **Quick Actions**: One-click navigation to property management pages
- **Trend Analysis**: Visual charts showing rating trends, category performance, and recurring issues

### 🏠 Property Management
- **Detailed Review View**: See all reviews for a specific property
- **Approval System**: Select which reviews appear on public website
- **Live Preview**: See how approved reviews will display to visitors
- **Bulk Actions**: Reset all approvals or filter by approval status
- **Category Analysis**: View performance across cleanliness, communication, value, etc.

### 🌐 Public Display
- **Professional Layout**: Clean, modern design matching FlexLiving brand
- **Category Ratings**: Visual breakdown of performance metrics
- **Verified Reviews**: Only manager-approved reviews displayed
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔌 API Integration
- **Hostaway API**: Real integration with fallback to mock data
- **Google Reviews Exploration**: Complete feasibility analysis and documentation
- **Multiple Endpoints**: Reviews, statistics, and listing-specific endpoints

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.3
- **Icons**: React Icons 4.11 (Feather icons set)
- **Build Tool**: Turbopack (development)
- **State Management**: React Hooks with localStorage synchronization

## 📁 Project Structure

```
reviews-dashboard/
├── app/
│   ├── layout.tsx                  # Root layout with metadata
│   ├── page.tsx                    # Main dashboard
│   ├── property/
│   │   └── [slug]/page.tsx         # Property management page
│   ├── public/
│   │   └── listing/
│   │       └── [slug]/page.tsx     # Public property page
│   └── api/
│       └── reviews/
│           ├── hostaway/route.ts    # Hostaway API integration
│           └── google/route.ts      # Google Reviews exploration
├── components/
│   └── TrendAnalysis.tsx           # Trend analysis component
├── lib/
│   ├── approval.ts                 # Basic approval functions
│   └── useApprovalState.ts         # React hook for approval state
├── data/
│   └── hostaway.json               # Mock review data (25+ reviews)
├── scripts/
│   └── test-hostaway-api.js        # API testing script
├── public/                         # Static assets
├── README.md                       # This file
├── DOCUMENTATION.md                # Detailed technical documentation
└── SETUP.md                        # Setup and troubleshooting guide
```

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hamed1999/reviews-dashboard.git
   cd flexliving-reviews-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add data files**
   - Create a `data` folder in the project root if it doesn't exist
   - Add the extended `hostaway.json` file with 25+ reviews (provided in the project)
   - Ensure the JSON follows the structure shown in the assessment document

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Routes

### `/api/reviews/hostaway`
- **Method**: GET
- **Purpose**: Fetch and normalize Hostaway review data
- **Parameters**:
  - `listing` (optional): Filter reviews by property name (case-insensitive)
- **Response**: Normalized review data with calculated ratings
- **Example**: `GET /api/reviews/hostaway?listing=2B%20N1%20A`

### `/api/reviews/google`
- **Method**: GET
- **Purpose**: Exploration of Google Reviews integration
- **Response**: Mock data with comprehensive integration documentation
- **Example**: `GET /api/reviews/google`

### `/api/reviews/stats`
- **Method**: GET
- **Purpose**: Get review statistics and analytics
- **Response**: Aggregated statistics including trends and category averages

### `/api/reviews/listings`
- **Method**: GET
- **Purpose**: Get list of all properties with review counts and ratings
- **Response**: Array of properties with summary statistics

## 🔐 Approval System

The dashboard uses a sophisticated client-side approval system:

- **Storage**: Uses `localStorage` to persist approval decisions
- **Sync**: Custom hook (`useApprovalState`) syncs approval status across components
- **Events**: Custom events trigger re-renders when approvals change
- **Cross-tab Support**: Changes in one browser tab reflect in others

**Note**: For production deployment, consider moving to a database-backed solution with user authentication for cross-device synchronization.

## 📊 Extended Dataset Features

The project includes an enhanced dataset with **25+ reviews** across **5 properties**:

### Properties:
1. **2B N1 A - 29 Shoreditch Heights** (6 reviews, avg rating: 8.3)
2. **Studio 4B - Camden** (4 reviews, avg rating: 7.0)
3. **3C N2 B - 45 Hackney Road** (5 reviews, avg rating: 8.0)
4. **Loft 5D - Brixton** (4 reviews, avg rating: 8.5)
5. **Penthouse A - Canary Wharf** (5 reviews, avg rating: 8.2)

### Time Range:
- Reviews span from **August 2020** to **June 2023**
- Allows for meaningful trend analysis over nearly 3 years

### Review Categories:
- 12+ different categories including cleanliness, communication, location, value, amenities, and more
- Realistic distribution of ratings (5-10 stars)
- Mixed positive and constructive feedback

## 📈 Trend Analysis Component

The dashboard includes a comprehensive `TrendAnalysis` component that provides:

### Monthly Trends
- Visual bar chart showing average ratings over time
- 6-month trend visualization
- Color-coded performance indicators

### Category Performance
- Progress bars for each review category
- Ranking from strongest to weakest categories
- Actionable insights for improvement

### Recurring Issues
- Word cloud of common issues mentioned in low-rated reviews
- Frequency counts for each issue
- Filtered from reviews rated 7 or below

### Rating Distribution
- Breakdown of excellent (9-10), good (7-8), average (5-6), and poor (0-4) reviews
- Visual percentage bars for each category
- Quick summary statistics

### Key Insights
- Automated recommendations based on data analysis
- Identification of strongest and weakest areas
- Trend direction indicators (improving/declining/stable)

## 🎨 Design Decisions

### UI/UX
- **Clean Interface**: Minimalist design with clear visual hierarchy
- **Responsive Grid**: Flexible layout adapting to all screen sizes
- **Visual Feedback**: Hover effects, transitions, and status indicators
- **Accessibility**: Semantic HTML with proper contrast ratios and ARIA labels
- **Consistent Branding**: Matches FlexLiving's professional aesthetic

### Data Handling
- **Normalization**: Transforms nested Hostaway data into flat, usable structure
- **Client-side Filtering**: Fast filtering without server round-trips
- **Memoization**: Optimized performance with React's `useMemo`
- **Error Handling**: Graceful degradation when data is missing or malformed

### State Management
- **Local Storage**: Simple persistence without backend requirements
- **Event-driven Updates**: Components react to approval changes via custom events
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Server-side Safe**: All functions check for `window` object before using browser APIs

## 🔌 Hostaway API Integration

### Real API Integration
The project attempts to connect to the real Hostaway API using provided credentials:
- **Account ID**: `61148`
- **API Key**: `f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152`

### Fallback Strategy
If the real API connection fails, the system automatically falls back to:
1. **Cached responses** (if available from previous successful calls)
2. **Mock data** from `data/hostaway.json`
3. **Empty array** as last resort

### Testing the API
A test script is included to verify API connectivity:
```bash
node scripts/test-hostaway-api.js
```

## 📈 Google Reviews Integration Findings

### Requirements
1. **Google Cloud Account** with billing enabled
2. **Places API Enabled** on the project
3. **API Key** with Places API restriction
4. **Place IDs** for each property

### Limitations
- **Read-only access**: Cannot respond to reviews via API
- **Limited history**: Typically 5-10 most recent reviews available
- **Filtered content**: Google may filter certain reviews from API
- **No direct attribution**: Can't verify if reviewer actually stayed

### Recommended Approach
- **Phase 1**: Use embedded Google Reviews widgets for public display
- **Phase 2**: Implement API integration for high-priority properties
- **Phase 3**: Full integration across all properties with caching

## 🔄 Development Workflow

### Adding New Features
1. Create component in appropriate directory
2. Add TypeScript interfaces for data structures
3. Implement with responsive Tailwind classes
4. Test across device sizes (mobile, tablet, desktop)
5. Update documentation as needed

### Data Updates
1. Update `hostaway.json` with new review data
2. API automatically normalizes new structure
3. Dashboard reflects changes immediately
4. No code changes required for new properties

### Styling Updates
1. Modify Tailwind classes in components
2. Use FlexLiving color palette (blues, grays, accents)
3. Maintain consistent spacing and typography
4. Test in both light and dark modes

## 🧪 Testing

### Manual Testing Checklist
- [ ] **Dashboard loads** with property cards
- [ ] **Filtering works** (search, rating, sort)
- [ ] **Property page shows** only relevant reviews
- [ ] **Approval toggles work** and sync across pages
- [ ] **Public page shows** only approved reviews
- [ ] **Responsive design works** on mobile/tablet
- [ ] **Stats update correctly** when approvals change
- [ ] **Trend analysis displays** with sufficient data
- [ ] **API endpoints return** expected data structure
- [ ] **Error handling works** for missing data

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Self-Hosting
```bash
# Build for production
npm run build

# Start production server
npm start

# Using PM2 for process management
pm2 start npm --name "flexliving-dashboard" -- start
```

### Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

# For Hostaway API integration
HOSTAWAY_API_URL=https://api.hostaway.com
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152

# For Google API integration (future)
# GOOGLE_PLACES_API_KEY=your_key_here
```

## 📝 Documentation

Complete documentation is available in:
- **`DOCUMENTATION.md`**: Detailed technical specifications, architecture decisions, and API documentation
- **`SETUP.md`**: Comprehensive setup instructions and troubleshooting guide

Key documentation sections include:
- System architecture and component diagrams
- API response formats and error codes
- State management flowcharts
- Performance optimization strategies
- Security considerations
- Future enhancement roadmap

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with descriptive commits
4. **Test thoroughly** across different devices
5. **Submit a pull request** with clear description of changes

### Code Style Guidelines
- Use TypeScript for all new code
- Follow existing naming conventions
- Add comments for complex logic
- Ensure responsive design principles
- Test in multiple browsers

## 📄 License

This project was developed as part of the FlexLiving Developer Assessment. All rights reserved by Hamed Salmanizadegan.

## 🙏 Acknowledgements

- **FlexLiving** for the assessment opportunity and design inspiration
- **Hostaway** for the review data structure and API specification
- **Next.js and Tailwind teams** for excellent development tools
- **React Icons** for the beautiful icon set
- **The open-source community** for invaluable resources and inspiration

## 📞 Support

For questions or issues:
1. Check the [documentation](DOCUMENTATION.md)
2. Review [setup instructions](SETUP.md)
3. Examine browser console for errors
4. Contact the development team if issues persist