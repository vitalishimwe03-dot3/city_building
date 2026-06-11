# Responsive Design Guide - City Building Academy

## Overview
This document outlines all responsive design updates made to fix browser display errors and optimize layouts across all device sizes.

---

## 📱 Responsive Breakpoints

All media queries follow Bootstrap 5.3 breakpoints:

| Device | Breakpoint | Width Range | Use Case |
|--------|-----------|-------------|----------|
| **Mobile (XS)** | None | < 576px | Phones |
| **Tablet (SM)** | 576px | 576px - 767px | Small tablets |
| **Tablet (MD)** | 768px | 768px - 991px | iPad, tablets |
| **Desktop (LG)** | 992px | 992px - 1199px | Laptops |
| **Large (XL)** | 1200px | 1200px - 1399px | Desktop monitors |
| **XL (XXL)** | 1400px | 1400px+ | Large monitors, 4K |

---

## 🧭 Navigation Bar

### Mobile Display (< 576px)
```
┌─────────────────────────┐
│ 🏢 Hamburger Menu       │
├─────────────────────────┤
│ • Home                  │
│ • About                 │
│ • Services              │
│ ────────────────────    │
│ • Login / Sign up       │
│ • Language              │
└─────────────────────────┘
```
- Logo height: 40px
- Nav items stack vertically
- Icons visible, text hidden on xs
- Full-width hamburger menu
- Padding: `0.5rem` on sides

### Tablet Display (576px - 991px)
```
┌─────────────────────────────────────┐
│ 🏢 City Building  Home About ... 🌍 │
│                                     │
└─────────────────────────────────────┘
```
- Logo height: 40px
- Nav items: `px-2 px-lg-3` responsive padding
- Text labels visible
- Language dropdown accessible
- Still has hamburger on small tablets

### Desktop Display (992px+)
```
┌──────────────────────────────────────────────────┐
│ 🏢 City Building | Home | About | Services | 🌍 │
│ Engineering Company Ltd (partial) | Contact      │
│ Full text visible, optimized spacing             │
└──────────────────────────────────────────────────┘
```
- Full navbar brand text visible
- Inline horizontal menu
- Logo height: 48px
- Spacing: `px-lg-3` (1rem on desktop)
- Sticky positioning

---

## 🎨 Subcourse Layout

### Mobile Layout (< 576px)
```
┌─────────────────────────┐
│ ← Back to Category      │
├─────────────────────────┤
│                         │
│   [Course Image]        │
│   (Full Width)          │
│                         │
├─────────────────────────┤
│ Category Badge          │
│                         │
│ Course Title            │
│ (Large text)            │
│                         │
│ Description paragraph   │
│ Wrapping naturally      │
│                         │
│ ✓ Learning Point 1      │
│ ✓ Learning Point 2      │
│ ✓ Learning Point 3      │
│                         │
│ [Enquire Button]        │
│ [Ask Question Button]   │
├─────────────────────────┤
│ [Info Card]             │
│ [Info Card]             │
│ [Info Card]             │
│ [Info Card]             │
│ (Stacked vertically)    │
└─────────────────────────┘
```

**CSS Applied:**
- Full-width image
- `g-4` gap (1.5rem)
- Single column layout
- Buttons stack vertically with `flex-column`
- Info cards 100% width

### Tablet Layout (576px - 991px)
```
┌──────────────────────────┐
│ ← Back                   │
├────────────┬─────────────┤
│            │ Category    │
│  [Image]   │ Title       │
│  50% wide  │ Description │
│            │ Benefits    │
│            │ [Buttons]   │
├────────────┴─────────────┤
│ [Card] [Card] [Card]     │
│ 2 columns on sm, 4 on md │
└──────────────────────────┘
```

**CSS Applied:**
- `col-lg-5` for image (flex: 1 on md up)
- `col-lg-7` for content (flex: 1)
- 2-column grid for info cards
- Hero spacing: `g-4 g-lg-5`
- Buttons: `d-flex flex-sm-row`

