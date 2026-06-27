# City Building Engineering — AI Visibility (GEO) & SEO Strategy

## Audit Summary: Why AI Says "Not Found"

**Current Issues Identified:**

1. **No Schema.org structured data** — Only a minimal Organization schema exists. No Course, LocalBusiness, FAQPage, EducationalOrganization, or BreadcrumbList schemas.
2. **No semantic HTML structure** — Missing H1 tags, improper heading hierarchy, no `<article>`, `<section>` landmarks for AI parsers.
3. **Course URLs use numeric IDs** — `/course/23` instead of `/course/revit-training-kigali`. AI models prefer descriptive, human-readable URLs.
4. **No dedicated content pages** — No blog, FAQ, internship page, instructor bios, or portfolio pages. AI needs text content to extract answers.
5. **Domain mismatch** — sitemap.xml and robots.txt reference `citybuilding.rw` but the live site is `city-building-engineering.onrender.com`. This confuses crawlers.
6. **No Open Graph / Twitter Card meta** — Social media previews are broken, reducing sharing and backlink potential.
7. **Testimonials load via JavaScript** — "Loading testimonials..." means AI crawlers never see your social proof.
8. **No E-E-A-T signals** — No author bios, instructor credentials, certifications, partner logos, or client logos displayed.
9. **Services page focuses on wrong content** — Highlights "Digital Twin" and "IoT" instead of your core training and engineering services.
10. **No location-specific content** — No pages targeting "Kigali" or "Rwanda" specifically for local SEO.
11. **No blog/content marketing** — Zero articles means no answerable content for AI to reference.
12. **Meta titles and descriptions are generic** — The `<title>` only shows page-level titles without leveraging keywords.

---

## How AI Search Engines Determine Authority

AI models rank sources based on:

| Factor | Weight | What to Do |
|--------|--------|------------|
| Structured Data (Schema.org) | Critical | Implement JSON-LD for all entity types |
| Clear, factual content | Critical | Create definitive pages answering "what," "where," "how much," "who" |
| Citation frequency | High | Get listed on .ac.rw, LinkedIn, directories, Google Business |
| E-E-A-T signals | High | Display instructor creds, certifications, partnerships |
| Fresh content | Medium | Publish blog posts monthly |
| Backlink quality | Medium | Earn links from .rw domains and education sites |
| Page speed & technical SEO | Medium | Optimize Core Web Vitals |
| Social proof | Medium | Indexable testimonials, case studies, portfolio |

---

## Phase 1 — Critical Fixes (Now)

### 1.1 Fix Domain & Crawl Issues

**Robots.txt** — Update to match actual domain:
```
User-agent: *
Allow: /
Sitemap: https://city-building-engineering.onrender.com/sitemap.xml
```

**Sitemap.xml** — Update domain references, add all new pages:
- Use `https://city-building-engineering.onrender.com/` as base
- Add priority for each page type
- Include all category, course, and new content pages

### 1.2 Fix Core SEO Meta Tags (in layout.ejs `<head>`)

Add proper meta tags for every page:

```html
<meta name="description" content="[page-specific description]">
<meta name="keywords" content="[page-specific keywords]">
<link rel="canonical" href="https://city-building-engineering.onrender.com[path]">
<meta property="og:type" content="website">
<meta property="og:title" content="[page title]">
<meta property="og:description" content="[page-specific description]">
<meta property="og:url" content="https://city-building-engineering.onrender.com[path]">
<meta property="og:image" content="https://city-building-engineering.onrender.com/images/og-image.jpg">
<meta property="og:locale" content="en_RW">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[page title]">
<meta name="twitter:description" content="[page-specific description]">
```

Generate a 1200x630px OG image with the company logo on a branded background.

### 1.3 Upgrade Schema.org Structured Data (JSON-LD)

Replace the minimal schema with these types:

**A) Organization — on every page:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://city-building-engineering.onrender.com/#organization",
  "name": "City Building Engineering Company Ltd",
  "alternateName": "City Building Engineering",
  "url": "https://city-building-engineering.onrender.com",
  "logo": "https://city-building-engineering.onrender.com/images/logo.png",
  "description": "Professional software training, engineering consultancy, and academic internships in Kigali, Rwanda.",
  "foundingDate": "2020",
  "email": "citybuildingengineeringcompany@gmail.com",
  "telephone": "+250-789-257-758",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "KG 17 Ave, Remera, Gasabo District",
    "addressLocality": "Kigali",
    "addressRegion": "Kigali City",
    "addressCountry": "RW"
  },
  "location": {
    "@type": "Place",
    "name": "City Building Engineering Office",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "KG 17 Ave, Remera, Near BK Arena",
      "addressLocality": "Kigali",
      "addressCountry": "RW"
    }
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+250-789-257-758",
    "contactType": ["enrollment", "customer service"],
    "availableLanguage": ["English", "French", "Kinyarwanda"]
  },
  "sameAs": [
    "https://www.instagram.com/city_building_engineering_cltd/",
    "https://wa.me/250789257758"
  ]
}
```

**B) LocalBusiness — on contact page:**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://city-building-engineering.onrender.com/contact#localbusiness",
  "parentOrganization": { "@id": "https://city-building-engineering.onrender.com/#organization" },
  "name": "City Building Engineering Company Ltd",
  "image": "https://city-building-engineering.onrender.com/images/logo.png",
  "priceRange": "$$",
  "areaServed": ["RW", "East Africa"],
  "openingHours": "Mo-Fr 08:00-17:00",
  "telephone": "+250-789-257-758",
  "email": "citybuildingengineeringcompany@gmail.com"
}
```

