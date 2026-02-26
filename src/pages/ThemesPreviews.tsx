import React from 'react'
import './ThemesPreviews.css'
import '../styles/terminal.css'
import '../styles/scifi.css'
import '../styles/sophisticated.css'
import '../styles/healthcare.css'



import '../styles/futuristic.css'
import '../styles/new-templates.css'
import '../styles/new-templates-extra.css'
import '../styles/new-templates-extra2.css'
import '../styles/new-templates-extra3.css'
import { OrigamiZenPreview, CorporateSlatePreview, TealWavePreview, PurpleDuskPreview, CoralBrightPreview, OceanDeepPreview, SageProPreview, CarbonNoirPreview, SandDunePreview, IndigoSharpPreview, PlatinumElitePreview, CascadeBluePreview, NordicMinimalPreview, MidnightProPreview, BlueprintPreview, EmeraldFreshPreview, SunsetWarmPreview, NewspaperClassicPreview, IvoryMarblePreview, NeonCyberPreview } from './ThemesPreviews2'
import { ResumeData } from '../types'

const SAMPLE_PERSONAS: Record<string, {
  name: string, role: string, email: string, phone: string, location: string,
  experience: { id: number, title: string, company: string, location: string, startDate: string, endDate: string, current: boolean, description: string }[],
  education: { id: number, degree: string, school: string, location: string, startDate: string, endDate: string, gpa: string, notes: string }[],
  skills: string[], summary: string
}> = {
  editorial_luxe: {
    name: 'Elena Vasquez', role: 'Senior Product Manager', email: 'elena.vasquez@email.com', phone: '(555) 412-8903', location: 'New York, NY',
    experience: [
      { id: 1, title: 'Senior Product Manager', company: 'Notion', location: 'New York, NY', startDate: '2021', endDate: 'Present', current: true, description: 'Led cross-functional team of 14 to launch AI-powered workspace features. Increased user activation by 28% through data-driven onboarding redesign. Managed $4M annual product budget across three product lines.' },
      { id: 2, title: 'Product Manager', company: 'Spotify', location: 'New York, NY', startDate: '2018', endDate: '2021', current: false, description: 'Owned discovery and personalization features reaching 180M+ monthly listeners. Launched Spotify Blend feature driving 15M shares in first month. Reduced churn by 12% through predictive engagement models.' },
      { id: 3, title: 'Associate Product Manager', company: 'Google', location: 'Mountain View, CA', startDate: '2016', endDate: '2018', current: false, description: 'Shipped search quality improvements affecting 2B+ daily queries. Collaborated with ML engineers on ranking algorithm updates.' }
    ],
    education: [
      { id: 1, degree: 'MBA, Technology Management', school: 'Columbia Business School', location: 'New York, NY', startDate: '2014', endDate: '2016', gpa: '', notes: '' },
      { id: 2, degree: 'B.S. Computer Science', school: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2010', endDate: '2014', gpa: '3.8', notes: '' }
    ],
    skills: ['Roadmapping', 'OKRs', 'User Research', 'SQL', 'A/B Testing', 'Data Analysis', 'Stakeholder Management', 'Agile'], summary: 'Product leader with 9+ years shipping consumer products at scale. Expert in data-informed decision making, cross-functional leadership, and building products that delight millions of users.'
  },
  dark_architect: {
    name: 'Marcus Chen', role: 'Staff Software Engineer', email: 'm.chen@email.com', phone: '(555) 903-1247', location: 'Seattle, WA',
    experience: [
      { id: 1, title: 'Staff Software Engineer', company: 'Datadog', location: 'Seattle, WA', startDate: '2022', endDate: 'Present', current: true, description: 'Designed event ingestion pipeline processing 2.4B events/day. Reduced P99 latency by 65% through architecture redesign. Mentored 8 engineers and led distributed systems guild.' },
      { id: 2, title: 'Senior Software Engineer', company: 'Stripe', location: 'San Francisco, CA', startDate: '2019', endDate: '2022', current: false, description: 'Built real-time fraud detection service handling 50K+ transactions/second. Designed idempotency framework adopted across 12 payment services. Led migration to event-driven architecture.' },
      { id: 3, title: 'Software Engineer', company: 'Amazon', location: 'Seattle, WA', startDate: '2015', endDate: '2019', current: false, description: 'Built inventory management system for AWS Marketplace. Optimized DynamoDB access patterns reducing costs by $1.2M annually.' }
    ],
    education: [
      { id: 1, degree: 'M.S. Computer Science', school: 'University of Washington', location: 'Seattle, WA', startDate: '2013', endDate: '2015', gpa: '', notes: '' },
      { id: 2, degree: 'B.S. Computer Engineering', school: 'UCLA', location: 'Los Angeles, CA', startDate: '2009', endDate: '2013', gpa: '3.7', notes: '' }
    ],
    skills: ['Go', 'Rust', 'Kubernetes', 'Kafka', 'gRPC', 'PostgreSQL', 'Distributed Systems', 'System Design'], summary: 'Staff engineer with 10+ years building distributed systems and developer platforms at scale. Passionate about reliability, performance, and mentoring the next generation of engineers.'
  },
  bauhaus_geometric: {
    name: 'Priya Nair', role: 'Data Science Lead', email: 'priya.nair@email.com', phone: '(555) 708-2341', location: 'Boston, MA',
    experience: [
      { id: 1, title: 'Lead Data Scientist', company: 'Wayfair', location: 'Boston, MA', startDate: '2021', endDate: 'Present', current: true, description: 'Built visual search recommendation engine increasing product discovery by 38%. Managed team of 6 data scientists and 2 ML engineers. Deployed real-time inference pipeline serving 10M+ daily predictions.' },
      { id: 2, title: 'Senior Data Scientist', company: 'Netflix', location: 'Los Gatos, CA', startDate: '2018', endDate: '2021', current: false, description: 'Developed personalization algorithms for 230M+ subscribers. Built A/B testing framework reducing experiment cycle time by 40%. Published 3 papers on recommender systems.' },
      { id: 3, title: 'Data Scientist', company: 'Two Sigma', location: 'New York, NY', startDate: '2016', endDate: '2018', current: false, description: 'Developed quantitative models for alternative data analysis. Built NLP pipeline processing 500K+ financial documents daily.' }
    ],
    education: [
      { id: 1, degree: 'Ph.D. Computer Science', school: 'MIT', location: 'Cambridge, MA', startDate: '2014', endDate: '2018', gpa: '4.0', notes: '' },
      { id: 2, degree: 'B.Tech. Computer Science', school: 'IIT Bombay', location: 'Mumbai, India', startDate: '2010', endDate: '2014', gpa: '3.9', notes: '' }
    ],
    skills: ['Machine Learning', 'Python', 'LLMs', 'NLP', 'TensorFlow', 'PyTorch', 'SQL', 'Spark'], summary: 'Data science leader with 8+ years building ML systems that drive measurable business impact. Expert in recommendation systems, NLP, and scaling models from research to production.'
  },
  classic: {
    name: 'James Whitfield', role: 'Senior Software Engineer', email: 'james@whitfield.io', phone: '(415) 320-8891', location: 'San Francisco, CA',
    experience: [
      { id: 1, title: 'Senior Software Engineer', company: 'Airbnb', location: 'San Francisco, CA', startDate: '2021', endDate: 'Present', current: true, description: 'Architected microservices handling 2M+ daily requests. Led migration from monolith to service-oriented architecture. Mentored 5 junior engineers through technical growth plans.' },
      { id: 2, title: 'Software Engineer', company: 'Shopify', location: 'Ottawa, ON', startDate: '2018', endDate: '2021', current: false, description: 'Built real-time inventory management system processing 50K orders/minute. Designed GraphQL API layer adopted by 200+ merchant integrations. Reduced page load times by 40% through performance optimization.' },
      { id: 3, title: 'Junior Software Engineer', company: 'Stripe', location: 'San Francisco, CA', startDate: '2016', endDate: '2018', current: false, description: 'Developed payment processing features for international expansion. Built automated testing framework improving code coverage from 65% to 92%.' }
    ],
    education: [
      { id: 1, degree: 'B.S. Computer Science', school: 'Stanford University', location: 'Stanford, CA', startDate: '2014', endDate: '2018', gpa: '3.8', notes: '' },
      { id: 2, degree: 'Minor in Mathematics', school: 'Stanford University', location: 'Stanford, CA', startDate: '2014', endDate: '2018', gpa: '', notes: '' }
    ],
    skills: ['TypeScript', 'React', 'AWS', 'System Design', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL'], summary: 'Full-stack engineer with 8+ years building scalable web applications at high-growth startups. Passionate about clean architecture, developer experience, and shipping products that matter.'
  },
  minimalist: {
    name: 'Lena Hartmann', role: 'UX Designer', email: 'lena@hartmann.design', phone: '(212) 555-0147', location: 'Berlin, Germany',
    experience: [
      { id: 1, title: 'Lead UX Designer', company: 'Spotify', location: 'Stockholm, SE', startDate: '2022', endDate: 'Present', current: true, description: 'Redesigned the discovery experience for 450M users. Led design system overhaul reducing component inconsistencies by 60%. Managed team of 4 designers across mobile and web platforms.' },
      { id: 2, title: 'UX Designer', company: 'Figma', location: 'San Francisco, CA', startDate: '2019', endDate: '2022', current: false, description: 'Designed collaborative editing features used by 4M+ teams. Conducted 200+ user research sessions informing product roadmap. Created accessibility guidelines adopted company-wide.' },
      { id: 3, title: 'Junior UX Designer', company: 'IDEO', location: 'London, UK', startDate: '2017', endDate: '2019', current: false, description: 'Designed healthcare and fintech products through human-centered design methodology. Facilitated co-creation workshops with clients and end users.' }
    ],
    education: [
      { id: 1, degree: 'M.A. Interaction Design', school: 'Royal College of Art', location: 'London, UK', startDate: '2017', endDate: '2019', gpa: '', notes: '' },
      { id: 2, degree: 'B.A. Visual Communication', school: 'Berlin University of the Arts', location: 'Berlin, DE', startDate: '2013', endDate: '2017', gpa: '', notes: '' }
    ],
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'Usability Testing', 'Sketch', 'Motion Design'], summary: 'Human-centered designer crafting intuitive digital experiences for global products. Expert in design systems, accessibility, and bridging user research with product strategy.'
  },
  sidebar: {
    name: 'Marcus Chen', role: 'Data Scientist', email: 'marcus.chen@ml.dev', phone: '(650) 200-3419', location: 'Seattle, WA',
    experience: [
      { id: 1, title: 'Senior Data Scientist', company: 'Netflix', location: 'Los Gatos, CA', startDate: '2021', endDate: 'Present', current: true, description: 'Built recommendation models serving 230M subscribers. Improved content discovery metrics by 22% through deep learning models. Led cross-functional data science guild of 15 researchers.' },
      { id: 2, title: 'Data Scientist', company: 'Tesla', location: 'Palo Alto, CA', startDate: '2018', endDate: '2021', current: false, description: 'Developed predictive maintenance algorithms for autopilot systems. Built anomaly detection pipeline processing 500GB telemetry data daily. Published 2 patents on sensor fusion techniques.' },
      { id: 3, title: 'Research Assistant', company: 'Carnegie Mellon', location: 'Pittsburgh, PA', startDate: '2016', endDate: '2018', current: false, description: 'Published 4 papers on deep reinforcement learning. Developed open-source toolkit for neural architecture search.' }
    ],
    education: [
      { id: 1, degree: 'Ph.D. Machine Learning', school: 'Carnegie Mellon', location: 'Pittsburgh, PA', startDate: '2014', endDate: '2018', gpa: '4.0', notes: '' },
      { id: 2, degree: 'B.S. Mathematics & CS', school: 'MIT', location: 'Cambridge, MA', startDate: '2010', endDate: '2014', gpa: '3.9', notes: '' }
    ],
    skills: ['Python', 'TensorFlow', 'SQL', 'Statistics', 'PyTorch', 'Spark', 'Bayesian Methods', 'Deep Learning'], summary: 'ML researcher turned industry practitioner specializing in recommendation systems, deep learning, and scaling models from research to production.'
  },
  creative: {
    name: 'Sofia Reyes', role: 'Creative Director', email: 'sofia@reyesstudio.com', phone: '(323) 654-8820', location: 'Los Angeles, CA',
    experience: [
      { id: 1, title: 'Creative Director', company: 'Nike', location: 'Portland, OR', startDate: '2020', endDate: 'Present', current: true, description: 'Led brand campaigns reaching 100M+ impressions globally. Directed creative for Air Max 2024 launch generating $50M in first-week sales. Managed team of 12 designers and 4 copywriters.' },
      { id: 2, title: 'Art Director', company: 'Ogilvy', location: 'New York, NY', startDate: '2016', endDate: '2020', current: false, description: 'Directed visual identity for Fortune 500 clients including IBM and Coca-Cola. Won 3 Cannes Lions and 5 D&AD Pencils. Led rebranding projects valued at $2M+.' },
      { id: 3, title: 'Senior Designer', company: 'Pentagram', location: 'New York, NY', startDate: '2014', endDate: '2016', current: false, description: 'Designed brand identities for startups and cultural institutions. Created visual systems for museum exhibitions seen by 500K+ visitors.' }
    ],
    education: [
      { id: 1, degree: 'BFA Graphic Design', school: 'Parsons School of Design', location: 'New York, NY', startDate: '2012', endDate: '2016', gpa: '3.7', notes: '' },
      { id: 2, degree: 'Certificate, Art Direction', school: 'School of Visual Arts', location: 'New York, NY', startDate: '2016', endDate: '2016', gpa: '', notes: '' }
    ],
    skills: ['Brand Strategy', 'Adobe Creative Suite', 'Motion Design', 'Typography', 'Art Direction', 'Video Production', 'Illustration', 'UX/UI'], summary: 'Award-winning creative leader with a track record of building iconic brand identities and campaigns that drive cultural conversation and business results.'
  },
  dark: {
    name: 'Viktor Sørensen', role: 'Principal Architect', email: 'viktor@sorensen.arch', phone: '(310) 442-7756', location: 'Copenhagen, Denmark',
    experience: [
      { id: 1, title: 'Principal Architect', company: 'Bjarke Ingels Group', location: 'Copenhagen, DK', startDate: '2019', endDate: 'Present', current: true, description: 'Led design of $200M mixed-use sustainable complex. Won AIA Honor Award for CopenHill waste-to-energy facility. Managed projects across 4 countries with 20+ person teams.' },
      { id: 2, title: 'Senior Architect', company: 'Foster + Partners', location: 'London, UK', startDate: '2015', endDate: '2019', current: false, description: 'Designed award-winning commercial towers achieving LEED Platinum certification. Led parametric facade design for Bloomberg HQ. Coordinated with 8 engineering disciplines.' },
      { id: 3, title: 'Architect', company: 'OMA', location: 'Rotterdam, NL', startDate: '2013', endDate: '2015', current: false, description: 'Contributed to master planning for cultural district in Seoul. Developed computational design tools for complex geometries.' }
    ],
    education: [
      { id: 1, degree: 'M.Arch Architecture', school: 'ETH Zürich', location: 'Zürich, CH', startDate: '2011', endDate: '2015', gpa: '', notes: '' },
      { id: 2, degree: 'B.Arch Architecture', school: 'Aarhus School of Architecture', location: 'Aarhus, DK', startDate: '2007', endDate: '2011', gpa: '', notes: '' }
    ],
    skills: ['Rhino', 'Parametric Design', 'Sustainability', 'BIM', 'Grasshopper', 'AutoCAD', 'Revit', 'V-Ray'], summary: 'Visionary architect blending sustainable innovation with bold structural expression. Specialist in parametric design and net-zero building strategies.'
  },
  editorial: {
    name: 'Eleanor Voss', role: 'Executive Editor', email: 'eleanor@vossmedia.com', phone: '(917) 330-2201', location: 'New York, NY',
    experience: [
      { id: 1, title: 'Executive Editor', company: 'The Atlantic', location: 'Washington, DC', startDate: '2020', endDate: 'Present', current: true, description: 'Grew digital readership by 40% year-over-year. Launched 3 award-winning investigative series. Managed editorial team of 25 writers and editors.' },
      { id: 2, title: 'Senior Editor', company: 'Condé Nast', location: 'New York, NY', startDate: '2016', endDate: '2020', current: false, description: 'Oversaw editorial for Vanity Fair digital reaching 12M monthly readers. Edited 200+ feature stories and profiles. Won National Magazine Award for Digital Innovation.' },
      { id: 3, title: 'Staff Writer', company: 'The New Yorker', location: 'New York, NY', startDate: '2014', endDate: '2016', current: false, description: 'Published 40+ longform pieces on technology and culture. Broke 3 stories picked up by national media outlets.' }
    ],
    education: [
      { id: 1, degree: 'B.A. English Literature', school: 'Columbia University', location: 'New York, NY', startDate: '2010', endDate: '2014', gpa: '3.9', notes: '' },
      { id: 2, degree: 'Certificate, Investigative Journalism', school: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2014', endDate: '2014', gpa: '', notes: '' }
    ],
    skills: ['Editorial Strategy', 'Longform Writing', 'Audience Growth', 'SEO', 'Content Strategy', 'CMS Management', 'Social Media', 'Newsletter Growth'], summary: 'Award-winning editor with 10+ years shaping narratives at premier publications. Expert in audience development and digital-first editorial strategy.'
  },
  bold: {
    name: 'Kai Nakamura', role: 'Brand Strategist', email: 'kai@nakamura.co', phone: '(503) 871-4420', location: 'Portland, OR',
    experience: [
      { id: 1, title: 'Head of Brand', company: 'Glossier', location: 'New York, NY', startDate: '2021', endDate: 'Present', current: true, description: 'Repositioned brand for Gen-Z, driving 55% revenue growth. Led rebrand across 200+ touchpoints in 6 months. Built in-house creative team of 8.' },
      { id: 2, title: 'Brand Strategist', company: 'R/GA', location: 'Portland, OR', startDate: '2018', endDate: '2021', current: false, description: 'Developed go-to-market strategies for 15+ tech startups. Created brand architecture frameworks adopted as agency standard. Won Effie Award for startup launch campaign.' },
      { id: 3, title: 'Brand Designer', company: 'IDEO', location: 'San Francisco, CA', startDate: '2016', endDate: '2018', current: false, description: 'Designed brand systems for Fortune 500 healthcare and fintech clients. Led naming and verbal identity projects.' }
    ],
    education: [
      { id: 1, degree: 'MBA Marketing', school: 'Wharton', location: 'Philadelphia, PA', startDate: '2016', endDate: '2018', gpa: '3.8', notes: '' },
      { id: 2, degree: 'B.A. Visual Arts', school: 'Brown University', location: 'Providence, RI', startDate: '2012', endDate: '2016', gpa: '3.6', notes: '' }
    ],
    skills: ['Brand Identity', 'Consumer Insights', 'Go-to-Market', 'Storytelling', 'Visual Design', 'Market Research', 'Campaign Strategy', 'Social Media'], summary: 'Strategic brand builder who transforms startups into household names through culturally resonant storytelling and design.'
  },
  teal: {
    name: 'Amara Okafor', role: 'Full-Stack Developer', email: 'amara@okafor.dev', phone: '(469) 220-5518', location: 'Austin, TX',
    experience: [
      { id: 1, title: 'Staff Engineer', company: 'Vercel', location: 'Remote', startDate: '2022', endDate: 'Present', current: true, description: 'Core contributor to Next.js framework and edge runtime. Shipped incremental static regeneration feature used by 500K+ projects. Led performance optimization reducing cold start times by 70%.' },
      { id: 2, title: 'Senior Developer', company: 'Twilio', location: 'San Francisco, CA', startDate: '2019', endDate: '2022', current: false, description: 'Built real-time communication APIs handling 1B+ messages monthly. Designed WebSocket infrastructure for video calling platform. Reduced API response times by 45%.' },
      { id: 3, title: 'Software Developer', company: 'Netlify', location: 'San Francisco, CA', startDate: '2017', endDate: '2019', current: false, description: 'Built CI/CD pipeline features for JAMstack deployments. Created open-source plugins downloaded 2M+ times.' }
    ],
    education: [
      { id: 1, degree: 'B.S. Software Engineering', school: 'Georgia Tech', location: 'Atlanta, GA', startDate: '2015', endDate: '2019', gpa: '3.7', notes: '' },
      { id: 2, degree: 'Minor in Human-Computer Interaction', school: 'Georgia Tech', location: 'Atlanta, GA', startDate: '2015', endDate: '2019', gpa: '', notes: '' }
    ],
    skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Edge Computing', 'TypeScript', 'React', 'GraphQL', 'Serverless'], summary: 'Open-source contributor and full-stack engineer passionate about developer experience, performance, and building tools that empower other developers.'
  },
  timeline: {
    name: 'Daniel Ortiz', role: 'Project Manager', email: 'daniel@ortiz.pm', phone: '(714) 892-3301', location: 'Chicago, IL',
    experience: [
      { id: 1, title: 'Senior Project Manager', company: 'McKinsey', location: 'Chicago, IL', startDate: '2020', endDate: 'Present', current: true, description: 'Managed digital transformation programs worth $50M+ across 3 industry verticals. Led teams of 15-30 consultants on 6-month engagements. Achieved 95% client satisfaction rating.' },
      { id: 2, title: 'Project Manager', company: 'Deloitte', location: 'New York, NY', startDate: '2017', endDate: '2020', current: false, description: 'Led agile delivery for enterprise SaaS migrations serving 100K+ users. Reduced project delivery time by 30% through process optimization. Managed $12M annual program budget.' },
      { id: 3, title: 'Associate Consultant', company: 'Accenture', location: 'Chicago, IL', startDate: '2015', endDate: '2017', current: false, description: 'Supported cloud migration strategy for Fortune 100 financial clients. Created project management playbook adopted by 50+ consultants.' }
    ],
    education: [
      { id: 1, degree: 'MBA Operations', school: 'Kellogg School', location: 'Evanston, IL', startDate: '2015', endDate: '2017', gpa: '3.6', notes: '' },
      { id: 2, degree: 'B.S. Industrial Engineering', school: 'Purdue University', location: 'West Lafayette, IN', startDate: '2011', endDate: '2015', gpa: '3.7', notes: '' }
    ],
    skills: ['Agile', 'Stakeholder Management', 'Budgeting', 'Risk Analysis', 'Scrum', 'JIRA', 'Change Management', 'Six Sigma'], summary: 'Results-driven PM who delivers complex programs on time and under budget. Expert in digital transformation and organizational change management.'
  },
  grande: {
    name: 'Isabelle Dupont', role: 'Marketing Director', email: 'isabelle@dupont.mktg', phone: '(646) 500-7742', location: 'Paris, France',
    experience: [
      { id: 1, title: 'VP of Marketing', company: 'Chanel', location: 'Paris, FR', startDate: '2021', endDate: 'Present', current: true, description: 'Orchestrated global luxury marketing campaigns across 40+ markets. Grew social media following by 200% through influencer partnerships. Managed €15M annual marketing budget.' },
      { id: 2, title: 'Marketing Director', company: 'LVMH', location: 'Paris, FR', startDate: '2017', endDate: '2021', current: false, description: 'Grew direct-to-consumer e-commerce by 120% in 3 years. Launched omnichannel CRM strategy increasing repeat purchases by 35%. Led digital transformation for 5 luxury brands.' },
      { id: 3, title: 'Brand Manager', company: 'L\'Oréal', location: 'Paris, FR', startDate: '2015', endDate: '2017', current: false, description: 'Managed product launches across European markets. Developed sustainability-focused brand narrative adopted company-wide.' }
    ],
    education: [
      { id: 1, degree: 'M.S. Marketing', school: 'HEC Paris', location: 'Paris, FR', startDate: '2013', endDate: '2015', gpa: '', notes: '' },
      { id: 2, degree: 'B.A. Business Administration', school: 'Sciences Po', location: 'Paris, FR', startDate: '2009', endDate: '2013', gpa: '', notes: '' }
    ],
    skills: ['Luxury Marketing', 'E-Commerce', 'CRM', 'Brand Positioning', 'Influencer Strategy', 'Market Research', 'Omnichannel', 'Analytics'], summary: 'Luxury marketing executive with deep expertise in global brand strategy, digital transformation, and building iconic consumer experiences.'
  },
  blob: {
    name: 'Priya Sharma', role: 'Product Designer', email: 'priya@sharmadesign.co', phone: '(408) 200-6630', location: 'San Jose, CA',
    experience: [
      { id: 1, title: 'Senior Product Designer', company: 'Notion', location: 'San Francisco, CA', startDate: '2022', endDate: 'Present', current: true, description: 'Redesigned workspace templates used by 30M+ users. Increased template adoption by 45% through iterative testing. Led design system migration to Figma tokens.' },
      { id: 2, title: 'Product Designer', company: 'Canva', location: 'Sydney, AU', startDate: '2019', endDate: '2022', current: false, description: 'Built design tool features reaching millions of users globally. Shipped collaborative whiteboard feature from concept to launch. Conducted 150+ usability tests.' },
      { id: 3, title: 'UX Designer', company: 'Flipkart', location: 'Bangalore, IN', startDate: '2017', endDate: '2019', current: false, description: 'Designed e-commerce checkout flow reducing cart abandonment by 18%. Created mobile-first design patterns for 200M+ users.' }
    ],
    education: [
      { id: 1, degree: 'B.Des Industrial Design', school: 'NID Ahmedabad', location: 'Ahmedabad, IN', startDate: '2015', endDate: '2019', gpa: '', notes: '' },
      { id: 2, degree: 'Certificate, Interaction Design', school: 'Cooper Union', location: 'New York, NY', startDate: '2019', endDate: '2019', gpa: '', notes: '' }
    ],
    skills: ['Product Thinking', 'Sketch', 'Framer', 'A/B Testing', 'Figma', 'Design Systems', 'User Research', 'Prototyping'], summary: 'Design-driven product thinker who bridges user empathy with business outcomes. Expert in design systems, rapid prototyping, and data-informed design decisions.'
  },
  split: {
    name: 'Oliver Brennan', role: 'DevOps Engineer', email: 'oliver@brennan.ops', phone: '(617) 332-9940', location: 'Boston, MA',
    experience: [
      { id: 1, title: 'Lead DevOps Engineer', company: 'Datadog', location: 'New York, NY', startDate: '2021', endDate: 'Present', current: true, description: 'Managed infrastructure serving 10B+ daily metrics across 200+ microservices. Reduced deployment failures by 80% through GitOps adoption. Led SRE team of 6 engineers.' },
      { id: 2, title: 'DevOps Engineer', company: 'HashiCorp', location: 'San Francisco, CA', startDate: '2018', endDate: '2021', current: false, description: 'Contributed to Terraform cloud provisioning tools used by 100K+ organizations. Built automated compliance scanning pipeline. Created internal developer platform.' },
      { id: 3, title: 'Systems Administrator', company: 'Red Hat', location: 'Raleigh, NC', startDate: '2016', endDate: '2018', current: false, description: 'Managed hybrid cloud environments for enterprise clients. Automated server provisioning reducing setup time from days to minutes.' }
    ],
    education: [
      { id: 1, degree: 'B.S. Computer Engineering', school: 'Boston University', location: 'Boston, MA', startDate: '2014', endDate: '2018', gpa: '3.5', notes: '' },
      { id: 2, degree: 'AWS Solutions Architect Professional', school: 'Amazon Web Services', location: 'Online', startDate: '2020', endDate: '2020', gpa: '', notes: '' }
    ],
    skills: ['Kubernetes', 'Terraform', 'CI/CD', 'Monitoring', 'Docker', 'Ansible', 'Prometheus', 'AWS'], summary: 'Infrastructure engineer focused on reliability, scalability, and developer productivity. Expert in GitOps, infrastructure-as-code, and platform engineering.'
  },
  obsidian: {
    name: 'Cassandra Blake', role: 'Investment Banker', email: 'c.blake@goldman.com', phone: '(212) 902-1001', location: 'New York, NY',
    experience: [
      { id: 1, title: 'Vice President', company: 'Goldman Sachs', location: 'New York, NY', startDate: '2020', endDate: 'Present', current: true, description: 'Executed $5B+ in M&A transactions across tech and healthcare sectors. Led cross-border acquisition of $800M fintech company. Managed team of 6 analysts and associates.' },
      { id: 2, title: 'Associate', company: 'Morgan Stanley', location: 'New York, NY', startDate: '2017', endDate: '2020', current: false, description: 'Led financial modeling for IPO advisory generating $200M+ in fees. Built DCF and LBO models for 20+ tech companies. Supported $3B SPAC merger negotiation.' },
      { id: 3, title: 'Analyst', company: 'Lazard', location: 'New York, NY', startDate: '2015', endDate: '2017', current: false, description: 'Created pitch books and financial analyses for restructuring engagements. Supported $1.2B debt restructuring for retail conglomerate.' }
    ],
    education: [
      { id: 1, degree: 'MBA Finance', school: 'Harvard Business School', location: 'Boston, MA', startDate: '2015', endDate: '2017', gpa: '', notes: '' },
      { id: 2, degree: 'B.S. Economics', school: 'University of Pennsylvania', location: 'Philadelphia, PA', startDate: '2011', endDate: '2015', gpa: '3.8', notes: '' }
    ],
    skills: ['Financial Modeling', 'M&A', 'Valuation', 'Due Diligence', 'LBO Analysis', 'Capital Markets', 'Negotiation', 'Bloomberg'], summary: 'Seasoned dealmaker with a track record of closing complex cross-border transactions across technology, healthcare, and financial services.'
  },
  ivory: {
    name: 'Charlotte Ashford', role: 'Strategy Consultant', email: 'charlotte@ashford.co', phone: '(202) 555-1190', location: 'Washington, DC',
    experience: [
      { id: 1, title: 'Principal Consultant', company: 'Bain & Company', location: 'Boston, MA', startDate: '2019', endDate: 'Present', current: true, description: 'Advised C-suites on growth strategy and operations across tech, healthcare, and retail verticals. Led 8 engagements generating $30M+ in consulting revenue. Built proprietary market sizing methodology.' },
      { id: 2, title: 'Consultant', company: 'BCG', location: 'Chicago, IL', startDate: '2016', endDate: '2019', current: false, description: 'Led cost transformation programs for F500 clients saving $150M+ collectively. Managed teams of 4-8 consultants on 12-week engagements. Developed go-to-market strategy for $500M product launch.' },
      { id: 3, title: 'Business Analyst', company: 'McKinsey', location: 'Washington, DC', startDate: '2014', endDate: '2016', current: false, description: 'Conducted competitive analysis and market research for government consulting practice. Built financial models for public-private partnership valuations.' }
    ],
    education: [
      { id: 1, degree: 'MBA', school: 'Yale School of Management', location: 'New Haven, CT', startDate: '2014', endDate: '2016', gpa: '3.9', notes: '' },
      { id: 2, degree: 'B.A. Economics', school: 'Georgetown University', location: 'Washington, DC', startDate: '2010', endDate: '2014', gpa: '3.8', notes: '' }
    ],
    skills: ['Corporate Strategy', 'Due Diligence', 'Market Sizing', 'Board Decks', 'Financial Modeling', 'Change Management', 'Competitive Analysis', 'Stakeholder Management'], summary: 'Strategy consultant who turns ambiguity into actionable roadmaps for Fortune 500 leaders. Expert in growth strategy, operational transformation, and M&A due diligence.'
  },
  noir: {
    name: 'Raven Cross', role: 'Security Engineer', email: 'raven@crosssec.io', phone: '(571) 200-6640', location: 'Arlington, VA',
    experience: [
      { id: 1, title: 'Principal Security Engineer', company: 'CrowdStrike', location: 'Austin, TX', startDate: '2021', endDate: 'Present', current: true, description: 'Led threat hunting team protecting Fortune 100 clients from nation-state actors. Developed automated threat detection reducing MTTR by 75%. Published 5 threat intelligence reports.' },
      { id: 2, title: 'Security Engineer', company: 'Palantir', location: 'Palo Alto, CA', startDate: '2018', endDate: '2021', current: false, description: 'Built anomaly detection for classified government systems. Designed zero-trust architecture adopted across 3 agencies. Led red team exercises for critical infrastructure.' },
      { id: 3, title: 'SOC Analyst', company: 'Mandiant', location: 'Reston, VA', startDate: '2016', endDate: '2018', current: false, description: 'Investigated 200+ security incidents across financial and defense sectors. Built SIEM correlation rules reducing false positives by 60%.' }
    ],
    education: [
      { id: 1, degree: 'M.S. Cybersecurity', school: 'Georgia Tech', location: 'Atlanta, GA', startDate: '2016', endDate: '2018', gpa: '3.9', notes: '' },
      { id: 2, degree: 'B.S. Computer Science', school: 'Virginia Tech', location: 'Blacksburg, VA', startDate: '2012', endDate: '2016', gpa: '3.7', notes: '' }
    ],
    skills: ['Penetration Testing', 'SIEM', 'Threat Intel', 'Zero Trust', 'Incident Response', 'Malware Analysis', 'Python', 'Cloud Security'], summary: 'Offensive security specialist who thinks like an adversary to protect critical infrastructure. Expert in threat hunting, red teaming, and security architecture.'
  },
  rose: {
    name: 'Camille Laurent', role: 'Fashion Editor', email: 'camille@laurentmag.com', phone: '(347) 880-5523', location: 'New York, NY',
    experience: [
      { id: 1, title: 'Fashion Director', company: 'Vogue', location: 'New York, NY', startDate: '2021', endDate: 'Present', current: true, description: 'Curated editorial direction for print and digital across 4 seasonal issues. Directed 60+ photo shoots with top photographers and models. Grew Instagram engagement by 85%.' },
      { id: 2, title: 'Style Editor', company: 'Harper\'s Bazaar', location: 'New York, NY', startDate: '2017', endDate: '2021', current: false, description: 'Produced 50+ editorial shoots per year for print and web. Launched sustainable fashion vertical growing to 2M monthly readers. Styled celebrity covers featured on 15 magazine covers.' },
      { id: 3, title: 'Fashion Assistant', company: 'Elle', location: 'London, UK', startDate: '2015', endDate: '2017', current: false, description: 'Assisted on fashion week coverage across Paris, Milan, and London. Coordinated showroom pulls and managed sample logistics for 200+ pieces per issue.' }
    ],
    education: [
      { id: 1, degree: 'B.A. Fashion Studies', school: 'Central Saint Martins', location: 'London, UK', startDate: '2013', endDate: '2017', gpa: '', notes: '' },
      { id: 2, degree: 'Certificate, Fashion Journalism', school: 'London College of Fashion', location: 'London, UK', startDate: '2015', endDate: '2015', gpa: '', notes: '' }
    ],
    skills: ['Trend Forecasting', 'Styling', 'Art Direction', 'Photography', 'Content Strategy', 'Brand Partnerships', 'Social Media', 'Visual Storytelling'], summary: 'Fashion storyteller blending haute couture sensibility with modern cultural commentary. Expert in editorial direction, sustainable fashion, and digital audience growth.'
  },
  executive: {
    name: 'Richard Thornton', role: 'Chief Operating Officer', email: 'r.thornton@exec.com', phone: '(312) 400-9901', location: 'Chicago, IL',
    experience: [
      { id: 1, title: 'COO', company: 'Salesforce', location: 'San Francisco, CA', startDate: '2020', endDate: 'Present', current: true, description: 'Streamlined operations across 70,000+ employees globally. Reduced operational costs by $180M through process automation. Led post-acquisition integration of 3 companies.' },
      { id: 2, title: 'SVP Operations', company: 'Oracle', location: 'Austin, TX', startDate: '2015', endDate: '2020', current: false, description: 'Led operational turnaround saving $200M annually. Redesigned global supply chain reducing delivery times by 35%. Managed P&L for $4B business unit.' },
      { id: 3, title: 'VP Strategy', company: 'IBM', location: 'Armonk, NY', startDate: '2011', endDate: '2015', current: false, description: 'Drove cloud-first transformation strategy generating $2B in new revenue. Led strategic planning for Watson AI division.' }
    ],
    education: [
      { id: 1, degree: 'MBA', school: 'Chicago Booth', location: 'Chicago, IL', startDate: '2011', endDate: '2013', gpa: '', notes: '' },
      { id: 2, degree: 'B.S. Economics', school: 'University of Chicago', location: 'Chicago, IL', startDate: '2001', endDate: '2005', gpa: '3.7', notes: '' }
    ],
    skills: ['P&L Management', 'Org Design', 'Board Relations', 'Transformation', 'M&A Integration', 'Supply Chain', 'Six Sigma', 'Strategic Planning'], summary: 'C-suite executive with 15+ years driving operational excellence at enterprise scale. Expert in organizational transformation and post-merger integration.'
  },
  terminal: {
    name: 'Zara Malik', role: 'Backend Engineer', email: 'zara@malik.dev', phone: '(206) 330-1142', location: 'Seattle, WA',
    experience: [
      { id: 1, title: 'Staff Backend Engineer', company: 'GitHub', location: 'Remote', startDate: '2022', endDate: 'Present', current: true, description: 'Designed Git storage layer for 100M+ repositories. Reduced git clone times by 40% through pack file optimization. Led backend architecture redesign for Copilot integration.' },
      { id: 2, title: 'Backend Engineer', company: 'Cloudflare', location: 'Austin, TX', startDate: '2019', endDate: '2022', current: false, description: 'Built edge caching infrastructure serving 25M+ requests/second globally. Designed DNS resolution system with 99.999% uptime. Reduced bandwidth costs by $3M annually.' },
      { id: 3, title: 'Software Engineer', company: 'DigitalOcean', location: 'New York, NY', startDate: '2017', endDate: '2019', current: false, description: 'Built container orchestration platform for managed Kubernetes service. Implemented auto-scaling algorithms handling 500% traffic spikes.' }
    ],
    education: [
      { id: 1, degree: 'B.S. Computer Science', school: 'University of Washington', location: 'Seattle, WA', startDate: '2015', endDate: '2019', gpa: '3.8', notes: '' },
      { id: 2, degree: 'Certificate, Distributed Systems', school: 'MIT OpenCourseWare', location: 'Online', startDate: '2020', endDate: '2020', gpa: '', notes: '' }
    ],
    skills: ['Go', 'Rust', 'Distributed Systems', 'gRPC', 'Linux', 'Networking', 'Docker', 'Redis'], summary: 'Low-level systems engineer building infrastructure that powers millions of developers. Expert in performance optimization, distributed storage, and network protocols.'
  },
  healthcare: {
    name: 'Dr. Elena Vasquez', role: 'Emergency Physician', email: 'elena.v@cedars.org', phone: '(310) 555-0198', location: 'Los Angeles, CA',
    experience: [
      { id: 1, title: 'Attending Physician', company: 'Cedars-Sinai', location: 'Los Angeles, CA', startDate: '2019', endDate: 'Present', current: true, description: 'Lead physician in Level I trauma center treating 5,000+ patients annually. Developed sepsis early detection protocol reducing mortality by 15%. Supervise team of 12 residents.' },
      { id: 2, title: 'Resident Physician', company: 'Johns Hopkins', location: 'Baltimore, MD', startDate: '2016', endDate: '2019', current: false, description: 'Completed emergency medicine residency with honors. Led quality improvement initiative for pediatric emergency department. Published research on point-of-care ultrasound.' },
      { id: 3, title: 'Research Fellow', company: 'NIH', location: 'Bethesda, MD', startDate: '2014', endDate: '2016', current: false, description: 'Conducted clinical research on traumatic brain injury outcomes. Co-authored 4 peer-reviewed publications in leading medical journals.' }
    ],
    education: [
      { id: 1, degree: 'M.D.', school: 'Johns Hopkins Medicine', location: 'Baltimore, MD', startDate: '2012', endDate: '2016', gpa: '', notes: '' },
      { id: 2, degree: 'B.S. Biochemistry', school: 'UCLA', location: 'Los Angeles, CA', startDate: '2008', endDate: '2012', gpa: '3.9', notes: '' }
    ],
    skills: ['Trauma Surgery', 'Critical Care', 'ACLS', 'Team Leadership', 'Point-of-Care Ultrasound', 'Research', 'Quality Improvement', 'Medical Education'], summary: 'Board-certified emergency physician with expertise in trauma and critical care medicine. Published researcher focused on improving emergency department outcomes and patient safety.'
  },
  nature: {
    name: 'Rowan Blackwell', role: 'Environmental Scientist', email: 'rowan@blackwell.eco', phone: '(970) 443-2218', location: 'Boulder, CO',
    experience: [
      { id: 1, title: 'Lead Ecologist', company: 'National Geographic', location: 'Washington, DC', startDate: '2021', endDate: 'Present', current: true, description: 'Led biodiversity research expeditions in 12 countries across 4 continents. Published landmark study on coral reef decline cited by IPCC. Managed $2M annual research budget and team of 8 field researchers.' },
      { id: 2, title: 'Environmental Analyst', company: 'Patagonia', location: 'Ventura, CA', startDate: '2018', endDate: '2021', current: false, description: 'Developed carbon footprint reduction strategies saving 5,000 metric tons CO2 annually. Built supply chain sustainability dashboard adopted company-wide. Led Fair Trade certification for 12 factories.' },
      { id: 3, title: 'Research Associate', company: 'Sierra Club', location: 'Oakland, CA', startDate: '2016', endDate: '2018', current: false, description: 'Conducted watershed health assessments across California. Secured $1.5M in conservation grants through technical writing and presentations.' }
    ],
    education: [
      { id: 1, degree: 'M.S. Environmental Science', school: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2015', endDate: '2018', gpa: '3.9', notes: '' },
      { id: 2, degree: 'B.S. Biology', school: 'University of Colorado', location: 'Boulder, CO', startDate: '2011', endDate: '2015', gpa: '3.7', notes: '' }
    ],
    skills: ['GIS Mapping', 'Field Research', 'Data Analysis', 'Grant Writing', 'R Programming', 'Remote Sensing', 'Statistical Modeling', 'Policy Analysis'], summary: 'Passionate ecologist using data-driven research to protect natural ecosystems worldwide. Expert in climate science, biodiversity assessment, and environmental policy.'
  },
  scifi: {
    name: 'Nova Sterling', role: 'AI Research Scientist', email: 'nova@sterling.ai', phone: '(628) 200-0042', location: 'San Francisco, CA',
    experience: [
      { id: 1, title: 'Research Scientist', company: 'DeepMind', location: 'London, UK', startDate: '2022', endDate: 'Present', current: true, description: 'Published 8 papers on reinforcement learning and multi-agent systems. Developed novel reward shaping technique improving sample efficiency by 3x. Led research team of 4 scientists.' },
      { id: 2, title: 'ML Engineer', company: 'OpenAI', location: 'San Francisco, CA', startDate: '2019', endDate: '2022', current: false, description: 'Contributed to large language model training infrastructure. Built distributed training pipeline scaling to 1000+ GPUs. Co-authored paper on constitutional AI alignment.' },
      { id: 3, title: 'Research Intern', company: 'Google Brain', location: 'Mountain View, CA', startDate: '2018', endDate: '2019', current: false, description: 'Developed attention mechanisms for vision transformers. Published first-author paper at NeurIPS with 500+ citations.' }
    ],
    education: [
      { id: 1, degree: 'Ph.D. Artificial Intelligence', school: 'MIT', location: 'Cambridge, MA', startDate: '2015', endDate: '2019', gpa: '4.0', notes: '' },
      { id: 2, degree: 'B.S. Mathematics & CS', school: 'Stanford University', location: 'Stanford, CA', startDate: '2011', endDate: '2015', gpa: '3.9', notes: '' }
    ],
    skills: ['PyTorch', 'Reinforcement Learning', 'NLP', 'Research', 'JAX', 'Distributed Training', 'Computer Vision', 'Paper Writing'], summary: 'AI researcher pushing the frontier of machine intelligence and autonomous agents. Published 20+ papers with 3000+ total citations across top ML venues.'
  },
  sophisticated: {
    name: 'Alexander Mercer', role: 'Managing Director', email: 'a.mercer@blackrock.com', phone: '(212) 810-3300', location: 'New York, NY',
    experience: [
      { id: 1, title: 'Managing Director', company: 'BlackRock', location: 'New York, NY', startDate: '2019', endDate: 'Present', current: true, description: 'Managed $12B portfolio across global equities and fixed income. Generated 18% alpha over benchmark through factor-based strategies. Built quantitative analytics team of 8.' },
      { id: 2, title: 'Director', company: 'J.P. Morgan', location: 'New York, NY', startDate: '2014', endDate: '2019', current: false, description: 'Led quantitative strategies desk managing $4B in systematic equity. Developed proprietary alpha signals generating $200M in annual revenue. Mentored 12 analysts.' },
      { id: 3, title: 'Vice President', company: 'Goldman Sachs', location: 'London, UK', startDate: '2010', endDate: '2014', current: false, description: 'Built derivatives pricing models for structured products desk. Managed $500M credit portfolio through European sovereign debt crisis.' }
    ],
    education: [
      { id: 1, degree: 'MBA Finance', school: 'London Business School', location: 'London, UK', startDate: '2010', endDate: '2012', gpa: '', notes: '' },
      { id: 2, degree: 'B.S. Applied Mathematics', school: 'Imperial College London', location: 'London, UK', startDate: '2005', endDate: '2009', gpa: '', notes: '' }
    ],
    skills: ['Portfolio Management', 'Risk Analysis', 'Derivatives', 'Bloomberg Terminal', 'Python', 'Quantitative Analysis', 'Factor Investing', 'Fixed Income'], summary: 'Senior investment professional with 14+ years managing institutional-grade portfolios. Expert in quantitative strategies, risk management, and systematic investing.'
  },
  vintage: {
    name: 'Theodore Wren', role: 'Literary Agent', email: 'theo@wrenlit.com', phone: '(207) 440-8812', location: 'Portland, ME',
    experience: [
      { id: 1, title: 'Senior Literary Agent', company: 'William Morris Endeavor', location: 'New York, NY', startDate: '2018', endDate: 'Present', current: true, description: 'Represented 40+ bestselling authors across literary fiction, memoir, and narrative nonfiction. Negotiated deals totaling $15M+ in advances. Launched 8 debut authors to bestseller lists.' },
      { id: 2, title: 'Associate Agent', company: 'Penguin Random House', location: 'New York, NY', startDate: '2014', endDate: '2018', current: false, description: 'Acquired and edited literary fiction titles generating $3M in revenue. Managed backlist of 200+ titles. Discovered 3 authors who won major literary prizes.' },
      { id: 3, title: 'Editorial Assistant', company: 'FSG', location: 'New York, NY', startDate: '2012', endDate: '2014', current: false, description: 'Assisted senior editors on 25+ book launches annually. Managed first-reader program evaluating 500+ manuscripts per year.' }
    ],
    education: [
      { id: 1, degree: 'B.A. Comparative Literature', school: 'Brown University', location: 'Providence, RI', startDate: '2010', endDate: '2014', gpa: '3.8', notes: '' },
      { id: 2, degree: 'Certificate, Publishing', school: 'Columbia University', location: 'New York, NY', startDate: '2014', endDate: '2014', gpa: '', notes: '' }
    ],
    skills: ['Manuscript Evaluation', 'Contract Negotiation', 'Editorial', 'Publishing', 'Rights Management', 'Author Development', 'Market Analysis', 'Submissions Strategy'], summary: 'Discerning literary agent championing bold voices and timeless storytelling. Track record of launching debut authors and negotiating career-defining deals.'
  },
  graduate: {
    name: 'Maya Patel', role: 'Junior Developer', email: 'maya@patel.dev', phone: '(510) 200-4430', location: 'San Francisco, CA',
    experience: [
      { id: 1, title: 'Software Engineering Intern', company: 'Meta', location: 'Menlo Park, CA', startDate: '2024', endDate: '2024', current: false, description: 'Built accessibility features for Instagram Stories reaching 500M+ daily users. Implemented screen reader support for AR filters. Received return offer with outstanding performance review.' },
      { id: 2, title: 'Teaching Assistant', company: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2023', endDate: '2024', current: false, description: 'TA for CS61B Data Structures, mentored 300 students across 2 semesters. Created automated grading tools reducing TA workload by 30%. Led weekly review sessions averaging 80+ attendance.' },
      { id: 3, title: 'Research Assistant', company: 'UC Berkeley EECS', location: 'Berkeley, CA', startDate: '2023', endDate: '2024', current: false, description: 'Contributed to open-source ML fairness toolkit. Co-authored paper on algorithmic bias detection presented at FAccT workshop.' }
    ],
    education: [
      { id: 1, degree: 'B.S. Computer Science', school: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2021', endDate: '2025', gpa: '3.9', notes: '' },
      { id: 2, degree: 'Minor in Data Science', school: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2021', endDate: '2025', gpa: '', notes: '' }
    ],
    skills: ['Java', 'React', 'Git', 'Algorithms', 'Python', 'SQL', 'TypeScript', 'Machine Learning'], summary: 'Recent CS graduate passionate about building products that make technology more accessible. Strong foundation in algorithms, data structures, and full-stack web development.'
  },
  futuristic: {
    name: 'Axel Rios', role: 'XR Engineer', email: 'axel@rios.xr', phone: '(424) 900-1177', location: 'Los Angeles, CA',
    experience: [
      { id: 1, title: 'Senior XR Engineer', company: 'Apple Vision Pro', location: 'Cupertino, CA', startDate: '2023', endDate: 'Present', current: true, description: 'Built spatial computing experiences for visionOS launching with 600+ apps. Developed hand-tracking interaction framework used by 3rd-party developers. Filed 2 patents on spatial UI rendering.' },
      { id: 2, title: 'VR Developer', company: 'Meta Reality Labs', location: 'Burlingame, CA', startDate: '2020', endDate: '2023', current: false, description: 'Developed multiplayer VR environments for Quest with 10M+ downloads. Optimized rendering pipeline achieving 90fps on mobile VR hardware. Led cross-platform SDK development.' },
      { id: 3, title: 'Graphics Engineer', company: 'Unity Technologies', location: 'San Francisco, CA', startDate: '2018', endDate: '2020', current: false, description: 'Built real-time global illumination system for Unity HDRP. Contributed to shader graph editor used by 2M+ developers worldwide.' }
    ],
    education: [
      { id: 1, degree: 'M.S. Computer Graphics', school: 'USC', location: 'Los Angeles, CA', startDate: '2018', endDate: '2020', gpa: '3.8', notes: '' },
      { id: 2, degree: 'B.S. Computer Science', school: 'UCLA', location: 'Los Angeles, CA', startDate: '2014', endDate: '2018', gpa: '3.7', notes: '' }
    ],
    skills: ['Unity', 'Swift', 'WebXR', '3D Rendering', 'Metal', 'Shader Programming', 'ARKit', 'C++'], summary: 'Spatial computing engineer creating the next generation of immersive digital experiences. Expert in real-time rendering, XR interaction design, and cross-platform development.'
  },
}

function useDynamicData(data: Partial<ResumeData>, themeId?: string) {
  const d = data || {}
  const p = d.personal || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', summary: '', photo: '' }

  // Use persona-specific defaults based on themeId
  const persona = themeId ? SAMPLE_PERSONAS[themeId] : undefined
  const fallback = persona || SAMPLE_PERSONAS.classic

  return {
    name: p.fullName || fallback.name,
    role: p.jobTitle || fallback.role,
    email: p.email || fallback.email,
    phone: (p.phone || fallback.phone).replace(/\D/g, '').length > 0 ? (p.phone || fallback.phone) : fallback.phone,
    location: p.location || fallback.location,
    experience: d.experience && d.experience.length > 0 ? d.experience : fallback.experience,
    education: d.education && d.education.length > 0 ? d.education : fallback.education,
    skills: d.skills && d.skills.length > 0 ? d.skills : fallback.skills,
    summary: d.summary || fallback.summary,
  }
}

interface PreviewProps {
  data?: Partial<ResumeData>
}

// ─── THEMES 1-17 (In ThemesPreviews.css) ─────────────────────

export function ClassicPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'classic')
  return (
    <div className="classic-resume">
      <div className="cr-name">{res.name}</div>
      <div className="cr-contact">✉ {res.email} · ☎ {res.phone} · {res.location}</div>
      <div className="cr-section">
        <div className="cr-section-title">Summary</div>
        <div className="cr-job-desc">{res.summary}</div>
      </div>
      <div className="cr-section">
        <div className="cr-section-title">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} className="cr-job">
            <div className="cr-job-title">{exp.title}</div>
            <div className="cr-job-company">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
            <div className="cr-job-desc">{exp.description}</div>
          </div>
        ))}
      </div>
      <div className="cr-section">
        <div className="cr-section-title">Education</div>
        {res.education.map((edu, i) => (
          <div key={i} className="cr-job">
            <div className="cr-job-title">{edu.degree}</div>
            <div className="cr-job-company">{edu.school} · {edu.startDate} – {edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </div>
      <div className="cr-section">
        <div className="cr-section-title">Skills</div>
        <div className="cr-skills">{res.skills.map((s, i) => <span key={i} className="cr-skill">{s}</span>)}</div>
      </div>
    </div>
  )
}

export function MinimalistPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'minimalist')
  return (
    <div className="minimal-resume">
      <div className="mr-name">{res.name}</div>
      <div className="mr-role">{res.role}</div>
      <div className="mr-divider" />
      <div className="mr-section">
        <div className="mr-label">Summary</div>
        <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.6, marginBottom: 10 }}>{res.summary}</div>
      </div>
      <div className="mr-section">
        <div className="mr-label">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} className="mr-item">
            <div className="mr-item-left">
              <div className="title">{exp.title}</div>
              <div className="sub">{exp.company}</div>
              <div style={{ fontSize: '9px', color: '#888', marginTop: 2 }}>{exp.description}</div>
            </div>
            <div className="mr-item-right">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
          </div>
        ))}
      </div>
      <div className="mr-section">
        <div className="mr-label">Education</div>
        {res.education.map((edu, i) => (
          <div key={i} className="mr-item">
            <div className="mr-item-left">
              <div className="title">{edu.degree}</div>
              <div className="sub">{edu.school}</div>
            </div>
            <div className="mr-item-right">{edu.startDate} – {edu.endDate}</div>
          </div>
        ))}
      </div>
      <div className="mr-section">
        <div className="mr-label">Skills</div>
        <div className="mr-skills">{res.skills.map((s, i) => <span key={i} className="mr-skill">{s}</span>)}</div>
      </div>
    </div>
  )
}

