# City Building Engineering Company - Platform README

## 🚀 Platform Overview

A professional web platform for **City Building Engineering Company Ltd** offering courses in:
- Architectural Software (Revit, ArchiCAD, SketchUp, AutoCAD)
- Structural Software (ETABS, SAFE, Plaxis, etc.)
- Geotechnical Software
- Rendering Software (Lumion, V-Ray, Enscape)
- Water & Road Design Software

**Key Features:**
- ✅ Student signup with OTP email verification
- ✅ Professional admin dashboard with CRUD operations
- ✅ Course category and subcourse management
- ✅ Student enquiry management
- ✅ Email notifications to admin
- ✅ Multi-language support (12+ languages)
- ✅ Responsive design (mobile, tablet, desktop)

---

## 📋 Quick Start Guide

### 1. **Prerequisites**
- Node.js (v14+)
- MySQL (v5.7+)
- PowerShell or Command Prompt

### 2. **Installation**

```powershell
# Clone or navigate to project
cd c:\path\to\city-building

# Install dependencies
npm install

# Create .env file with configuration
# (See Configuration section below)
```

### 3. **Configure Environment**

Create `.env` file in root directory:

```env
# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_DATABASE=city_building
DB_PORT=3306

# Server
PORT=3000
SESSION_SECRET=your-secret-key-here

# Email (SMTP)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-smtp-password-or-app-password
ADMIN_EMAIL=admin@example.com
EMAIL_SERVICE=gmail
# Optional for other SMTP providers:
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_TRANSPORT=console
```

**Important:**
- For Gmail, use a valid App Password from https://myaccount.google.com/apppasswords
- For other SMTP providers, set `EMAIL_HOST`, `EMAIL_PORT`, and `EMAIL_SECURE`
- For local testing without email delivery, set `EMAIL_TRANSPORT=console`

### 4. **Start Server**

```powershell
# Start MySQL (if not running)
Start-Service -Name MySQL80

# Start application
npm start

# Server will run on: http://localhost:3000
```

### 5. **Access Platform**

| Role | URL | Credentials |
|------|-----|-------------|
| **Student** | http://localhost:3000/signup | Create new account |
| **Admin** | http://localhost:3000/admin/login | [Set up in admin panel] |
| **Home** | http://localhost:3000/ | Public page |

---

## 📁 Project Structure

```
city-building/
├── src/
│   ├── server.js              # Main Express app & routes
│   ├── db.js                  # Database connection pool
│   ├── email.js               # Email functions (OTP, notifications)
│   ├── localization.js        # Multi-language support
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── models/
│       ├── initDb.js          # Database schema setup
│       ├── User.js            # (Deprecated)
│       ├── SiteUser.js        # Student account management
│       ├── Admin.js           # (Deprecated)
│       └── OTP.js             # OTP storage & validation
│
├── db/
│   ├── schema.sql             # Database table definitions
│   ├── seed.sql               # Initial data
│   └── admin-seed.sql         # Admin test data
│
├── public/
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   ├── custom.css         # Custom styling
│   │   ├── custom-responsive.css
│   │   └── admin-dashboard.css # Admin panel styling ⭐
│   ├── js/
│   │   ├── site.js            # Site-wide JS
│   │   └── theme.js           # Theme switching
│   └── images/
│
├── views/
│   ├── layout.ejs             # Main layout template
│   ├── signup.ejs             # Student signup form ⭐
│   ├── verify-otp.ejs         # OTP verification form ⭐
│   ├── index.ejs              # Home page
│   ├── about.ejs              # About page
│   ├── services.ejs           # Services page
│   ├── category.ejs           # Course categories
│   ├── subcourse.ejs          # Individual course
│   ├── contact.ejs            # Contact form
│   ├── login.ejs              # Student login
│   ├── account.ejs            # Student account
│   └── admin/
│       ├── dashboard.ejs      # Admin dashboard ⭐
│       ├── login.ejs          # Admin login
│       ├── categories/        # Category CRUD
│       ├── courses/           # Course CRUD
│       ├── enquiries/         # Enquiry management
│       └── users/             # User management
│
├── locales/
│   ├── en.json                # English translations
│   ├── fr.json                # French
│   ├── es.json                # Spanish
│   └── ... (10+ more languages)
│
├── package.json               # Dependencies
├── server.js                  # Server entry point
├── .env                       # Environment variables (⚠️ don't commit)
├── .gitignore                 # Git ignore rules
├── EMAIL_SETUP_GUIDE.md       # Email configuration ⭐
├── ADMIN_FEATURES_GUIDE.md    # Admin panel documentation ⭐
├── COMPLETE_IMPLEMENTATION.md # Full technical details ⭐
└── README.md                  # This file
```

---

## 🔑 Core Features Explained

### 1. **Student Signup with OTP Verification** ⭐