**C) EducationalOrganization — on about page:**
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://city-building-engineering.onrender.com/about#educational",
  "parentOrganization": { "@id": "https://city-building-engineering.onrender.com/#organization" },
  "name": "City Building Engineering Training Academy",
  "description": "Professional software training for architecture, engineering, and design careers.",
  "teaches": [
    "AutoCAD", "Revit", "ArchiCAD", "SketchUp", "Civil 3D", "ArcGIS",
    "WaterCAD", "WaterGEMS", "ETABS", "SAFE", "CSI Bridge", "CSI Detailer",
    "Robot Structural Analysis", "ProtaStructure", "Prokon", "Lumion",
    "Twinmotion", "Enscape", "V-Ray", "PLAXIS 2D", "PLAXIS 3D"
  ]
}
```

**D) Course — on each category/course page:**
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://city-building-engineering.onrender.com/course/[slug]#course",
  "name": "Revit Training Course in Kigali, Rwanda",
  "description": "Professional Revit training — BIM and architectural design. Hands-on course in Kigali.",
  "provider": {
    "@type": "EducationalOrganization",
    "@id": "https://city-building-engineering.onrender.com/about#educational",
    "name": "City Building Engineering Training Academy"
  },
  "coursePrerequisites": "Basic computer literacy",
  "courseMode": "In-person",
  "location": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kigali",
      "addressCountry": "RW"
    }
  },
  "offers": {
    "@type": "Offer",
    "price": "[price]",
    "priceCurrency": "RWF",
    "availability": "https://schema.org/InStock"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "In-person",
    "location": {
      "@type": "Place",
      "name": "City Building Engineering Office",
      "address": "KG 17 Ave, Remera, Kigali"
    },
    "instructor": {
      "@type": "Person",
      "name": "[Instructor Name]",
      "jobTitle": "Certified Instructor"
    }
  }
}
```

**E) FAQPage — on FAQ page:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What software training do you offer in Kigali?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "We offer professional training in AutoCAD, Revit, ArchiCAD, ETABS, Civil 3D, ArcGIS, Lumion, and more at our Kigali, Rwanda campus."
    }
  }]
}
```

**F) BreadcrumbList — on every page:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://city-building-engineering.onrender.com"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Architecture Courses",
    "item": "https://city-building-engineering.onrender.com/category/architecture"
  }]
}
```

**G) WebSite — on every page:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://city-building-engineering.onrender.com",
  "name": "City Building Engineering — Software Training Kigali",
  "description": "Professional software training for architecture, engineering, and construction careers in Rwanda.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://city-building-engineering.onrender.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 1.4 Fix Testimonials (Make Them Indexable)

Replace the client-side `Loading testimonials...` with server-rendered HTML. Pass testimonials from the route handler:
```ejs
<% if (testimonials && testimonials.length) { %>
  <% testimonials.forEach(t => { %>
    <div class="testimonial" itemscope itemtype="https://schema.org/Review">
      <p itemprop="reviewBody"><%= t.content %></p>
      <cite itemprop="author" itemscope itemtype="https://schema.org/Person">
        <span itemprop="name"><%= t.student_name %></span>
      </cite>
      <meta itemprop="reviewRating" content="<%= t.rating %>">
    </div>
  <% }); %>
<% } else { %>
  <p>Loading testimonials...</p>
<% } %>
```

### 1.5 Fix Contact Page

Remove the broken `de s` text artifact in the contact address. Ensure the contact form posts to a working endpoint.

---

## Phase 2 — SEO Improvements (Week 1-2)

### 2.1 Keyword Strategy

**Primary Keywords:**
- engineering software training Rwanda
- AutoCAD training Kigali
- Revit course Rwanda
- Civil 3D training Kigali
- structural analysis software course
- engineering internship Rwanda
- internship for civil engineering students Rwanda

**Secondary Keywords:**
- best architecture software course Rwanda
- GIS training Kigali
- WaterCAD training Rwanda
- ETABS course Rwanda
- SAFE software training
- building design training Kigali
- surveying software course Rwanda
- professional training for engineers Rwanda

**Long-tail Keywords:**
- where to learn Revit in Kigali Rwanda
- best AutoCAD training center in Kigali
- civil engineering internship opportunities in Rwanda
- structural design software training for beginners
- BIM training courses in Kigali 2026
- affordable engineering software training Rwanda
- certified Revit training near me in Kigali
- WaterGEMS training for water engineers Rwanda
- Lumion rendering course for architects Rwanda
- ETABS structural analysis training for civil engineers