export function DarkPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'dark')
  return (
    <div className="dark-resume">
      <div className="dr-accent-line"></div>
      <div className="dr-name">{res.name}</div>
      <div className="dr-role">{res.role}</div>
      <div className="dr-divider"></div>
      <div className="dr-section">
        <div className="dr-section-title">Summary</div>
        <div className="dr-job-desc">{res.summary}</div>
      </div>
      <div className="dr-section">
        <div className="dr-section-title">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} className="dr-job">
            <div className="dr-job-title">{exp.title}</div>
            <div className="dr-job-meta">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
            <div className="dr-job-desc">{exp.description}</div>
          </div>
        ))}
      </div>
      <div className="dr-section">
        <div className="dr-section-title">Education</div>
        {res.education.map((edu, i) => (
          <div key={i} className="dr-job">
            <div className="dr-job-title">{edu.degree}</div>
            <div className="dr-job-meta">{edu.school} · {edu.startDate} – {edu.endDate}</div>
          </div>
        ))}
      </div>
      <div className="dr-section">
        <div className="dr-section-title">Skills</div>
        <div className="dr-skills">{res.skills.map((s, i) => <span key={i} className="dr-skill">{s}</span>)}</div>
      </div>
      <div className="dr-section">
        <div className="dr-section-title">Selected Projects</div>
        {[
          { name: 'Distributed Tracing Platform', co: 'Datadog · 2023', desc: 'Rebuilt trace ingestion to handle 4B spans/day. Cut storage costs 42% via adaptive sampling. Adopted by 18K+ enterprise customers.' },
          { name: 'Payments Idempotency Layer', co: 'Stripe · 2021', desc: 'Cross-service framework preventing $2M+ in duplicate charges monthly across 12 payment APIs.' },
        ].map((proj, i) => (
          <div key={i} className="dr-job">
            <div className="dr-job-title">{proj.name}</div>
            <div className="dr-job-meta">{proj.co}</div>
            <div className="dr-job-desc">{proj.desc}</div>
          </div>
        ))}
      </div>
      <div className="dr-section">
        <div className="dr-section-title">Certifications</div>
        <div className="dr-job"><div className="dr-job-title">Certified Kubernetes Administrator</div><div className="dr-job-meta">CNCF · 2023</div></div>
        <div className="dr-job"><div className="dr-job-title">AWS Solutions Architect Pro</div><div className="dr-job-meta">Amazon · 2022</div></div>
      </div>
      <div className="dr-section">
        <div className="dr-section-title">Languages</div>
        <div className="dr-skills">
          <span className="dr-skill">English — Native</span>
          <span className="dr-skill">Cantonese — Fluent</span>
          <span className="dr-skill">Mandarin — Conversational</span>
        </div>
      </div>
    </div>
  )
}

