# Visual Reference: Subcourse Image System

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      CITY BUILDING PLATFORM                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐           ┌──────────────────────┐    │
│  │   PUBLIC WEBSITE     │           │   ADMIN PANEL        │    │
│  ├──────────────────────┤           ├──────────────────────┤    │
│  │                      │           │                      │    │
│  │ /category/:slug      │           │ /admin/courses       │    │
│  │  - Show courses      │────────┐  │ - List all courses   │    │
│  │  - Display images    │        │  │ - Upload images ✅   │    │
│  │  - Responsive cards  │        │  │ - Preview images ✅  │    │
│  │                      │        │  │ - Edit descriptions  │    │
│  │ /course/:id          │        │  │ - Delete courses     │    │
│  │  - Hero image ✅     │        │  │                      │    │
│  │  - Full description  │        │  │ /admin/courses/:id   │    │
│  │  - Enquiry form      │        │  │ - Edit form          │    │
│  │  - Benefits list     │        │  │ - Upload new image   │    │
│  │                      │        │  │ - See current image  │    │
│  └──────────────────────┘        │  └──────────────────────┘    │
│                                  │                               │
│                                  ▼                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    APPLICATION CORE                         │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  Route Handlers:                                            │ │
│  │  ├─ GET /category/:slug → Fetch courses                   │ │
│  │  ├─ GET /course/:id → Fetch course details                │ │
│  │  ├─ GET /admin/courses → List courses                     │ │
│  │  ├─ POST /admin/courses → Create ✅                       │ │
│  │  │   └─ Upload image via Multer ✅ NEW                    │ │
│  │  ├─ GET /admin/courses/:id/edit → Edit form              │ │
│  │  ├─ POST /admin/courses/:id → Update ✅                   │ │
│  │  │   └─ Upload image via Multer ✅ NEW                    │ │
│  │  │   └─ Delete old image ✅ NEW                           │ │
│  │  └─ POST /admin/courses/:id/delete → Delete              │ │
│  │                                                              │ │
│  │  Middleware:                                                │ │
│  │  ├─ express.static() → Serve /public files               │ │
│  │  ├─ upload.single() → Multer ✅ NEW                       │ │
│  │  └─ isAdminAuthenticated → Auth check                     │ │
│  │                                                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│      ┌────────────────────┼────────────────────┐               │
│      ▼                    ▼                    ▼               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  DATABASE    │  │  FILE SYSTEM │  │  EXTERNAL    │        │
│  │  (MySQL)     │  │  (Local)     │  │  (URLs)      │        │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤        │
│  │              │  │              │  │              │        │
│  │ subcourses   │  │ /public/     │  │ Unsplash     │        │
│  │ table        │  │ images/      │  │ CDN          │        │
│  │              │  │ uploads/     │  │ External     │        │
│  │ ┌──────────┐ │  │              │  │ servers      │        │
│  │ │ id       │ │  │ course-1.jpg │  │              │        │
│  │ │ name     │ │  │ course-2.jpg │  │ URL stored   │        │
│  │ │ image ✅ │ │  │ course-3.jpg │  │ in database  │        │
│  │ │ desc     │ │  │ ...          │  │              │        │
│  │ └──────────┘ │  │              │  │              │        │
│  │              │  │ ✅ Auto-     │  │ ✅ Reference │        │
│  │ Stores:      │  │   created    │  │ only (no     │        │
│  │ ✅ File path │  │ ✅ Secure    │  │ storage)     │        │
│  │ ✅ URLs      │  │ ✅ Managed   │  │              │        │
│  │              │  │              │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Uploading an Image

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOADS IMAGE                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌────────────────┐
                    │ ADMIN FORM     │
                    │ (form.ejs)     │
                    │                │
                    │ 1. Select file │
                    │ 2. See preview │
                    │ 3. Click save  │
                    └────────────────┘
                            │
                   multipart/form-data
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │      POST /admin/courses/:id          │
        │      + upload.single('imageFile')    │
        └───────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Validate │ │ Generate │ │  Store   │
        │ File     │ │ Unique   │ │  File    │
        │ (image?)│ │ Filename │ │          │
        │ <5MB?   │ │          │ │  /public/│
        │          │ │ course-  │ │  images/ │
        │ ✅ PASS  │ │ 123456- │ │  uploads/│
        │          │ │ xyz.jpg  │ │          │
        └──────────┘ └──────────┘ └──────────┘
                │
                │ New file path
                │
                ▼
        ┌──────────────────────┐
        │ OLD IMAGE? (Edit)    │
        └──────────────────────┘
           YES │              NO
             │                 │
             ▼                 │
        ┌──────────────┐       │
        │ Delete old   │       │
        │ /images/     │       │
        │ uploads/old  │       │
        └──────────────┘       │
                │               │
                └───────┬───────┘
                        │
                        ▼
        ┌──────────────────────────────────┐
        │ SAVE TO DATABASE                 │
        │ UPDATE subcourses SET            │
        │   image = '/images/uploads/      │
        │           course-123456.jpg'     │
        │ WHERE id = ?                     │
        └──────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────┐
        │ REDIRECT TO /admin/courses       │
        └──────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────┐
        │ 302 REDIRECT RESPONSE            │
        │ Location: /admin/courses         │
        └──────────────────────────────────┘
                        │
                        ▼
                  ✅ SUCCESS
                  Image uploaded!
                  File stored
                  DB updated
