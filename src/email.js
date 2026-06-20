
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : undefined;
const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : undefined;
const emailService = process.env.EMAIL_SERVICE || 'gmail';
const emailTransport = process.env.EMAIL_TRANSPORT || emailService;
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
const emailSecure = process.env.EMAIL_SECURE === 'true';

const isConsoleTransport = emailTransport && emailTransport.toLowerCase() === 'console';
const transporterOptions = isConsoleTransport ? {
  streamTransport: true,
  newline: 'unix',
  buffer: true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
} : {
  auth: {
    user: emailUser,
    pass: emailPass,
  },
};

if (!isConsoleTransport) {
  if (emailHost) transporterOptions.host = emailHost;
  if (emailPort) transporterOptions.port = emailPort;
  if (process.env.EMAIL_SECURE) transporterOptions.secure = emailSecure;

  if (!emailHost && !emailPort) {
    if (emailService && emailService.toLowerCase() === 'gmail') {
      transporterOptions.service = 'gmail';
      transporterOptions.host = 'smtp.gmail.com';
      transporterOptions.port = 465;
      transporterOptions.secure = true;
    } else {
      transporterOptions.service = emailService;
    }
  }
}

if (!emailUser || !emailPass) {
  console.error('Email transport is not configured: set EMAIL_USER and EMAIL_PASS in .env');
}

const transporter = nodemailer.createTransport(transporterOptions);

async function verifyTransporter() {
  if (isConsoleTransport) {
    console.log('Email transporter configured for console transport; emails will be logged to the terminal.');
    return;
  }

  if (!emailUser || !emailPass) {
    console.error('Email transporter verification skipped: missing EMAIL_USER or EMAIL_PASS.');
    return;
  }

  try {
    await transporter.verify();
    console.log('Email transporter is configured and ready.');
  } catch (err) {
    console.error('Email transporter verification failed:', err.message || err);
    if (err.responseCode === 535 || err.message.includes('Invalid login')) {
      console.error('Invalid SMTP credentials. Check EMAIL_USER and EMAIL_PASS, and if using Gmail use a valid App Password without spaces.');
    }
    if (err.code === 'ENOTFOUND' || (err.message && err.message.includes('getaddrinfo'))) {
      console.error('SMTP host lookup failed. Verify internet/DNS access and that your mail host is reachable.');
    }
  }
}

verifyTransporter();

function formatEmailError(err) {
  if (!err) return 'Unknown email error.';
  if (err.responseCode === 535 || (err.message && err.message.includes('Invalid login'))) {
    return 'Email login failed: check EMAIL_USER and EMAIL_PASS. For Gmail, use a valid App Password and do not include spaces.';
  }
  if (err.code === 'ENOTFOUND' || (err.message && err.message.includes('getaddrinfo'))) {
    return 'Email host lookup failed: verify internet/DNS access and that the SMTP host is reachable.';
  }
  return err.message || String(err);
}

async function sendMail(mailOptions) {
  if (!isConsoleTransport && (!emailUser || !emailPass)) {
    throw new Error('Email transport not configured: set EMAIL_USER and EMAIL_PASS in .env');
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    if (isConsoleTransport) {
      console.log('--- Console Email Output ---');
      console.log(info.message.toString());
      console.log('-----------------------------');
    }
    return info;
  } catch (err) {
    const message = formatEmailError(err);
    console.error('Email send failed:', message, 'to:', mailOptions.to);
    throw new Error(message);
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'citybuildingengineeringcompany@gmail.com';

async function sendEnquiryNotification(data) {
  const mailOptions = {
    from: emailUser,
    to: ADMIN_EMAIL,
    subject: 'New Student Application/Enquiry',
    text: `A new student has applied/enquired.\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCourse: ${data.course || 'Not specified'}\nMessage: ${data.message || ''}`,
    html: `<h3>New Student Application/Enquiry</h3><ul><li><b>Name:</b> ${data.name}</li><li><b>Email:</b> ${data.email}</li><li><b>Phone:</b> ${data.phone}</li><li><b>Course:</b> ${data.course || 'Not specified'}</li><li><b>Message:</b> ${data.message || ''}</li></ul>`
  };
  await sendMail(mailOptions);
}

async function sendNewStudentNotification(data) {
  const mailOptions = {
    from: emailUser,
    to: ADMIN_EMAIL,
    subject: 'New Student Signed Up',
    text: `A new student account was created.\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone || ''}`,
    html: `<h3>New Student Signed Up</h3><ul><li><b>Name:</b> ${data.fullName}</li><li><b>Email:</b> ${data.email}</li><li><b>Phone:</b> ${data.phone || ''}</li></ul>`
  };
  await sendMail(mailOptions);
}

async function sendAdminPasswordResetEmail(admin, resetToken, baseUrl) {
  const resetLink = `${baseUrl}/admin/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: emailUser,
    to: admin.email,
    subject: 'Admin Password Reset Request',
    text: `You requested a password reset for your admin account.\n\nClick the link below to reset your password:\n${resetLink}\n\nThis link expires in 24 hours.\n\nIf you did not request this, please ignore this email.`,
    html: `<h3>Admin Password Reset Request</h3><p>You requested a password reset for your admin account.</p><p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p><p>This link expires in 24 hours.</p><p>If you did not request this, please ignore this email.</p>`
  };
  await sendMail(mailOptions);
}

async function sendUserPasswordResetEmail(user, resetToken, baseUrl) {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: emailUser,
    to: user.email,
    subject: 'Password Reset Request',
    text: `You requested a password reset for your account.\n\nClick the link below to reset your password:\n${resetLink}\n\nThis link expires in 24 hours.\n\nIf you did not request this, please ignore this email.`,
    html: `<h3>Password Reset Request</h3><p>You requested a password reset for your account.</p><p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p><p>This link expires in 24 hours.</p><p>If you did not request this, please ignore this email.</p>`
  };
  await sendMail(mailOptions);
}

async function sendOtpEmail(email, otp) {
  console.log(`[DEV] OTP for ${email}: ${otp}`);
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: 'Your City Building Verification Code',
    text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nCity Building Engineering Company Ltd`,
    html: `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f1d35; color: #edf2f7; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0891b2, #06b6d4); padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; color: #fff;">Email Verification</h1>
      </div>
      <div style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; color: #94a3b8;">Your verification code is:</p>
        <div style="background: #152642; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #1e3a5f; margin-bottom: 20px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #06b6d4; font-family: monospace;">${otp}</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: #64748b;">This code expires in <strong style="color: #f59e0b;">10 minutes</strong>.</p>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid #1e3a5f; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #475569;">City Building Engineering Company Ltd &bull; Kigali, Rwanda</p>
      </div>
    </div>`
  };
  await sendMail(mailOptions);
}

module.exports = { sendEnquiryNotification, sendNewStudentNotification, sendAdminPasswordResetEmail, sendUserPasswordResetEmail, sendOtpEmail };