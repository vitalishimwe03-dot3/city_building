-- Add price/duration to subcourses for comparison table
ALTER TABLE subcourses ADD COLUMN price VARCHAR(50) DEFAULT 'Contact us';
ALTER TABLE subcourses ADD COLUMN duration VARCHAR(100) DEFAULT '4-8 weeks';
ALTER TABLE subcourses ADD COLUMN skill_level VARCHAR(50) DEFAULT 'All Levels';

-- Student project gallery
CREATE TABLE IF NOT EXISTS gallery_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name VARCHAR(255) NOT NULL,
  course_name VARCHAR(255),
  project_title VARCHAR(255) NOT NULL,
  description TEXT,
  image_path VARCHAR(512),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Course waitlist
CREATE TABLE IF NOT EXISTS course_waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subcourse_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  notified BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subcourse_id) REFERENCES subcourses(id) ON DELETE CASCADE
);

-- Certificate verification
CREATE TABLE IF NOT EXISTS certificate_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_code VARCHAR(64) UNIQUE NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  completion_date DATETIME,
  is_valid BOOLEAN DEFAULT true,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions for "Which Course Fits You?"
CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  scores TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Alumni (for alumni map)
CREATE TABLE IF NOT EXISTS alumni (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name VARCHAR(255) NOT NULL,
  course_name VARCHAR(255),
  employer VARCHAR(255),
  job_title VARCHAR(255),
  location VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Rwanda',
  photo_url VARCHAR(512),
  linkedin_url VARCHAR(512),
  testimonial TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mini-course signups (lead magnet)
CREATE TABLE IF NOT EXISTS mini_course_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  course_interest VARCHAR(255),
  sent_lesson_1 BOOLEAN DEFAULT false,
  sent_lesson_2 BOOLEAN DEFAULT false,
  sent_lesson_3 BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Course price tiers for comparison table
CREATE TABLE IF NOT EXISTS course_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subcourse_id INT NOT NULL,
  tier_name VARCHAR(100) DEFAULT 'Standard',
  price VARCHAR(50) NOT NULL,
  duration VARCHAR(100),
  includes TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subcourse_id) REFERENCES subcourses(id) ON DELETE CASCADE
);