```

## Data Flow: Displaying Images on Public Site

```
┌──────────────────────────────────────────────────┐
│ USER VISITS: /category/architectural             │
└──────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────────┐
        │ GET /category/architectural      │
        └──────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
    Query DB              Check each course.image
    SELECT * FROM          
    categories             ┌─────────────┐
    WHERE slug =            │ Has image?  │
    'architectural'         └─────────────┘
                             │        │
                           YES        NO
                             │        │
                    ┌────────▼─────────▼───────────┐
                    │ Use custom    Use fallback   │
                    │ image OR      keyword match  │
                    │ external URL  OR default     │
                    └──────────────┬────────────────┘
                                   │
        ┌──────────────────────────┴──────────────────┐
        │                                              │
        ▼                                              ▼
    External URL                    Local File
    (Unsplash, etc)                 /images/uploads/
    
    https://example.com/            /images/uploads/
    photo.jpg                       course-123456.jpg
                                    
        │                                │
        └────────────┬───────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────┐
    │ Render Template                 │
    │ category.ejs                    │
    │                                 │
    │ <img src="<%= course.image %>"  │
    │      alt="<%= course.name %>">  │
    └─────────────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────┐
    │ HTML Response with Image URLs   │
    │                                 │
    │ <img src="/images/uploads/..."  │
    │   OR                            │
    │ <img src="https://unsplash...   │
    └─────────────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────┐
    │ Browser requests image           │
    │ Static file server responds      │
    │ Image displays on page           │
    │                                 │
    │ [Beautiful course card]          │
    │ [with image]                     │
    └─────────────────────────────────┘
```

## File Upload Process Diagram

```
USER COMPUTER              UPLOAD FORM           SERVER
    │                           │                   │
    │ 1. Select file            │                   │
    │──────────────────────────>│                   │
    │    (revit-course.jpg)      │                   │
    │                           │                   │
    │                           │ 2. POST multipart │
    │                           │   with file data  │
    │                           ──────────────────>│
    │                           │                   │
    │                           │              3. Multer
    │                           │                 receives
    │                           │                 request
    │                           │                   │
    │                           │  4. Validate:     │
    │                           │   - Is image?     │
    │                           │   - < 5MB?        │
    │                           │   - MIME type?    │
    │                           │                   │
    │                           │  5. Generate:     │
    │                           │   - Unique name   │
    │                           │   - course-1234   │
    │                           │     5678.jpg      │
    │                           │                   │
    │                           │  6. Save to:      │
    │                           │   /public/images/ │
    │                           │   uploads/        │
    │                           │                   │
    │                           │  7. Save path     │
    │                           │   to database     │
    │                           │                   │
    │ 3. Preview shown          │<──────────────────│
    │ before upload             │  Return JSON OK   │
    │ (client-side)             │                   │
    │                           │                   │
    │ 4. Click "Save"           │                   │
    │──────────────────────────>│                   │
    │                           ──────────────────>│
    │                           │   Redirect 302    │
    │                           │<──────────────────│
    │ 5. Page redirects         │                   │
    │<──────────────────────────│                   │
    │                           │                   │
    │ ✅ Image uploaded!        │                   │
```

## Image Storage Comparison

```
┌─────────────────────────────────────────────────────────────┐
│              METHOD 1: FILE UPLOAD                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /public/images/uploads/course-1234567890-987654.jpg        │
│                                                               │
│  ✅ Local storage                                           │
│  ✅ Fast delivery                                           │
│  ✅ No external dependency                                  │
│  ✅ Automatic cleanup                                       │
│  ✅ Full control                                            │
│  ❌ Disk space usage                                        │
│  ❌ Needs backup                                            │
│                                                               │
│  Database stores: '/images/uploads/course-123456.jpg'       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              METHOD 2: EXTERNAL URL                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  https://images.unsplash.com/photo-1234567890?auto=format  │
│                                                               │
│  ✅ No disk usage                                           │
│  ✅ CDN benefits                                            │
│  ✅ Externally managed                                      │
│  ✅ Better performance globally                            │
│  ❌ External dependency                                     │
│  ❌ URL could break                                         │
│  ❌ No automatic cleanup                                    │
│                                                               │
│  Database stores: 'https://images.unsplash.com/...'        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Admin Interface - Course Form