### Desktop Layout (992px+)
```
┌───────────────────────────────────────────────┐
│ ← Back to Category                            │
├──────────────────┬───────────────────────────┤
│                  │ Category Badge            │
│  [Course Image]  │                           │
│  ~50% width      │ Course Title (h1)         │
│  Perfect ratio   │ Description               │
│                  │ • Benefits list           │
│                  │ • Multiple items          │
│                  │ • Check marks             │
│                  │ [Enquire] [Ask]           │
├──────────────────┴───────────────────────────┤
│ [Info] [Info] [Info] [Info]                  │
│ 4 equal columns, centered text               │
├─────────────────────────────────────────────┤
│         ENQUIRY FORM SECTION                 │
│ [Name] [Email]                              │
│ [Phone] [Course]                            │
│ [Message textarea]                          │
│ [Submit Button]                             │
└─────────────────────────────────────────────┘
```

**CSS Applied:**
- `col-12 col-lg-5` for image
- `col-12 col-lg-7` for content
- Image height: 450px on desktop (with object-fit)
- Content vertically centered (flexbox)
- 4-column grid for info cards
- Max-width 800px for enquiry form
- Padding: `py-5` (3rem on md, 4rem on lg)

---

## 📊 Info Cards Grid

### Responsive Columns
- **Mobile**: `col-md-3 col-sm-6` = 2 columns (50% each)
- **Tablet (sm)**: `col-sm-6` = 2 columns
- **Tablet (md)**: `col-md-3` = 4 columns
- **Desktop**: Always 4 columns

```css
<div class="col-md-3 col-sm-6">
  <div class="info-card">...</div>
</div>
```

### Height Management
- Uses `min-height: 150px`
- Hover effect: `transform: translateY(-5px)`
- Centered content with flexbox

---

## 📋 Form Responsiveness

### Enquiry Form Layout

**Mobile (< 576px):**
```
[Full name              ]
[Email                 ]
[Phone                 ]
[Course               ]
[Message               ]
[Button - Full Width  ]
```

**Tablet+ (576px+):**
```
[Name    ][Email   ]
[Phone   ][Course  ]
[Message - Full Width ]
[Button              ]
```

**CSS Grid:**
```css
<div class="col-md-6">  /* Half width on md+ */
  <input class="form-control-lg">
</div>
```

---

## 🎯 Footer Responsive Stack

### Mobile (< 576px)
```
┌─────────────────────┐
│ Company Info        │
│ - Logo              │
│ - Language Select   │
│ - Contact           │
├─────────────────────┤
│ Explore             │
├─────────────────────┤
│ Quick Links         │
├─────────────────────┤
│ Connect             │
│ [Social Icons]      │
├─────────────────────┤
│ Footer Bottom       │
└─────────────────────┘
```

### Tablet (576px - 767px)
```
┌────────────────────────────────┐
│ Company | Explore | Quick Links│
│ Info    | Links   | Links      │
├────────────────────────────────┤
│ Connect - Social Icons (Full)  │
├────────────────────────────────┤
│ Footer Copyright               │
└────────────────────────────────┘
```

### Desktop (768px+)
```
┌──────────────────────────────────────────┐
│ Company (col-4) | Links (col-2) | Links │
│ Logo, Contact   | Home, About    | Career│
│                 | Services, Cert | Signup│
├──────────────────────────────────────────┤
│ Connect (col-3) - Social icons           │
├──────────────────────────────────────────┤
│ Copyright (col-6) | Design Note (col-6)  │
└──────────────────────────────────────────┘
```

**CSS Classes:**
- `col-12 col-sm-6 col-lg-4` = Full width, then 50%, then 33%
- `col-6 col-sm-3 col-lg-2` = 50%, then 25%, then 16%
- Social chips: `d-flex gap-2` with `d-none d-sm-inline` for labels