**Semantic Keywords:**
- BIM (Building Information Modeling), CAD, drafting, 3D modeling, structural analysis, geotechnical analysis, water distribution modeling, GIS mapping, rendering, visualization, sustainable design, engineering consultancy, academic internship, career pathways

### 2.2 SEO Titles & Meta Descriptions

| Page | Title (max 60 chars) | Meta Description (max 160 chars) |
|------|---------------------|-------------------------------|
| Home | City Building Engineering — Software Training in Kigali, Rwanda | Professional software training in AutoCAD, Revit, ETABS & more. Hands-on courses for architects & engineers in Kigali, Rwanda. Enroll now. |
| About | About City Building Engineering — Kigali's Training Hub | Learn about City Building Engineering Company Ltd — Kigali's premier engineering software training center with 50+ courses and 98% job placement. |
| Services | Engineering Services & Software Training in Kigali | Professional training, engineering consultancy, building design, road design, surveying & GIS services in Rwanda. |
| Contact | Contact City Building Engineering — Kigali, Rwanda | Get in touch with City Building Engineering. Visit our office in Remera, Kigali or call +250 789 257 758. |
| Category | [Name] Software Training in Kigali, Rwanda | Professional [name] training in Kigali. Hands-on courses with certified instructors. Enroll today. |
| Course | [Software Name] Course in Kigali — City Building Engineering | Learn [software name] in Kigali with hands-on training. Certified instructors, real projects. |
| Career | Engineering Careers & Internships in Rwanda | Explore career opportunities and engineering internships in Rwanda at City Building Engineering. |
| FAQ | FAQ — Software Training & Engineering Services in Kigali | Answers to common questions about our training, pricing, schedules, and engineering services in Kigali. |
| Internship | Engineering Internships in Rwanda — City Building | Professional internship programs for civil engineering students in Kigali, Rwanda. Gain hands-on experience. |
| Blog | [Blog Title] — City Building Engineering | [Article-specific description targeting the keyword] |

### 2.3 Heading Structure (H1, H2, H3)

**Homepage:**
```
H1: Professional Software Training for Engineers & Architects in Kigali
H2: Our Courses
  H3: Architecture Software Training
  H3: Structural Engineering Software Training
  H3: Civil Engineering & GIS Training
  H3: Visualization & Rendering Training
H2: Why Choose City Building Engineering
H2: What Our Students Say
H2: Start Your Engineering Career Today
```

**Category Page (e.g., Architecture):**
```
H1: Architecture Software Training in Kigali, Rwanda
H2: Software We Teach
  H3: Revit (BIM & Architectural Design)
  H3: ArchiCAD (Building Design)
  H3: SketchUp (3D Modeling)
  H3: AutoCAD (Technical Drafting)
H2: Why Learn Architecture Software at City Building?
H2: Course Schedule & Pricing
H2: Enroll Now
```

**Course Page:**
```
H1: Revit Training Course in Kigali
H2: Course Overview
H2: What You'll Learn
H2: Prerequisites
H2: Schedule & Duration
H2: Pricing
H2: Your Instructor
H2: Enroll in This Course
```

### 2.4 URL Structure

Change from numeric IDs to slugs:

| Current | New |
|---------|-----|
| `/course/23` | `/course/revit-training-kigali` |
| `/course/19` | `/course/autocad-training-kigali` |
| `/course/2` | `/course/archicad-training-kigali` |
| `/course/4` | `/course/sketchup-training-kigali` |
| `/course/18` | `/course/civil-3d-training-kigali` |
| `/course/11` | `/course/arcgis-training-kigali` |
| `/course/10` | `/course/watercad-training-kigali` |
| `/course/9` | `/course/watergems-training-kigali` |
| `/course/6` | `/course/etabs-training-kigali` |
| `/course/14` | `/course/safe-training-kigali` |
| `/course/12` | `/course/csi-bridge-training-kigali` |
| `/course/13` | `/course/csi-detailer-training-kigali` |
| `/course/26` | `/course/robot-structural-analysis-kigali` |
| `/course/25` | `/course/protastructure-training-kigali` |
| `/course/16` | `/course/prokon-training-kigali` |
| `/course/7` | `/course/lumion-training-kigali` |
| `/course/5` | `/course/twinmotion-training-kigali` |
| `/course/1` | `/course/enscape-training-kigali` |
| `/course/8` | `/course/vray-training-kigali` |
| `/course/22` | `/course/plaxis-2d-training-kigali` |
| `/course/27` | `/course/plaxis-3d-training-kigali` |

Add 301 redirects from old numeric URLs to new slug URLs.

### 2.5 Navigation Improvements

Current: Home | About | Services | Contact | Certificate | Career

**New Navigation:**
```
Home | About | Courses ▼ | Services ▼ | Internship | FAQ | Contact
         └─ Architecture    └─ Training
         └─ Structural      └─ Consultancy
         └─ Civil/GIS       └─ Building Design
         └─ Water           └─ Surveying
         └─ Geotechnical    └─ GIS Services
         └─ Visualization   └─ Projects
```

Mobile: Add hamburger with the same structure.

