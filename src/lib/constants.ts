// Site Configuration
export const SITE_CONFIG = {
  name: 'Islamic College',
  tagline: 'Excellence in Faith & Knowledge',
  description: 'A premier Islamic educational institution providing Western education rooted in Islamic values from Primary to Secondary levels.',
  url: 'https://islamiccollege.edu',
  email: 'info@islamiccollege.edu',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Education Drive',
    city: 'City Name',
    state: 'State',
    zip: '12345',
    country: 'Country',
  },
  social: {
    facebook: 'https://facebook.com/islamiccollege',
    twitter: 'https://twitter.com/islamiccollege',
    instagram: 'https://instagram.com/islamiccollege',
    linkedin: 'https://linkedin.com/company/islamiccollege',
    youtube: 'https://youtube.com/@islamiccollege',
  },
}

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
    submenu: [
      { label: 'Our Story', href: '/about#story' },
      { label: 'Mission & Vision', href: '/about#mission' },
      { label: 'Leadership', href: '/about#leadership' },
      { label: 'Accreditation', href: '/about#accreditation' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs',
    submenu: [
      { label: 'Primary School', href: '/programs/primary' },
      { label: 'Secondary School', href: '/programs/secondary' },
      { label: 'Islamic Studies', href: '/programs/islamic-studies' },
      { label: 'Extracurricular', href: '/programs#extracurricular' },
    ],
  },
  {
    label: 'Admissions',
    href: '/admissions',
    submenu: [
      { label: 'How to Apply', href: '/admissions#apply' },
      { label: 'Requirements', href: '/admissions#requirements' },
      { label: 'Tuition & Fees', href: '/admissions#tuition' },
      { label: 'Financial Aid', href: '/admissions#financial-aid' },
    ],
  },
  {
    label: 'Faculty',
    href: '/faculty',
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

// Statistics for Stats Section
export const SCHOOL_STATS = [
  {
    value: 500,
    suffix: '+',
    label: 'Students Enrolled',
    icon: 'Users',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Graduate Success Rate',
    icon: 'Award',
  },
  {
    value: 45,
    suffix: '+',
    label: 'Qualified Teachers',
    icon: 'GraduationCap',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Years of Excellence',
    icon: 'Calendar',
  },
]

// Core Values
export const CORE_VALUES = [
  {
    title: 'Islamic Values',
    description: 'Integrating faith into daily learning and character development',
    icon: 'Sparkles',
  },
  {
    title: 'Academic Excellence',
    description: 'Rigorous curriculum meeting international standards',
    icon: 'BookOpen',
  },
  {
    title: 'Character Development',
    description: 'Building integrity, leadership, and moral responsibility',
    icon: 'Heart',
  },
  {
    title: 'Community Focus',
    description: 'Fostering unity, service, and social responsibility',
    icon: 'Users',
  },
]

// Programs Overview
export const PROGRAMS = [
  {
    id: 'primary',
    title: 'Primary School',
    subtitle: 'Grades 1-6',
    description: 'Foundation years focused on core subjects, Islamic studies, and character building in a nurturing environment.',
    icon: '📖',
    image: '/images/programs/primary-school.jpg',
    features: [
      'Core curriculum with Islamic integration',
      'Arabic language instruction',
      'Quran memorization program',
      'STEM foundation courses',
      'Arts & Physical Education',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'secondary',
    title: 'Secondary School',
    subtitle: 'Grades 7-12',
    description: 'Advanced academic preparation with continued spiritual development, preparing students for university and beyond.',
    icon: '🎓',
    image: '/images/programs/secondary-school.jpg',
    features: [
      'College preparatory curriculum',
      'Advanced Islamic studies',
      'Leadership development programs',
      'Career guidance & counseling',
      'University preparation',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'islamic-studies',
    title: 'Islamic Studies',
    subtitle: 'All Grades',
    description: 'Comprehensive Islamic education integrated throughout all grade levels, fostering spiritual growth.',
    icon: '🌙',
    image: '/images/programs/islamic-studies.jpg',
    features: [
      'Quran recitation & memorization',
      'Islamic history & civilization',
      'Arabic language mastery',
      'Character & ethics development',
      'Daily prayers & spiritual practice',
    ],
    color: 'from-emerald-500 to-teal-500',
  },
]

// Grade Levels
export const GRADE_LEVELS = {
  primary: [1, 2, 3, 4, 5, 6],
  secondary: [7, 8, 9, 10, 11, 12],
}

// Academic Year
export const ACADEMIC_YEAR = {
  current: '2024-2025',
  admissionDeadline: '2025-03-31',
  termDates: {
    fall: { start: '2024-09-01', end: '2024-12-20' },
    winter: { start: '2025-01-06', end: '2025-03-20' },
    spring: { start: '2025-04-01', end: '2025-06-15' },
  },
}

// Contact Form Fields
export const CONTACT_REASONS = [
  'General Inquiry',
  'Admissions Question',
  'Schedule a Visit',
  'Financial Aid Information',
  'Program Information',
  'Other',
]

// FAQ Categories
export const FAQ_CATEGORIES = [
  'Admissions',
  'Academic Programs',
  'Tuition & Fees',
  'Islamic Studies',
  'Extracurricular Activities',
  'Facilities',
]

// Animation Variants for Framer Motion
export const FADE_IN_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
}

export const SLIDE_IN_LEFT = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
}

export const SLIDE_IN_RIGHT = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
}

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}