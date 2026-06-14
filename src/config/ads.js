const config = {
  // ============================================
  // ACTION-BASED AD CONFIGURATION
  // These earn money when users CLICK, BUY, or SIGN UP
  // ============================================

  // --- 1. GOOGLE ADSENSE (Pay Per Click) ---
  // Pays when users click on ads. Set your publisher ID from https://adsense.google.com
  adsensePublisherId: process.env.ADSENSE_PUBLISHER_ID || '',
  adsenseEnabled: !!(process.env.ADSENSE_PUBLISHER_ID),
  adSlots: {
    topBanner: process.env.ADSENSE_SLOT_TOP_BANNER || '',
    footerBanner: process.env.ADSENSE_SLOT_FOOTER_BANNER || '',
    inContent: process.env.ADSENSE_SLOT_IN_CONTENT || '',
  },

  // --- 2. AFFILIATE MARKETING (Commission per sale) ---
  // Pays when users buy through your links
  amazonAffiliateId: process.env.AMAZON_AFFILIATE_ID || '',
  affiliateEnabled: !!(process.env.AMAZON_AFFILIATE_ID),

  // --- 3. SOFTWARE AFFILIATE PROGRAMS (Commission per signup/purchase) ---
  // Many engineering software companies have affiliate programs
  softwareAffiliates: {
    // Autodesk (Revit, AutoCAD, etc.) - free for students, paid for pros
    autodesk: {
      url: 'https://www.autodesk.com/affiliate-program',
      label: 'Get Revit & AutoCAD',
      promo: 'Free student license + paid pro versions',
    },
    // Coursera / Udemy (online courses) - commission per enrollment
    udemy: {
      url: process.env.AFFILIATE_UDEMY_LINK || 'https://www.udemy.com/course/revit-beginners/?referralCode=' + (process.env.UDEMY_REFERRAL_CODE || ''),
      label: 'Online Revit Course',
      promo: 'Learn at your own pace',
    },
    // Amazon Books (commission per book sale)
    amazonBooks: {
      url: process.env.AFFILIATE_AMAZON_BOOKS_LINK || 'https://www.amazon.com/s?k=revit+training+books&tag=' + (process.env.AMAZON_AFFILIATE_ID || ''),
      label: 'Engineering Books on Amazon',
      promo: 'Revit, AutoCAD, ETABS guides',
    },
  },

  // --- 4. SPONSORED COURSE LISTINGS (Pay per click/lead) ---
  // Companies can pay to feature their course. You earn per click or per lead.
  sponsoredCourses: [
    // Each entry is a sponsored course that pays you per referral
    // {
    //   name: 'Advanced Revit Masterclass',
    //   url: 'https://example.com/revit-course?ref=your-id',
    //   payout: 'Pay per enrollment',
    //   badge: 'Sponsored',
    // },
  ],

  // --- 5. LEAD GENERATION (Pay per form submission) ---
  // Pays when users fill a form or request a quote
  leadGenEnabled: !!(process.env.LEADGEN_FORM_ID),

  // --- 6. COST-PER-ENGAGEMENT (Pay per interaction) ---
  // Pays when users watch a video, take a quiz, etc.
  cpeEnabled: process.env.CPE_ENABLED === 'true',

  // --- Ad Slot Visibility ---
  showTopBanner: process.env.ADS_SHOW_TOP_BANNER !== 'false',
  showFooterBanner: process.env.ADS_SHOW_FOOTER_BANNER !== 'false',
  showInContent: process.env.ADS_SHOW_IN_CONTENT !== 'false',
  showAffiliate: process.env.ADS_SHOW_AFFILIATE !== 'false',
  showSponsored: process.env.ADS_SHOW_SPONSORED !== 'false',
};

module.exports = config;
