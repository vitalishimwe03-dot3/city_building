# Technical Implementation: Subcourse Image Management

## Changes Made

### 1. Backend Implementation (src/server.js)

#### Multer Configuration
```javascript
// File upload configuration with limits and validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // /public/images/uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'course-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
```

#### Route Changes

**Course Creation Route:**
```javascript
app.post('/admin/courses', 
  isAdminAuthenticated, 
  upload.single('imageFile'), // Multer middleware
  async (req, res, next) => {
    // Handle file upload
    // Save either uploaded file path OR provided URL
});
```

**Course Update Route:**
```javascript
app.post('/admin/courses/:id', 
  isAdminAuthenticated, 
  upload.single('imageFile'), // Multer middleware
  async (req, res, next) => {
    // Handle file upload with old image cleanup
    // Delete old image if local file
    // Save new image path OR keep existing
});
```

#### Upload Directory
Auto-created at: `/public/images/uploads/`

### 2. Frontend Changes (views/admin/courses/form.ejs)

#### Key Features Added:

1. **File Upload Input**
```html
<input type="file" class="form-control" id="imageFile" name="imageFile" 
       accept="image/*" onchange="previewImage(event)">
```

2. **Current Image Preview** (for edit mode)
```html
<% if (course && course.image) { %>
  <!-- Display current image -->
<% } %>
```

3. **Image Preview on Upload**
```javascript
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}
```

4. **URL Fallback Option**
```html
<input type="url" class="form-control" id="imageUrl" name="imageUrl" 
       placeholder="https://example.com/image.jpg">
```

### 3. Dependencies Added

#### Package.json Update
```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1"
  }
}
```

Install with: `npm install multer`

## Database Schema

### Subcourses Table
```sql
CREATE TABLE subcourses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  description TEXT,
  image VARCHAR(1024),  -- Stores path or URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Image Storage Options
1. **Local Upload**: `/images/uploads/course-[timestamp].jpg`
2. **External URL**: `https://example.com/image.jpg`
3. **NULL**: Falls back to AI-generated keyword-based image

## File Structure

```
public/
├── css/
├── js/
└── images/
    ├── [existing images]
    └── uploads/  (auto-created)
        ├── course-1623456789-123456.jpg
        ├── course-1623456800-654321.jpg
        └── ...

src/
└── server.js (updated with multer config and routes)

views/
└── admin/
    └── courses/
        ├── form.ejs (updated with file upload UI)
        └── index.ejs (unchanged)
```

## Request/Response Flow

### Create Course with File Upload

```
POST /admin/courses
├── Content-Type: multipart/form-data
├── Form Data:
│   ├── categoryId: 1
│   ├── name: "Revit Basics"
│   ├── slug: "revit-basics"
│   ├── description: "..."
│   ├── imageFile: [binary file data]
│   └── imageUrl: "" (optional fallback)
├── Multer Processing:
│   ├── Validate file type (image/*)
│   ├── Check file size (< 5MB)
│   └── Save to /public/images/uploads/
├── Application:
│   └── Save image path to database
└── Response: 302 Redirect to /admin/courses
```

### Update Course with File Replacement

```
POST /admin/courses/:id
├── Content-Type: multipart/form-data
├── Check existing image:
│   └── If local file (/images/uploads/*)
│       └── Delete old file
├── Process new file (if provided):
│   ├── Validate and save
│   └── Store new path
├── Fallback to existing or URL:
│   └── If no new file, keep existing image
└── Response: 302 Redirect to /admin/courses
```

## Error Handling

### File Upload Errors

```javascript
// Multer error handling
try {
  // File validation happens in multer middleware
  if (req.file) {
    // File validated and stored
    imagePath = '/images/uploads/' + req.file.filename;
  }
} catch (err) {
  // Pass to error handler
  next(err);
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| File too large | > 5MB | Reduce file size |
| Invalid format | Not an image | Use JPG, PNG, GIF, WebP |
| Permission denied | Server can't write | Check folder permissions |
| Disk full | No space available | Free disk space |

## Frontend Display Logic

### Category View (category.ejs)
```javascript
const toolImages = { /* default images */ };

// Display priority:
// 1. If course has custom image
if (course.image) {
  // Check if URL or local path
  if (course.image.startsWith('http')) {
    // Use as URL
  } else {
    // Prepend /images/
  }
}
// 2. Fallback to keyword-matched image
// 3. Default architecture image
```

### Subcourse View (subcourse.ejs)
```javascript
// Same logic as category view
// Also uses tool-specific image matching
```

## Performance Considerations

### Image Optimization Tips

1. **Compression**
   - Use tools like TinyPNG, ImageOptim
   - Reduce file size without quality loss

2. **Dimensions**
   - Recommended: 1200x800 pixels
   - Min: 800x600 pixels
   - Max: 5MB file size

3. **Format Selection**
   - PNG: Transparency needed
   - JPG: Photographs, complex images
   - WebP: Modern browsers (better compression)
   - GIF: Animations only

4. **Caching**
   - Browser caches uploaded images
   - URL-based images cached by CDN
   - Clear cache if image updated

## Security Measures

### File Upload Security

1. **MIME Type Validation**
   - Only `image/*` types allowed
   - Checked in multer fileFilter

2. **File Size Limit**
   - Maximum 5MB per image
   - Prevents disk exhaustion

3. **Filename Sanitization**
   - Auto-generated unique filenames
   - Prevents path traversal attacks
   - Format: `course-[timestamp]-[random].ext`

4. **Static File Access**
   - Served via express.static
   - Only files in /public accessible
   - No direct file system access

### Admin Authentication
- All upload endpoints require `isAdminAuthenticated`
- Prevents unauthorized image uploads
- Session-based protection

## API Endpoints

### Subcourse Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /admin/courses | List all courses |
| GET | /admin/courses/create | Create form |
| POST | /admin/courses | Create with upload |
| GET | /admin/courses/:id/edit | Edit form |
| POST | /admin/courses/:id | Update with upload |
| POST | /admin/courses/:id/delete | Delete course |
| GET | /images/uploads/* | Serve uploaded images |

## Testing Checklist

- [ ] Upload image succeeds
- [ ] Preview shows before save
- [ ] Image displays on category page
- [ ] Image displays on course detail page
- [ ] URL fallback works
- [ ] Old image deleted on replace
- [ ] File size validation works
- [ ] Format validation works
- [ ] Multiple uploads work
- [ ] Mobile display works
- [ ] Cache clearing works
- [ ] Permissions correct

## Future Enhancements

1. **Image Cropping**: Built-in image editor
2. **Multiple Images**: Gallery per course
3. **Image Optimization**: Auto-compression
4. **CDN Integration**: Upload to external CDN
5. **Image Versioning**: Keep upload history
6. **Responsive Images**: srcset attributes
7. **Lazy Loading**: Performance optimization
8. **Image Search**: Find/filter by image

## Rollback Instructions

If issues occur, to revert:

1. Remove multer from package.json
2. Remove file upload code from server.js
3. Remove form changes from courses/form.ejs
4. Run `npm install`
5. Restart server

Courses with existing images will continue to work.

---

**Implementation Date**: June 2026
**Version**: 1.0
**Maintainer**: System Administrator
