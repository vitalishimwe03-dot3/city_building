# Admin Dashboard - Complete Feature Guide

## Overview
The City Building admin dashboard provides comprehensive management of all platform features with professional design, full CRUD operations, and role-based access control.

## Access & Authentication
- **Admin Login:** `http://localhost:3000/admin/login`
- **Dashboard:** `http://localhost:3000/admin/dashboard`
- **Default Admin:** Create via `/admin/users` → Create User

## Dashboard Statistics
The main dashboard displays:
- **Total Enquiries** (with new count badge)
- **Total Categories** (course categories)
- **Total Courses** (subcourses)
- **Total Users** (admin users)
- **System Info** (logged-in user, role, last login)

## Admin Features & CRUD Operations

### 1. **Enquiries Management**
**Route:** `/admin/enquiries`

#### Operations:
- **Read (List)** - View all student enquiries with status filter
  - Display: Name, Email, Phone, Status, Date
  - Filter by: new, contacted, closed status
  
- **Read (View)** - `/admin/enquiries/:id`
  - View full enquiry details
  - See student's name, email, phone, message, course applied for
  
- **Update** - Change enquiry status
  - Status options: new → contacted → closed
  - Updates record in DB
  
- **Delete** - `/admin/enquiries/:id/delete`
  - Remove enquiry from system
  - Soft or hard delete depending on preference

#### Email Integration:
- New enquiries trigger admin email to `citybuildingengineeringcompany@gmail.com`
- Email includes: Student name, email, phone, course applied for, message

---

### 2. **Users (Admin Users) Management**
**Route:** `/admin/users`

#### Operations:
- **Create** - `/admin/users/create`
  - Fields: Username, Email, Full Name, Password, Role
  - Role options: super_admin, admin, moderator
  - Password auto-hashed (bcrypt)
  
- **Read (List)** - View all admin users
  - Display: Username, Email, Full Name, Role, Status, Last Login
  - Search/filter functionality
  
- **Read (View)** - `/admin/users/:id/edit`
  - Edit admin user details
  - Update password, role, status
  
- **Update** - `/admin/users/:id`
  - Modify: Full Name, Email, Role, Active Status
  
- **Delete** - `/admin/users/:id/delete`
  - Remove admin user account
  - Verify permission (role-based)

#### Security:
- Passwords hashed with bcrypt (10 salt rounds)
- Session-based authentication
- Role-based access control

---

### 3. **Categories Management**
**Route:** `/admin/categories`

#### Operations:
- **Create** - `/admin/categories/create`
  - Fields: Name, Description, Slug (URL-friendly)
  - Example: Architectural Software (slug: architectural)
  
- **Read (List)** - View all course categories
  - Display: ID, Name, Slug, Description, Actions
  
- **Read (View)** - `/admin/categories/:id/edit`
  - Edit category details
  
- **Update** - `/admin/categories/:id`
  - Modify: Name, Description, Slug
  
- **Delete** - `/admin/categories/:id/delete`
  - Remove category (cascades to subcourses if configured)

#### Pre-seeded Categories:
1. Architectural Software
2. Structural Software
3. Geotechnical Software
4. Rendering Software
5. Water & Road Design Software

---

### 4. **Courses (Subcourses) Management**
**Route:** `/admin/courses`

#### Operations:
- **Create** - `/admin/courses/create`
  - Fields: Category, Name, Slug, Description, Image URL
  - Example: Revit (category: Architectural, slug: revit)
  
- **Read (List)** - View all courses with category filter
  - Display: ID, Name, Category, Slug, Image, Description, Actions
  
- **Read (View)** - `/admin/courses/:id/edit`
  - Edit course details
  
- **Update** - `/admin/courses/:id`
  - Modify: Category, Name, Slug, Description, Image URL
  
- **Delete** - `/admin/courses/:id/delete`
  - Remove course from catalog

#### Pre-seeded Courses (20 total):
**Architectural:**
- Revit, ArchiCAD, SketchUp, AutoCAD

**Structural:**
- Prostructure, CSI Etabs, Prokon, Robot Structure, CSI Safe, CSI Detailer, CSI Bridge

**Geotechnical:**
- Plaxis 2D, Plaxis 3D

**Rendering:**
- Lumion, Twin Motion, Enscape, V-Ray

**Water & Road:**
- ArcGIS, Civil 3D, WaterCAD, WaterGEM

---

## Student Signup with Email Verification

### Flow:
1. **Signup Page** - `/signup`
   - Student fills: Full Name, Email, Phone, Password (must include uppercase, lowercase, number, special char, min 8 chars)

2. **OTP Generation & Sending**
   - 7-digit OTP generated
   - Sent to student's email via SMTP
   - Valid for 5 minutes
   - Stored in `user_otps` table

3. **OTP Verification Page** - `/verify-otp`
   - Student enters 7-digit code
   - Validates against DB records
   - Expires after 5 minutes or successful use

