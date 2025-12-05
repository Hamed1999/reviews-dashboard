# FlexLiving Reviews Dashboard

A modern, intuitive dashboard for property managers to monitor, manage, and showcase guest reviews across multiple properties.

## 🚀 Features

### 📊 Manager Dashboard

- **Property Overview**: Group reviews by property with key metrics
- **Advanced Filtering**: Search by review content, guest name, or minimum rating
- **Sorting Options**: Sort by newest or highest-rated reviews
- **Real-time Stats**: Track total reviews, average ratings, and approval status
- **Quick Actions**: One-click navigation to property management pages

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

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Icons**: React Icons (Feather icons set)
- **State Management**: React Hooks with localStorage synchronization
- **Styling**: Custom gradients, shadows, and animations matching FlexLiving design

## 📁 Project Structure

my-reviews-dashboard/
├── app/
│ ├── page.tsx # Main dashboard
│ ├── property/[slug]/page.tsx # Property management page
│ ├── public/listing/[slug]/page.tsx # Public property page
│ └── api/
│ ├── reviews/hostaway/route.ts # Hostaway API integration
│ └── reviews/google/route.ts # Google Reviews exploration
├── lib/
│ ├── approval.ts # Basic approval functions
│ └── useApprovalState.ts # React hook for approval state
├── data/
│ └── hostaway.json # Mock review data
└── public/ # Static assets

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

### 1. **Clone the repository**

```bash
git clone [repository-url]
cd my-reviews-dashboard
```

Install dependencies

bash
npm install

# or

yarn install
Add mock data

Place your hostaway.json file in the data/ directory

Ensure it follows the structure shown in the assessment document

Run the development server

bash
npm run dev

# or

yarn dev
Open your browser
Navigate to http://localhost:3000

### 🔧 API Routes

/api/reviews/hostaway
Method: GET

Purpose: Fetch and normalize Hostaway review data

Parameters:

listing (optional): Filter reviews by property name

Response: Normalized review data with calculated ratings

/api/reviews/google
Method: GET

Purpose: Exploration of Google Reviews integration

Response: Mock data with integration documentation

### 🔐 Approval System

The dashboard uses a client-side approval system:

Storage: Uses localStorage to persist approval decisions

Sync: Custom hook (useApprovalState) syncs approval status across components

Events: Custom events trigger re-renders when approvals change

Note: For production, consider moving to a database-backed solution for cross-device synchronization.

### 🎨 Design Decisions

UI/UX
Clean Interface: Minimalist design with clear visual hierarchy

Responsive Grid: Flexible layout adapting to screen size

Visual Feedback: Hover effects, transitions, and status indicators

Accessibility: Semantic HTML with proper contrast ratios

Data Handling
Normalization: Transforms nested Hostaway data into flat structure

Client-side Filtering: Fast filtering without server round-trips

Memoization: Optimized performance with React's useMemo

State Management
Local Storage: Simple persistence without backend requirements

Event-driven Updates: Components react to approval changes

Optimistic Updates: Immediate UI feedback for user actions

### 📈 Google Reviews Integration

Findings
The Google Reviews API exploration revealed:

Requirements:

Google Cloud account with Places API enabled

API key with billing enabled

Place ID for each property

Rate limiting implementation (60 requests/minute)

Limitations:

Read-only access to reviews

Cannot reply or interact via API

Limited historical data

Requires Google Business Profile

Alternatives Considered:

Third-party aggregation services (Birdeye, Podium)

Embedded Google reviews widget

Manual review import process

Recommended Approach:
Start with Hostaway integration, then add Google Reviews via embedded widgets for simplicity, moving to API integration as scale warrants.

### 🔄 Development Workflow

Adding New Features
Create component in appropriate directory

Add TypeScript interfaces for data structures

Implement with responsive Tailwind classes

Test across device sizes

Data Updates
Update hostaway.json with new review data

API automatically normalizes new structure

Dashboard reflects changes immediately

Styling Updates
Modify Tailwind classes in components

Use FlexLiving color palette (blues, grays, accents)

Maintain consistent spacing and typography

### 🧪 Testing

Manual Testing Checklist
Dashboard loads with property cards

Filtering works (search, rating, sort)

Property page shows only relevant reviews

Approval toggles work and sync across pages

Public page shows only approved reviews

Responsive design works on mobile/tablet

Stats update correctly when approvals change

### 📝 Documentation

See DOCUMENTATION.md for:

Detailed API specifications

Component architecture

State management flow

Future enhancement ideas

### 🤝 Contributing

Fork the repository

Create a feature branch

Make changes with descriptive commits

Submit a pull request with clear description

### 📄 License

This project is for FlexLiving assessment purposes.

### 🙏 Acknowledgements

FlexLiving for the assessment opportunity

Hostaway for the review data structure

Next.js and Tailwind teams for excellent tools
"# reviews-dashboard" 
