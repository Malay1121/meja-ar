# MejaAR Admin Panel

🍽️ **Comprehensive restaurant management dashboard** for MejaAR - Manage your restaurant's digital AR dining experience with ease.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password login with role-based access
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **MejaAR Branding** - Consistent design language with the main app
- 🍴 **Menu Management** - Add, edit, delete menu items and categories
- 🏪 **Restaurant Profile** - Customize restaurant information and branding
- 📊 **Analytics Dashboard** - Track performance and popular items
- 🌐 **AR Model Management** - Upload and manage 3D models for menu items
- 📸 **Image Upload** - Easy drag-and-drop image management
- 🎯 **Real-time Updates** - Changes sync instantly with the main app

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project (shared with main MejaAR app)
- A code editor (VS Code recommended)

### Installation

1. **Clone and setup the project:**

   ```bash
   cd mejar-admin
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase configuration in `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3001`

## 🏗️ Project Structure

```
mejar-admin/
├── src/
│   ├── app/                  # Next.js 13+ App Router
│   │   ├── dashboard/        # Protected dashboard routes
│   │   ├── globals.css       # Global styles & Tailwind
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx         # Login page
│   │   └── providers.tsx     # Context providers
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities and services
│   │   ├── firebase.ts      # Firebase configuration
│   │   ├── auth.ts          # Authentication service
│   │   └── restaurant.ts    # Restaurant data service
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
└── package.json
```

## 🔐 Authentication & Security

### User Roles

- **Admin**: Full access to all restaurant management features
- **Manager**: Access to menu and profile management, view analytics
- **Staff**: Limited access to menu management only

### Security Features

- ✅ Email/password authentication via Firebase Auth
- ✅ Role-based access control
- ✅ Restaurant-specific data isolation
- ✅ Secure file uploads to Firebase Storage
- ✅ Input validation and sanitization
- ✅ Protected API routes

### Demo Access

For testing purposes, use:

- **Email**: `demo@restaurant.com`
- **Password**: `demo123`

## 📱 Core Functionality

### Dashboard Overview

- Restaurant performance metrics
- Popular menu items analytics
- Recent activity feed
- Quick action buttons

### Menu Management

- **Categories**: Create and organize menu categories
- **Items**: Add/edit menu items with:
  - Name, description, pricing
  - Multiple images
  - 3D AR models
  - Nutritional information
  - Availability settings
  - Tags and dietary information

### Restaurant Profile

- Basic information (name, description, contact)
- Operating hours
- Branding colors and logos
- Address and location
- Settings and preferences

### Analytics

- View counts and interactions
- Popular items and categories
- Time-based performance data
- AR engagement metrics

## 🎨 Design System

### Color Palette (MejaAR Brand)

```css
Primary Orange: #f07316
Secondary Gray: #64748b
Success Green: #10b981
Warning Yellow: #f59e0b
Error Red: #ef4444
```

### Typography

- **Headings**: Cal Sans (display font)
- **Body**: Inter (system font)

### Components

All components follow MejaAR's design language with:

- Consistent spacing and typography
- Subtle shadows and rounded corners
- Smooth animations and transitions
- Accessible color contrasts

## 🔧 Configuration

### Firebase Setup

1. Ensure your Firebase project has:

   - Authentication enabled (Email/Password)
   - Firestore database
   - Storage bucket
   - Proper security rules

2. Create admin users in Firestore:
   ```javascript
   // In Firestore console, create document in 'admins' collection:
   {
     uid: "user_auth_uid",
     email: "admin@restaurant.com",
     displayName: "Restaurant Admin",
     restaurantId: "your_restaurant_id",
     role: "admin",
     isActive: true,
     permissions: {
       manageMenu: true,
       manageProfile: true,
       viewAnalytics: true,
       manageStaff: true
     }
   }
   ```

### Customization

- **Branding**: Update colors in `tailwind.config.js`
- **Features**: Enable/disable features in component props
- **Permissions**: Modify role permissions in `src/lib/auth.ts`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Tailwind CSS** for styling

## 📚 API Integration

The admin panel integrates with your existing Firebase project:

- **Authentication**: Firebase Auth
- **Database**: Firestore with nested structure
- **Storage**: Firebase Storage for images/models
- **Real-time**: Firestore real-time listeners

## 🔄 Data Sync

Changes made in the admin panel sync in real-time with the main MejaAR app through Firebase's real-time database features.

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed
2. **Auth Issues**: Check Firebase configuration
3. **Permission Errors**: Verify Firestore security rules
4. **Styling Issues**: Check Tailwind CSS setup

### Support

For issues or questions:

- Check the documentation
- Review Firebase console logs
- Contact development team

## 📝 License

This project is part of the MejaAR platform - Restaurant AR Dining Experience.

---

**Built with ❤️ for restaurant owners who want to provide amazing AR dining experiences.**