### 2.6 Breadcrumb Navigation

Add breadcrumbs to every page below the header:

```
Home > Architecture Courses > Revit Training
```

Implement via a template partial:
```ejs
<nav aria-label="Breadcrumb" class="breadcrumb-nav">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <% breadcrumbs.forEach((crumb, i) => { %>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="<%= crumb.url %>"><span itemprop="name"><%= crumb.name %></span></a>
        <meta itemprop="position" content="<%= i + 1 %>">
      </li>
    <% }); %>
  </ol>
</nav>
```

---

## Phase 3 — AI Visibility (GEO) — Weeks 2-4

### 3.1 AI-Friendly Writing Style

AI models extract information from clear, factual, well-structured text. Follow these rules:

**Rule 1: Answer questions directly.** Start sections with the answer:
```
**What is the cost of Revit training in Kigali?**
Revit training at City Building Engineering costs [price] RWF for a [duration] course.
```

**Rule 2: Use Q&A format.** AI models recognize FAQ schemas and Q&A sections:
```html
<section>
  <h2>Frequently Asked Questions</h2>
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">How long is the AutoCAD course?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">The AutoCAD training course runs for [duration] with hands-on projects.</div>
    </div>
  </div>
</section>
```

**Rule 3: Include structured data in every page.**
**Rule 4: Use clear, simple sentences.** Avoid jargon without explanation.
**Rule 5: Include specific numbers.** "98% job placement rate," "500+ graduates," "50+ software courses."

### 3.2 Content Clusters

Organize content into topic clusters with pillar pages and supporting articles.

**Cluster 1: Engineering Software Training in Rwanda**
- Pillar: `/training` — Complete guide to all courses
- `/course/revit-training-kigali`
- `/course/autocad-training-kigali`
- `/course/etabs-training-kigali`
- Blog: "Why Revit is Essential for Architects in Rwanda"
- Blog: "AutoCAD vs Revit: Which Should You Learn?"

**Cluster 2: Engineering Internships Rwanda**
- Pillar: `/internship` — Complete internship program guide
- `/internship/civil-engineering`
- `/internship/structural-engineering`
- `/internship/architecture`
- Blog: "How to Get an Engineering Internship in Rwanda"

**Cluster 3: Engineering Consultancy Services**
- Pillar: `/services/engineering-consultancy`
- `/services/building-design`
- `/services/structural-design`
- `/services/road-design`
- `/services/water-supply-design`
- Blog: "Structural Design Standards in Rwanda"

**Cluster 4: Surveying & GIS**
- Pillar: `/services/surveying-gis`
- `/course/arcgis-training-kigali`
- `/course/civil-3d-training-kigali`
- Blog: "GIS Applications in Rwandan Infrastructure"

**Cluster 5: Visualization & Rendering**
- Pillar: `/services/visualization-rendering`
- `/course/lumion-training-kigali`
- `/course/twinmotion-training-kigali`
- Blog: "Architectural Rendering: Lumion vs Twinmotion"

### 3.3 FAQ Page

Create `/faq` with 30+ questions covering registration, pricing, schedules, certification, prerequisites. Format with FAQPage schema.

Example questions:
1. What software training courses do you offer in Kigali?
2. How much does AutoCAD training cost in Rwanda?
3. How long is the Revit course?
4. Do you offer internships for civil engineering students?
5. Where is your training center located in Kigali?
6. What are the prerequisites for the ETABS course?
7. Do you provide certificates after training?
8. What are your training hours?
9. Can I enroll online?
10. Do you offer corporate training packages?
11. What is the job placement rate for graduates?
12. What payment methods do you accept?
13. Do you offer training in Kinyarwanda?
14. What is the duration of the full training program?
15. Are your instructors certified?

### 3.4 Blog Topics (1 per week for 6 months)

**Month 1: Course-Specific**
1. "Why Revit is the Future of Architectural Design in Rwanda"
2. "AutoCAD vs Revit: Which Software Should Engineers Learn?"
3. "Top 10 Reasons to Learn ETABS for Structural Engineering"
4. "Getting Started with Civil 3D for Road Design in Rwanda"

**Month 2: Career-Focused**
5. "How to Start a Career in Structural Engineering in Rwanda"
6. "Best Engineering Software Skills for Rwandan Job Market 2026"
7. "From Student to Professional: Engineering Career Pathways"
8. "Why Internships Matter for Civil Engineering Students"

**Month 3: Industry Insights**
9. "BIM Adoption in Rwanda: What Engineers Need to Know"
10. "The Role of GIS in Rwanda's Infrastructure Development"
11. "Water Supply Design Software: WaterCAD vs WaterGEMS"
12. "Sustainable Building Design Trends in East Africa"

**Month 4: How-To Guides**
13. "5 Essential AutoCAD Commands Every Engineer Should Know"
14. "Beginner's Guide to Revit: First Project Tutorial"
15. "How to Model a Simple Building in ETABS"
16. "Creating Your First Architectural Rendering in Lumion"