**Flow:**
```
User fills signup form
  ↓
Server generates 7-digit OTP
  ↓
OTP sent to email (SMTP)
  ↓
User redirected to verify-otp page
  ↓
User enters OTP code
  ↓
Account created, admin notified
  ↓
Success page shown
```

**Routes:**
- `GET /signup` - Show signup form
- `POST /signup` - Submit signup, send OTP
- `POST /verify-otp` - Verify code, create account
- `GET /verify-otp` - Show verification form

**Features:**
- ✅ 7-digit OTP with 5-minute expiry
- ✅ Email verification before account creation
- ✅ Duplicate email detection
- ✅ Password strength validation (uppercase, lowercase, number, special)
- ✅ Admin email notification on signup
- ✅ bcrypt password hashing

---

### 2. **Email System** ⭐

**Three types of emails:**

1. **OTP Email** → Student
   - 7-digit code
   - 5-minute expiry
   - HTML formatted

2. **Student Signup Notification** → Admin
   - Student name, email, phone
   - Signup date & time

3. **Enquiry Notification** → Admin
   - Enquiry details + course name
   - Student contact info

**Configuration:**
```env
EMAIL_USER=your-email@gmail.com    # Sender address
EMAIL_PASS=app-password-16-chars   # Gmail App Password
ADMIN_EMAIL=admin@example.com      # Receiver
```

**Implementation:** [src/email.js](src/email.js)

---

### 3. **Admin Dashboard** ⭐

**Access:** http://localhost:3000/admin/login

**Features:**
- 📊 Statistics (enquiries, categories, courses, users)
- 📧 Enquiry Management (view, filter, update status, delete)
- 👥 User Management (CRUD for admin users)
- 📚 Category Management (CRUD for course categories)
- 🎓 Course Management (CRUD for courses)

**Professional Design:**
- Purple gradient sidebar
- Responsive grid layouts
- Stat cards with animations
- Color-coded action buttons
- Data tables with filtering
- Form validation

**CSS:** [public/css/admin-dashboard.css](public/css/admin-dashboard.css)

---

### 4. **Database Schema**

**Tables:**

```sql
users (Student accounts)
├── id, full_name, email, phone, password_hash, created_at

user_otps (OTP storage)
├── id, email, otp, expires_at, created_at

categories (Course categories)
├── id, name, slug, description, created_at

subcourses (Individual courses)
├── id, category_id, name, slug, description, image_url, created_at

enquiries (Student enquiries)
├── id, name, email, phone, message, course, status, created_at

admin_users (Admin accounts)
├── id, username, email, full_name, password_hash, role, active, last_login, created_at
```

**Initialization:** Auto-runs on server start via [src/models/initDb.js](src/models/initDb.js)

---

### 5. **Multi-Language Support**

**Supported Languages (12+):**
- English (en)
- French (fr)
- Spanish (es)
- Portuguese (pt)
- Arabic (ar)
- Swahili (sw)
- German (de)
- Chinese (zh)
- Russian (ru)
- Italian (it)
- Turkish (tr)
- Amharic (am)

**Implementation:** [src/localization.js](src/localization.js)

**Usage in templates:**
```ejs
<%- t('nav.home') %>  <!-- Translates to current language -->
```

---

## 🛠️ Development Guide

### Starting Development Server

```powershell
# Terminal 1: Start server
npm start

# Server running on http://localhost:3000
```

### Database Management

```powershell
# Manually reinitialize database
node src/models/initDb.js

# Access MySQL directly
mysql -u root -p city_building
```

### Testing Features

**Test 1: Signup & OTP**
```
1. Go to http://localhost:3000/signup
2. Fill form
3. Submit
4. Check email for OTP
5. Enter code
6. Account created!
```

**Test 2: Admin Access**
```
1. Go to http://localhost:3000/admin/login
2. Enter admin credentials
3. View dashboard with statistics
4. Manage courses, categories, users
```

**Test 3: Course Enquiry**
```
1. Browse course (http://localhost:3000/category/architectural)
2. Fill enquiry form
3. Submit
4. Admin receives email
```

---

## 📊 Database Initialization

**Automatic (on server start):**
- Creates all tables from [db/schema.sql](db/schema.sql)
- Seeds initial data from [db/seed.sql](db/seed.sql)
- Creates OTP table with indexes

**Pre-seeded Data:**
- 5 course categories
- 20 courses across categories
- Sample admin user (optional)

**Retry Logic:**
- Handles transient DB errors
- 3 retry attempts with exponential backoff
- Useful for MySQL connection drops

---

## 🔐 Security Features

✅ **Implemented:**
- Password hashing with bcrypt (10 salt rounds)
- OTP codes (7-digit, time-limited to 5 min)
- Email verification before account creation
- Session-based authentication (24-hour cookies)
- Unique constraints on email fields
- Environment variables for secrets
- Input validation (client & server)
- SQL injection protection (parameterized queries)

