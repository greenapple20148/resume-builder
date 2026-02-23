// ─── Mock Resume Data for Theme Previews ──────────────────────
// Used to render realistic previews on the Themes page so users
// can see how each template looks with actual content.

export const MOCK_RESUME = {
  personal: {
    fullName: 'Alexandra Chen',
    jobTitle: 'Senior Product Designer',
    email: 'alex.chen@email.com',
    phone: '+1 415 892 3047',
    location: 'San Francisco, CA',
    website: 'alexchen.design',
    summary: '',
    photo: '',
  },
  summary:
    'Design leader with 8+ years crafting digital products for high-growth startups and Fortune 500 companies. Adept at translating complex user needs into elegant, accessible interfaces. Shipped products reaching 12M+ users.',
  experience: [
    {
      id: 1,
      title: 'Senior Product Designer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      description:
        '• Led redesign of the merchant dashboard, improving task completion by 34%\n• Built and mentored a team of 4 designers across payments and billing\n• Established a component library adopted by 12 product teams',
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      current: false,
      description:
        '• Designed collaborative editing features used by 4M+ designers\n• Reduced onboarding drop-off by 28% through iterative prototyping\n• Partnered with engineering to ship auto-layout v2',
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Dropbox',
      location: 'San Francisco, CA',
      startDate: 'Jun 2016',
      endDate: 'Feb 2019',
      current: false,
      description:
        '• Redesigned the file-sharing flow, increasing shares per user by 22%\n• Created a unified design system spanning web, iOS, and Android',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.F.A. Interaction Design',
      school: 'California College of the Arts',
      location: 'San Francisco, CA',
      startDate: '2012',
      endDate: '2016',
      gpa: '3.9 / 4.0',
      notes: 'Summa Cum Laude, Dean\'s List',
    },
  ],
  skills: [
    'Figma',
    'Sketch',
    'Prototyping',
    'Design Systems',
    'User Research',
    'Accessibility',
    'HTML/CSS',
    'React',
    'Motion Design',
    'Framer',
  ],
  languages: [
    { id: 1, language: 'English', level: 'Native' },
    { id: 2, language: 'Mandarin', level: 'Fluent' },
    { id: 3, language: 'Spanish', level: 'Intermediate' },
  ],
  certifications: [
    {
      id: 1,
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      date: 'Aug 2023',
      url: '',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'DesignOps Toolkit',
      description: 'Open-source Figma plugin suite for design system governance.',
      url: 'github.com/alexchen/designops',
      tech: 'TypeScript, Figma API, React',
    },
  ],
}