**Month 5: Student Success**
17. "From Student to BIM Specialist: Success Story"
18. "How Our Internship Program Launched 50+ Engineering Careers"
19. "Student Spotlight: Revit Certification Journey"
20. "What Our Graduates Say About City Building Training"

**Month 6: Local Market**
21. "Engineering Software Trends in Rwanda 2026"
22. "Best Training Centers in Kigali for Engineers"
23. "How to Choose the Right Engineering Software Course"
24. "Understanding Rwanda's Building Code for Engineers"

### 3.5 New Pages Required

| Page | URL | Description |
|------|-----|-------------|
| Training Overview | `/training` | All courses listed by category with prices |
| Internship Program | `/internship` | Full internship details, eligibility, application |
| Internship Civil Eng | `/internship/civil-engineering` | Civil engineering specific internship |
| Internship Architecture | `/internship/architecture` | Architecture specific internship |
| FAQ | `/faq` | 30+ questions with FAQPage schema |
| Blog Home | `/blog` | Blog index |
| Blog Post | `/blog/[post-slug]` | Individual articles |
| Instructors | `/instructors` | Instructor bios and credentials |
| Portfolio | `/portfolio` | Project showcase with images |
| Certificate Verification | `/verify` | Verify certificate authenticity |
| Pricing | `/pricing` | Course pricing table |
| Corporate Training | `/corporate-training` | Team/company training packages |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |
| Location | `/locations/kigali` | Location-specific page for local SEO |

---

## Phase 4 — Content Creation (Weeks 4-8)

### 4.1 Homepage Improvements

Current homepage is missing key elements. Add:

**Above the fold:**
- Clear H1: "Professional Software Training for Engineers & Architects in Kigali"
- Subheading with key differentiator
- CTA buttons: "Explore Courses" / "Enroll Now"
- Social proof bar: "500+ Graduates | 50+ Courses | 98% Placement"

**Middle section — Add trust elements:**
- Instructor credentials (logos: Autodesk, Bentley, etc.)
- Client/partner logos
- Certification badges
- Stats counter section

**Lower section:**
- Testimonials carousel (server-rendered)
- Latest blog posts
- Newsletter signup
- Final CTA: "Start Your Engineering Career Today"

### 4.2 About Us Page Improvements

Add:
- Company history/founding story
- Instructor team with photos, credentials, LinkedIn links
- Certifications and affiliations
- Mission/Vision with concrete metrics
- Location map embed
- Video introduction

### 4.3 Service Pages

Create dedicated pages for each service:

| Service | URL |
|---------|-----|
| Engineering Consultancy | `/services/engineering-consultancy` |
| Building Design | `/services/building-design` |
| Structural Design | `/services/structural-design` |
| Road Design | `/services/road-design` |
| Water Supply Design | `/services/water-supply-design` |
| Surveying Services | `/services/surveying` |
| GIS Services | `/services/gis` |
| Project Management | `/services/project-management` |

Each page needs:
- H1 with location: "Building Design Services in Kigali, Rwanda"
- Service description
- Process/workflow
- Past projects (with images)
- Testimonials
- CTA: "Get a Free Consultation"

### 4.4 Course Pages

Each course page needs:
```
H1: [Software Name] Training Course in Kigali, Rwanda
H2: Course Overview (duration, level, format)
H2: What You'll Learn (curriculum outline)
H2: Prerequisites
H2: Schedule & Fees
H2: Your Instructor (bio, photo, credentials)
H2: Why Take This Course at City Building?
H2: Student Reviews
H2: Related Courses (internal links)
CTA: Enroll Now / Book a Free Trial
```

Add Course schema JSON-LD to every course page.

### 4.5 Internship Pages

Create `/internship` with:
```
H1: Engineering Internships in Kigali, Rwanda
H2: Program Overview
H2: Eligibility Requirements
H2: Available Tracks
  H3: Civil Engineering Internship
  H3: Structural Engineering Internship
  H3: Architecture Internship
  H3: Surveying Internship
H2: What You'll Learn
H2: Duration & Schedule
H2: Application Process
H2: Success Stories (testimonials from past interns)
H2: Partner Companies
H2: Apply Now
```

### 4.6 Portfolio / Project Showcase

Create `/portfolio` with project cards:
- Filter by category (Building Design, Road Design, Structural, Water Supply)
- Each project: title, description, images, client, location, year
- Schema markup: `CreativeWork` or `Project`

---

## Phase 5 — Authority Building (Weeks 4-12)

### 5.1 E-E-A-T Improvements

**Experience:**
- Add "Years in business" and "Students trained" stats
- Showcase real projects with before/after images
- Student success stories with photos and quotes

**Expertise:**
- Instructor profile pages with certifications (Autodesk Certified, Bentley, etc.)
- Blog posts demonstrating deep knowledge
- Published guest posts on industry sites

**Authoritativeness:**
- Get listed on `.ac.rw` domain or partner with universities
- Contribute to engineering forums and LinkedIn groups
- Get media mentions (local newspapers, tech blogs)

**Trustworthiness:**
- SSL certificate (already has HTTPS)
- Clear pricing page
- Terms of service and privacy policy
- Certificate verification system
- Physical address and phone number
- Google Business Profile verified