⚠️ **For Production:**
- Use HTTPS (SSL certificate)
- Enable CORS if needed
- Rate limiting on auth endpoints
- CSRF protection on forms
- Content Security Policy headers
- SQL query logging for audit
- Backup strategy for database

---

## 📧 Email Configuration

**REQUIRED:** Gmail App Password

**Setup Steps:**
1. Enable 2FA on Gmail: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy 16-character password
4. Update `.env` with password
5. Restart server

**See:** [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)

---

## 🎨 Customization

### Change Colors

Edit [public/css/admin-dashboard.css](public/css/admin-dashboard.css):

```css
:root {
  --primary-color: #0d6efd;        /* Blue */
  --secondary-color: #6c757d;      /* Gray */
  --success-color: #198754;        /* Green */
  --danger-color: #dc3545;         /* Red */
}
```

### Add Language

Create new file: `locales/[code].json`

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.signup": "Sign Up"
}
```

### Customize Email Templates

Edit [src/email.js](src/email.js), modify `sendOTP()` HTML:

```javascript
async function sendOTP(email, otp) {
  const htmlContent = `
    <h1>Your OTP Code</h1>
    <p>Code: ${otp}</p>
    <!-- Customize HTML here -->
  `;
  // ...
}
```

---

## 🐛 Troubleshooting

### Issue: Server won't start
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution:
Start-Service -Name MySQL80
npm start
```

### Issue: Signup service unavailable
```
Error: Email verification service is temporarily unavailable

Solution:
1. Check .env has EMAIL_USER and EMAIL_PASS
2. Verify Gmail App Password (not regular password)
3. Restart server: npm start
```

### Issue: OTP not received
```
Solution:
1. Check EMAIL_USER is correct Gmail address
2. Check EMAIL_PASS is 16-character App Password
3. Check spam/promotions folder
4. Verify 2FA enabled on Gmail account
```

### Issue: Database table doesn't exist
```
Solution:
node src/models/initDb.js
npm start
```

---

## 📚 Documentation Files

- **[README.md](README.md)** - This file (overview & quick start)
- **[EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md)** - Email configuration ⭐
- **[ADMIN_FEATURES_GUIDE.md](ADMIN_FEATURES_GUIDE.md)** - Admin panel details ⭐
- **[COMPLETE_IMPLEMENTATION.md](COMPLETE_IMPLEMENTATION.md)** - Technical deep-dive ⭐
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Previous work
- **[RESPONSIVE_DESIGN_GUIDE.md](RESPONSIVE_DESIGN_GUIDE.md)** - Design guidelines
- **[BEFORE_AND_AFTER.md](BEFORE_AND_AFTER.md)** - Feature changes

---

## 🚀 Production Deployment

### Prepare for Production

1. **Update .env:**
   ```env
   NODE_ENV=production
   PORT=80 (or 443 for HTTPS)
   DB_HOST=production-db-server
   DB_USER=prod-user
   DB_PASSWORD=strong-password
   ```

2. **Use process manager:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "city-building"
   pm2 save
   ```

3. **Enable HTTPS:**
   - Get SSL certificate (Let's Encrypt)
   - Use Nginx/Apache reverse proxy
   - Configure HTTPS redirect

4. **Database:**
   - Regular backups
   - Strong credentials
   - Connection pooling tuned

5. **Email:**
   - Use production SMTP server
   - Configure email domain authentication
   - Monitor delivery rates

6. **Security:**
   - Enable rate limiting
   - Add Web Application Firewall
   - Monitor logs
   - Regular security updates

---

## 📞 Support & Contact

**Company:**
- Email: citybuildingengineeringcompany@gmail.com
- Phone: +250 789 257 758
- WhatsApp: https://wa.me/250789257758

**Platform Issues:**
- Check [troubleshooting section](#-troubleshooting)
- Review error logs in console
- Verify .env configuration
- Check database connectivity

---

## 📝 License & Credits

**Platform:** City Building Engineering Company Ltd
**Built with:** Express.js, EJS, Bootstrap, MySQL, Node.js
**Email Service:** Nodemailer + Gmail SMTP

---

## ✅ Implementation Checklist

- ✅ Student signup page with validation
- ✅ OTP generation and storage
- ✅ Email sending via SMTP
- ✅ OTP verification page
- ✅ Account creation with password hashing
- ✅ Admin email notifications
- ✅ Professional admin dashboard
- ✅ CRUD operations for all entities
- ✅ Database schema and seeding
- ✅ Multi-language support
- ✅ Responsive design
- ✅ Error handling and validation
- ✅ Documentation

**Status:** 🟢 **COMPLETE & READY FOR USE**

---

**Last Updated:** June 2, 2026
**Version:** 1.0
**Platform Status:** Production Ready ✅