```
┌────────────────────────────────────────────────────────────┐
│  ✎ Edit Course                                             │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Category:           [ Architectural Software    ▼ ]       │
│                                                              │
│  Course Name:        [ Revit                    ]           │
│                                                              │
│  Slug:               [ revit                     ]           │
│                      (URL-friendly name)                     │
│                                                              │
│  Description:        ┌────────────────────────────┐         │
│                      │ Full course description    │         │
│                      │                            │         │
│                      └────────────────────────────┘         │
│                                                              │
│  ════════════════════════════════════════════════════════   │
│  Course Image         ✅ NEW SECTION                        │
│  ════════════════════════════════════════════════════════   │
│                                                              │
│  Current Image (if editing):                               │
│  ┌────────────────────────────────────┐                    │
│  │ [Image preview from previous upload] │                  │
│  │ /images/uploads/course-123456.jpg   │                  │
│  └────────────────────────────────────┘                    │
│                                                              │
│  Upload New Image File:                                    │
│  [ Choose File ]  (revit-course.jpg)  ✅ NEW              │
│  Supported: JPG, PNG, GIF, WebP. Max: 5MB                 │
│                                                              │
│  Image Preview:  ✅ NEW                                    │
│  ┌────────────────────────────────────┐                    │
│  │ [Live preview as you select file]   │                    │
│  │ Updates in real-time!               │                    │
│  └────────────────────────────────────┘                    │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│              OR                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Image URL (if not uploading):                             │
│  [ https://images.unsplash.com/...  ] ✅ NEW              │
│  Paste external image link if preferred                    │
│                                                              │
│  ════════════════════════════════════════════════════════   │
│                                                              │
│  [ ✓ Update Course ]  [ ← Cancel ]                         │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Public Display: Category Page

```
┌──────────────────────────────────────────────────────────┐
│ Architectural Software                                    │
│ Training in leading architecture software tools          │
│                                                            │
│ [ Browse subcourses ]                                    │
│                                                            │
├──────────────────────────────────────────────────────────┤
│                                                            │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │              │  │              │  │              │   │
│ │   [IMAGE]    │  │   [IMAGE]    │  │   [IMAGE]    │   │
│ │ ✅ UPLOADED  │  │ ✅ UPLOADED  │  │ ✅ UPLOADED  │   │
│ │              │  │              │  │              │   │
│ ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│ │ Revit        │  │ AutoCAD      │  │ SketchUp     │   │
│ │              │  │              │  │              │   │
│ │ BIM modeling │  │ 2D drafting  │  │ 3D modeling  │   │
│ │ course       │  │ fundamentals │  │ basics       │   │
│ │              │  │              │  │              │   │
│ │ [View Detail]│  │ [View Detail]│  │ [View Detail]│   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │              │  │              │  │              │   │
│ │   [IMAGE]    │  │   [IMAGE]    │  │   [IMAGE]    │   │
│ │ ✅ UPLOADED  │  │ ✅ UPLOADED  │  │ ✅ UPLOADED  │   │
│ │              │  │              │  │              │   │
│ ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│ │ Grasshopper  │  │ Lumion       │  │ Enscape      │   │
│ │              │  │              │  │              │   │
│ │ Parametric   │  │ Architectural│  │ Real-time    │   │
│ │ design       │  │ rendering    │  │ visualization│   │
│ │              │  │              │  │              │   │
│ │ [View Detail]│  │ [View Detail]│  │ [View Detail]│   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## Public Display: Course Detail Page

```
┌────────────────────────────────────────────────────────┐
│  < Back to Architectural Software                      │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │                      │  │ Architectural        │   │
│  │    [LARGE IMAGE]     │  │ REVIT                │   │
│  │    ✅ YOUR UPLOAD    │  │                      │   │
│  │    Fills hero area   │  │ Complete Revit BIM   │   │
│  │    with custom       │  │ modeling course      │   │
│  │    course image      │  │                      │   │
│  │                      │  │ What you will learn: │   │
│  │                      │  │ ✅ Practical tools   │   │
│  │                      │  │ ✅ Real scenarios    │   │
│  │                      │  │ ✅ Portfolio projects│   │
│  │                      │  │ ✅ Industry practices│   │
│  │                      │  │                      │   │
│  │                      │  │ [Enquire]  [Question]│   │
│  └──────────────────────┘  └──────────────────────┘   │
│                                                          │
├────────────────────────────────────────────────────────┤
│                                                          │
│  Practical Skills          Career Focused              │
│  Professional tools        Job-ready training          │
│                                                          │
│  Expert Support            Certification              │
│  Industry mentors          Recognized credential       │
│                                                          │
├────────────────────────────────────────────────────────┤
│                                                          │
│  Ready to apply?                                        │
│                                                          │
│  Name:        [ _________________  ]                   │
│  Email:       [ _________________  ]                   │
│  Phone:       [ _________________  ]                   │
│  Course:      [ Revit (readonly)    ]                  │
│  Questions:   ┌─────────────────────┐                 │
│               │                     │                 │
│               └─────────────────────┘                 │
│                                                          │
│               [ Send Enquiry ]                          │
│                                                          │
└────────────────────────────────────────────────────────┘
```

---

**Legend**:
- ✅ = New feature added
- [ ] = Input field
- [ TEXT ] = Button
- [IMAGE] = User-uploaded image

**This diagram updated**: June 5, 2026