### 5.2 Backlink Strategy

Target sites:
- `.ac.rw` domains (University of Rwanda, etc.)
- Engineering blogs and forums
- LinkedIn articles
- Local Rwandan business directories
- GitHub (if you have open-source projects or course materials)
- Medium (publish articles about engineering in Rwanda)

Sources to pursue:
- Rwanda ICT Chamber
- Rwanda Engineers Association
- Ministry of Infrastructure (MININFRA)
- Local construction companies
- Architecture firms in Kigali
- Real estate developers

### 5.3 Local Citations in Rwanda

Get listed on:
1. Google Business Profile (optimized — see below)
2. Bing Places for Business
3. Yelp Rwanda
4. Cylex Rwanda
5. Rwanda Yellow Pages
6. Africa Business Pages
7. Kompass Rwanda
8. LinkedIn Company Page (create and optimize)
9. Facebook Business Page (with all info filled)
10. Instagram Business Profile

### 5.4 Google Business Profile Optimization

Complete all fields:
- Name: City Building Engineering Company Ltd
- Category: Engineering Training Center / Software Training
- Address: KG 17 Ave, Remera, Gasabo District, Kigali (Near BK Arena)
- Phone: +250 789 257 758
- Website: https://city-building-engineering.onrender.com
- Hours: Monday-Friday 8:00-17:00, Saturday 9:00-13:00
- Description: Professional software training in AutoCAD, Revit, ETABS, Civil 3D, and more for architects, engineers, and designers in Kigali, Rwanda.
- Attributes: Offers online classes, Has wheelchair-accessible entrance
- Posts: Weekly updates with course offerings and tips
- Photos: 30+ photos of the training center, student sessions, certificates
- Reviews: Actively request reviews from students
- Q&A: Answer common questions

### 5.5 Social Media Content Strategy

**LinkedIn (primary for B2B/professional):**
- Weekly posts: Course tips, student spotlights, industry news
- Company page with all services listed
- Engage in engineering groups

**Instagram (visual/showcase):**
- Daily: Course photos, student work, behind-the-scenes
- Stories: Day-in-the-life of a student
- Reels: Software tips in 30-60 seconds

**Facebook (broader audience):**
- Weekly: Course announcements, blog links, event posts
- Community engagement in Rwanda engineering groups

**YouTube (long-form content):**
- Software tutorials (5-15 min)
- Student testimonials
- Virtual campus tour
- Course overviews
- Career advice

---

## Phase 6 — Long-Term Growth (Months 2-6)

### 6.1 Monthly Content Publishing Schedule

| Week | Content Type | Topic |
|------|-------------|-------|
| Week 1 | Blog Post | Course spotlight (one software) |
| Week 2 | FAQ Update | Add 5 new Q&As |
| Week 3 | Blog Post | Industry insight / trend |
| Week 4 | Case Study / Student Story | Profile a graduate |
| Monthly | Social Media | 20 posts across platforms |
| Monthly | Video | 2 YouTube shorts / 1 long video |

### 6.2 Conversion Optimization

**CTA Placement Strategy:**

| Page | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| Homepage | "Explore Courses" | "Enroll Now" |
| Course Page | "Enroll Now" | "Download Syllabus" |
| Service Page | "Get a Free Consultation" | "View Our Portfolio" |
| Blog Post | "Learn More About Our Courses" | "Subscribe" |
| About Page | "Meet Our Instructors" | "Contact Us" |
| FAQ | "Enroll Today" | "Ask a Question" |
| Internship | "Apply Now" | "Download Brochure" |
| Contact | "Send Message" | "Call Us" |

**CTA Design Rules:**
- Primary CTAs: High-contrast button color (teal/cyan)
- Visible above the fold
- Reappear after scrolling 75% of page
- Use action verbs: "Enroll," "Apply," "Get Started," "Learn More"

### 6.3 Image SEO

All images need:
- Descriptive filenames: `revit-training-classroom-kigali.jpg` not `IMG_001.jpg`
- Alt text: "Students learning Revit at City Building Engineering in Kigali"
- Title attribute
- Compressed format (WebP with JPEG fallback)
- Lazy loading for below-fold images
- Responsive srcset

### 6.4 Video Content Ideas

1. "Day in the Life of a Civil Engineering Intern in Kigali"
2. "Revit in 10 Minutes: Quick Start Tutorial"
3. "AutoCAD Basics for Rwandan Engineers"
4. "Tour of Our Training Center in Remera, Kigali"
5. "Student Testimonial: From Beginner to BIM Specialist"
6. "Top 5 Engineering Software Every Rwandan Student Should Learn"
7. "How to Apply for Our Internship Program"
8. "ETABS vs SAFE: When to Use Which?"
9. "Rendering with Lumion: Before and After"
10. "Meet the Instructors: City Building Engineering Team"

### 6.5 Analytics Setup

1. Google Analytics 4 (GA4) — Install measurement ID
2. Google Search Console — Verify domain, submit sitemap
3. Google Tag Manager — For managing tracking codes
4. Facebook Pixel — For retargeting
5. LinkedIn Insight Tag — For B2B tracking
6. Heatmap tool (Hotjar or Microsoft Clarity) — Track user behavior
7. Custom events: Track CTA clicks, form submissions, course page views