export function TerminalPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'terminal')
  const skillColors = ['linear-gradient(90deg, #7ee787, #56d364)', 'linear-gradient(90deg, #79c0ff, #58a6ff)', 'linear-gradient(90deg, #e3b341, #d29922)', 'linear-gradient(90deg, #bc8cff, #a371f7)', 'linear-gradient(90deg, #f778ba, #db61a2)']
  const skillPcts = [95, 90, 85, 80, 75]
  return (
    <div className="terminal-theme-wrapper">
      <div className="terminal-container">
        <div className="terminal-window">
          <div className="terminal-titlebar">
            <div className="terminal-titlebar-btn close"></div>
            <div className="terminal-titlebar-btn min"></div>
            <div className="terminal-titlebar-btn max"></div>
            <div className="terminal-titlebar-text">resume.sh — bash — 86×42</div>
          </div>
          <div className="terminal-body">
            <div className="terminal-prompt"><span className="terminal-prompt-prefix">user</span><span className="terminal-prompt-dir">@portfolio</span><span className="terminal-prompt-symbol"> $ </span><span className="terminal-command">cat</span> <span style={{ color: '#f778ba' }}>--pretty</span> <span style={{ color: '#7ee787' }}>~/resume.json</span></div>
            <div className="terminal-section">
              <div className="terminal-ascii-box"><div className="terminal-name">{res.name}</div><div className="terminal-title">{res.role}</div></div>
            </div>
            <div className="terminal-section">
              <div className="terminal-section-cmd">$ grep <span style={{ color: '#f778ba' }}>-i</span> <span style={{ color: '#7ee787' }}>"contact"</span> info.cfg</div>
              <div style={{ paddingLeft: 4 }}>
                {[['email', res.email], ['phone', res.phone], ['location', res.location]].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '2px 0', fontSize: '9px' }}>
                    <span style={{ color: '#f778ba', minWidth: 70 }}>  {k}:</span>
                    <span style={{ color: '#c9d1d9' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="terminal-section">
              <div className="terminal-section-cmd">$ echo <span style={{ color: '#7ee787' }}>$ABOUT_ME</span></div>
              <div style={{ fontSize: '9px', color: '#c9d1d9', lineHeight: 1.6, paddingLeft: 4 }}>{res.summary}</div>
            </div>
            <div className="terminal-section">
              <div className="terminal-section-cmd">$ skills <span style={{ color: '#f778ba' }}>--list</span> <span style={{ color: '#f778ba' }}>--verbose</span></div>
              {res.skills.slice(0, 5).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '3px 0', paddingLeft: 4 }}>
                  <span style={{ fontSize: '9px', color: '#c9d1d9', minWidth: 80 }}>{s}</span>
                  <div style={{ flex: 1, height: 6, background: '#1b2733', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${skillPcts[i] || 70}%`, height: '100%', background: skillColors[i % skillColors.length], borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: '8px', color: '#8b949e', minWidth: 24, textAlign: 'right' as const }}>{skillPcts[i] || 70}%</span>
                </div>
              ))}
              <div style={{ marginTop: 8 }}><span style={{ fontSize: '8px', color: '#8b949e', fontStyle: 'italic' }}>  # Also comfortable with:</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, paddingLeft: 4, marginTop: 4 }}>
                {res.skills.slice(5).map((s, i) => <span key={i} style={{ fontSize: '8px', background: 'rgba(121,192,255,0.08)', border: '1px solid rgba(121,192,255,0.2)', color: '#79c0ff', padding: '2px 8px', borderRadius: 3 }}>{s}</span>)}
              </div>
            </div>
            <div className="terminal-section">
              <div className="terminal-section-cmd">$ history <span style={{ color: '#f778ba' }}>--career</span> <span style={{ color: '#8b949e' }}>|</span> sort <span style={{ color: '#f778ba' }}>-r</span></div>
              {res.experience.map((exp, i) => (
                <div key={i} className="terminal-exp-entry">
                  <div className="terminal-exp-role">{exp.title}</div>
                  <div className="terminal-exp-co">{exp.company}</div>
                  <div style={{ fontSize: '8px', color: '#8b949e' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                  <div style={{ fontSize: '8px', color: '#c9d1d9', paddingLeft: 4, lineHeight: 1.5, marginTop: 4 }}>{exp.description}</div>
                </div>
              ))}
            </div>
            <div className="terminal-section">
              <div className="terminal-section-cmd">$ cat <span style={{ color: '#7ee787' }}>/etc/education</span></div>
              {res.education.map((edu, i) => (
                <div key={i} className="terminal-exp-entry">
                  <div style={{ color: '#f0f6fc', fontWeight: 600, fontSize: '10px' }}>{edu.degree}</div>
                  <div style={{ color: '#bc8cff', fontSize: '9px' }}>{edu.school}</div>
                  <div style={{ fontSize: '8px', color: '#8b949e' }}>{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #1b2733', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#8b949e' }}>
              <span><span className="terminal-prompt-prefix">user</span><span className="terminal-prompt-dir">@portfolio</span><span className="terminal-prompt-symbol"> $ </span><span style={{ display: 'inline-block', width: 6, height: 10, background: '#7ee787', animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }} /></span>
              <span style={{ color: '#7ee787' }}>uptime: {res.experience.length}+ yrs in tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Resume1EditorialLuxePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'editorial_luxe')
  const c = { ink: '#1a1a1a', cream: '#f8f5f0', accent: '#c4553a', muted: '#7a7167', rule: '#d4cec5' }
  const sTitle: React.CSSProperties = { fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: c.accent, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }
  const nameParts = res.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'DM Sans', sans-serif", background: c.cream, padding: '60px 64px', position: 'relative', overflow: 'hidden' }}>
      {/* Corner marks */}
      <span style={{ position: 'absolute', top: 28, left: 28, width: 24, height: 24, borderTop: `2px solid ${c.accent}`, borderLeft: `2px solid ${c.accent}`, opacity: 0.4 }} />
      <span style={{ position: 'absolute', bottom: 28, right: 28, width: 24, height: 24, borderBottom: `2px solid ${c.accent}`, borderRight: `2px solid ${c.accent}`, opacity: 0.4 }} />
      {/* Header */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 32, paddingBottom: 28, borderBottom: `1px solid ${c.rule}`, marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontWeight: 900, fontSize: 52, letterSpacing: -1, lineHeight: 1, color: c.ink }}>{firstName} {lastName && <span style={{ color: c.accent, fontStyle: 'italic', fontWeight: 400 }}>{lastName}</span>}</h1>
          <div style={{ fontSize: 15, fontWeight: 300, color: c.muted, letterSpacing: 3, textTransform: 'uppercase', marginTop: 10 }}>{res.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 13.5, color: c.muted, lineHeight: 1.8 }}>
          {res.location}<br />{res.phone}<br /><span style={{ color: c.accent }}>{res.email}</span>
        </div>
      </header>
      {/* Summary */}
      <div style={{ fontSize: 15.5, lineHeight: 1.7, color: '#444', fontWeight: 300, marginBottom: 36, paddingLeft: 20, borderLeft: `3px solid ${c.accent}` }}>
        {res.summary}
      </div>
      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 48 }}>
        {/* Main */}
        <main>
          <div style={sTitle}>Experience<span style={{ flex: 1, height: 1, background: c.rule }} /></div>
          {res.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <h3 style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 17, fontWeight: 700, color: c.ink }}>{exp.title}</h3>
                <span style={{ fontSize: 12.5, color: c.muted, whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: 14, color: c.accent, fontWeight: 600, marginBottom: 8 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
              {exp.description && exp.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13.5, color: '#555', lineHeight: 1.6, paddingLeft: 16, position: 'relative', marginBottom: 4 }}><span style={{ position: 'absolute', left: 0, color: c.accent, fontWeight: 600 }}>—</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
            </div>
          ))}
        </main>
        {/* Sidebar */}
        <aside>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: c.accent, marginBottom: 18 }}>Skills</div>
            <p style={{ fontSize: 13.5, color: '#444', lineHeight: 1.8 }}>{res.skills.join(', ')}</p>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: c.accent, marginBottom: 18 }}>Education</div>
            {res.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <h4 style={{ fontFamily: "'Playfair Display', 'EB Garamond', serif", fontSize: 14.5, fontWeight: 700, color: c.ink }}>{edu.degree}</h4>
                <p style={{ fontSize: 13, color: c.muted, lineHeight: 1.5 }}>{edu.school}<br />{edu.endDate}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export function Resume2DarkArchitectPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'dark_architect')
  const c = { bg: '#0f0f13', surface: '#18181f', surface2: '#1f1f28', border: '#2a2a36', text: '#e4e2de', muted: '#8a8690', accent: '#64ffda', accentDim: 'rgba(100,255,218,0.08)', warm: '#ffd6a0' }
  const mono = "'JetBrains Mono', 'DM Mono', monospace"
  const sLabel: React.CSSProperties = { fontFamily: mono, fontSize: 10, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', color: c.muted, marginBottom: 20, paddingBottom: 8, borderBottom: `1px solid ${c.border}` }
  const tag: React.CSSProperties = { fontFamily: mono, fontSize: 11, padding: '4px 10px', borderRadius: 4, background: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.15)', color: c.accent }
  const nameParts = res.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: c.surface, border: `1px solid ${c.border}`, borderRadius: 16, overflow: 'hidden', color: c.text }}>
      {/* Accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.warm}, ${c.accent})` }} />
      {/* Header */}
      <header style={{ padding: '48px 56px 36px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'flex-start', borderBottom: `1px solid ${c.border}` }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.1, color: c.text }}><span style={{ fontWeight: 300, opacity: 0.7 }}>{firstName}</span> {lastName}</h1>
          <div style={{ fontFamily: mono, fontSize: 13, color: c.accent, marginTop: 8, letterSpacing: 1 }}><span style={{ opacity: 0.4 }}>{'> '}</span>{res.role}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', fontFamily: mono, fontSize: 12, color: c.muted }}>
          {[['Location', res.location], ['Phone', res.phone], ['Email', res.email]].map(([label, val], i) => (
            <div key={i}><span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: c.accent, opacity: 0.6 }}>{label}</span><br />{val}</div>
          ))}
        </div>
      </header>
      {/* Summary */}
      <div style={{ padding: '32px 56px', borderBottom: `1px solid ${c.border}`, background: c.accentDim }}>
        <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.75, color: c.text, maxWidth: 680 }}>{res.summary}</p>
      </div>
      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px' }}>
        {/* Main */}
        <div style={{ padding: '36px 48px 48px 56px', borderRight: `1px solid ${c.border}` }}>
          <div style={sLabel}>Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: c.text }}>{exp.title}</h3>
                <span style={{ fontFamily: mono, fontSize: 11.5, color: c.muted, whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: c.accent, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>{exp.company}{exp.location && <><span style={{ width: 4, height: 4, borderRadius: '50%', background: c.warm }} />{exp.location}</>}</div>
              {exp.description && exp.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13.5, fontWeight: 300, color: c.text, opacity: 0.85, lineHeight: 1.6, paddingLeft: 18, position: 'relative', marginBottom: 5 }}><span style={{ position: 'absolute', left: 0, color: c.accent, fontSize: 12 }}>▸</span>{b.replace(/^[•\-–—]\s*/, '')}</div>)}
            </div>
          ))}
        </div>
        {/* Sidebar */}
        <div style={{ padding: '36px 36px 48px', background: c.surface2 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={sLabel}>Tech Stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {res.skills.map((s, i) => <span key={i} style={tag}>{s}</span>)}
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={sLabel}>Education</div>
            {res.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{edu.degree}</h4>
                <p style={{ fontSize: 12.5, color: c.muted, lineHeight: 1.5 }}>{edu.school}<br />{edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Resume3BauhausGeometricPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'bauhaus_geometric')
  const c = { navy: '#0d1b3e', coral: '#e8634a', gold: '#f0c75e', sky: '#4a98d9', cream: '#faf8f4', text: '#2c2c2c', muted: '#6e6e6e', ltBg: '#f2efe8' }
  const sbHead: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: c.coral, marginBottom: 12, paddingBottom: 6, borderBottom: '2px solid rgba(255,255,255,0.08)' }
  const initials = res.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden', borderRadius: 4, background: '#fff', color: c.text }}>
      {/* Sidebar */}
      <aside style={{ background: c.navy, color: '#fff', padding: '48px 28px 40px', position: 'relative' }}>
        {/* Coral triangle corner */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: c.coral, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
        {/* Gold circle ornament */}
        <div style={{ position: 'absolute', bottom: 40, left: 28, width: 36, height: 36, border: `3px solid ${c.gold}`, borderRadius: '50%', opacity: 0.4 }} />
        {/* Avatar */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${c.coral}, ${c.gold})`, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff' }}>{initials}</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, marginBottom: 6 }}>{res.name}</h1>
        <div style={{ fontSize: 12, fontWeight: 300, letterSpacing: 2.5, textTransform: 'uppercase', color: c.gold, marginBottom: 32 }}>{res.role}</div>
        {/* Contact */}
        <div style={{ marginBottom: 28 }}>
          <div style={sbHead}>Contact</div>
          <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 2, color: 'rgba(255,255,255,0.8)' }}>{res.location}<br />{res.phone}<br /><span style={{ color: c.gold }}>{res.email}</span></p>
        </div>
        {/* Skills */}
        <div style={{ marginBottom: 28 }}>
          <div style={sbHead}>Expertise</div>
          {res.skills.map((skill, i) => (
            <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>{skill}</div>
          ))}
        </div>
        {/* Education */}
        <div style={{ marginBottom: 28 }}>
          <div style={sbHead}>Education</div>
          {res.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{edu.degree}</h4>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{edu.school} · {edu.endDate}</p>
            </div>
          ))}
        </div>
      </aside>
      {/* Main */}
      <main style={{ padding: '48px 48px 40px' }}>
        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle fill={c.coral} cx="7" cy="7" r="7" /></svg>
          <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3.5, textTransform: 'uppercase', color: c.navy }}>Profile</h2>
          <span style={{ flex: 1, height: 2, background: c.ltBg }} />
        </div>
        <div style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif", fontSize: 15, lineHeight: 1.75, color: c.muted, marginBottom: 32, padding: '20px 24px', background: c.cream, borderLeft: `4px solid ${c.coral}`, borderRadius: '0 8px 8px 0' }}>
          {res.summary}
        </div>
        {/* Experience */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, marginTop: 8 }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect fill={c.sky} width="14" height="14" /></svg>
          <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3.5, textTransform: 'uppercase', color: c.navy }}>Experience</h2>
          <span style={{ flex: 1, height: 2, background: c.ltBg }} />
        </div>
        {res.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 26, paddingLeft: 20, borderLeft: `2px solid ${c.ltBg}`, position: 'relative' }}>
            <div style={{ position: 'absolute', left: -5, top: 6, width: 8, height: 8, background: c.coral, borderRadius: '50%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: c.navy }}>{exp.title}</h3>
              <span style={{ fontSize: 12, color: c.muted, whiteSpace: 'nowrap', background: c.cream, padding: '2px 10px', borderRadius: 10 }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: c.coral, marginBottom: 8 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
            {exp.description && exp.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13.5, color: '#555', lineHeight: 1.65, paddingLeft: 16, position: 'relative', marginBottom: 4 }}><span style={{ position: 'absolute', left: 0, top: 9, width: 6, height: 2, background: c.gold }} />{b.replace(/^[•\-–—]\s*/, '')}</div>)}
          </div>
        ))}
      </main>
    </div>
  )
}

export function Resume4SoftPastelPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'soft_pastel')
  const c = { rose: '#d4726a', roseLt: '#f8e8e6', sage: '#7a9e7e', sageLt: '#e4f0e5', lav: '#8e7cc3', lavLt: '#ece8f6', bg: '#fdfbf8', text: '#3a3535', light: '#7d7575', border: '#ede8e3' }
  const divider = (label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '36px 0 24px' }}>
      <span style={{ flex: 1, height: 1, background: c.border }} />
      <h2 style={{ fontFamily: "'Lora', 'Georgia', serif", fontSize: 14, fontWeight: 600, color: c.rose, letterSpacing: 2.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</h2>
      <span style={{ flex: 1, height: 1, background: c.border }} />
    </div>
  )
  const chipColors = [c.roseLt, c.sageLt, c.lavLt]
  const gradients = [`linear-gradient(90deg, ${c.rose}, ${c.lav})`, `linear-gradient(90deg, ${c.sage}, ${c.rose})`, `linear-gradient(90deg, ${c.lav}, ${c.sage})`]
  const nameParts = res.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  return (
    <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif", background: c.bg, borderRadius: 20, padding: '52px 56px', overflow: 'hidden', color: c.text, lineHeight: 1.5 }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Lora', 'Georgia', serif", fontSize: 44, fontWeight: 600, color: c.text, letterSpacing: -0.5, marginBottom: 6 }}>{firstName} {lastName && <span style={{ color: c.rose }}>{lastName}</span>}</h1>
        <div style={{ fontSize: 15, fontWeight: 500, color: c.sage, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>{res.role}</div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
          {[['📍', res.location], ['📱', res.phone], ['✉️', res.email]].map(([icon, val], i) => (
            <span key={i} style={{ fontSize: 12.5, padding: '6px 16px', borderRadius: 20, background: '#fff', border: `1px solid ${c.border}`, color: c.light }}><span style={{ marginRight: 6, opacity: 0.6 }}>{icon}</span>{val}</span>
          ))}
        </div>
      </header>
      {/* About */}
      {divider('About')}
      <p style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 12px', fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: c.light }}>
        {res.summary}
      </p>
      {/* Skills */}
      {divider('Core Skills')}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
        {res.skills.map((s, i) => (
          <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: '6px 16px', borderRadius: 20, color: c.text, background: chipColors[i % 3] }}>{s}</span>
        ))}
      </div>
      {/* Experience */}
      {divider('Experience')}
      {res.experience.map((exp, i) => (
        <div key={i} style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 14, padding: '22px 24px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: gradients[i % 3] }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
            <h3 style={{ fontSize: 15.5, fontWeight: 600, color: c.text }}>{exp.title}</h3>
            <span style={{ fontSize: 12, color: c.light, whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: c.rose, marginBottom: 10 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
          {exp.description && exp.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13, color: c.light, lineHeight: 1.6, paddingLeft: 14, position: 'relative', marginBottom: 4, fontWeight: 300 }}><span style={{ position: 'absolute', left: 0, top: 8, width: 5, height: 5, borderRadius: '50%', background: c.sage }} />{b.replace(/^[•\-–—]\s*/, '')}</div>)}
        </div>
      ))}
      {/* Education */}
      {divider('Education')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {res.education.map((edu, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${c.border}`, borderRadius: 14, padding: '20px 24px' }}>
            <h3 style={{ fontFamily: "'Lora', 'Georgia', serif", fontSize: 15, fontWeight: 600, color: c.text, marginBottom: 2 }}>{edu.degree}</h3>
            <p style={{ fontSize: 13, color: c.light, fontWeight: 300 }}>{edu.school} · {edu.endDate}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Resume5SwissGridPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'swiss_grid')
  const c = { black: '#111', white: '#fff', red: '#d63031', g1: '#f7f7f7', g2: '#e5e5e5', g3: '#999', g4: '#666', type: '#222' }
  const rowLabel: React.CSSProperties = { padding: '28px 24px 28px 52px', borderRight: `1px solid ${c.g2}`, borderBottom: `1px solid ${c.g2}`, background: c.g1 }
  const rowContent: React.CSSProperties = { padding: '28px 52px 28px 32px', borderBottom: `1px solid ${c.g2}` }
  const sLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: 3.5, textTransform: 'uppercase', color: c.red }
  const nameParts = res.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  return (
    <div style={{ fontFamily: "'Instrument Sans', 'DM Sans', sans-serif", background: c.white, color: c.type, overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{ background: c.black, color: c.white, padding: '44px 52px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, letterSpacing: -1 }}>{firstName} <span style={{ color: c.red }}>{lastName}</span></h1>
          <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: 16, fontStyle: 'italic', color: c.g3, marginTop: 8 }}>{res.role}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 13, color: c.g3, lineHeight: 1.9 }}>
          <strong style={{ color: c.white, fontWeight: 500 }}>{res.location}</strong><br />{res.phone}<br />{res.email}
        </div>
      </div>
      {/* Body Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
        {/* Profile */}
        <div style={rowLabel}><h2 style={sLabel}>Profile</h2></div>
        <div style={rowContent}>
          <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: 16, lineHeight: 1.75, color: c.g4, maxWidth: 580 }}>{res.summary}</p>
        </div>
        {/* Experience */}
        <div style={rowLabel}><h2 style={sLabel}>Experience</h2></div>
        <div style={rowContent}>
          {res.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < res.experience.length - 1 ? 28 : 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', marginBottom: 4 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: c.black }}>{exp.title}</h3>
                <span style={{ fontSize: 12, fontWeight: 500, color: c.g3, textTransform: 'uppercase', letterSpacing: 1 }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.red, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>{exp.company}{exp.location && <><span style={{ width: 20, height: 1, background: c.g2 }} /><span style={{ fontWeight: 400, color: c.g3 }}>{exp.location}</span></>}</div>
              {exp.description && exp.description.split('\n').filter(Boolean).map((b, j) => <div key={j} style={{ fontSize: 13.5, color: c.g4, lineHeight: 1.65, paddingLeft: 20, position: 'relative', marginBottom: 5 }}><span style={{ position: 'absolute', left: 0, top: 8, width: 8, height: 1, background: c.red }} />{b.replace(/^[•\-–—]\s*/, '')}</div>)}
            </div>
          ))}
        </div>
        {/* Skills */}
        <div style={rowLabel}><h2 style={sLabel}>Skills</h2></div>
        <div style={rowContent}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {res.skills.map((s, i) => (
              <span key={i} style={{ fontSize: 12.5, fontWeight: 500, padding: '4px 14px', borderRadius: 4, background: c.g1, border: `1px solid ${c.g2}`, color: c.type }}>{s}</span>
            ))}
          </div>
        </div>
        {/* Education */}
        <div style={rowLabel}><h2 style={sLabel}>Education</h2></div>
        <div style={rowContent}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {res.education.map((edu, i) => (
              <div key={i}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: c.black, marginBottom: 2 }}>{edu.degree}</h3>
                <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontStyle: 'italic', fontSize: 13.5, color: c.g4 }}>{edu.school}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.red, marginTop: 2 }}>{edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{ background: c.black, padding: '14px 52px', fontSize: 11, color: c.g3, textAlign: 'center', letterSpacing: 1 }}>References available upon request</div>
    </div>
  )
}

