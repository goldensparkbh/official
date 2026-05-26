export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  /**
   * When true, the card is shown but not clickable and the "Visit"
   * affordance is hidden. Use for restricted / login-only platforms.
   */
  noVisit?: boolean;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: '01',
    title: 'Khidma',
    category: 'Service & Task Marketplace',
    description:
      'A digital marketplace for services and tasks, helping users access, request, and manage service-related needs online.',
    url: 'https://khidma.bh/',
  },
  {
    id: '02',
    title: 'Custom Controller',
    category: 'PS5 Customizer',
    description:
      'A product customisation web app for designing personalised PS5 controllers with a visual configuration and purchasing experience.',
    url: 'https://customcontroller.co/',
  },
  {
    id: '03',
    title: 'Sports Club Manager',
    category: 'Club & Gym Operations',
    description:
      'A club and gym management platform that supports member, activity, and operational management for sports facilities.',
    url: 'https://clubmanager-0.web.app/',
  },
  {
    id: '04',
    title: 'e-MTT Portal',
    category: 'Ministry of Transportation',
    description:
      'A secure login portal for Ministry of Transportation and Telecommunications services and internal digital workflows.',
    url: 'https://lionfish-app-36tut.ondigitalocean.app/login',
    noVisit: true,
  },
  {
    id: '05',
    title: 'Connect 4',
    category: 'Browser Game',
    description:
      'A browser-based Connect Four game with turn tracking, wins counter, level controls, reset options, and gameplay instructions.',
    url: 'https://mjassim2030.github.io/Connect-4/',
  },
  {
    id: '06',
    title: 'MindArena',
    category: 'Interactive Platform',
    description:
      'An online interactive platform built to support engaging, real-time experiences for users.',
    url: 'https://mindarena.onrender.com/',
  },
  {
    id: '07',
    title: 'WAW8',
    category: 'Affiliate Marketplace',
    description:
      'An affiliate marketplace platform connecting products, offers, and promotional opportunities through an online marketplace model.',
    url: 'https://waw8.com/',
  },
  {
    id: '08',
    title: 'LeapAndSleep',
    category: 'Systems & Workflows',
    description:
      'A platform focused on guided paths, tools, and workflows that help users turn effort into repeatable output and online growth.',
    url: 'https://leapandsleep.com/',
  },
  {
    id: '09',
    title: 'ESP32 LPG Monitor',
    category: 'IoT Dashboard',
    description:
      'An IoT dashboard for LPG leak detection — system status, gas readings, air quality, fan/servo state, cylinder weight, and alerts.',
    url: 'https://lpg-leak-detection.web.app/',
  },
  {
    id: '10',
    title: 'Solar Panel Monitor',
    category: 'Energy Dashboard',
    description:
      'A solar monitoring dashboard that displays voltage, current, power, and performance graphs for tracking solar panel output.',
    url: 'https://solar-tracker-2f8a7.web.app/',
  },
  {
    id: '11',
    title: 'Waste Management',
    category: 'Operations Dashboard',
    description:
      'A waste monitoring dashboard displaying fill levels and status indicators for general waste, plastic, paper, and cans.',
    url: 'https://waste-management-system-c9715.web.app/',
  },
  {
    id: '12',
    title: 'Farkeshha',
    category: 'Card Game Brand',
    description:
      'A web platform supporting the Farkeshha card game brand and its online presentation and digital presence.',
    url: 'https://farkeshhaa.web.app/',
  },
  {
    id: '13',
    title: 'E-Resume',
    category: 'Digital Persona',
    description:
      'A digital resume and personal profile web app designed to present professional information through an online persona-style page.',
    url: 'https://e-resume-53ba6.web.app/',
  },
  {
    id: '14',
    title: 'Spin the Wheel',
    category: 'Name Selection Tool',
    description:
      'An Arabic spin-the-wheel tool for random name selection — ideal for classroom activities, draws, or interactive sessions.',
    url: 'https://spin-the-wheel-e2151.web.app/',
  },
  {
    id: '15',
    title: 'Follow-up Reports',
    category: 'Slide View Reporting',
    description:
      'An Arabic follow-up reporting tool that connects to Excel, maps columns, filters status fields, and presents sector-based reports in slide format.',
    url: 'https://manage-ai-a822a.web.app/',
  },
  {
    id: '16',
    title: 'LTD Strategy Event',
    category: 'Event Registration',
    description:
      'An event registration and badge-generation platform for the Future Vision of the Integrated Sustainable Mobility and Postal Logistics Strategy.',
    url: 'https://ltd-strategy.web.app/',
  },
  {
    id: '17',
    title: 'Alumetric',
    category: 'Field Measurement Tool',
    description:
      'A field measurement and project documentation tool for aluminium window and door installers, supporting project records and professional reporting workflows.',
    url: 'https://alumetric00.web.app/#/home',
  },
  {
    id: '18',
    title: 'InvoiceAI',
    category: 'AI Invoice Processing',
    description:
      'An AI-powered invoice processing web app that turns invoices into structured data for quick review, extraction, and business processing.',
    url: 'https://invoice-ai-1.web.app/',
  },
  {
    id: '19',
    title: 'SparkInvo',
    category: 'Invoice & Billing',
    description:
      'An invoice-making web app for creating and managing professional invoices, estimates, and business billing documents.',
    url: 'https://sparkinvo.web.app/',
  },
  {
    id: '20',
    title: 'MMSI Assignment',
    category: 'Maritime Identification',
    description:
      'A system for managing Maritime Mobile Service Identity assignment workflows and related maritime radio identification records.',
    url: 'https://mmsi-system.web.app/',
    noVisit: true,
  },
  {
    id: '21',
    title: 'Golden Spark',
    category: 'AI Agents & Automation',
    description:
      'A business automation platform presenting AI agents and automation solutions for improving workflows and digital operations.',
    url: 'https://binaa110.web.app/',
  },
];

/**
 * Returns a screenshot URL for the given website. We use WordPress mShots,
 * a free unlimited screenshot service that caches results across users.
 */
export const getScreenshotUrl = (url: string, width = 1280, height = 800) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(
    url
  )}?w=${width}&h=${height}`;

/**
 * Fallback to Microlink's screenshot embed if mShots fails. Slightly slower
 * but more reliable for sites mShots can't render.
 */
export const getScreenshotFallbackUrl = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(
    url
  )}&screenshot=true&meta=false&embed=screenshot.url`;