### 6.6 Technical SEO

- Page speed target: <3s load time, >90 Lighthouse score
- Enable gzip/Brotli compression
- Minify CSS, JS, HTML
- Use CDN for static assets
- Implement lazy loading for images
- Reduce render-blocking resources
- Use `<link rel="preload">` for critical assets
- Ensure mobile responsiveness (already looks responsive)
- Fix any broken links (check with a crawler)
- Add `lang="en"` attribute (already present)

### 6.7 Sitemap Improvements

Generate a dynamic sitemap that includes:
- All static pages
- All category pages
- All course pages (with descriptive URLs)
- All blog posts
- All service pages
- All internship pages

Use `<lastmod>` tags to indicate freshness.

### 6.8 Backlink Opportunities

**High Priority:**
- University of Rwanda (UR) — Partner for internship programs
- Rwanda Polytechnic — Offer training to their students
- Rwanda Engineers Registration Board (RERB) — Get listed
- Rwanda Association of Civil Engineers (RACE) — Join and contribute

**Medium Priority:**
- Local construction companies — Cross-link
- Architecture firms in Kigali — Partner testimonials
- Real estate developers — Case study collaborations
- Government infrastructure projects — Mention involvement

**Low Priority:**
- Guest posts on engineering blogs
- Industry forums (Eng-Tips, ResearchGate)
- LinkedIn publishing

---

## Implementation Roadmap

### Phase 1 — Critical Fixes (Days 1-3)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Fix robots.txt to use actual domain | High | Low |
| 2 | Fix sitemap.xml to use actual domain | High | Low |
| 3 | Add complete Schema.org JSON-LD (Organization, LocalBusiness, EducationalOrganization) | Critical | Medium |
| 4 | Add proper meta title + description tags to every page | High | Medium |
| 5 | Add OG + Twitter Card meta tags | High | Low |
| 6 | Fix testimonials to render server-side | High | Medium |
| 7 | Fix contact page `de s` artifact | Medium | Low |
| 8 | Add Course schema to every course page | Critical | Medium |
| 9 | Add BreadcrumbList schema + breadcrumb nav | High | Medium |
| 10 | Ensure SSL is valid and working | Critical | Low |

### Phase 2 — SEO Improvements (Days 4-10)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 11 | Change course URLs from numeric IDs to descriptive slugs | High | High |
| 12 | Add 301 redirects from old to new URLs | High | Medium |
| 13 | Write unique meta titles + descriptions for every page | High | Medium |
| 14 | Fix heading hierarchy (H1, H2, H3) on every page | High | Medium |
| 15 | Add breadcrumb navigation to all pages | High | Medium |
| 16 | Create /faq page with FAQPage schema (30+ Q&As) | Critical | High |
| 17 | Create /training overview page | High | Medium |
| 18 | Optimize images (alt text, filenames, compression) | Medium | Medium |
| 19 | Improve navigation menu with dropdowns | Medium | Medium |
| 20 | Add hreflang tags for multilingual pages | Medium | Low |

### Phase 3 — AI Visibility / GEO (Days 11-20)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 21 | Create /internship page with full program details | Critical | High |
| 22 | Create /instructors page with bios and credentials | High | High |
| 23 | Add Q&A format sections to course pages (AI-friendly) | High | Medium |
| 24 | Write 5 blog posts (course spotlights) | High | High |
| 25 | Add FAQPage schema to /faq | Critical | Low |
| 26 | Create /portfolio with project case studies | High | High |
| 27 | Create /pricing page with course fees | High | Medium |
| 28 | Write 10 FAQ entries optimized for featured snippets | High | Medium |
| 29 | Add "Person" schema for instructors | Medium | Low |
| 30 | Add "Article" schema to blog posts | Medium | Low |

### Phase 4 — Content Creation (Days 21-45)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 31 | Create 8 service pages (building design, structural, etc.) | High | High |
| 32 | Write 10 more blog posts | High | High |
| 33 | Create internship sub-pages (civil, structural, architecture) | Medium | High |
| 34 | Write corporate training page | Medium | Medium |
| 35 | Create certificate verification page | Medium | Medium |
| 36 | Create terms of service and privacy policy | Medium | Low |
| 37 | Write instructor bio pages with individual schemas | High | Medium |
| 38 | Create downloadable course brochures (PDF) | Medium | High |
| 39 | Add video content embeds to course pages | Medium | Medium |
| 40 | Add student success story pages (case studies) | High | Medium |

### Phase 5 — Authority Building (Days 30-60)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 41 | Create and optimize Google Business Profile | Critical | Low |
| 42 | Get listed on 10+ local directories | High | Medium |
| 43 | Create LinkedIn Company Page and optimize | High | Low |
| 44 | Reach out to 5 local sites for backlinks | High | High |
| 45 | Partner with University of Rwanda for internship program | High | High |
| 46 | Get listed on Rwanda Engineers Registration Board | High | Medium |
| 47 | Request student reviews on Google Business | High | Medium |
| 48 | Set up Google Analytics 4 and Search Console | High | Low |
| 49 | Install heatmap tracking (Hotjar/Clarity) | Medium | Low |
| 50 | Create social media content calendar | Medium | Medium |