---

## 🔧 CSS Utilities for Responsiveness

### Display Utilities
```html
<!-- Hide on small devices, show on md+ -->
<span class="d-none d-md-inline">Full text</span>

<!-- Hide on large devices -->
<span class="d-lg-none">Mobile text</span>

<!-- Flex direction change -->
<div class="d-flex flex-column flex-md-row"></div>
```

### Spacing (Padding/Margin)
```
p-2        = 0.5rem (mobile default)
p-md-3     = 0.75rem on md+
px-lg-4    = 1rem horizontal on lg+
py-5       = 3rem vertical
```

### Text Sizing
```css
font-size: clamp(2rem, 2.4vw, 2.8rem);
/* Min: 2rem, Preferred: 2.4vw, Max: 2.8rem */
```

---

## 🚨 Browser Error Fixes

### Issues Fixed:
1. ✅ **Navbar overflow on desktop** - Added `px-2 px-lg-4` to container
2. ✅ **Subcourse layout not responsive** - Added `col-lg-5/col-lg-7` grid
3. ✅ **Form button full-width on mobile** - Added `w-100 w-md-auto` class
4. ✅ **Footer stacking issues** - Fixed with proper col classes
5. ✅ **Missing media queries** - Added comprehensive breakpoints
6. ✅ **Small device working fine** - Maintained mobile-first approach

### Testing Checklist:
- [ ] Mobile (320px - 375px)
- [ ] Small phone (376px - 425px)
- [ ] Tablet portrait (426px - 768px)
- [ ] Tablet landscape (769px - 1024px)
- [ ] Desktop (1025px - 1440px)
- [ ] Large desktop (1441px - 1920px)
- [ ] 4K (1921px+)

---

## 📐 CSS Variables for Theming

```css
/* Light Mode (Default) */
--light-bg: #ffffff;
--light-text: #1e293b;
--light-accent: #0f766e;

/* Dark Mode */
--dark-bg: #0f172a;
--dark-text: #f1f5f9;
--dark-accent: #14b8a6;
```

Apply responsively:
```css
body {
  background-color: var(--light-surface);
}
body.dark-mode {
  background-color: var(--dark-bg);
}
```

---

## 🎬 Animation & Transitions

### Button Hover (All Devices)
```css
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
}
```

### Card Hover (All Devices)
```css
.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
```

### Dropdown (Desktop friendly)
```css
.dropdown-item:hover {
  transform: translateX(2px);
  background-color: #e0e3e8;
}
```

---

## 📖 Usage Examples

### Hero Section
```html
<div class="row g-4 g-lg-5 align-items-center">
  <div class="col-12 col-lg-5">
    <!-- Image -->
  </div>
  <div class="col-12 col-lg-7">
    <!-- Content -->
  </div>
</div>
```

### Responsive Grid
```html
<div class="row g-4">
  <div class="col-md-3 col-sm-6">
    <!-- Card -->
  </div>
</div>
```

### Flexible Buttons
```html
<div class="d-flex flex-column flex-sm-row gap-3">
  <button class="btn btn-primary btn-lg">Action</button>
  <button class="btn btn-outline-secondary btn-lg">Secondary</button>
</div>
```

---

## 🔗 Related Files

- [Layout Template](views/layout.ejs)
- [Subcourse Template](views/subcourse.ejs)
- [Style Stylesheet](public/css/style.css)
- [Custom Stylesheet](public/css/custom.css)

---

## 📝 Notes

- All layouts use Bootstrap 5.3 grid system
- Mobile-first approach: base styles for mobile, media queries for larger screens
- No inline styles; all responsive classes
- Accessibility maintained with semantic HTML
- Print styles included for document printing
- Font sizing uses `clamp()` for smooth scaling

---

**Last Updated:** June 1, 2026  
**Version:** 2.0 - Full Responsive Redesign