export function PhdResumePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'phd')
  return (
    <div className="phd-wrapper">



      <header className="hd">
        <div>
          <div className="hd-label">Department of Brain & Cognitive Sciences · PhD Candidate</div>
          <h1 className="hd-name">{res.name}</h1>
          <div className="hd-cred">B.Sc. (Hons) · M.Sc. · PhD Candidate (ABD) · Expected 2026</div>
          <div className="hd-affil">
            <strong>Massachusetts Institute of Technology</strong><br />
            Brain & Cognitive Sciences Program<br />
            Advisor: Prof. Daniel J. Hartman
          </div>
        </div>
        <div className="hd-contact">
          <div className="hd-contact-item">e.whitfield@mit.edu</div>
          <div className="hd-contact-item">+1 (617) 555-0142</div>
          <div className="hd-contact-item">Cambridge, MA 02139</div>
          <div className="hd-contact-item">orcid.org / 0000-0002-1234-5678</div>
          <div className="hd-contact-item">scholar.whitfield.mit.edu</div>
        </div>
      </header>

      <div className="orn"><div className="orn-line"></div><div className="orn-gem"></div><div className="orn-line"></div></div>


      <div className="body">


        <main className="main">


          <div className="diss">
            <div className="diss-label">Doctoral Dissertation — Expected May 2026</div>
            <div className="diss-title">"Predictive Coding and Temporal Precision: How the Brain Constructs Time from Noisy Sensory Signals"</div>
            <div className="diss-desc">Investigates the neural mechanisms underlying temporal perception using fMRI, EEG, and computational modelling. Proposes a unified hierarchical Bayesian framework reconciling conflicting accounts of interval timing in prefrontal and cerebellar circuits. Three first-author papers completed; one under review at <em>PLOS Computational Biology</em>.</div>
          </div>


          <div className="section">
            <div className="sec-title">Education</div>

            <div className="entry">
              <div>
                <div className="e-title">Doctor of Philosophy — <em>Brain & Cognitive Sciences</em></div>
                <div className="e-org">Massachusetts Institute of Technology, Cambridge MA</div>
                <div className="e-sub">Thesis Committee: D. Hartman (chair), L. Chen, R. Patel (Oxford)</div>
                <div className="e-desc">NSF Graduate Research Fellow. Qualifying exams passed with distinction. Recipient of MIT School of Science Fellowship (2021–22).</div>
              </div>
              <div className="e-date">2021 — present</div>
            </div>

            <div className="entry">
              <div>
                <div className="e-title">Master of Science — <em>Cognitive Neuroscience</em></div>
                <div className="e-org">University College London, London UK</div>
                <div className="e-sub">Thesis: "Bayesian Priors in Auditory Temporal Estimation" · Awarded Distinction</div>
              </div>
              <div className="e-date">2019 — 2020</div>
            </div>

            <div className="entry">
              <div>
                <div className="e-title">Bachelor of Science — <em>Psychology with Neuroscience</em></div>
                <div className="e-org">University of Edinburgh, Edinburgh UK</div>
                <div className="e-sub">First Class Honours · Dean's List (all four years) · Best Undergraduate Thesis Prize</div>
              </div>
              <div className="e-date">2015 — 2019</div>
            </div>
          </div>


          <div className="section">
            <div className="sec-title">Research Experience</div>

            <div className="entry">
              <div>
                <div className="e-title">Graduate Research Assistant</div>
                <div className="e-org">Hartman Computational Cognition Lab · MIT</div>
                <div className="e-sub">PI: Prof. Daniel J. Hartman</div>
                <div className="e-desc">Designing and executing behavioural and neuroimaging studies of temporal perception. Developed novel fMRI paradigm to dissociate prospective and retrospective timing. Built lab's Python/R neuroimaging analysis pipeline. Mentoring four undergraduate research assistants.</div>
              </div>
              <div className="e-date">2021 — present</div>
            </div>

            <div className="entry">
              <div>
                <div className="e-title">Visiting Researcher</div>
                <div className="e-org">Department of Experimental Psychology · University of Oxford</div>
                <div className="e-sub">Host: Prof. Rachel Patel · Funded by MIT SHASS International Travel Grant</div>
                <div className="e-desc">Collaborated on cross-modal timing experiments using TMS-EEG co-registration. Co-authored two manuscripts from the collaboration, one published in <em>Journal of Neuroscience</em>.</div>
              </div>
              <div className="e-date">Summer 2023</div>
            </div>

            <div className="entry">
              <div>
                <div className="e-title">Research Assistant</div>
                <div className="e-org">Language & Brain Lab · UCL</div>
                <div className="e-sub">PI: Prof. Sophie Laurent</div>
                <div className="e-desc">Supported MEG data collection for study on prosodic rhythm and temporal prediction. Preprocessed 40+ participant datasets using SPM12 and MNE-Python.</div>
              </div>
              <div className="e-date">2019 — 2020</div>
            </div>
          </div>


          <div className="section">
            <div className="sec-title">Selected Publications</div>

            <div className="pub">
              <div className="pub-title">"Hierarchical Temporal Prediction Errors in Human Auditory Cortex"</div>
              <div className="pub-meta"><span className="journal">Nature Neuroscience</span>, 27(4), 2024 · Whitfield, E., Chen, L., & Hartman, D.J. <span className="pub-status">Published</span></div>
            </div>

            <div className="pub">
              <div className="pub-title">"Cerebellar-Prefrontal Dynamics During Interval Timing: A Dynamic Causal Modelling Analysis"</div>
              <div className="pub-meta"><span className="journal">Journal of Neuroscience</span>, 43(12), 2023 · Whitfield, E., Patel, R., & Hartman, D.J. <span className="pub-status">Published</span></div>
            </div>

            <div className="pub">
              <div className="pub-title">"Bayesian Observer Models Fail to Capture Individual Differences in Temporal Sensitivity"</div>
              <div className="pub-meta"><span className="journal">PLOS Computational Biology</span>, 2024 · Whitfield, E., Okafor, T., & Hartman, D.J. <span className="pub-status">In Review</span></div>
            </div>

            <div className="pub">
              <div className="pub-title">"Prior Expectations Modulate Temporal Rate Perception Across Sensory Modalities"</div>
              <div className="pub-meta"><span className="journal">Cognition</span>, 224, 2022 · Whitfield, E. & Laurent, S. <span className="pub-status">Published</span></div>
            </div>
          </div>


          <div className="section">
            <div className="sec-title">Teaching & Mentorship</div>

            <div className="entry">
              <div>
                <div className="e-title">Teaching Assistant — <em>Computational Neuroscience (9.40)</em></div>
                <div className="e-org">MIT · Dept. of Brain & Cognitive Sciences</div>
                <div className="e-desc">Led weekly recitation sections (30 students). Developed new problem sets on dynamical systems modelling. Student evaluation: 4.9 / 5.0.</div>
              </div>
              <div className="e-date">Spring 2023</div>
            </div>

            <div className="entry">
              <div>
                <div className="e-title">Guest Lecturer — <em>Perception & Cognition (9.35)</em></div>
                <div className="e-org">MIT · Three 90-minute lectures on temporal perception and Bayesian brain theory</div>
              </div>
              <div className="e-date">2022, 2024</div>
            </div>

            <div className="entry">
              <div>
                <div className="e-title">Undergraduate Thesis Co-Supervisor</div>
                <div className="e-org">MIT · Two senior thesis projects; both students graduated with honours</div>
              </div>
              <div className="e-date">2023 — present</div>
            </div>
          </div>

        </main>


        <aside className="sidebar">

          <div className="sb-sec">
            <div className="sb-title">Research Interests</div>
            <div className="tags">
              <span className="tag">Temporal Perception</span>
              <span className="tag">Predictive Coding</span>
              <span className="tag">Bayesian Brain</span>
              <span className="tag">fMRI / EEG</span>
              <span className="tag">Computational Models</span>
              <span className="tag">Interval Timing</span>
              <span className="tag">Cerebellum</span>
              <span className="tag">Multisensory</span>
            </div>
          </div>

          <div className="sb-sec">
            <div className="sb-title">Honours & Funding</div>
            <div className="award">
              <div className="award-gem"></div>
              <div className="award-text"><strong>NSF Graduate Research Fellowship</strong>$138,000 · 2021 – 2024</div>
            </div>
            <div className="award">
              <div className="award-gem"></div>
              <div className="award-text"><strong>CNS Young Investigator Award</strong>Cognitive Neuroscience Society · SF 2024</div>
            </div>
            <div className="award">
              <div className="award-gem"></div>
              <div className="award-text"><strong>MIT School of Science Fellowship</strong>2021 – 2022</div>
            </div>
            <div className="award">
              <div className="award-gem"></div>
              <div className="award-text"><strong>UCL Dean's Prize · Best MSc Thesis</strong>2020</div>
            </div>
            <div className="award">
              <div className="award-gem"></div>
              <div className="award-text"><strong>BPS Undergraduate Prize</strong>2019</div>
            </div>
          </div>

          <div className="sb-sec">
            <div className="sb-title">Conferences</div>
            <div className="sb-item">
              <div className="sb-item-title">Society for Neuroscience (SfN)</div>
              <div className="sb-item-sub">Oral presentation · Chicago · 2024</div>
            </div>
            <div className="sb-item">
              <div className="sb-item-title">Cognitive Neuroscience Society</div>
              <div className="sb-item-sub">Poster + travel award · SF · 2024</div>
            </div>
            <div className="sb-item">
              <div className="sb-item-title">Vision Sciences Society</div>
              <div className="sb-item-sub">Poster · St. Pete Beach · 2023</div>
            </div>
            <div className="sb-item">
              <div className="sb-item-title">European Conf. on Visual Perception</div>
              <div className="sb-item-sub">Talk · Leuven, Belgium · 2022</div>
            </div>
          </div>

          <div className="sb-sec">
            <div className="sb-title">Technical Skills</div>
            <div className="skill-row">
              <span className="skill-name">Python (MNE, nilearn, Stan)</span>
              <div className="skill-dots"><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div></div>
            </div>
            <div className="skill-row">
              <span className="skill-name">R / Bayesian modelling</span>
              <div className="skill-dots"><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-off"></div></div>
            </div>
            <div className="skill-row">
              <span className="skill-name">MATLAB / SPM12</span>
              <div className="skill-dots"><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-off"></div></div>
            </div>
            <div className="skill-row">
              <span className="skill-name">fMRI (3T & 7T Siemens)</span>
              <div className="skill-dots"><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-off"></div></div>
            </div>
            <div className="skill-row">
              <span className="skill-name">EEG / TMS-EEG</span>
              <div className="skill-dots"><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-off"></div><div className="d-off"></div></div>
            </div>
            <div className="skill-row">
              <span className="skill-name">Git / Docker / HPC</span>
              <div className="skill-dots"><div className="d-on"></div><div className="d-on"></div><div className="d-on"></div><div className="d-off"></div><div className="d-off"></div></div>
            </div>
          </div>

          <div className="sb-sec">
            <div className="sb-title">Languages</div>
            <div className="skill-row"><span className="skill-name">English</span><span className="skill-level">Native</span></div>
            <div className="skill-row"><span className="skill-name">French</span><span className="skill-level">Fluent</span></div>
            <div className="skill-row"><span className="skill-name">German</span><span className="skill-level">Intermediate</span></div>
            <div className="skill-row"><span className="skill-name">Mandarin</span><span className="skill-level">Basic</span></div>
          </div>

          <div className="sb-sec">
            <div className="sb-title">Service & Outreach</div>
            <div className="sb-item">
              <div className="sb-item-title">Peer Reviewer</div>
              <div className="sb-item-sub">Nature Neuroscience, J. Neurosci., Cognition, NeuroImage · 28 reviews, 2022–present</div>
            </div>
            <div className="sb-item">
              <div className="sb-item-title">Graduate Women in Science</div>
              <div className="sb-item-sub">Chapter co-president, MIT · 2022 – 2023</div>
            </div>
            <div className="sb-item">
              <div className="sb-item-title">Brain Awareness Week</div>
              <div className="sb-item-sub">Public lecturer & lab tour coordinator · 2022 – 2024</div>
            </div>
          </div>

        </aside>
      </div>


      <footer className="footer">
        <div className="footer-note">Curriculum Vitae · Eleanor Whitfield · Updated February 2026</div>
        <div className="footer-note">Full list: scholar.whitfield.mit.edu</div>
      </footer>


    </div>
  )
}

