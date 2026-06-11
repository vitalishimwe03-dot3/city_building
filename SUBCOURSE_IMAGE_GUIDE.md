# Subcourse Image Management Guide

## Overview
This guide explains how to add and manage images for subcourses in the City Building platform. The system now supports both **file uploads** and **image URLs**.

## Features Added

✅ **File Upload Support** - Upload images directly from your computer
✅ **Image Preview** - Preview images before saving
✅ **URL Support** - Use external image URLs if preferred
✅ **Automatic File Management** - Old images are cleaned up when replaced
✅ **Responsive Display** - Images display beautifully on all devices

## Accessing Subcourse Image Management

### Step 1: Login to Admin Panel
1. Navigate to your site's admin login: `/admin/login`
2. Enter your admin credentials

### Step 2: Go to Courses Management
1. Click **Manage Courses** in the admin menu
2. You'll see a list of all existing subcourses (Revit, AutoCAD, SketchUp, etc.)

### Step 3: Create or Edit a Course

#### To Create a New Course:
1. Click **"Add Course"** button
2. Fill in the course details:
   - **Category**: Select from dropdown (e.g., Architectural Software)
   - **Course Name**: e.g., "Revit Fundamentals"
   - **Slug**: URL-friendly name (e.g., "revit-fundamentals")
   - **Description**: Course overview and details

#### To Edit Existing Course:
1. Find the course in the list
2. Click **"Edit"** button
3. Update any field as needed

## Image Management

### Option 1: Upload Image File (Recommended)

**Steps:**
1. In the Course Form, scroll to "Course Image" section
2. Under "Upload New Image File", click to select an image
3. Choose an image from your computer (JPG, PNG, GIF, or WebP)
4. You'll see a preview of the image
5. Click **"Create Course"** or **"Update Course"** to save

**Supported Formats:**
- JPG/JPEG
- PNG
- GIF
- WebP

**File Size Limit:** 5MB per image

**Best Practices:**
- Use high-quality images (minimum 800x600 pixels)
- Optimize images for web (reduce file size)
- Use consistent aspect ratios across courses
- Recommended size: 1200x800 pixels for best display

### Option 2: Use Image URL

**Steps:**
1. In the Course Form, scroll to "Course Image" section
2. Under "Image URL (if not uploading)", paste the image link
3. Example: `https://images.unsplash.com/photo-1234567890.jpg`
4. Click **"Create Course"** or **"Update Course"** to save

**When to Use:**
- Using images from online sources
- Linking to CDN-hosted images
- Quick setup without uploading

## Image Storage Locations

### Uploaded Images
- **Storage Path**: `/public/images/uploads/`
- **URL Format**: `/images/uploads/course-[timestamp].jpg`
- **Managed Automatically**: Old images are deleted when replaced

### External Images (URLs)
- **Storage**: On external servers
- **No Local Storage**: URLs are stored as references
- **No Automatic Cleanup**: You manage external images

## Viewing Subcourse Images

### On Public Website

Images display in two places:

#### 1. Category Page
- Path: `/category/[category-slug]`
- Shows: Course card with image
- Display: Grid layout with 3 columns on desktop
- Features: Responsive, hover effects

Example view:
```
[Image] Revit          [Image] AutoCAD        [Image] SketchUp
Autodesk Revit...      CAD Drafting...        3D Modeling...
View Details           View Details           View Details
```

#### 2. Subcourse Detail Page
- Path: `/course/[course-id]`
- Shows: Large hero image with course information
- Features: Full-width image, course benefits, enquiry form

## Troubleshooting

### Image Not Appearing

**Problem**: Uploaded image shows broken link
**Solution**: 
1. Check file format is JPG, PNG, GIF, or WebP
2. Verify file size is under 5MB
3. Try re-uploading the image
4. Clear browser cache (Ctrl+Shift+Delete)

### Upload Fails

**Problem**: Error when uploading image
**Solution**:
1. Check file type is an image
2. Reduce file size if over 5MB
3. Try a different image
4. Check browser console for error details

### Image Looks Distorted

**Problem**: Image appears stretched or squished
**Solution**:
1. Upload a different aspect ratio image
2. Recommended: 1200x800 pixels or 4:3 ratio
3. Avoid very small images (< 600px)

### Old Image Still Shows

**Problem**: Previous image displays after update
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+F5)
3. Try a different browser

## Technical Details

### File Upload Configuration

```javascript
// Maximum file size: 5MB
// Allowed MIME types: image/*
// Storage: /public/images/uploads/
// Filename format: course-[timestamp]-[random].jpg
```

### Database

The `subcourses` table has an `image` column that stores:
- Uploaded file paths: `/images/uploads/course-123456.jpg`
- External URLs: `https://example.com/image.jpg`
- Default: NULL (uses fallback image)

### API Endpoint

GET images from: `/images/uploads/[filename]`

## Best Practices

1. **Consistency**: Use same image sizes for all courses
2. **Quality**: Use high-resolution images
3. **Optimization**: Compress images before uploading
4. **Naming**: Keep filenames descriptive
5. **Backups**: Keep originals in case you need to re-upload
6. **Testing**: Test on mobile to ensure responsive display

## Image Fallback System

If a course has no image:
1. System looks for keyword match in course name
2. Applies relevant professional image
3. Default to generic architecture image

Keyword Matching Examples:
- "Revit" → BIM/Building image
- "AutoCAD" → CAD design image
- "SketchUp" → 3D modeling image
- "Rendering" → Professional render image

## Support

For issues with:
- **File uploads**: Check server logs
- **Image display**: Verify file path in database
- **Performance**: Optimize image sizes
- **Errors**: Contact system administrator

## Examples

### Revit Course Setup
```
Name: Revit for Architects
Slug: revit-architects
Description: Complete Revit workflow for architectural design
Image: [Upload course-revit.jpg] OR [Use Unsplash link]
```

### AutoCAD Course Setup
```
Name: AutoCAD Fundamentals
Slug: autocad-basics
Description: Master AutoCAD for 2D drafting and design
Image: [Upload course-autocad.jpg]
```

## Related Pages

- Admin Dashboard: `/admin/dashboard`
- All Courses: `/admin/courses`
- Categories: `/admin/categories`
- Public Category: `/category/[slug]`
- Course Details: `/course/[id]`

---

**Last Updated**: June 2026
**System Version**: City Building Platform v1.0