4. **Account Creation**
   - Student account created in `users` table
   - Hashed password stored
   - OTP record deleted
   - Admin notified at `citybuildingengineeringcompany@gmail.com` with full details

5. **Thank You Page**
   - Success message
   - Link to login

### Email Notifications:
- **OTP Email:** "Your City Building Verification Code: [7-digit OTP]"
- **Admin Notification:** Full student details (Name, Email, Phone)

---

## Professional Design Features

### Admin Dashboard CSS (`/public/css/admin-dashboard.css`)
- **Color Scheme:** Purple gradient sidebar, clean white cards
- **Responsive:** Mobile, tablet, desktop layouts
- **Components:**
  - Stat cards with hover animations
  - Professional data tables with striping
  - Action buttons with distinct colors (Edit: blue, Delete: red, View: dark)
  - Search and filter boxes
  - Status badges (new, contacted, closed)
  - Form validation styling
  - Pagination controls

### UI Elements:
- Icon integration (Bootstrap Icons)
- Smooth transitions & animations
- Hover effects on cards and buttons
- Responsive grid layouts
- Professional typography

---

## Database Schema

### Tables:
1. **categories** - Course categories
2. **subcourses** - Individual courses
3. **enquiries** - Student enquiries
4. **admin_users** - Admin user accounts
5. **users** - Student accounts
6. **user_otps** - OTP storage for email verification

### Key Relationships:
- `subcourses.category_id` → `categories.id` (Foreign Key)
- `users.email` UNIQUE (prevents duplicates)
- `user_otps.email` UNIQUE (one OTP per email at a time)

---

## API Endpoints (for reference)

### Public APIs:
- `GET /api/categories` - List all categories
- `GET /api/category/:slug/subcourses` - Get courses for a category

### Admin APIs:
- `GET /admin/dashboard` - Dashboard view
- `GET /admin/enquiries` - List enquiries
- `POST /admin/enquiries/:id/status` - Update enquiry status
- `GET /admin/users` - List admin users
- `POST /admin/users` - Create admin user
- `GET /admin/categories` - List categories
- `POST /admin/categories` - Create category
- `GET /admin/courses` - List courses
- `POST /admin/courses` - Create course

---

## Environment Variables

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=city_building
DB_PORT=3306
PORT=3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=citybuildingengineeringcompany@gmail.com
SESSION_SECRET=your-session-secret
```

---

## Testing the Complete Flow

### 1. Admin Login:
```
URL: http://localhost:3000/admin/login
User: [admin username]
Pass: [admin password]
```

### 2. Create a Course Category:
```
Navigate to: /admin/categories/create
Fill: Name, Description, Slug
Click: Create Category
```

### 3. Add a Course:
```
Navigate to: /admin/courses/create
Select: Category (from dropdown)
Fill: Name, Slug, Description
Add: Image URL (optional)
Click: Create Course
```

### 4. Test Student Signup & OTP:
```
1. Go to: /signup
2. Fill form with valid data
3. Click: Sign up
4. Check email for OTP code
5. Go to: /verify-otp
6. Enter: OTP code
7. Account created!
8. Check admin email for notification
```

### 5. Manage Enquiries:
```
1. Go to: /admin/enquiries
2. Click view on an enquiry
3. Change status: new → contacted → closed
4. Or delete enquiry
```

---

## Security Best Practices

✅ Passwords hashed with bcrypt
✅ OTP codes 7-digit random
✅ OTP expires after 5 minutes
✅ Admin emails not publicly visible (env var)
✅ Session-based authentication
✅ Email verification before account creation
✅ UNIQUE constraints on email fields
✅ Role-based access control structure in place
✅ Input validation on all forms
✅ SQL injection protection (parameterized queries)

---

## Future Enhancements

- Implement role-based access control for admin operations
- Add user dashboard for students to view courses, certificates
- SMS OTP option (alongside email)
- Course progress tracking
- Certificate generation & download
- Analytics dashboard for admin
- Email template customization
- Payment integration for paid courses
- Course reviews and ratings

---

## Support & Troubleshooting

### Issue: OTP not received
- ✅ Check EMAIL_USER and EMAIL_PASS in .env
- ✅ Ensure Gmail App Password is used (not regular password)
- ✅ Check spam folder
- ✅ MySQL must be running

### Issue: Admin login fails
- ✅ Verify admin user exists: Run `/admin/users`
- ✅ Check username/password case sensitivity
- ✅ Clear browser cookies if needed

### Issue: Database errors
- ✅ Ensure MySQL is running: `Start-Service -Name MySQL80`
- ✅ Check DB connection in `.env`
- ✅ Run DB init: `node src/models/initDb.js`

---

**Generated:** June 2, 2026
**Version:** 1.0 - Complete Admin & Student Features
