# Component Reference Guide
## City Building Engineering - Modern Design System Components

---

## 📚 COMPLETE COMPONENT LIBRARY

This guide documents every component in the new design system with code examples.

---

## 🔘 BUTTONS

### Basic Button
```html
<button class="btn btn-primary">Click Me</button>
```

**CSS:** `.btn` + `.btn-primary`

### Button Variants

#### Primary (Main CTA)
```html
<button class="btn btn-primary">Primary Action</button>
```
- Color: Teal (#0f766e)
- Use for: Main calls-to-action

#### Secondary
```html
<button class="btn btn-secondary">Secondary Action</button>
```
- Color: Gray background
- Use for: Alternative actions

#### Outline
```html
<button class="btn btn-outline-primary">Learn More</button>
```
- Color: Transparent with border
- Use for: Less prominent actions

#### Ghost
```html
<button class="btn btn-ghost">Menu Item</button>
```
- Color: Transparent
- Use for: Navigation-like buttons

### Button Sizes

#### Small
```html
<button class="btn btn-primary btn-sm">Small</button>
```
- Padding: 0.5rem 1rem
- Font Size: var(--font-size-xs)

#### Default
```html
<button class="btn btn-primary">Default</button>
```
- Padding: 0.625rem 1.25rem
- Font Size: var(--font-size-sm)

#### Large
```html
<button class="btn btn-primary btn-lg">Large</button>
```
- Padding: 0.75rem 1.75rem
- Font Size: var(--font-size-base)

### Button with Icon
```html
<button class="btn btn-primary btn-lg">
  <i class="bi bi-rocket-takeoff"></i> Apply Now
</button>
```

### Disabled Button
```html
<button class="btn btn-primary" disabled>Disabled</button>
```
- Opacity: 0.6
- Cursor: not-allowed

---

## 🎴 CARDS

### Basic Card
```html
<div class="card">
  <div class="card-body">
    <h3>Card Title</h3>
    <p>Card content goes here</p>
  </div>
</div>
```

**CSS:** `.card` + `.card-body`

### Feature Card (with Icon)
```html
<div class="card-feature">
  <div class="card-feature-icon">
    <i class="bi bi-laptop"></i>
  </div>
  <h3>Feature Title</h3>
  <p>Feature description here</p>
</div>
```

**CSS:** `.card-feature` + `.card-feature-icon`

**Features:**
- Icon container (3rem x 3rem)
- Icon background color: rgba(15, 118, 110, 0.1)
- Hover effect: lift up, shadow increase
- Good for: Feature lists, capability cards

### Course Card
```html
<article class="card-course">
  <img 
    src="course-image.jpg" 
    alt="Course name" 
    class="card-course-image"
  >
  <div class="card-course-body">
    <h3 class="card-course-title">Course Name</h3>
    <p class="card-course-description">
      Learn industry-standard tools...
    </p>
    <a href="#" class="btn btn-primary btn-sm">
      Enroll Now
    </a>
  </div>
</article>
```

**CSS:** `.card-course` + `.card-course-image` + `.card-course-body`

**Features:**
- Image height: 12rem
- Image covers entire width
- Body grows to fill space
- Button sticks to bottom

---

## 📝 FORMS

### Form Wrapper
```html
<form class="form-wrapper">
  <!-- form content -->
</form>
```

**CSS:** `.form-wrapper`

**Features:**
- Background: white
- Border: 1px solid
- Border radius: var(--radius-lg)
- Padding: clamp(2rem, 5vw, 3rem)
- Box shadow: var(--shadow-md)

### Form Group
```html
<div class="form-group">
  <label class="form-label" for="field-id">Field Label *</label>
  <input 
    type="text" 
    id="field-id" 
    class="form-control" 
    placeholder="Enter text..."
    required
  >
  <div class="form-help">Help text here</div>
</div>
```

**CSS:** `.form-group` + `.form-label` + `.form-control` + `.form-help`

### Input Types

#### Text Input
```html
<input 
  type="text" 
  class="form-control" 
  placeholder="Your name"
>
```

#### Email Input
```html
<input 
  type="email" 
  class="form-control" 
  placeholder="your@email.com"
>
```

#### Telephone Input
```html
<input 
  type="tel" 
  class="form-control" 
  placeholder="+1 (000) 000-0000"
>
```

#### Textarea
```html
<textarea 
  class="form-control" 
  rows="4" 
  placeholder="Enter message..."
></textarea>
```

### Select Dropdown
```html
<select class="form-select">
  <option>Select option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkbox
```html
<div style="display: flex; gap: var(--spacing-sm);">
  <input type="checkbox" id="agree" required>
  <label for="agree">I agree to terms</label>
</div>
```

### Form Validation

#### Error State
```html
<input class="form-control" type="email" value="invalid">
<div class="form-error">Please enter a valid email</div>
```

#### Helper Text
```html
<input class="form-control" type="password">
<div class="form-help">Password must be 8+ characters</div>
```

---

## ⚠️ ALERTS & NOTIFICATIONS

### Success Alert
```html
<div class="alert alert-success alert-dismissible fade show" role="alert">
  <i class="bi bi-check-circle" aria-hidden="true"></i>
  <div>
    <strong>Success!</strong>
    <p>Your changes have been saved.</p>
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

### Warning Alert
```html
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
  <div>
    <strong>Warning</strong>
    <p>This action cannot be undone.</p>
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

### Danger Alert
```html
<div class="alert alert-danger alert-dismissible fade show" role="alert">
  <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
  <div>
    <strong>Error</strong>
    <p>An error occurred. Please try again.</p>
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

### Info Alert
```html
<div class="alert alert-info alert-dismissible fade show" role="alert">
  <i class="bi bi-info-circle" aria-hidden="true"></i>
  <div>
    <strong>Information</strong>
    <p>Check your email for confirmation.</p>
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
```

---

## 🏷️ BADGES & LABELS

### Primary Badge
```html
<span class="badge badge-primary">Primary</span>
```

### Success Badge
```html
<span class="badge badge-success">Active</span>
```

### Warning Badge
```html
<span class="badge badge-warning">Pending</span>
```

### Danger Badge
```html
<span class="badge badge-danger">Urgent</span>
```

---

## 📊 LISTS & TABLES

### Unstyled List
```html
<ul class="list-unstyled">
  <li>
    <i class="bi bi-check-circle-fill text-success me-2"></i>
    List item 1
  </li>
  <li>
    <i class="bi bi-check-circle-fill text-success me-2"></i>
    List item 2
  </li>
</ul>
```

### Table
```html
<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td><span class="badge badge-success">Active</span></td>
    </tr>
  </tbody>
</table>
```

---

## 🏗️ GRIDS & LAYOUTS

### 2-Column Grid
```html
<div class="grid grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

Behavior:
- Desktop: 2 columns
- Tablet: 2 columns
- Mobile: 1 column (stacked)

### 3-Column Grid
```html
<div class="grid grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

Behavior:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

### 4-Column Grid
```html
<div class="grid grid-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
  <div>Column 4</div>
</div>
```

Behavior:
- Large Desktop: 4 columns
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

### Auto-Responsive Grid
```html
<div class="grid grid-auto">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <!-- automatically fills available space -->
</div>
```

Behavior:
- Automatically sizes items to fit screen
- Min item width: 280px
- Wraps to new row as needed

---

## 🎨 TYPOGRAPHY

### Headings
```html
<h1>Heading 1 (Display Size)</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
```

**Font Sizes (Fluid):**
- h1: clamp(2.25rem, 5vw, 3rem)
- h2: clamp(1.875rem, 4vw, 2.25rem)
- h3: clamp(1.5rem, 3vw, 1.875rem)
- h4: clamp(1.25rem, 2.5vw, 1.5rem)
- h5: clamp(1.125rem, 2vw, 1.25rem)
- h6: clamp(1rem, 1.5vw, 1.125rem)

### Paragraph
```html
<p>Regular paragraph text</p>
<p class="lead">Lead/intro paragraph</p>
<p class="text-muted">Muted/secondary text</p>
```

**Font Sizes:**
- p: var(--font-size-base) = clamp(1rem, 1.5vw, 1.125rem)
- .lead: var(--font-size-lg) = clamp(1.125rem, 2vw, 1.25rem)
- .text-muted: Reduced opacity

---

## 🎭 HERO SECTION

### Complete Hero
```html
<section class="hero">
  <div class="container">
    <div class="grid grid-2">
      <div class="hero-content">
        <h1 class="hero-title">
          Become an Expert
        </h1>
        <p class="hero-subtitle">
          Master industry-standard tools...
        </p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg">
            Apply Now
          </button>
          <a href="#" class="btn btn-outline-primary btn-lg">
            Learn More
          </a>
        </div>
      </div>
      <div>
        <img 
          src="hero.jpg" 
          alt="Professional training" 
          class="hero-image"
        >
      </div>
    </div>
  </div>
</section>
```

**CSS:** `.hero` + `.hero-content` + `.hero-title` + `.hero-subtitle` + `.hero-cta` + `.hero-image`

**Features:**
- Gradient background (primary to primary-light)
- SVG pattern overlay
- Responsive grid (2 cols → 1 col on mobile)
- Image hidden on mobile

---

## 🧭 NAVIGATION BAR

### Navbar Structure
```html
<nav class="navbar navbar-expand-lg" role="navigation">
  <div class="container">
    <!-- Brand -->
    <a class="navbar-brand" href="/">
      <img src="logo.png" alt="City Building" class="navbar-logo">
      <span>City Building</span>
    </a>

    <!-- Hamburger Toggle -->
    <button 
      class="navbar-toggler" 
      data-bs-toggle="collapse" 
      data-bs-target="#mainNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Nav Items -->
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/">Home</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#">Menu</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Item 1</a></li>
            <li><a class="dropdown-item" href="#">Item 2</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

**CSS:** `.navbar` + `.navbar-brand` + `.navbar-logo` + `.nav-link` + `.dropdown-menu`

---

## 🦶 FOOTER

### Footer Structure
```html
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="grid grid-4">
      <!-- Column 1 -->
      <div class="footer-section">
        <h3 class="footer-title">Company</h3>
        <ul class="list-unstyled">
          <li><a href="#" class="footer-link">About</a></li>
          <li><a href="#" class="footer-link">Contact</a></li>
        </ul>
      </div>
      <!-- More columns... -->
    </div>
  </div>
</footer>
```

**CSS:** `.footer` + `.footer-section` + `.footer-title` + `.footer-link`

---

## 🎬 ANIMATIONS

### Fade In
```html
<div class="animate-fade-in">
  This will fade in smoothly
</div>
```

### Slide Up
```html
<div class="animate-slide-up">
  This will slide up from below
</div>
```

### Hover Effects
Built into components:
- Buttons: lift up (translateY(-2px))
- Cards: lift up (translateY(-4px to -8px))
- Links: color change + underline

---

## 📐 SPACING UTILITIES

### Margin Top
```html
<div class="mt-sm">Small margin top</div>
<div class="mt-md">Medium margin top</div>
<div class="mt-lg">Large margin top</div>
<div class="mt-xl">Extra large margin top</div>
```

### Margin Bottom
```html
<div class="mb-sm">Small margin bottom</div>
<div class="mb-md">Medium margin bottom</div>
<div class="mb-lg">Large margin bottom</div>
<div class="mb-xl">Extra large margin bottom</div>
```

### Padding
```html
<div class="px-sm">Horizontal padding</div>
<div class="py-md">Vertical padding</div>
```

---

## 🔍 UTILITY CLASSES

### Text Alignment
```html
<p class="text-center">Centered text</p>
<p class="text-left">Left aligned</p>
<p class="text-right">Right aligned</p>
```

### Responsive Display
```html
<!-- Hide on mobile, show on larger -->
<div class="hidden-mobile">Desktop only</div>

<!-- Hide on tablet, show on others -->
<div class="hidden-tablet">Mobile and desktop</div>

<!-- Hide on desktop, show on mobile/tablet -->
<div class="hidden-desktop">Mobile and tablet</div>
```

---

## 🎨 COLOR SYSTEM

### Text Colors
```html
<p style="color: var(--text-primary);">Primary text</p>
<p style="color: var(--text-secondary);">Secondary text</p>
<p style="color: var(--text-tertiary);">Tertiary text</p>
```

### Background Colors
```html
<div style="background-color: var(--bg-primary);">Primary BG</div>
<div style="background-color: var(--bg-secondary);">Secondary BG</div>
<div style="background-color: var(--bg-tertiary);">Tertiary BG</div>
```

### Semantic Colors
```html
<div style="background-color: rgba(16, 185, 129, 0.1); color: var(--color-success);">
  Success
</div>
<div style="background-color: rgba(245, 158, 11, 0.1); color: var(--color-warning);">
  Warning
</div>
<div style="background-color: rgba(239, 68, 68, 0.1); color: var(--color-danger);">
  Danger
</div>
```

---

## 📱 RESPONSIVE PATTERNS

### Mobile First
```html
<!-- Mobile default: single column -->
<div class="grid grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Automatically becomes:
     Mobile: 1 column (stacked)
     Tablet: 2 columns
     Desktop: 2 columns
-->
```

### Hidden on Specific Sizes
```html
<!-- Show only on desktop -->
<img src="hero.jpg" alt="Hero" class="hidden-mobile">

<!-- Show only on mobile -->
<img src="hero-mobile.jpg" alt="Hero" class="hidden-tablet hidden-desktop">
```

### Responsive Font Sizes
All typography automatically scales using clamp():
- Automatically readable on mobile
- Perfectly sized on desktop
- No media queries needed

---

## ✅ BEST PRACTICES

### Do's ✅
```html
<!-- Use component classes -->
<button class="btn btn-primary btn-lg">Good</button>

<!-- Use CSS variables -->
<div style="padding: var(--spacing-md);">Good</div>

<!-- Use semantic HTML -->
<nav class="navbar">Good</nav>

<!-- Use proper ARIA labels -->
<button aria-label="Close menu">Good</button>
```

### Don'ts ❌
```html
<!-- Don't use inline styles -->
<button style="background: blue; padding: 10px 20px;">Bad</button>

<!-- Don't mix class systems -->
<div class="grid col-md-6">Bad</div>

<!-- Don't use non-semantic elements for structure -->
<div class="navbar">Bad</div>

<!-- Don't forget alt text -->
<img src="image.jpg">Bad</img>
```

---

## 🔄 COMBINING COMPONENTS

### Button Group
```html
<div style="display: flex; gap: var(--spacing-md);">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-outline-primary">Outline</button>
</div>
```

### Feature Grid with Buttons
```html
<div class="grid grid-auto">
  <div class="card-feature">
    <div class="card-feature-icon">icon</div>
    <h3>Title</h3>
    <p>Description</p>
    <button class="btn btn-primary btn-sm">Learn More</button>
  </div>
</div>
```

### Form with Help Text
```html
<div class="form-group">
  <label class="form-label">Field</label>
  <input class="form-control" type="text">
  <div class="form-help">This is helper text</div>
</div>
```

---

## 📞 TROUBLESHOOTING

### Component Not Styling?
1. Check CSS file is loaded (`design-system.css` + `components.css`)
2. Verify class names are correct
3. Check browser DevTools for CSS conflicts
4. Clear browser cache (Ctrl+Shift+Delete)

### Spacing Looks Wrong?
- Use CSS variables instead of hardcoded values
- Check if parent has conflicting padding/margin
- Use DevTools Inspector to verify computed styles

### Button Not Responsive?
- Ensure mobile viewport meta tag present
- Use `btn-lg` class on mobile CTA buttons
- Test on real mobile device, not just browser emulation

### Form Labels Not Associated?
- Use proper `for` attribute on labels
- Match `id` on input to `for` on label
- Use `aria-required="true"` for required fields

---

## 🎓 LEARNING PATH

1. **Start with:** Design Tokens in design-system.css
2. **Then learn:** Global styles and typography
3. **Practice with:** Buttons and forms
4. **Build:** Cards and grids
5. **Combine:** Multiple components together
6. **Deploy:** Full pages using patterns

---

This comprehensive component reference covers every element in the modern design system. Use it as a quick lookup guide while developing! 🚀
