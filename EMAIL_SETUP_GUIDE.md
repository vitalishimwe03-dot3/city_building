# Email Configuration Setup Guide

## Current Status
✅ Email system is implemented and working
⚠️ **Needs**: Actual Gmail App Password to send emails

## How to Configure Email

### Step 1: Get Your Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the prompts to enable it

2. **Generate App Password**:
   - After 2FA is enabled, go back to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - **Copy this password**

### Step 2: Update .env File

Open `.env` file in the project root and update:

```env
EMAIL_USER=citybuildingengineeringcompany@gmail.com
EMAIL_PASS=your-16-character-app-password-here
ADMIN_EMAIL=citybuildingengineeringcompany@gmail.com
```

Replace `your-16-character-app-password-here` with the actual password from Step 1.

**Example:**
```env
EMAIL_USER=citybuildingengineeringcompany@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
ADMIN_EMAIL=citybuildingengineeringcompany@gmail.com
```

### Step 3: Restart Server

1. Stop the server (Ctrl+C)
2. Run: `npm start`
3. Server will load new .env variables

## Testing Email

### Test 1: Student Signup
1. Go to http://localhost:3000/signup
2. Fill form with test data
3. Click "Sign up"
4. **Expected:** OTP email sent to student's email, page shows verify-otp form
5. **Check:** Look in email inbox for OTP code

### Test 2: Admin Notification
1. Complete signup with OTP verification
2. **Expected:** Admin email sent to citybuildingengineeringcompany@gmail.com with student details
3. **Check:** Look in ADMIN_EMAIL inbox for notification

### Test 3: Enquiry Email
1. Go to any course page (e.g., http://localhost:3000/category/architectural)
2. Click on a course
3. Fill enquiry form
4. Submit
5. **Expected:** Admin email sent with enquiry details
6. **Check:** Look in ADMIN_EMAIL inbox

## Troubleshooting

### Issue: "Email verification service is temporarily unavailable"

**Solution:** Check .env file
```powershell
# Check current .env content
Get-Content .env
```

Make sure:
- ✅ EMAIL_USER is set correctly to the full Gmail address
- ✅ EMAIL_PASS is a valid 16-character App Password (not a regular Gmail password)
- ✅ ADMIN_EMAIL is configured
- ✅ No quotes around passwords
- ✅ If your App Password is shown in groups, spaces are removed automatically when the app starts

### Local dev fallback: console email transport
If you want to test email functionality without SMTP, set:
```powershell
EMAIL_TRANSPORT=console
```
This will log the email contents to the server console instead of sending real mail.

### Use another SMTP provider
If Gmail SMTP is not working, configure another provider:
```powershell
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-smtp-password
```
If your provider requires SSL/TLS on port 465, set `EMAIL_SECURE=true`.

### Issue: "Invalid login for..."

**Solution:** Wrong password or invalid format
- Make sure you're using **App Password**, not Gmail password
- Use the 16-character App Password value exactly, without extra spaces
- Regular Gmail password will NOT work

### Issue: "Less secure app access is blocked"

**Solution:** Use App Password instead
- This error means you used regular Gmail password
- Gmail now requires App Passwords for third-party apps
- Follow Step 1 & 2 above

### Issue: Email sent but not received

**Solution:** Check spam folder
- Some SMTP servers mark first-time emails as spam
- Check "Spam" or "Promotions" folder in Gmail
- Add sender to contacts to whitelist

## Email Features Implemented

### 1. OTP Email (Sent to Student)
```
Subject: Your City Building Verification Code
From: EMAIL_USER
To: student-email@example.com

Body:
Your City Building Verification Code: [7-DIGIT-CODE]
Expires in 5 minutes
```

### 2. New Student Notification (Sent to Admin)
```
Subject: New Student Registration - City Building
From: EMAIL_USER
To: ADMIN_EMAIL

Body:
New Student Details:
- Full Name: [Name]
- Email: [Email]
- Phone: [Phone]
- Signup Date: [Date & Time]
```

### 3. Enquiry Notification (Sent to Admin)
```
Subject: New Course Enquiry - City Building
From: EMAIL_USER
To: ADMIN_EMAIL

Body:
New Enquiry Details:
- Student Name: [Name]
- Email: [Email]
- Phone: [Phone]
- Course Applied: [Course Name]
- Message: [Enquiry Message]
- Date: [Date & Time]
```

## Email System Architecture

```
User Signup (/signup)
    ↓
Server validates input
    ↓
Generate 7-digit OTP
    ↓
Store OTP in DB (expires 5 min)
    ↓
Send OTP Email via SMTP
    ├─ Success → Show verify-otp page
    └─ Failure → Delete OTP, show error
    
User Verifies OTP (/verify-otp)
    ↓
Validate OTP code (format & expiry)
    ↓
Create user account (bcrypt password)
    ↓
Delete OTP from DB
    ↓
Send Admin Notification Email
    ├─ Async (don't block user)
    └─ Contains full student details
    
Success → Show thank-you page
```

## Environment Variables Required

```env
# Required for email
EMAIL_USER=your-email@gmail.com        # Gmail address to send from
EMAIL_PASS=your-app-password           # 16-char App Password from Gmail
ADMIN_EMAIL=admin@example.com          # Admin email to receive notifications

# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your-password
DB_DATABASE=city_building

# Server
PORT=3000
SESSION_SECRET=your-session-secret
```

## Security Notes

✅ **Secure Practices**:
- App Password stored in .env (never in code)
- App Password is scoped to Gmail only (not full account access)
- OTP codes are 7-digit random (not sequential)
- OTP expires after 5 minutes
- Passwords hashed with bcrypt
- HTTPS recommended in production

⚠️ **Do NOT**:
- Commit .env file to git
- Use regular Gmail password (only App Password)
- Share your App Password
- Enable "Less Secure Apps" (use App Password instead)

## Support

**Gmail Help:**
- App Passwords: https://myaccount.google.com/apppasswords
- 2FA Setup: https://myaccount.google.com/security
- Email Troubleshooting: https://support.google.com/mail

**Common Issues:**
- 2FA not enabled? → https://myaccount.google.com/security
- Need App Password? → https://myaccount.google.com/apppasswords
- Email not working? → Check .env EMAIL_PASS is 16 characters
- Still failing? → Check Gmail "Log in & security" → "Connected apps & sites" for blocked attempts

---

## Next Steps

1. ✅ Get Gmail App Password
2. ✅ Update .env with credentials
3. ✅ Restart server (`npm start`)
4. ✅ Test signup flow
5. ✅ Check OTP email received
6. ✅ Verify account creation
7. ✅ Check admin email notification

**Status:** Ready for email testing once credentials are updated!