### Phase 6 — Long-Term Growth (Months 2-6)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 51 | Publish 4 blog posts per month | High | Ongoing |
| 52 | Build weekly LinkedIn presence | Medium | Ongoing |
| 53 | Create YouTube channel with tutorials | High | High |
| 54 | Run Google Ads for "engineering training Rwanda" | High | Medium |
| 55 | Email newsletter to students and prospects | Medium | Ongoing |
| 56 | Co-marketing with construction companies | High | High |
| 57 | Attend/host engineering events in Kigali | High | High |
| 58 | Create case study PDFs for download | Medium | Medium |
| 59 | Implement AI chatbot trained on your content | Medium | High |
| 60 | Monthly SEO audit and content refresh | Medium | Ongoing |

---

## Prioritized Checklist (Highest to Lowest Impact)

### 🔴 Critical (Do First — This Week)

- [ ] Fix robots.txt and sitemap.xml domain mismatch
- [ ] Implement complete Schema.org JSON-LD (Organization, LocalBusiness, EducationalOrganization, Course, FAQPage, BreadcrumbList, WebSite)
- [ ] Add unique `<title>` and `<meta name="description">` to every page
- [ ] Add Open Graph (`og:`) and Twitter Card meta tags
- [ ] Create `/faq` page with 30+ Q&As wrapped in FAQPage schema
- [ ] Rewrite testimonials to render server-side (not client-side JS)
- [ ] Add Course schema JSON-LD to every course page
- [ ] Change course URLs from numeric IDs to descriptive slugs (`/course/revit-training-kigali`)
- [ ] Fix all broken HTML on contact page
- [ ] Ensure SSL certificate is valid (no mixed content warnings)

### 🟠 High Impact (Week 2-3)

- [ ] Write and publish 5 cornerstone blog posts
- [ ] Create `/internship` page with full program details and schema
- [ ] Create `/instructors` page with bios, photos, credentials
- [ ] Create `/training` overview page with all courses
- [ ] Fix heading hierarchy (H1/H2/H3) on all pages
- [ ] Add breadcrumb navigation with BreadcrumbList schema
- [ ] Create 8 dedicated service pages
- [ ] Create `/pricing` page
- [ ] Create `/portfolio` with project case studies
- [ ] Add Q&A sections to all course pages (AI-friendly)
- [ ] Create Google Business Profile and optimize completely
- [ ] Set up Google Analytics 4, Search Console, heatmaps

### 🟡 Medium Impact (Week 3-4)

- [ ] Create internship sub-pages for each track
- [ ] Create `/corporate-training` page
- [ ] Create certificate verification system
- [ ] Write terms of service and privacy policy
- [ ] Add video content to course pages (tutorials, tours)
- [ ] Create downloadable PDF brochures
- [ ] Build 10 external citations on Rwanda directories
- [ ] Set up and optimize LinkedIn Company Page
- [ ] Partner with University of Rwanda
- [ ] Start YouTube channel with weekly content
- [ ] Implement image SEO (alt text, filenames, compression)

### 🟢 Lower Impact (Month 2+)

- [ ] Build weekly/monthly content calendar
- [ ] Run Google Ads for target keywords
- [ ] Build backlinks through guest posting and partnerships
- [ ] Email newsletter to prospects and students
- [ ] Monthly SEO audits and content refreshes
- [ ] Create social media content calendar
- [ ] Attend/host industry events
- [ ] Implement AI chatbot trained on your content

---

## How to Make AI Assistants Confidently Answer Questions About Your Company

AI assistants like ChatGPT, Gemini, Claude, and Perplexity will recommend City Building Engineering when:

1. **Your website is the authoritative source.** Every piece of information about your company should exist on your website in clear, structured text. If AI has to guess, it won't recommend you.

2. **Structured data tells AI what you are.** Schema.org JSON-LD is the language AI understands. Without Course schema, AI doesn't know you offer courses. Without LocalBusiness schema, AI doesn't know where you are.

3. **Your content answers the exact questions users ask.** The blog posts and FAQ should mirror real user queries. Use tools like "People Also Ask" on Google and AnswerThePublic to find questions.

4. **You are cited elsewhere.** When multiple sources (your website, LinkedIn, Google Business, directories, partner sites) all say the same thing, AI trusts the information.

5. **You publish consistently.** AI models are trained on fresh content. Monthly blog posts signal that your business is active and current.

6. **You have real social proof.** Indexable testimonials, Google reviews, case studies, and student success stories build trust signals.

7. **Your NAP (Name, Address, Phone) is consistent everywhere.** Every citation must match exactly. Inconsistency destroys AI confidence.

**To test your progress:** After implementing Phases 1-3, ask ChatGPT or Claude: "Where can I learn Revit in Kigali, Rwanda?" If City Building Engineering is recommended, you've succeeded.