export const PREVIEW_MAP: Record<string, React.FC<PreviewProps>> = {

  editorial_luxe: Resume1EditorialLuxePreview,
  dark_architect: Resume2DarkArchitectPreview,
  bauhaus_geometric: Resume3BauhausGeometricPreview,
  soft_pastel: Resume4SoftPastelPreview,
  swiss_grid: Resume5SwissGridPreview,

  phd: PhdResumePreview,

  classic: ClassicPreview,
  minimalist: MinimalistPreview,
  dark: DarkPreview,

  terminal: TerminalPreview,

  corporate_slate: CorporateSlatePreview,
  teal_wave: TealWavePreview,
  purple_dusk: PurpleDuskPreview,
  coral_bright: CoralBrightPreview,
  ocean_deep: OceanDeepPreview,
  sage_pro: SageProPreview,
  carbon_noir: CarbonNoirPreview,
  sand_dune: SandDunePreview,
  indigo_sharp: IndigoSharpPreview,
  platinum_elite: PlatinumElitePreview,
  cascade_blue: CascadeBluePreview,
  nordic_minimal: NordicMinimalPreview,
  midnight_pro: MidnightProPreview,
  blueprint: BlueprintPreview,
  emerald_fresh: EmeraldFreshPreview,
  sunset_warm: SunsetWarmPreview,
  newspaper_classic: NewspaperClassicPreview,
  ivory_marble: IvoryMarblePreview,
  neon_cyber: NeonCyberPreview,
  origami_zen: OrigamiZenPreview,
}
