const fs = require('fs');
const path = require('path');

// Cache translations
const translations = {};
const localesDir = path.join(__dirname, '..', 'locales');

// Supported languages (50 languages)
const SUPPORTED_LANGUAGES = [
  'en','fr','es','pt','ar','sw','de','zh','ru','it','tr','am',
  'yo','ig','ha','rw','zu','st','ms','hi','bn','ja','ko','th','fa',
  'nl','pl','sv','da','no','fi','cs','sk','hu','ro','bg','sr','hr','uk',
  'el','he','vi','tl','id','km','my','ne','si','ka','hy'
];

// Language display names (native)
const LANGUAGE_NAMES = {
  en:'English',fr:'Français',es:'Español',pt:'Português',ar:'العربية',
  sw:'Kiswahili',de:'Deutsch',zh:'中文',ru:'Русский',it:'Italiano',
  tr:'Türkçe',am:'አማርኛ',yo:'Yorùbá',ig:'Igbo',ha:'Hausa',
  rw:'Kinyarwanda',zu:'isiZulu',st:'Sesotho',ms:'Bahasa Melayu',
  hi:'हिन्दी',bn:'বাংলা',ja:'日本語',ko:'한국어',th:'ไทย',
  fa:'فارسی',nl:'Nederlands',pl:'Polski',sv:'Svenska',da:'Dansk',
  no:'Norsk',fi:'Suomi',cs:'Čeština',sk:'Slovenčina',hu:'Magyar',
  ro:'Română',bg:'Български',sr:'Српски',hr:'Hrvatski',uk:'Українська',
  el:'Ελληνικά',he:'עברית',vi:'Tiếng Việt',tl:'Filipino',id:'Bahasa Indonesia',
  km:'ភាសាខ្មែរ',my:'မြန်မာဘာသာ',ne:'नेपाली',si:'සිංහල',
  ka:'ქართული',hy:'Հայերեն'
};

// Load all translation files
function loadTranslations() {
  SUPPORTED_LANGUAGES.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
      try {
        translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        console.error(`Failed to load translation for ${lang}:`, err);
      }
    }
  });
}

// Get translation string by key path (e.g., "nav.home")
function t(language, keyPath, defaultValue = keyPath) {
  if (!translations[language]) {
    return t('en', keyPath, defaultValue);
  }

  const keys = keyPath.split('.');
  let value = translations[language];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value || defaultValue;
}

// Middleware to attach language functions to res.locals
function localizationMiddleware(req, res, next) {
  // Priority: query param > session > default
  let userLanguage = req.query.lang || req.session?.userLanguage || 'en';
  
  // Validate language
  const language = SUPPORTED_LANGUAGES.includes(userLanguage) ? userLanguage : 'en';

  // Update session if language changed or not set
  if (req.session) {
    req.session.userLanguage = language;
  }

  // Attach language and translation helper to response locals
  res.locals.currentLanguage = language;
  res.locals.t = (key, defaultVal) => t(language, key, defaultVal);
  res.locals.supportedLanguages = SUPPORTED_LANGUAGES;
  res.locals.languageNames = LANGUAGE_NAMES;

  next();
}

// Load translations on module load
loadTranslations();

module.exports = {
  t,
  localizationMiddleware,
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  loadTranslations
};
