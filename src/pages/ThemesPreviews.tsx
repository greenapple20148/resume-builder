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

export function SidebarPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'sidebar')
  return (
    <div className="sidebar-resume">
      <div className="sb-left">
        <div className="sb-avatar">{res.name[0]}</div>
        <div className="sb-name">{res.name}</div>
        <div className="sb-role">{res.role}</div>
        <div className="sb-section-title">Contact</div>
        <div className="sb-contact-item">{res.email}</div>
        <div className="sb-contact-item">{res.phone}</div>
        <div className="sb-contact-item">{res.location}</div>
        <div className="sb-divider" />
        <div className="sb-section-title">Skills</div>
        {res.skills.map((skill, i) => (
          <div key={i} className="sb-skill-bar">
            <div className="sb-skill-name">{skill}</div>
            <div className="sb-bar-bg"><div className="sb-bar-fill" style={{ width: `${85 - i * 8}%` }} /></div>
          </div>
        ))}
        <div className="sb-divider" />
        <div className="sb-section-title">Education</div>
        {res.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: '9px', fontWeight: 600 }}>{edu.degree}</div>
            <div className="sb-contact-item">{edu.school}</div>
          </div>
        ))}
        <div className="sb-divider" />
        <div className="sb-section-title">Certifications</div>
        <div style={{ marginBottom: 5 }}>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>AWS Solutions Architect</div>
          <div className="sb-contact-item">Amazon · 2023</div>
        </div>
        <div style={{ marginBottom: 5 }}>
          <div style={{ fontSize: '9px', fontWeight: 600 }}>Deep Learning Specialization</div>
          <div className="sb-contact-item">DeepLearning.AI · 2022</div>
        </div>
        <div className="sb-divider" />
        <div className="sb-section-title">Languages</div>
        <div className="sb-contact-item">English — Native</div>
        <div className="sb-contact-item">Mandarin — Fluent</div>
        <div className="sb-contact-item">French — Conversational</div>
      </div>
      <div className="sb-right">
        <div className="sb-r-name">Profile</div>
        <div className="sb-r-section">
          <div className="sb-r-job-desc">{res.summary}</div>
        </div>
        <div className="sb-r-section">
          <div className="sb-r-label">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="sb-r-job">
              <div className="sb-r-job-title">{exp.title}</div>
              <div className="sb-r-job-meta">{exp.company} | {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="sb-r-job-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="sb-r-section">
          <div className="sb-r-label">Selected Projects</div>
          {[
            { name: 'ML Fraud Pipeline', co: 'Netflix · 2023', desc: 'Real-time anomaly system flagging 99.4% fraudulent streams. Reduced chargebacks by $8M annually.' },
            { name: 'Recommendation Engine v3', co: 'Netflix · 2022', desc: 'Two-tower neural net boosting watch-time 18% for 230M subscribers. Deployed in A/B across 6 regions.' },
            { name: 'Studio Analytics Dashboard', co: 'Netflix · 2021', desc: 'Built self-serve BI tool used by 400+ content executives. Reduced reporting cycle from 5 days to real-time.' },
          ].map((proj, i) => (
            <div key={i} className="sb-r-job">
              <div className="sb-r-job-title">{proj.name}</div>
              <div className="sb-r-job-meta">{proj.co}</div>
              <div className="sb-r-job-desc">{proj.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CreativePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'creative')
  return (
    <div className="creative-resume">
      <div className="cr2-top">
        <div className="cr2-name">{res.name}</div>
        <div className="cr2-role">{res.role}</div>
      </div>
      <div className="cr2-body">
        <div className="cr2-contact">
          <div className="cr2-contact-item">{res.email}</div>
          <div className="cr2-contact-item">{res.phone}</div>
          <div className="cr2-contact-item">{res.location}</div>
        </div>
        <div style={{ fontSize: '9px', color: '#555', lineHeight: 1.6, marginBottom: 12 }}>{res.summary}</div>
        <div className="cr2-section-title">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} className="cr2-item">
            <div className="cr2-item-title">{exp.title}</div>
            <div className="cr2-item-sub">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
            <div className="cr2-item-desc">{exp.description}</div>
          </div>
        ))}
        <div className="cr2-section-title">Education</div>
        {res.education.map((edu, i) => (
          <div key={i} className="cr2-item">
            <div className="cr2-item-title">{edu.degree}</div>
            <div className="cr2-item-sub">{edu.school} · {edu.startDate} – {edu.endDate}</div>
          </div>
        ))}
        <div className="cr2-section-title">Skills</div>
        <div className="cr2-tags">{res.skills.map((s, i) => <span key={i} className="cr2-tag">{s}</span>)}</div>
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

export function EditorialPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'editorial')
  return (
    <div className="editorial-resume">
      <div className="er-header">
        <div className="er-issue">ISSUE No. 42</div>
        <div className="er-name">{res.name}</div>
        <div className="er-tagline">{res.role}</div>
      </div>
      <div className="er-body">
        <div className="er-col-main">
          <div className="er-section-label">Profile</div>
          <div className="er-item-desc" style={{ marginBottom: 12 }}>{res.summary}</div>
          <div className="er-section-label">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="er-item">
              <div className="er-item-title">{exp.title}</div>
              <div className="er-item-sub">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="er-item-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="er-col-side">
          <div className="er-section-label">Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="er-item">
              <div className="er-item-title">{edu.degree}</div>
              <div className="er-item-sub">{edu.school}</div>
            </div>
          ))}
          <div className="er-section-label" style={{ marginTop: 10 }}>Skills</div>
          <div>{res.skills.map((s, i) => <span key={i} className="er-tag">{s}</span>)}</div>
          <div className="er-section-label" style={{ marginTop: 10 }}>Awards</div>
          <div className="er-item"><div className="er-item-title">Pulitzer Finalist</div><div className="er-item-sub">Feature Writing · 2023</div></div>
          <div className="er-item"><div className="er-item-title">SPJ Award</div><div className="er-item-sub">Investigative Reporting · 2022</div></div>
          <div className="er-item"><div className="er-item-title">IRE Award</div><div className="er-item-sub">Data Journalism · 2021</div></div>
          <div className="er-section-label" style={{ marginTop: 10 }}>Publications</div>
          <div className="er-item"><div className="er-item-title">"The Algorithm Beat"</div><div className="er-item-sub">NYT Magazine · 2023</div></div>
          <div className="er-item"><div className="er-item-title">"Platform Power"</div><div className="er-item-sub">The Atlantic · 2022</div></div>
          <div className="er-section-label" style={{ marginTop: 10 }}>Contact</div>
          <div className="er-item-sub">{res.email}</div>
          <div className="er-item-sub">{res.phone}</div>
          <div className="er-item-sub">{res.location}</div>
        </div>
      </div>
    </div>
  )
}

export function BoldPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'bold')
  return (
    <div className="bold-resume">
      <div className="ba-left">
        <div className="ba-top-block">
          <div className="ba-avatar">{res.name[0]}</div>
        </div>
        <div className="ba-left-body">
          <div className="ba-section-head">Contact</div>
          <div className="ba-contact-item">{res.email}</div>
          <div className="ba-contact-item">{res.phone}</div>
          <div className="ba-contact-item">{res.location}</div>
          <div className="ba-section-head">Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="ba-edu-item">
              <div className="ba-edu-year">{edu.startDate} – {edu.endDate}</div>
              <div className="ba-edu-deg">{edu.degree}</div>
              <div className="ba-edu-school">{edu.school}</div>
            </div>
          ))}
          <div className="ba-section-head">Skills</div>
          {res.skills.map((skill, i) => (
            <div key={i} className="ba-skill-item">
              <div className="ba-skill-name">{skill}</div>
              <div className="ba-skill-track"><div className="ba-skill-fill" style={{ width: `${90 - i * 10}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="ba-right">
        <div className="ba-name">{res.name}</div>
        <div className="ba-title">{res.role}</div>
        <div style={{ fontSize: '8.5px', color: '#555', lineHeight: 1.5, marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>{res.summary}</div>
        <div className="ba-r-section-head">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} className="ba-exp-item">
            <div className="ba-exp-meta"><span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span><span>{exp.location}</span></div>
            <div className="ba-exp-title">{exp.title}</div>
            <div className="ba-exp-company">{exp.company}</div>
            <div className="ba-exp-desc">{exp.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TealPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'teal')
  return (
    <div className="teal-resume">
      <div className="tl-left">
        <div className="tl-photo">
          <div className="tl-photo-circle">{res.name[0]}</div>
        </div>
        <div className="tl-body">
          <div className="tl-section-head">Info</div>
          <div className="tl-contact-item">{res.email}</div>
          <div className="tl-contact-item">{res.phone}</div>
          <div className="tl-contact-item">{res.location}</div>
          <div className="tl-section-head">Skills</div>
          {res.skills.map((skill, i) => (
            <div key={i} className="tl-skill-item">
              <div className="tl-skill-name"><span>{skill}</span></div>
              <div className="tl-dots-row">
                {[1, 2, 3, 4, 5].map(d => <div key={d} className={d <= 4 - Math.min(i, 2) ? 'tl-dot-filled' : 'tl-dot-empty'} />)}
              </div>
            </div>
          ))}
          <div className="tl-section-head">Education</div>
          {res.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: '8.5px', fontWeight: 600 }}>{edu.degree}</div>
              <div className="tl-contact-item">{edu.school}</div>
            </div>
          ))}
          <div className="tl-section-head">Certifications</div>
          <div style={{ marginBottom: 5 }}><div style={{ fontSize: '8.5px', fontWeight: 600 }}>GitHub Actions CI/CD</div><div className="tl-contact-item">GitHub · 2023</div></div>
          <div style={{ marginBottom: 5 }}><div style={{ fontSize: '8.5px', fontWeight: 600 }}>CKA — Kubernetes Admin</div><div className="tl-contact-item">CNCF · 2022</div></div>
          <div className="tl-section-head">Languages</div>
          <div className="tl-contact-item">English — Native</div>
          <div className="tl-contact-item">Korean — Fluent</div>
          <div className="tl-contact-item">Japanese — Basic</div>
        </div>
      </div>
      <div className="tl-right">
        <div className="tl-cv-label">CV</div>
        <div className="tl-name">{res.name}</div>
        <div className="tl-job">{res.role}</div>
        <div style={{ fontSize: '8px', color: '#555', lineHeight: 1.5, marginBottom: 8 }}>{res.summary}</div>
        <div className="tl-r-section-head">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} className="tl-exp-item">
            <div className="tl-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
            <div className="tl-exp-title">{exp.title}</div>
            <div className="tl-exp-company">{exp.company}</div>
            <div className="tl-exp-desc">{exp.description}</div>
          </div>
        ))}
        <div className="tl-r-section-head">Projects</div>
        {[
          { title: 'Open Source CLI Tool', co: 'Personal · 2023', desc: '2.3K GitHub stars. Automated Kubernetes deployment workflows for small teams.' },
          { title: 'Edge Cache Layer', co: 'Vercel · 2022', desc: 'Reduced TTFB by 61% globally using Redis + CDN integration. Processed 800M req/day.' },
        ].map((proj, i) => (
          <div key={i} className="tl-exp-item">
            <div className="tl-exp-title">{proj.title}</div>
            <div className="tl-exp-company">{proj.co}</div>
            <div className="tl-exp-desc">{proj.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TimelinePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'timeline')
  return (
    <div className="timeline-resume">
      <div className="tl2-header">
        <div className="tl2-name">{res.name}</div>
        <div className="tl2-role">{res.role}</div>
      </div>
      <div className="tl2-summary">
        <div className="tl2-section-label">Profile</div>
        <div className="tl2-summary-text">{res.summary}</div>
      </div>
      <div className="tl2-body">
        <div className="tl2-col">
          <div className="tl2-section-label">History</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="tl2-item">
              <div className="tl2-item-title">{exp.title}</div>
              <div className="tl2-item-sub">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="tl2-item-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="tl2-center">
          <div className="tl2-center-dot" />
          <div className="tl2-center-line" />
          <div className="tl2-center-dot" />
        </div>
        <div className="tl2-col">
          <div className="tl2-section-label">Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="tl2-item">
              <div className="tl2-item-title">{edu.degree}</div>
              <div className="tl2-item-sub">{edu.school} · {edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
          <div className="tl2-section-label" style={{ marginTop: 10 }}>Skills</div>
          {res.skills.map((skill, i) => (
            <div key={i} className="tl2-skill-item">
              <div className="tl2-skill-name">{skill}</div>
              <div className="tl2-skill-bar"><div className="tl2-skill-fill" style={{ width: `${85 - i * 10}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GrandePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'grande')
  return (
    <div className="grande-resume">
      <div className="gr-header">
        <div className="gr-name">{res.name}</div>
        <div className="gr-role">{res.role}</div>
        <div className="gr-divider-line"></div>
      </div>
      <div className="gr-body">
        <div className="gr-left">
          <div className="gr-section-title">Contact</div>
          <div className="gr-contact-item">{res.email}</div>
          <div className="gr-contact-item">{res.phone}</div>
          <div className="gr-contact-item">{res.location}</div>
          <div className="gr-section-title" style={{ marginTop: 12 }}>Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="gr-edu-item">
              <div className="gr-edu-school">{edu.school}</div>
              <div className="gr-edu-degree">{edu.degree}</div>
              <div className="gr-edu-year">{edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
          <div className="gr-section-title" style={{ marginTop: 12 }}>Skills</div>
          <div className="gr-skills-list">
            {res.skills.map((skill, i) => (
              <span key={i} className="gr-skill-tag">{skill}</span>
            ))}
          </div>
          <div className="gr-section-title" style={{ marginTop: 12 }}>Achievements</div>
          <div className="gr-edu-item"><div className="gr-edu-school">Forbes 30 Under 30</div><div className="gr-edu-degree">Healthcare · 2022</div></div>
          <div className="gr-edu-item"><div className="gr-edu-school">HIMSS Innovation Award</div><div className="gr-edu-degree">Digital Health · 2023</div></div>
          <div className="gr-edu-item"><div className="gr-edu-school">AMA Health Tech Speaker</div><div className="gr-edu-degree">Annual Conf. · 2023</div></div>
          <div className="gr-section-title" style={{ marginTop: 12 }}>Certifications</div>
          <div className="gr-edu-item"><div className="gr-edu-school">PMP — Project Mgmt</div><div className="gr-edu-degree">PMI · 2022</div></div>
          <div className="gr-edu-item"><div className="gr-edu-school">HL7 FHIR Developer</div><div className="gr-edu-degree">HL7 Intl · 2021</div></div>
          <div className="gr-section-title" style={{ marginTop: 12 }}>Languages</div>
          <div className="gr-skills-list">
            <span className="gr-skill-tag">English</span>
            <span className="gr-skill-tag">Tagalog</span>
            <span className="gr-skill-tag">Spanish</span>
          </div>
        </div>
        <div className="gr-right">
          <div className="gr-section-title">Summary</div>
          <div className="gr-exp-desc" style={{ marginBottom: 10 }}>{res.summary}</div>
          <div className="gr-section-title">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="gr-exp-item">
              <div className="gr-exp-company">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="gr-exp-title">{exp.title}</div>
              <div className="gr-exp-desc">{exp.description}</div>
            </div>
          ))}
          <div className="gr-section-title">Selected Projects</div>
          {[
            { co: 'Epic Systems · 2023', title: 'Smart Triage AI', desc: 'NLP model triaging 2M+ patient messages/month. Reduced ER wait times 31% at 14 hospital systems.' },
            { co: 'MedStar Health · 2022', title: 'FHIR Integration Layer', desc: 'Built HL7 FHIR API connecting 6 disparate EHR systems. Enabled real-time data sharing for 800K patients.' },
          ].map((proj, i) => (
            <div key={i} className="gr-exp-item">
              <div className="gr-exp-company">{proj.co}</div>
              <div className="gr-exp-title">{proj.title}</div>
              <div className="gr-exp-desc">{proj.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function BlobPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'blob')
  return (
    <div className="blob-resume">
      <div className="bl-blob1"></div>
      <div className="bl-header">
        <div className="bl-avatar">{res.name[0]}</div>
        <div className="bl-name-block">
          <div className="bl-name">{res.name}</div>
          <div className="bl-contact">{res.role} · {res.email} · {res.phone}</div>
        </div>
      </div>
      <div className="bl-body">
        <div className="bl-col">
          <div className="bl-section-title">Summary</div>
          <div className="bl-item-desc" style={{ marginBottom: 8 }}>{res.summary}</div>
          <div className="bl-section-title">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="bl-item">
              <div className="bl-item-title">{exp.title}</div>
              <div className="bl-item-sub">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="bl-item-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="bl-divider-v"></div>
        <div className="bl-col">
          <div className="bl-section-title">Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="bl-item">
              <div className="bl-item-title">{edu.degree}</div>
              <div className="bl-item-sub">{edu.school} · {edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
          <div className="bl-section-title" style={{ marginTop: 8 }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {res.skills.map((s, i) => <span key={i} style={{ fontSize: '8px', background: 'linear-gradient(135deg, #ffb3c6, #c3b1e1)', color: '#fff', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>{s}</span>)}
          </div>
          <div className="bl-section-title" style={{ marginTop: 8 }}>Awards</div>
          <div className="bl-item"><div className="bl-item-title">Webby Award — Best UX</div><div className="bl-item-sub">Interactive Media · 2023</div></div>
          <div className="bl-item"><div className="bl-item-title">Communication Arts Award</div><div className="bl-item-sub">Design Excellence · 2022</div></div>
          <div className="bl-item"><div className="bl-item-title">CSS Design Awards</div><div className="bl-item-sub">Site of the Year · 2021</div></div>
          <div className="bl-section-title" style={{ marginTop: 8 }}>Selected Work</div>
          <div className="bl-item"><div className="bl-item-title">Headspace Refresh</div><div className="bl-item-sub">Brand identity + motion system · 2023</div></div>
          <div className="bl-item"><div className="bl-item-title">Airbnb Icons</div><div className="bl-item-sub">450-icon design system · 2022</div></div>
          <div className="bl-item"><div className="bl-item-title">Figma Community Kit</div><div className="bl-item-sub">32K downloads · 2021</div></div>
          <div className="bl-section-title" style={{ marginTop: 8 }}>Languages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontSize: '8px', background: 'linear-gradient(135deg, #c3b1e1, #a29bd4)', color: '#fff', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>English</span>
            <span style={{ fontSize: '8px', background: 'linear-gradient(135deg, #ffb3c6, #f4a0b5)', color: '#fff', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>Portuguese</span>
            <span style={{ fontSize: '8px', background: 'linear-gradient(135deg, #c3b1e1, #a29bd4)', color: '#fff', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>Spanish</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SplitPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'split')
  return (
    <div className="split-resume">
      <div className="sp-left">
        <div className="sp-name">{res.name}</div>
        <div className="sp-role">{res.role}</div>
        <div className="sp-divider"></div>
        <div className="sp-section-title">Contact</div>
        <div className="sp-contact-item">{res.email}</div>
        <div className="sp-contact-item">{res.phone}</div>
        <div className="sp-contact-item">{res.location}</div>
        <div className="sp-section-title" style={{ marginTop: 12 }}>Education</div>
        {res.education.map((edu, i) => (
          <div key={i} className="sp-edu-item">
            <div className="sp-edu-degree">{edu.degree}</div>
            <div className="sp-edu-school">{edu.school}</div>
            <div className="sp-edu-year">{edu.startDate} – {edu.endDate}</div>
          </div>
        ))}
        <div className="sp-section-title" style={{ marginTop: 12 }}>Skills</div>
        <div className="sp-skills-grid">
          {res.skills.map((skill, i) => (
            <div key={i} className="sp-skill-item">
              <div className="sp-skill-name">{skill}</div>
              <div className="sp-skill-bar"><div className="sp-skill-fill" style={{ width: `${85 - i * 10}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="sp-right">
        <div className="sp-exp-section">
          <div className="sp-r-section-title">Summary</div>
          <div className="sp-exp-desc" style={{ marginBottom: 10 }}>{res.summary}</div>
        </div>
        <div className="sp-exp-section">
          <div className="sp-r-section-title">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="sp-exp-item">
              <div className="sp-exp-company">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="sp-exp-title">{exp.title}</div>
              <div className="sp-exp-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="sp-exp-section">
          <div className="sp-r-section-title">Selected Projects</div>
          {[
            { co: 'Shopify · 2023', title: 'Checkout Conversion Suite', desc: 'Rebuilt payment flow reducing cart abandonment 34%. Shipped across 1.7M merchant stores globally.' },
            { co: 'Shopify · 2022', title: 'B2B Commerce Platform', desc: 'End-to-end wholesale commerce product. $120M ARR in first year, 14K enterprise merchants onboarded.' },
          ].map((proj, i) => (
            <div key={i} className="sp-exp-item">
              <div className="sp-exp-company">{proj.co}</div>
              <div className="sp-exp-title">{proj.title}</div>
              <div className="sp-exp-desc">{proj.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ObsidianPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'obsidian')
  return (
    <div className="obsidian-resume">
      <div className="ob-border-frame"></div>
      <div className="ob-corner tl"></div><div className="ob-corner tr"></div>
      <div className="ob-corner bl"></div><div className="ob-corner br"></div>
      <div className="ob-inner">
        <div className="ob-monogram">{res.name.split(' ').map(n => n[0]).join('')}</div>
        <div className="ob-name">{res.name}</div>
        <div className="ob-title">{res.role}</div>
        <div className="ob-divider"><div className="ob-divider-line"></div><div className="ob-divider-gem"></div><div className="ob-divider-line"></div></div>
        <div className="ob-section">
          <div className="ob-section-head">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="ob-exp">
              <div className="ob-exp-title">{exp.title}</div>
              <div className="ob-exp-meta">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="ob-exp-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="ob-section">
          <div className="ob-section-head">Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="ob-exp">
              <div className="ob-exp-title">{edu.degree}</div>
              <div className="ob-exp-meta">{edu.school} · {edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
        </div>
        <div className="ob-section">
          <div className="ob-section-head">Skills</div>
          <div className="ob-skills">{res.skills.map((s, i) => <span key={i} className="ob-skill">{s}</span>)}</div>
        </div>
        <div className="ob-section">
          <div className="ob-section-head">Selected Projects</div>
          {[
            { title: 'Luminary Brand Identity', co: 'Obsidian Studio · 2023', desc: 'Rebranded luxury hotel chain across 48 properties. Identity system spanning print, digital and environmental design.' },
            { title: 'Nocturne Editorial Series', co: 'Harper’s Bazaar · 2022', desc: '12-issue visual language system for print and digital. Grew digital readership 41% in first quarter.' },
          ].map((proj, i) => (
            <div key={i} className="ob-exp">
              <div className="ob-exp-title">{proj.title}</div>
              <div className="ob-exp-meta">{proj.co}</div>
              <div className="ob-exp-desc">{proj.desc}</div>
            </div>
          ))}
        </div>
        <div className="ob-section">
          <div className="ob-section-head">Awards</div>
          <div className="ob-exp"><div className="ob-exp-title">D&AD Pencil — Gold</div><div className="ob-exp-meta">Typography · 2023</div></div>
          <div className="ob-exp"><div className="ob-exp-title">Cannes Lions Silver</div><div className="ob-exp-meta">Brand Design · 2022</div></div>
          <div className="ob-exp"><div className="ob-exp-title">Type Directors Club</div><div className="ob-exp-meta">Communication Design · 2021</div></div>
        </div>
        <div className="ob-section">
          <div className="ob-section-head">Contact</div>
          <div className="ob-contact">
            <div className="ob-contact-item"><div className="ob-contact-dot"></div>{res.email}</div>
            <div className="ob-contact-item"><div className="ob-contact-dot"></div>{res.phone}</div>
            <div className="ob-contact-item"><div className="ob-contact-dot"></div>{res.location}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function IvoryPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'ivory')
  return (
    <div className="ivory-resume">
      <div className="iv-top-stripe"></div>
      <div className="iv-header">
        <div className="iv-header-text">
          <div className="iv-name">{res.name}</div>
          <div className="iv-title-bar"><div className="iv-title">{res.role}</div><div className="iv-title-dash"></div></div>
        </div>
        <div className="iv-header-contact">
          <div className="iv-contact-item">{res.email}</div>
          <div className="iv-contact-item">{res.phone}</div>
          <div className="iv-contact-item">{res.location}</div>
        </div>
      </div>
      <div className="iv-body">
        <div className="iv-main">
          <div className="iv-section-label">Experience</div>
          <div className="iv-section-rule"></div>
          {res.experience.map((exp, i) => (
            <div key={i} className="iv-exp-item">
              <div className="iv-exp-role">{exp.title}</div>
              <div className="iv-exp-where">
                <span className="iv-exp-co">{exp.company}</span>
                <span className="iv-exp-dot"></span>
                <span className="iv-exp-date">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="iv-exp-desc">{exp.description}</div>
            </div>
          ))}
        </div>
        <div className="iv-aside">
          <div className="iv-aside-section">
            <div className="iv-aside-label">Education</div>
            {res.education.map((edu, i) => (
              <div key={i} className="iv-edu-item">
                <div className="iv-edu-degree">{edu.degree}</div>
                <div className="iv-edu-school">{edu.school}</div>
                <div className="iv-edu-year">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
          <div className="iv-aside-section">
            <div className="iv-aside-label">Skills</div>
            {res.skills.map((skill, i) => (
              <div key={i} className="iv-skill-row">
                <div className="iv-skill-name">{skill}</div>
                <div className="iv-skill-dots">
                  {[1, 2, 3, 4, 5].map(d => <div key={d} className={d <= 4 - Math.min(i, 2) ? 'iv-dot-on' : 'iv-dot-off'} />)}
                </div>
              </div>
            ))}
          </div>
          <div className="iv-aside-section">
            <div className="iv-aside-label">Awards</div>
            <div className="iv-edu-item"><div className="iv-edu-degree">National Book Award</div><div className="iv-edu-school">Fiction · 2023</div></div>
            <div className="iv-edu-item"><div className="iv-edu-degree">PEN/Faulkner Award</div><div className="iv-edu-school">American Fiction · 2022</div></div>
            <div className="iv-edu-item"><div className="iv-edu-degree">Whiting Award</div><div className="iv-edu-school">Emerging Writers · 2021</div></div>
          </div>
          <div className="iv-aside-section">
            <div className="iv-aside-label">Languages</div>
            <div className="iv-edu-item"><div className="iv-edu-degree">English — Native</div><div className="iv-edu-degree">French — Fluent</div><div className="iv-edu-degree">Italian — Conversational</div></div>
          </div>
          <div className="iv-quote">
            <p>{res.summary}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NoirPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'noir')
  return (
    <div className="noir-resume">
      <div className="na-header">
        <div className="na-index">NA-2026-X</div>
        <div className="na-name"><em>{res.name.split(' ')[0]}</em> {res.name.split(' ').slice(1).join(' ')}</div>
        <div className="na-role">{res.role}</div>
      </div>
      <div className="na-divider"><div className="na-divider-seg"></div><div className="na-divider-seg"></div><div className="na-divider-seg"></div></div>
      <div className="na-body">
        <div className="na-left">
          <div className="na-section-label">Contact</div>
          <div className="na-contact-item"><span className="na-contact-slash">//</span> {res.email}</div>
          <div className="na-contact-item"><span className="na-contact-slash">//</span> {res.phone}</div>
          <div className="na-contact-item"><span className="na-contact-slash">//</span> {res.location}</div>
          <div className="na-section-label" style={{ marginTop: 12 }}>Skills</div>
          {res.skills.map((skill, i) => (
            <div key={i} className="na-skill-item">
              <div className="na-skill-name">{skill} <span>{90 - i * 10}%</span></div>
              <div className="na-skill-bar-bg"><div className="na-skill-bar-fill" style={{ width: `${90 - i * 10}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="na-right">
          <div className="na-section-label">Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} className="na-exp-item">
              <div className="na-exp-role">{exp.title}</div>
              <div className="na-exp-meta">{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              <div className="na-exp-desc">{exp.description}</div>
            </div>
          ))}
          <div className="na-section-label" style={{ marginTop: 10 }}>Education</div>
          {res.education.map((edu, i) => (
            <div key={i} className="na-exp-item">
              <div className="na-exp-role">{edu.degree}</div>
              <div className="na-exp-meta">{edu.school} · {edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
          <div className="na-section-label" style={{ marginTop: 10 }}>Selected Projects</div>
          {[
            { title: 'Zero-Day Response Protocol', co: 'Mandiant · 2023', desc: 'Incident response framework adopted by 60+ enterprise clients. Reduced mean time-to-contain by 71%.' },
            { title: 'Kernel Exploit Research', co: 'NSA Collaboration · 2022', desc: 'Identified 3 CVEs in Linux kernel. Coordinated disclosure with kernel maintainers and major vendors.' },
            { title: 'Red Team Automation Suite', co: 'Personal · 2021', desc: '1.8K GitHub stars. Automated recon and privilege escalation chains for internal red team exercises.' },
          ].map((proj, i) => (
            <div key={i} className="na-exp-item">
              <div className="na-exp-role">{proj.title}</div>
              <div className="na-exp-meta">{proj.co}</div>
              <div className="na-exp-desc">{proj.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RosePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'rose')
  return (
    <div className="rose-resume">
      <div className="ra-accent-col"></div>
      <div className="ra-main">
        <div className="ra-header">
          <div className="ra-eyebrow">RESUME</div>
          <div className="ra-name">{res.name}</div>
          <div className="ra-title">{res.role}</div>
        </div>
        <div className="ra-body">
          <div className="ra-left">
            <div className="ra-section-head">Contact</div>
            <div className="ra-contact-item"><div className="ra-contact-pip"></div>{res.email}</div>
            <div className="ra-contact-item"><div className="ra-contact-pip"></div>{res.phone}</div>
            <div className="ra-contact-item"><div className="ra-contact-pip"></div>{res.location}</div>
            <div className="ra-section-head" style={{ marginTop: 12 }}>Education</div>
            {res.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#2a1f1f' }}>{edu.degree}</div>
                <div style={{ fontSize: '8px', color: '#a07878' }}>{edu.school}</div>
              </div>
            ))}
            <div className="ra-section-head" style={{ marginTop: 12 }}>Certifications</div>
            <div style={{ marginBottom: 4 }}><div style={{ fontSize: '9px', fontWeight: 600, color: '#2a1f1f' }}>Google UX Certification</div><div style={{ fontSize: '8px', color: '#a07878' }}>Google Career Cert · 2023</div></div>
            <div style={{ marginBottom: 4 }}><div style={{ fontSize: '9px', fontWeight: 600, color: '#2a1f1f' }}>Nielsen Norman UX</div><div style={{ fontSize: '8px', color: '#a07878' }}>NN/g · 2022</div></div>
            <div className="ra-section-head" style={{ marginTop: 12 }}>Languages</div>
            <div style={{ fontSize: '8px', color: '#5a4040', marginBottom: 3 }}>• English — Native</div>
            <div style={{ fontSize: '8px', color: '#5a4040', marginBottom: 3 }}>• Spanish — Fluent</div>
            <div style={{ fontSize: '8px', color: '#5a4040', marginBottom: 3 }}>• Italian — Conversational</div>
          </div>
          <div className="ra-right">
            <div className="ra-section-head">Summary</div>
            <div style={{ fontSize: '8.5px', color: '#5a4040', lineHeight: 1.6, marginBottom: 10 }}>{res.summary}</div>
            <div className="ra-section-head">Experience</div>
            {res.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#2a1f1f' }}>{exp.title}</div>
                <div style={{ fontSize: '8px', color: '#c4789a', marginBottom: 2 }}>{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                <div style={{ fontSize: '8px', color: '#5a4040', lineHeight: 1.5 }}>{exp.description}</div>
              </div>
            ))}
            <div className="ra-section-head">Selected Work</div>
            {[
              { title: 'Bloom Health App', co: 'Bloom Digital · 2023', desc: 'Led UX for women’s health platform. 4.9★ App Store rating, 800K downloads in 6 months.' },
              { title: 'Atelier Rebrand', co: 'Maison Atelier · 2022', desc: 'End-to-end brand identity and digital experience for luxury fashion house. +62% e-commerce conversion.' },
            ].map((proj, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#2a1f1f' }}>{proj.title}</div>
                <div style={{ fontSize: '8px', color: '#c4789a', marginBottom: 2 }}>{proj.co}</div>
                <div style={{ fontSize: '8px', color: '#5a4040', lineHeight: 1.5 }}>{proj.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ExecutivePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'executive')
  return (
    <div className="executive-resume">
      <div className="ex-name">{res.name}</div>
      <div className="ex-role">{res.role}</div>
      <div className="ex-contact">{res.email} | {res.phone} | {res.location}</div>
      <div className="ex-divider"></div>
      <div className="ex-section">
        <div className="ex-section-title">Summary</div>
        <div className="ex-profile">{res.summary}</div>
      </div>
      <div className="ex-section">
        <div className="ex-section-title">Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: '11px', fontWeight: 600 }}>{exp.title}</div>
            <div style={{ fontSize: '9px', color: '#777', fontStyle: 'italic', marginBottom: 3 }}>{exp.company} · {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
            <div style={{ fontSize: '9px', color: '#555', lineHeight: 1.5 }}>{exp.description}</div>
          </div>
        ))}
      </div>
      <div className="ex-section">
        <div className="ex-section-title">Education</div>
        {res.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: '10px', fontWeight: 600 }}>{edu.degree}</div>
            <div style={{ fontSize: '9px', color: '#777' }}>{edu.school} · {edu.startDate} – {edu.endDate}</div>
          </div>
        ))}
      </div>
      <div className="ex-section">
        <div className="ex-section-title">Skills</div>
        <div style={{ fontSize: '9px', color: '#555' }}>{res.skills.join(' · ')}</div>
      </div>
      <div className="ex-section">
        <div className="ex-section-title">Selected Projects</div>
        {[
          { title: 'Enterprise GTM Transformation', co: 'Palantir · 2023', desc: 'Led $200M+ enterprise sales motion across 8 verticals. Built 40-person GTM team from the ground up. Exceeded quota by 38% in year one.' },
          { title: 'EMEA Market Expansion', co: 'Palantir · 2022', desc: 'Opened UK, Germany and France markets simultaneously. $45M in new ARR within 18 months of launch.' },
        ].map((proj, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: '10px', fontWeight: 600 }}>{proj.title}</div>
            <div style={{ fontSize: '9px', color: '#777', fontStyle: 'italic', marginBottom: 3 }}>{proj.co}</div>
            <div style={{ fontSize: '9px', color: '#555', lineHeight: 1.5 }}>{proj.desc}</div>
          </div>
        ))}
      </div>
      <div className="ex-section">
        <div className="ex-section-title">Board &amp; Advisory</div>
        <div style={{ marginBottom: 6 }}><div style={{ fontSize: '10px', fontWeight: 600 }}>Board Observer</div><div style={{ fontSize: '9px', color: '#777' }}>Series B SaaS startup · 2022–Present</div></div>
        <div style={{ marginBottom: 6 }}><div style={{ fontSize: '10px', fontWeight: 600 }}>Advisor — GTM Strategy</div><div style={{ fontSize: '9px', color: '#777' }}>Y Combinator W23 Cohort · 2023</div></div>
      </div>
      <div className="ex-section">
        <div className="ex-section-title">Languages</div>
        <div style={{ fontSize: '9px', color: '#555' }}>English — Native · German — Fluent · French — Conversational</div>
      </div>
    </div>
  )
}

// ─── THEMES 18-25 (With Dedicated CSS Files) ────────────────

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

export function HealthcarePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'healthcare')
  const initials = res.name.split(' ').map(n => n[0]).join('')
  const vitals = [{ num: '12+', label: 'Years Exp', color: '#0d9488' }, { num: '8K+', label: 'Patients', color: '#3b82f6' }, { num: '24', label: 'Publications', color: '#ef6461' }, { num: '96%', label: 'Satisfaction', color: '#d97706' }]
  return (
    <div className="health-theme-wrapper">
      <div className="health-hero">
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}>{initials}</div>
          <div>
            <div className="health-name">{res.name}</div>
            <div className="health-title">{res.role}</div>
          </div>
        </div>
        <div className="health-contact"><span>{res.email}</span><span>{res.phone}</span><span>{res.location}</span></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: '0 14px', marginTop: -8 }}>
        {vitals.map((v, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 6px', textAlign: 'center' as const, position: 'relative' as const, overflow: 'hidden' }}>
            <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: 2, background: v.color }} />
            <div style={{ fontSize: '16px', fontWeight: 400, color: v.color, lineHeight: 1.1 }}>{v.num}</div>
            <div style={{ fontSize: '6px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginTop: 2 }}>{v.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: '#fff', borderLeft: '3px solid #0d9488', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: '9px', color: '#475569', lineHeight: 1.6, marginBottom: 12, boxShadow: '0 1px 3px rgba(15,43,76,0.04)' }}>{res.summary}</div>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6 }}>Experience</div>
        {res.experience.map((exp, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', marginBottom: 8, boxShadow: '0 1px 3px rgba(15,43,76,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
              <div><div style={{ fontSize: '10px', fontWeight: 600, color: '#0f2b4c' }}>{exp.title}</div><div style={{ fontSize: '8px', color: '#0d9488', fontWeight: 600 }}>{exp.company}</div></div>
              <span style={{ fontSize: '7px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' as const }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <div style={{ fontSize: '8px', color: '#475569', lineHeight: 1.5, marginTop: 6 }}>{exp.description}</div>
          </div>
        ))}
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6, marginTop: 8 }}>Education</div>
        {res.education.map((edu, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? 'rgba(239,100,97,0.06)' : 'rgba(59,130,246,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>{i === 0 ? '🩺' : '🔬'}</div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#0f2b4c' }}>{edu.degree}</div>
              <div style={{ fontSize: '8px', color: '#0d9488', fontWeight: 600 }}>{edu.school}</div>
              <div style={{ fontSize: '7px', color: '#94a3b8' }}>{edu.startDate} – {edu.endDate}</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6, marginTop: 8 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginBottom: 12 }}>
          {res.skills.map((s, i) => <span key={i} style={{ fontSize: '8px', background: 'rgba(13,148,136,0.06)', color: '#0d9488', padding: '3px 10px', borderRadius: 100, border: '1px solid rgba(13,148,136,0.12)' }}>{s}</span>)}
        </div>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6 }}>Certifications &amp; Licenses</div>
        {[
          { name: 'Board Certified — Internal Medicine', issuer: 'ABIM · 2022' },
          { name: 'Clinical Informatics Certificate', issuer: 'AMIA · 2021' },
          { name: 'Advanced Cardiac Life Support', issuer: 'AHA · 2023' },
        ].map((cert, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#475569', marginBottom: 4, paddingBottom: 4, borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 500 }}>{cert.name}</span>
            <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' as const, marginLeft: 8 }}>{cert.issuer}</span>
          </div>
        ))}
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6, marginTop: 8 }}>Publications &amp; Research</div>
        {[
          { title: '"AI Triage in Emergency Medicine"', journal: 'NEJM · 2023 · 4,200+ citations' },
          { title: '"Predictive Models for Sepsis"', journal: 'JAMA · 2022 · 2,800+ citations' },
          { title: '"EHR Usability Barriers"', journal: 'JAMIA · 2021 · 1,400+ citations' },
        ].map((pub, i) => (
          <div key={i} style={{ fontSize: '8px', color: '#475569', marginBottom: 5 }}>
            <div style={{ fontWeight: 600, color: '#0f2b4c' }}>{pub.title}</div>
            <div style={{ color: '#94a3b8', fontSize: '7.5px' }}>{pub.journal}</div>
          </div>
        ))}
      </div>
    </div>
  )
}



export function ScifiPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'scifi')
  const skillPcts = [95, 88, 84, 78, 72]
  return (
    <div className="scifi-theme-wrapper">
      <div className="scifi-sys-bar"><span>⚡ STATUS: ACTIVE</span><span>SECTOR-7 · {new Date().toISOString().split('T')[0]}</span></div>
      <div className="scifi-header">
        <div className="scifi-name" data-name={res.name}>{res.name}</div>
        <div className="scifi-designation">{res.role}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '4px 16px', marginTop: 8, fontSize: '7px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
          {[['COMM', res.email], ['SIG', res.phone], ['BASE', res.location]].map(([k, v], i) => (
            <span key={i}><span style={{ color: 'rgba(0,195,255,0.4)' }}>[{k}]</span> <span style={{ color: 'rgba(0,195,255,0.7)' }}>{v}</span></span>
          ))}
        </div>
      </div>
      <div className="scifi-section">
        <div className="scifi-section-head"><div className="scifi-section-title">◈ MISSION BRIEF</div><div className="scifi-section-line"></div></div>
        <div style={{ fontSize: '8px', color: 'rgba(0,195,255,0.5)', lineHeight: 1.65, paddingLeft: 8, borderLeft: '2px solid rgba(0,195,255,0.15)' }}>{res.summary}</div>
      </div>
      <div className="scifi-section">
        <div className="scifi-section-head"><div className="scifi-section-title">◈ CAPABILITIES</div><div className="scifi-section-line"></div></div>
        {res.skills.slice(0, 5).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0', paddingLeft: 8 }}>
            <span style={{ fontSize: '8px', color: 'rgba(0,195,255,0.7)', minWidth: 70, letterSpacing: '0.05em' }}>{s}</span>
            <div style={{ flex: 1, height: 4, background: 'rgba(0,195,255,0.06)', overflow: 'hidden' }}>
              <div style={{ width: `${skillPcts[i] || 60}%`, height: '100%', background: `linear-gradient(90deg, rgba(0,195,255,0.2), rgba(0,195,255,0.6))` }} />
            </div>
            <span style={{ fontSize: '7px', color: 'rgba(0,195,255,0.4)', minWidth: 22, textAlign: 'right' as const }}>{skillPcts[i] || 60}%</span>
          </div>
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, paddingLeft: 8, marginTop: 8 }}>
          {res.skills.slice(5).map((s, i) => <span key={i} style={{ fontSize: '7px', border: '1px solid rgba(0,195,255,0.2)', color: 'rgba(0,195,255,0.6)', padding: '2px 8px', letterSpacing: '0.05em', background: 'rgba(0,195,255,0.03)' }}>{s}</span>)}
        </div>
      </div>
      <div className="scifi-section">
        <div className="scifi-section-head"><div className="scifi-section-title">◈ SERVICE RECORD</div><div className="scifi-section-line"></div></div>
        {res.experience.map((exp, i) => (
          <div key={i} className="scifi-exp-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="scifi-exp-role">{exp.title}</div>
              <span style={{ fontSize: '7px', color: 'rgba(0,195,255,0.3)', letterSpacing: '0.1em' }}>{exp.startDate} – {exp.current ? 'ACTIVE' : exp.endDate}</span>
            </div>
            <div className="scifi-exp-co">{exp.company}</div>
            <div style={{ fontSize: '7.5px', color: 'rgba(0,195,255,0.4)', lineHeight: 1.5, marginTop: 4 }}>{exp.description}</div>
          </div>
        ))}
      </div>
      <div className="scifi-section">
        <div className="scifi-section-head"><div className="scifi-section-title">◈ TRAINING LOG</div><div className="scifi-section-line"></div></div>
        {res.education.map((edu, i) => (
          <div key={i} className="scifi-exp-card">
            <div className="scifi-exp-role">{edu.degree}</div>
            <div className="scifi-exp-co">{edu.school}</div>
            <div style={{ fontSize: '7px', color: 'rgba(0,195,255,0.3)' }}>{edu.startDate} – {edu.endDate}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, borderTop: '1px solid rgba(0,195,255,0.08)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: 'rgba(0,195,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
        <span>⚡ {res.name} · Personnel File</span>
        <span>CLEARANCE: OPEN</span>
      </div>
    </div>
  )
}

export function SophisticatedPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'sophisticated')
  const skillPcts = [98, 95, 93, 90, 88, 85]
  return (
    <div className="sophisticated-theme-wrapper">
      <div className="sophisticated-hero">
        <div className="sophisticated-hero-content">
          <div>
            <div style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#b8953e', marginBottom: 4 }}>Executive Profile</div>
            <div className="sophisticated-name">{res.name}</div>
            <div className="sophisticated-title">{res.role}</div>
          </div>
          <div className="sophisticated-contact-box">
            <div className="sophisticated-contact-label">Contact</div>
            <div style={{ fontSize: '8px', color: '#ddd', lineHeight: 1.6 }}>{res.email}<br />{res.phone}</div>
            <div className="sophisticated-contact-label" style={{ marginTop: 6 }}>Location</div>
            <div style={{ fontSize: '8px', color: '#ddd' }}>{res.location}</div>
          </div>
        </div>
      </div>
      <div className="sophisticated-body" style={{ display: 'grid', gridTemplateColumns: '1fr 180px' }}>
        <div className="sophisticated-main" style={{ padding: '14px 16px 16px 20px', borderRight: '1px solid #e8e3dd' }}>
          <div className="sophisticated-section-label">Executive Summary</div>
          <div style={{ borderLeft: '2px solid #b8953e', paddingLeft: 12, marginLeft: 2, fontStyle: 'italic', fontSize: '9px', color: '#555', lineHeight: 1.65, marginBottom: 14 }}>{res.summary}</div>
          <div className="sophisticated-section-label">Professional Experience</div>
          {res.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: i < res.experience.length - 1 ? '1px solid #f0ebe5' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' as const, gap: 4 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.2px' }}>{exp.title}</span>
                <span style={{ fontSize: '8px', color: '#aaa', letterSpacing: '0.5px' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#888', marginBottom: 4 }}>{exp.company}</div>
              <div style={{ fontSize: '8px', color: '#555', lineHeight: 1.6 }}>{exp.description}</div>
            </div>
          ))}
          <div className="sophisticated-section-label" style={{ marginTop: 6 }}>Education</div>
          {res.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>{edu.degree}</div>
              <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#888' }}>{edu.school}</div>
              <div style={{ fontSize: '8px', color: '#aaa' }}>{edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 14px 16px 12px', background: '#faf9f7' }}>
          <div style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#b8953e', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #e8e3dd' }}>Core Competencies</div>
          {res.skills.slice(0, 6).map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '8px', fontWeight: 500, color: '#444', marginBottom: 3 }}>{s}</div>
              <div style={{ width: '100%', height: 2, background: '#e8e3dd', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${skillPcts[i] || 80}%`, background: 'linear-gradient(90deg, #b8953e, #d4b96a)' }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#b8953e', marginTop: 14, marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #e8e3dd' }}>Expertise</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
            {res.skills.slice(6).map((s, i) => <span key={i} style={{ fontSize: '7px', padding: '3px 8px', border: '1px solid #e8e3dd', color: '#555', background: '#fff' }}>{s}</span>)}
          </div>
          <div style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#b8953e', marginTop: 14, marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #e8e3dd' }}>Board Roles</div>
          <div style={{ fontSize: '8px', color: '#555', marginBottom: 5 }}><strong>Advisor</strong><br />OpenAI LP · 2023–Present</div>
          <div style={{ fontSize: '8px', color: '#555', marginBottom: 5 }}><strong>Board Observer</strong><br />Anthropic · 2022</div>
          <div style={{ fontSize: '7px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#b8953e', marginTop: 14, marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #e8e3dd' }}>Awards</div>
          <div style={{ fontSize: '8px', color: '#555', marginBottom: 5 }}>Fortune 40 Under 40 · 2023</div>
          <div style={{ fontSize: '8px', color: '#555', marginBottom: 5 }}>WSJ CEO Innovation Award · 2022</div>
          <div style={{ fontSize: '8px', color: '#555', marginBottom: 5 }}>Salesforce Trailblazer · 2021</div>
        </div>
      </div>
      <div style={{ background: '#1a1a1a', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '7px' }}>
        <span style={{ fontStyle: 'italic', color: '#888' }}>“Strategy without execution is hallucination.”</span>
        <span style={{ fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#b8953e' }}>References Upon Request</span>
      </div>
    </div>
  )
}



export function FuturisticPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'futuristic')
  const initials = res.name.split(' ').map(n => n[0]).join('')
  const metrics = [{ value: `${res.experience.length}+`, label: 'Years Exp' }, { value: '60+', label: 'Projects' }, { value: '12M', label: 'Users' }, { value: '3', label: 'Awards' }]
  const chipColors = ['rgba(110,231,183,0.12)', 'rgba(129,140,248,0.12)', 'rgba(251,146,160,0.12)', 'rgba(103,232,249,0.12)']
  const chipBorders = ['rgba(110,231,183,0.3)', 'rgba(129,140,248,0.3)', 'rgba(251,146,160,0.3)', 'rgba(103,232,249,0.3)']
  const chipTexts = ['#6ee7b7', '#818cf8', '#fb929f', '#67e8f9']
  return (
    <div className="futuristic-resume-wrapper" style={{ height: '100%', overflow: 'hidden', fontSize: '10px' }}>
      <div className="bg-mesh"><div className="orb orb-1"></div><div className="orb orb-2"></div></div>
      <div className="page" style={{ padding: '16px' }}>
        <div className="status-bar" style={{ marginBottom: '10px' }}><span><span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#6ee7b7', marginRight: 5, verticalAlign: 'middle' }} />PROFILE ACTIVE · v4.7.2</span><span>CLEARANCE: OPEN</span></div>
        <div className="hero-card glass" style={{ marginBottom: '10px' }}>
          <div className="hero-layout">
            <div className="avatar-orb" style={{ width: '50px', height: '50px' }}><span className="avatar-initials" style={{ fontSize: '14px' }}>{initials}</span></div>
            <div className="hero-info">
              <div className="hero-name" style={{ fontSize: '18px' }}>{res.name}</div>
              <div className="hero-role" style={{ fontSize: '10px' }}>{res.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px 14px', fontSize: '8px', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {[['Mail', res.email], ['Tel', res.phone], ['Base', res.location]].map(([k, v], i) => (
              <span key={i}><span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginRight: 4 }}>{k}</span><span style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</span></span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
          {metrics.map((m, i) => (
            <div key={i} className="glass" style={{ padding: '8px 6px', textAlign: 'center' as const, borderRadius: 8 }}>
              <div style={{ fontSize: '16px', fontWeight: 300, background: 'linear-gradient(135deg, #6ee7b7, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.value}</div>
              <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div className="bento" style={{ gap: '8px' }}>
          <div className="bento-card bento-full glass" style={{ padding: '12px' }}>
            <div className="card-label cl-mint">Profile Summary</div>
            <div className="summary-text" style={{ fontSize: '9px' }}>{res.summary}</div>
          </div>
          <div className="bento-card bento-full glass" style={{ padding: '12px' }}>
            <div className="card-label cl-indigo">Experience</div>
            {res.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 8, borderBottom: i < res.experience.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#f0f6fc' }}>{exp.title}</span>
                  <span style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: '8px', color: '#6ee7b7', fontWeight: 500 }}>{exp.company}</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginTop: 4 }}>{exp.description}</div>
              </div>
            ))}
          </div>
          <div className="bento-card glass" style={{ padding: '12px' }}>
            <div className="card-label cl-rose">Toolkit</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
              {res.skills.map((s, i) => <span key={i} style={{ fontSize: '8px', background: chipColors[i % 4], border: `1px solid ${chipBorders[i % 4]}`, color: chipTexts[i % 4], padding: '3px 8px', borderRadius: 4 }}>{s}</span>)}
            </div>
          </div>
          <div className="bento-card glass" style={{ padding: '12px' }}>
            <div className="card-label cl-amber">Education</div>
            {res.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#f0f6fc' }}>{edu.degree}</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{edu.school}</div>
                <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)' }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
          <div className="bento-card bento-full glass" style={{ padding: '12px' }}>
            <div className="card-label cl-mint">Patents &amp; Publications</div>
            {[
              { title: 'Spatial UI Rendering System', type: 'Patent · US11,234,567 · 2023' },
              { title: 'Hand-Tracking Interaction in visionOS', type: 'Apple Tech Talk · WWDC 2023' },
              { title: 'Real-Time XR Mesh Compression', type: 'SIGGRAPH 2022 · ACM Digital Library' },
            ].map((pub, i) => (
              <div key={i} style={{ marginBottom: 6, paddingBottom: 5, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#f0f6fc' }}>{pub.title}</div>
                <div style={{ fontSize: '7px', color: '#6ee7b7' }}>{pub.type}</div>
              </div>
            ))}
          </div>
          <div className="bento-card glass" style={{ padding: '12px' }}>
            <div className="card-label cl-indigo">Awards</div>
            <div style={{ fontSize: '8px', marginBottom: 5 }}><span style={{ color: '#818cf8', fontWeight: 600 }}>Apple Design Award</span><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}> · 2023</span></div>
            <div style={{ fontSize: '8px', marginBottom: 5 }}><span style={{ color: '#818cf8', fontWeight: 600 }}>GDC Best XR Experience</span><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}> · 2022</span></div>
            <div style={{ fontSize: '8px', marginBottom: 5 }}><span style={{ color: '#818cf8', fontWeight: 600 }}>Unity Award — Graphics</span><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '7px' }}> · 2021</span></div>
          </div>
        </div>
        <div style={{ textAlign: 'center' as const, marginTop: 10, padding: '8px', fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px' }}>
          <span style={{ background: 'linear-gradient(90deg, #6ee7b7, #818cf8, #fb929f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>{res.name.toUpperCase()}</span> · PROFILE INTERFACE · REFS ON REQUEST
        </div>
      </div>
    </div>
  )
}

// ─── EDITOR PAGE PREVIEW MAP ───────────────────────────────


export function Resume1EditorialLuxePreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'editorial_luxe')
  return (
    <div className="editorial-luxe-wrapper">
      <header>
        <div className="name-block">
          <h1>{res.name.split(' ')[0]} <span>{res.name.split(' ').slice(1).join(' ')}</span></h1>
          <div className="tagline">{res.role}</div>
        </div>
        <div className="contact-block">
          {res.location}<br />
          {res.phone}<br />
          <a href={`mailto:${res.email}`}>{res.email}</a><br />
          linkedin.com/in/elenavasquez
        </div>
      </header>

      <div className="summary">{res.summary}</div>

      <div style={{ display: 'flex', borderTop: '1px solid #e8e0d4', borderBottom: '1px solid #e8e0d4', margin: '0 0 16px' }}>
        {[['9+', 'Years Exp.'], ['180M+', 'Users Reached'], ['$4M', 'Budget Managed'], ['28%', 'Activation Lift']].map(([val, label], i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' as const, padding: '8px 4px', borderRight: i < 3 ? '1px solid #e8e0d4' : 'none' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>{val}</div>
            <div style={{ fontSize: '6.5px', color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="content">
        <main>
          <div className="section-title">Experience</div>

          {res.experience.map((exp, i) => (
            <div className="entry" key={i}>
              <div className="entry-header">
                <h3>{exp.title}</h3>
                <span className="dates">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="company">{exp.company} · {exp.location}</div>
              <ul>
                {exp.description.split('. ').map((bullet, bi) => (
                  <li key={bi}>{bullet}{bullet.endsWith('.') ? '' : '.'}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="section-title" style={{ marginTop: 14 }}>Selected Projects</div>
          {[
            { name: 'AI Workspace Assistant', co: 'Notion · 2023', desc: 'GPT-4 writing assistant — 2.1M activations in 60 days, #1 Product of the Week on ProductHunt.' },
            { name: 'Spotify Blend', co: 'Spotify · 2021', desc: 'Collaborative playlist merging two users\' tastes — 15M+ shares in first 30 days, featured in TechCrunch.' },
            { name: 'Search Quality Initiative', co: 'Google · 2017', desc: '+4.2% search satisfaction improvement across 12 verticals, impacting 2B+ daily queries.' },
          ].map((proj, i) => (
            <div className="entry" key={i}>
              <div className="entry-header"><h3>{proj.name}</h3></div>
              <div className="company">{proj.co}</div>
              <ul><li>{proj.desc}</li></ul>
            </div>
          ))}

          <div className="main-heading">
            <svg className="geo" viewBox="0 0 14 14" style={{ width: '12px', height: '12px' }}><rect fill="#1a1a2e" width="14" height="14" /></svg>
            <h2>Selected Projects</h2>
          </div>
          {[
            { name: 'Visual Search Engine', co: 'Wayfair · 2023', desc: 'Built image-similarity model powering 38% lift in product discovery for 22M monthly shoppers. Deployed on GPU cluster with 12ms P99 latency.' },
            { name: 'Real-Time Rec System', co: 'Netflix · 2021', desc: 'Personalization pipeline for 230M subscribers using two-tower neural network. Reduced cold-start problem by 44% for new user cohorts.' },
            { name: 'Alt-Data NLP Pipeline', co: 'Two Sigma · 2017', desc: 'Processed 500K+ financial documents daily with sentiment + entity extraction. Alpha signal contributed to $120M AUM strategy.' },
          ].map((proj, i) => (
            <div className="exp-item" key={i}>
              <div className="top-row"><h3>{proj.name}</h3></div>
              <div className="company">{proj.co}</div>
              <ul><li>{proj.desc}</li></ul>
            </div>
          ))}
        </main>

        <aside className="sidebar">
          <div className="section">
            <div className="section-title">Skills</div>
            <div className="skill-group"><h4>Strategy</h4><p>Roadmapping · OKRs · GTM · Competitive Analysis · Stakeholder Mgmt</p></div>
            <div className="skill-group"><h4>Analytics</h4><p>SQL · A/B Testing · Mixpanel · Amplitude · User Research</p></div>
            <div className="skill-group"><h4>Tools</h4><p>Figma · Jira · Linear · Looker · dbt · Notion</p></div>
          </div>

          <div className="section">
            <div className="section-title">Education</div>
            {res.education.map((edu, i) => (
              <div className="edu-item" key={i}>
                <h4>{edu.degree}</h4>
                <p>{edu.school}<br />{edu.endDate}</p>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-title">Achievements</div>
            <div className="edu-item">
              <h4>Top PM — New York, 2023</h4>
              <p>ProductHunt Community Award</p>
            </div>
            <div className="edu-item">
              <h4>Speaker — ProductCon 2022</h4>
              <p>"Data-Driven Onboarding at Scale"</p>
            </div>
            <div className="edu-item">
              <h4>Forbes 30 Under 30</h4>
              <p>Consumer Technology, 2021</p>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Certifications</div>
            <div className="edu-item">
              <h4>AWS Certified Solutions Architect</h4>
              <p>Amazon Web Services · 2022</p>
            </div>
            <div className="edu-item">
              <h4>Product Strategy</h4>
              <p>SVPG · 2020</p>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Languages</div>
            <div className="edu-item">
              <h4>English &mdash; Native</h4>
              <h4>Spanish &mdash; Fluent</h4>
              <h4>French &mdash; Conversational</h4>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export function Resume2DarkArchitectPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'dark_architect')
  return (
    <div className="dark-architect-wrapper">
      <div className="accent-bar"></div>
      <header>
        <div className="name">
          <h1><span className="first">{res.name.split(' ')[0]}</span> {res.name.split(' ').slice(1).join(' ')}</h1>
          <div className="role">{res.role}</div>
        </div>
        <div className="contact-grid">
          <div><span className="label">Location</span><br />{res.location}</div>
          <div><span className="label">Phone</span><br />{res.phone}</div>
          <div><span className="label">Email</span><br />{res.email}</div>
        </div>
      </header>

      <div className="summary-section">
        <p>{res.summary}</p>
      </div>

      <div className="body-content">
        <div className="main-col">
          <div className="section-label">Experience</div>
          {res.experience.map((exp, i) => (
            <div className="exp-entry" key={i}>
              <div className="exp-top">
                <h3>{exp.title}</h3>
                <span className="period">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="exp-company">{exp.company} <span className="dot"></span> {exp.location}</div>
              <ul>
                {exp.description.split('. ').map((bullet, bi) => (
                  <li key={bi}>{bullet}{bullet.endsWith('.') ? '' : '.'}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="side-col">
          <div className="side-section">
            <div className="section-label">Skills</div>
            <div className="tags">
              {res.skills.map((skill, i) => (
                <span className="tag" key={i}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="side-section">
            <div className="section-label">Education</div>
            {res.education.map((edu, i) => (
              <div className="edu-entry" key={i}>
                <h4>{edu.degree}</h4>
                <p>{edu.school}<br />{edu.endDate}</p>
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
  return (
    <div className="bauhaus-geometric-wrapper">
      <aside className="sidebar">
        <div className="avatar-placeholder">{res.name.split(' ').map(n => n[0]).join('')}</div>
        <h1>{res.name}</h1>
        <div className="role">{res.role}</div>

        <div className="sb-section">
          <div className="sb-heading">Contact</div>
          <div className="sb-contact">
            <p>{res.location}<br />
              {res.phone}<br />
              <a href={`mailto:${res.email}`}>{res.email}</a><br />
              linkedin.com/in/priyanair
            </p>
          </div>
        </div>

        <div className="sb-section">
          <div className="sb-heading">Expertise</div>
          {res.skills.map((skill, i) => (
            <div className="skill-bar-group" key={i}>
              <div className="label" style={{ fontSize: '10px', marginBottom: '2px', color: 'rgba(255,255,255,0.8)' }}>{skill}</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${95 - i * 5}%` }}></div></div>
            </div>
          ))}
        </div>

        <div className="sb-section">
          <div className="sb-heading">Education</div>
          {res.education.map((edu, i) => (
            <div className="sb-edu-item" key={i}>
              <h4>{edu.degree}</h4>
              <p>{edu.school} · {edu.endDate}</p>
            </div>
          ))}
        </div>

        <div className="sb-section">
          <div className="sb-heading">Certifications</div>
          <div className="sb-edu-item"><h4>Google ML Engineer</h4><p>Google Cloud · 2023</p></div>
          <div className="sb-edu-item"><h4>Deep Learning Specialization</h4><p>DeepLearning.AI · 2022</p></div>
          <div className="sb-edu-item"><h4>AWS Data Analytics</h4><p>Amazon · 2021</p></div>
        </div>

        <div className="sb-section">
          <div className="sb-heading">Languages</div>
          <div className="sb-edu-item"><h4>English — Native</h4><h4>Hindi — Fluent</h4><h4>Tamil — Conversational</h4></div>
        </div>
      </aside>

      <main className="main">
        <div className="main-heading">
          <svg className="geo" viewBox="0 0 14 14" style={{ width: '12px', height: '12px' }}><circle fill="#e8634a" cx="7" cy="7" r="7" /></svg>
          <h2>Profile</h2>
        </div>
        <div className="summary-block">{res.summary}</div>

        <div style={{ display: 'flex', gap: 6, margin: '12px 0 16px' }}>
          {[['8+', 'Years Exp.'], ['230M+', 'Users Impacted'], ['3', 'Papers Published'], ['40%', 'Discovery Lift']].map(([val, label], i) => (
            <div key={i} style={{ flex: 1, background: i % 2 === 0 ? '#1a1a2e' : '#e8634a', borderRadius: 4, padding: '8px 6px', textAlign: 'center' as const }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: 'Helvetica Neue, sans-serif' }}>{val}</div>
              <div style={{ fontSize: '6.5px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="main-heading">
          <svg className="geo" viewBox="0 0 14 14" style={{ width: '12px', height: '12px' }}><polygon fill="#f0c75e" points="7,0 14,14 0,14" /></svg>
          <h2>Experience</h2>
        </div>
        {res.experience.map((exp, i) => (
          <div className="exp-item" key={i}>
            <div className="top-row">
              <h3>{exp.title}</h3>
              <span className="dates">{exp.startDate} — {exp.endDate}</span>
            </div>
            <div className="company">{exp.company} · {exp.location}</div>
            <ul>
              {exp.description.split('. ').map((bullet, bi) => (
                <li key={bi}>{bullet}{bullet.endsWith('.') ? '' : '.'}</li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  )
}

export function Resume4SoftPastelPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'soft_pastel')
  return (
    <div className="soft_pastel-wrapper">

      <header>
        <h1>{res.name}</h1>
        <div className="role">Healthcare UX Researcher</div>
        <div className="contact-pills">
          <span className="pill"><span className="icon">📍</span>Portland, OR</span>
          <span className="pill"><span className="icon">📱</span>(555) 219-4087</span>
          <span className="pill"><span className="icon">✉️</span>olivia.park@email.com</span>
          <span className="pill"><span className="icon">🔗</span>oliviapark.design</span>
        </div>
      </header>

      <div className="divider"><h2>About</h2></div>
      <p className="summary">
        UX researcher specializing in healthcare and digital health products. 7 years of experience
        conducting mixed-methods research that shapes products used by millions of patients and clinicians.
        Passionate about designing accessible, equitable experiences that improve health outcomes.
      </p>

      <div className="divider"><h2>Core Skills</h2></div>
      <div className="skills-ribbon">
        <span className="skill-chip rose">User Interviews</span>
        <span className="skill-chip sage">Usability Testing</span>
        <span className="skill-chip lav">Survey Design</span>
        <span className="skill-chip rose">Journey Mapping</span>
        <span className="skill-chip sage">Accessibility (WCAG)</span>
        <span className="skill-chip lav">Quantitative Analysis</span>
        <span className="skill-chip rose">Figma & Miro</span>
        <span className="skill-chip sage">HIPAA Compliance</span>
        <span className="skill-chip lav">Stakeholder Presentations</span>
      </div>

      <div className="divider"><h2>Experience</h2></div>

      <div className="exp-card c1">
        <div className="top">
          <h3>Senior UX Researcher</h3>
          <span className="dates">2022 — Present</span>
        </div>
        <div className="company">Epic Systems · Portland, OR</div>
        <ul>
          <li>Lead research for patient-facing MyChart features used by 190M+ activated patients</li>
          <li>Conducted 200+ user sessions across 15 health systems to redesign medication management</li>
          <li>Reduced appointment scheduling drop-off by 34% through iterative prototype testing</li>
        </ul>
      </div>

      <div className="exp-card c2">
        <div className="top">
          <h3>UX Researcher</h3>
          <span className="dates">2019 — 2022</span>
        </div>
        <div className="company">One Medical · San Francisco, CA</div>
        <ul>
          <li>Built and scaled research operations from ad-hoc studies to structured program with 40+ studies/year</li>
          <li>Designed telehealth experience research framework adopted across all product teams</li>
          <li>Identified accessibility barriers leading to WCAG 2.1 AA compliance across mobile app</li>
        </ul>
      </div>

      <div className="exp-card c3">
        <div className="top">
          <h3>Junior UX Researcher</h3>
          <span className="dates">2017 — 2019</span>
        </div>
        <div className="company">Kaiser Permanente · Oakland, CA</div>
        <ul>
          <li>Conducted ethnographic studies in 8 clinical settings to understand EHR workflows</li>
          <li>Co-created personas and journey maps used to secure $2M product investment</li>
        </ul>
      </div>

      <div className="divider"><h2>Education & More</h2></div>

      <div className="two-col">
        <div>
          <div className="edu-card">
            <h3>M.S. Human-Computer Interaction</h3>
            <p>Carnegie Mellon University · 2017</p>
          </div>
          <div className="edu-card">
            <h3>B.A. Psychology & Design</h3>
            <p>University of Michigan · 2015</p>
          </div>

          <h4 style={{ "fontFamily": "'Lora',serif", "fontSize": "13px", "color": "var(--rose)", "letterSpacing": "2px", "textTransform": "uppercase", "margin": "24px 0 12px" }}>Volunteering</h4>
          <div className="vol-item">
            <h4>Code for America — UX Lead</h4>
            <p>Redesigned public benefits application for low-income families</p>
          </div>
          <div className="vol-item">
            <h4>AIGA Portland — Mentorship Chair</h4>
            <p>Pair early-career designers with senior mentors in healthcare</p>
          </div>
        </div>

        <div>
          <h4 style={{ "fontFamily": "'Lora',serif", "fontSize": "13px", "color": "var(--rose)", "letterSpacing": "2px", "textTransform": "uppercase", "marginBottom": "12px" }}>Awards & Speaking</h4>
          <ul className="awards-list">
            <li><span className="award-dot r"></span> UXPA International Best Paper 2023</li>
            <li><span className="award-dot s"></span> Speaker, HIMSS Conference 2022</li>
            <li><span className="award-dot l"></span> Fast Company Innovation by Design Finalist</li>
            <li><span className="award-dot r"></span> Epic Research Excellence Award 2024</li>
            <li><span className="award-dot s"></span> Keynote, DesignOps Summit 2021</li>
          </ul>
        </div>
      </div>

    </div>
  )
}

export function Resume5SwissGridPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'swiss_grid')
  return (
    <div className="swiss_grid-wrapper">

      <div className="top-bar">
        <div>
          <h1>{res.name}</h1>
          <div className="subtitle">Strategy &amp; Management Consultant</div>
        </div>
        <div className="top-contact">
          <strong>Chicago, IL</strong><br />
          (555) 801-3456<br />
          t.keller@email.com<br />
          linkedin.com/in/tkeller
        </div>
      </div>

      <div className="body-grid">

        <div className="row-label"><h2>Profile</h2></div>
        <div className="row-content">
          <p className="summary-text">
            Management consultant with 10+ years advising Fortune 500 companies on digital transformation,
            operational efficiency, and growth strategy. Trusted advisor to C-suite leaders across technology,
            financial services, and healthcare. Known for synthesizing complex data into clear strategic recommendations
            that drive measurable outcomes.
          </p>
        </div>


        <div className="row-label"><h2>Experience</h2></div>
        <div className="row-content">
          <div className="exp-block">
            <div className="exp-meta">
              <h3>Principal Consultant</h3>
              <span className="period">2021 — Present</span>
            </div>
            <div className="exp-org">McKinsey & Company <span className="sep"></span> <span className="loc">Chicago, IL</span></div>
            <ul>
              <li>Lead digital transformation engagements for 3 Fortune 100 clients with combined revenue of $85B</li>
              <li>Designed operating model restructure delivering $120M in annual cost savings for major bank</li>
              <li>Built and manage team of 12 consultants; promoted 4 to engagement manager within 2 years</li>
              <li>Authored firm-wide knowledge asset on AI adoption strategy downloaded 2,000+ times internally</li>
            </ul>
          </div>

          <div className="exp-block">
            <div className="exp-meta">
              <h3>Senior Associate</h3>
              <span className="period">2018 — 2021</span>
            </div>
            <div className="exp-org">McKinsey & Company <span className="sep"></span> <span className="loc">New York, NY</span></div>
            <ul>
              <li>Led workstreams on 15+ engagements across tech, healthcare, and private equity due diligence</li>
              <li>Developed pricing optimization model increasing client margins by 8 percentage points</li>
              <li>Selected as facilitator for firm's global leadership development program</li>
            </ul>
          </div>

          <div className="exp-block">
            <div className="exp-meta">
              <h3>Business Analyst</h3>
              <span className="period">2015 — 2018</span>
            </div>
            <div className="exp-org">Bain & Company <span className="sep"></span> <span className="loc">Boston, MA</span></div>
            <ul>
              <li>Supported M&A due diligence on 8 deals totaling $4.2B in transaction value</li>
              <li>Built customer segmentation framework adopted by $3B consumer goods client</li>
            </ul>
          </div>
        </div>


        <div className="row-label"><h2>Expertise</h2></div>
        <div className="row-content">
          <div className="skills-grid">
            <div className="skill-col">
              <h4>Strategy</h4>
              <p>Digital Transformation, Growth Strategy, M&A Due Diligence, Market Entry, Operating Model Design</p>
            </div>
            <div className="skill-col">
              <h4>Analytical</h4>
              <p>Financial Modeling, Pricing Optimization, Data Analytics, Competitive Benchmarking, Scenario Planning</p>
            </div>
            <div className="skill-col">
              <h4>Leadership</h4>
              <p>Executive Communication, Team Development, Stakeholder Alignment, Workshop Facilitation, Change Management</p>
            </div>
          </div>
        </div>


        <div className="row-label"><h2>Education</h2></div>
        <div className="row-content">
          <div className="edu-grid">
            <div className="edu-item">
              <h3>MBA</h3>
              <div className="school">Harvard Business School</div>
              <div className="year">2018 · Baker Scholar</div>
            </div>
            <div className="edu-item">
              <h3>B.A. Economics & Mathematics</h3>
              <div className="school">Williams College</div>
              <div className="year">2015 · Summa Cum Laude</div>
            </div>
          </div>
        </div>


        <div className="row-label"><h2>More</h2></div>
        <div className="row-content">
          <div className="extras-grid">
            <div className="extras-group">
              <h4>Publications</h4>
              <ul>
                <li><strong>HBR:</strong> "Rethinking Digital Transformation for the AI Era" (2024)</li>
                <li><strong>McKinsey Quarterly:</strong> "The CFO's Guide to GenAI ROI" (2023)</li>
                <li><strong>MIT Sloan Review:</strong> "Operating Models for the Platform Economy" (2022)</li>
              </ul>
            </div>
            <div className="extras-group">
              <h4>Board & Advisory</h4>
              <ul>
                <li><strong>Board Member</strong> — Chicago Digital Health Initiative</li>
                <li><strong>Advisor</strong> — Two Series-B SaaS startups</li>
                <li><strong>CFA Charterholder</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bar">References available upon request</div>

    </div>
  )
}

export function Resume6BrutalistRawPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'brutalist_raw')
  return (
    <div className="brutalist_raw-wrapper">

      <div className="corner-block"></div>

      <header>
        <h1>{res.name}</h1>
        <div className="role-bar">CREATIVE TECHNOLOGIST</div>
        <div className="contact-row">
          <span>Los Angeles, CA</span>
          <span>(555) 739-0214</span>
          <span>kai@nakamura.dev</span>
          <span>nakamura.dev</span>
        </div>
      </header>

      <div className="section">
        <div className="section-head">ABOUT</div>
        <p className="summary">
          Creative technologist and full-stack developer blending art, code, and emerging tech to build
          immersive digital experiences. 8 years crafting interactive installations, WebGL experiments,
          and creative tools for brands like Nike, Spotify, and the Museum of Modern Art. Obsessed with
          pushing the boundaries of what the browser can do.
        </p>
      </div>

      <div className="section">
        <div className="section-head">EXPERIENCE</div>

        <div className="exp-entry">
          <div className="exp-top">
            <h3>LEAD CREATIVE TECHNOLOGIST</h3>
            <span className="dates">2022 — PRESENT</span>
          </div>
          <div className="exp-org">Active Theory · Los Angeles, CA</div>
          <ul>
            <li>Directed technical development of award-winning interactive experiences for Nike and Google</li>
            <li>Built real-time 3D product configurator with Three.js serving 4M+ sessions monthly</li>
            <li>Won 3 Awwwards Site of the Year nominations and 1 FWA Grand Prix</li>
            <li>Mentored team of 6 developers on WebGL, shaders, and creative coding techniques</li>
          </ul>
        </div>

        <div className="exp-entry">
          <div className="exp-top">
            <h3>SENIOR DEVELOPER</h3>
            <span className="dates">2019 — 2022</span>
          </div>
          <div className="exp-org">Resn · Amsterdam, NL</div>
          <ul>
            <li>Developed immersive WebGL experiences for Spotify Wrapped reaching 120M+ users</li>
            <li>Created generative art system for Adidas campaign generating 1M+ unique NFT artworks</li>
            <li>Optimized rendering pipeline achieving 60fps on mobile for complex 3D scenes</li>
          </ul>
        </div>

        <div className="exp-entry">
          <div className="exp-top">
            <h3>CREATIVE DEVELOPER</h3>
            <span className="dates">2017 — 2019</span>
          </div>
          <div className="exp-org">Jam3 · Toronto, CA</div>
          <ul>
            <li>Built interactive installation for MoMA exhibition visited by 200K+ people</li>
            <li>Developed AR experiences using WebXR for Facebook's Spark AR platform</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="section-head">SKILLS</div>
        <div className="skills-raw">
          <div className="skill-cell">
            <div className="name">Three.js / WebGL</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">GLSL Shaders</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">TypeScript</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">React / Next.js</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">Creative Coding</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">WebXR / AR</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">Motion Design</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block"></div><div className="block"></div></div>
          </div>
          <div className="skill-cell">
            <div className="name">Blender / C4D</div>
            <div className="level"><div className="block filled"></div><div className="block filled"></div><div className="block filled"></div><div className="block"></div><div className="block"></div></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">EDUCATION</div>
        <div className="edu-row">
          <div className="edu-item">
            <h4>MFA DESIGN & TECHNOLOGY</h4>
            <p>Parsons School of Design<br /><span className="year">2017</span></p>
          </div>
          <div className="edu-item">
            <h4>B.S. COMPUTER SCIENCE</h4>
            <p>University of British Columbia<br /><span className="year">2015</span></p>
          </div>
        </div>
      </div>

      <div className="footer-strip">PORTFOLIO → NAKAMURA.DEV</div>

    </div>
  )
}

export function Resume7WarmEarthPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'warm_earth')
  return (
    <div className="warm_earth-wrapper">

      <div className="hero">
        <div className="hero-inner">
          <div>
            <h1>{res.name}</h1>
            <div className="tagline">Brand Strategist & Marketing Director</div>
          </div>
          <div className="hero-contact">
            <strong>Atlanta, GA</strong><br />
            (555) 482-1093<br />
            amara.osei@email.com<br />
            linkedin.com/in/amaraosei
          </div>
        </div>
      </div>

      <div className="body-wrap">
        <div className="sec-head"><div className="dot terra"></div><h2>About</h2></div>
        <div className="summary-wrap">
          <p>
            Storyteller-turned-strategist with <strong>10+ years</strong> building culturally resonant brands
            for Fortune 500 companies and high-growth startups. Expert in brand positioning, consumer insights,
            and integrated campaign strategy. Led rebrands generating <strong>$200M+</strong> in measurable brand value
            and campaigns reaching <strong>500M+ impressions</strong>.
          </p>
        </div>

        <div className="sec-head"><div className="dot terra"></div><h2>Experience</h2></div>
        <div className="timeline">
          <div className="tl-entry">
            <div className="tl-top">
              <h3>VP, Brand Strategy</h3>
              <span className="dates">2022 — Present</span>
            </div>
            <div className="tl-org">Mailchimp (Intuit) · Atlanta, GA</div>
            <ul>
              <li>Lead 18-person brand team responsible for positioning, creative strategy, and brand governance</li>
              <li>Orchestrated brand refresh increasing unaided brand awareness by 32% in 12 months</li>
              <li>Launched "Made With Mailchimp" campaign reaching 500M+ impressions across 6 channels</li>
              <li>Established brand measurement framework adopted across Intuit's portfolio brands</li>
            </ul>
          </div>

          <div className="tl-entry">
            <div className="tl-top">
              <h3>Director of Brand Marketing</h3>
              <span className="dates">2019 — 2022</span>
            </div>
            <div className="tl-org">Glossier · New York, NY</div>
            <ul>
              <li>Built brand strategy for 3 product line launches generating $45M in first-year revenue</li>
              <li>Developed community-driven marketing approach growing social following from 1.2M to 3.8M</li>
              <li>Created influencer partnership model achieving 8× industry-average engagement rates</li>
            </ul>
          </div>

          <div className="tl-entry">
            <div className="tl-top">
              <h3>Senior Brand Strategist</h3>
              <span className="dates">2016 — 2019</span>
            </div>
            <div className="tl-org">Wieden+Kennedy · Portland, OR</div>
            <ul>
              <li>Developed brand platforms for Nike, Coca-Cola, and Samsung global campaigns</li>
              <li>Won Gold Cannes Lion for Nike "Dream Further" brand narrative work</li>
            </ul>
          </div>
        </div>

        <div className="bottom-grid">
          <div>
            <div className="sec-head"><div className="dot olive"></div><h2>Skills</h2></div>
            <div className="skill-group">
              <h4>Strategy</h4>
              <div className="skill-tags">
                <span>Brand Positioning</span>
                <span>Consumer Insights</span>
                <span>Market Research</span>
                <span>Competitive Analysis</span>
              </div>
            </div>
            <div className="skill-group">
              <h4>Creative</h4>
              <div className="skill-tags">
                <span>Campaign Strategy</span>
                <span>Storytelling</span>
                <span>Content Strategy</span>
                <span>Social Media</span>
              </div>
            </div>
            <div className="skill-group">
              <h4>Leadership</h4>
              <div className="skill-tags">
                <span>Team Building</span>
                <span>P&L Management</span>
                <span>Agency Relations</span>
              </div>
            </div>
          </div>

          <div>
            <div className="sec-head"><div className="dot earth"></div><h2>Education</h2></div>
            <div className="edu-card">
              <h4>MBA, Marketing</h4>
              <p>NYU Stern School of Business<br /><span className="yr">2016</span></p>
            </div>
            <div className="edu-card">
              <h4>B.A. English & African Studies</h4>
              <p>Spelman College<br /><span className="yr">2013</span></p>
            </div>

            <div className="sec-head" style={{ "marginTop": "24px" }}><div className="dot terra"></div><h2>Recognition</h2></div>
            <div className="award-item">
              <div className="aw-icon">★</div>
              <p><strong>Cannes Gold Lion</strong> — Nike "Dream Further"</p>
            </div>
            <div className="award-item">
              <div className="aw-icon">★</div>
              <p><strong>Adweek Brand Genius</strong> — 2023 Honoree</p>
            </div>
            <div className="award-item">
              <div className="aw-icon">★</div>
              <p><strong>Forbes 30 Under 30</strong> — Marketing & Advertising</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export function Resume8MonochromePrecisionPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'monochrome_precision')
  return (
    <div className="monochrome_precision-wrapper">

      <header>
        <div className="name-area">
          <h1>{res.name}</h1>
          <div className="role">Clinical Psychologist</div>
        </div>
        <div className="contact-area">
          <div className="c-item"><span className="c-label">Location</span>Denver, CO</div>
          <div className="c-item"><span className="c-label">Phone</span>(555) 316-7842</div>
          <div className="c-item"><span className="c-label">Email</span>lhoffman@email.com</div>
          <div className="c-item"><span className="c-label">LinkedIn</span>linkedin.com/in/lenahoffman</div>
        </div>
      </header>

      <hr className="big-rule" />

      <div className="summary-row">
        <div className="label-col">Profile</div>
        <div className="content-col">
          <p className="summary">
            Licensed clinical psychologist with 12 years of experience in cognitive behavioral therapy,
            trauma-informed care, and clinical research. Expertise in treating anxiety, PTSD, and mood disorders.
            Published researcher with 18 peer-reviewed articles. Passionate about reducing barriers to
            mental healthcare access through telehealth innovation and community programming.
          </p>
        </div>
      </div>

      <hr className="thin-rule" />

      <div className="data-row">
        <div className="label-col">Experience</div>
        <div className="content-col">
          <div className="exp-item">
            <div className="exp-line-1">
              <h3>Director of Clinical Services</h3>
              <span className="period">2021 — Present</span>
            </div>
            <div className="exp-line-2">Denver Health Behavioral Health · Denver, CO</div>
            <ul>
              <li>Oversee clinical operations for 24-provider outpatient behavioral health practice</li>
              <li>Launched telehealth program expanding access to 3,200+ rural patients annually</li>
              <li>Reduced average wait time for new patients from 6 weeks to 10 days through workflow redesign</li>
              <li>Implemented measurement-based care model improving clinical outcomes scores by 28%</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-line-1">
              <h3>Senior Clinical Psychologist</h3>
              <span className="period">2017 — 2021</span>
            </div>
            <div className="exp-line-2">VA Eastern Colorado Healthcare System · Aurora, CO</div>
            <ul>
              <li>Provided evidence-based treatment for PTSD and TBI to 200+ veteran patients annually</li>
              <li>Trained and supervised 12 psychology interns and postdoctoral fellows</li>
              <li>Led research study on CPT effectiveness published in Journal of Traumatic Stress</li>
            </ul>
          </div>

          <div className="exp-item">
            <div className="exp-line-1">
              <h3>Clinical Psychologist</h3>
              <span className="period">2013 — 2017</span>
            </div>
            <div className="exp-line-2">Massachusetts General Hospital · Boston, MA</div>
            <ul>
              <li>Conducted CBT and DBT for adults with anxiety, depression, and personality disorders</li>
              <li>Co-developed group therapy protocol adopted across 4 MGH satellite clinics</li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="thin-rule" />

      <div className="data-row">
        <div className="label-col">Expertise</div>
        <div className="content-col">
          <table className="skills-table">
            <tr>
              <td className="sk-cat">Clinical</td>
              <td className="sk-items">CBT, DBT, CPT, EMDR, Trauma-Informed Care, Psychological Assessment, Crisis Intervention</td>
            </tr>
            <tr>
              <td className="sk-cat">Research</td>
              <td className="sk-items">Clinical Trials, SPSS, R, Outcomes Measurement, IRB Protocol Development, Grant Writing</td>
            </tr>
            <tr>
              <td className="sk-cat">Leadership</td>
              <td className="sk-items">Program Development, Clinical Supervision, Telehealth Operations, Quality Improvement</td>
            </tr>
          </table>
        </div>
      </div>

      <hr className="thin-rule" />

      <div className="data-row">
        <div className="label-col">Education</div>
        <div className="content-col">
          <div className="edu-pair">
            <div className="edu-block">
              <h4>Psy.D. Clinical Psychology</h4>
              <p>University of Denver, GSPP</p>
              <span className="year">2013</span>
            </div>
            <div className="edu-block">
              <h4>B.A. Psychology</h4>
              <p>Wellesley College</p>
              <span className="year">2008</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="thin-rule" />

      <div className="data-row">
        <div className="label-col">Selected<br />Publications</div>
        <div className="content-col">
          <div className="pub-item">
            <strong>Hoffman, L.</strong>, et al. (2023). Telehealth-delivered CPT for PTSD: A randomized controlled trial. <em>Journal of Traumatic Stress, 36</em>(2), 412–425.
          </div>
          <div className="pub-item">
            <strong>Hoffman, L.</strong> & Rivera, M. (2021). Measurement-based care in community behavioral health. <em>Professional Psychology: Research and Practice, 52</em>(4), 318–329.
          </div>
          <div className="pub-item">
            <strong>Hoffman, L.</strong>, et al. (2019). Group CBT protocol for comorbid anxiety and depression. <em>Cognitive Therapy and Research, 43</em>(1), 89–102.
          </div>
        </div>
      </div>

      <div className="footer">Licensed · Colorado (PSY.0012847) · Massachusetts (PSY-28491)</div>

    </div>
  )
}

export function Resume9GradientHorizonPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'gradient_horizon')
  return (
    <div className="gradient_horizon-wrapper">

      <div className="header-gradient">
        <div className="header-inner">
          <div>
            <h1>{res.name}</h1>
            <div className="sub">DevOps & Cloud Infrastructure Engineer</div>
          </div>
          <div className="header-contact">
            Austin, TX<br />
            (555) 291-4068<br />
            <a href="#">j.rivera@email.com</a><br />
            <a href="#">linkedin.com/in/jrivera</a>
          </div>
        </div>
      </div>

      <div className="metric-strip">
        <div className="metric">
          <div className="num">99.99%</div>
          <div className="desc">Uptime SLA</div>
        </div>
        <div className="metric">
          <div className="num">$4.2M</div>
          <div className="desc">Cloud Savings</div>
        </div>
        <div className="metric">
          <div className="num">300+</div>
          <div className="desc">Services Managed</div>
        </div>
        <div className="metric">
          <div className="num">8</div>
          <div className="desc">Years Experience</div>
        </div>
      </div>

      <div className="body-content">
        <div className="sec-title">Profile</div>
        <p className="summary-text">
          Cloud infrastructure engineer specializing in designing and operating large-scale distributed
          systems on AWS and GCP. Deep expertise in Kubernetes orchestration, CI/CD automation, and
          infrastructure-as-code. Proven track record of improving system reliability while reducing
          infrastructure costs by 40%+ through architectural optimization.
        </p>

        <div className="sec-title">Experience</div>

        <div className="exp-card">
          <div className="row-1">
            <h3>Principal DevOps Engineer</h3>
            <span className="date-badge">2022 — Present</span>
          </div>
          <div className="org">Cloudflare · Austin, TX</div>
          <ul>
            <li>Architect infrastructure serving 20% of the web's HTTP traffic across 300+ global data centers</li>
            <li>Led migration to Kubernetes-based deployment reducing release cycle from days to minutes</li>
            <li>Designed cost optimization strategy saving $4.2M annually in cloud infrastructure spend</li>
            <li>Built observability platform using Prometheus, Grafana, and custom alerting reducing MTTR by 65%</li>
          </ul>
        </div>

        <div className="exp-card">
          <div className="row-1">
            <h3>Senior DevOps Engineer</h3>
            <span className="date-badge">2019 — 2022</span>
          </div>
          <div className="org">Confluent · Mountain View, CA</div>
          <ul>
            <li>Managed 200+ microservices infrastructure on AWS and GCP across 12 regions</li>
            <li>Implemented GitOps workflow with ArgoCD and Terraform reducing config drift by 95%</li>
            <li>Built internal developer platform serving 400+ engineers with self-service deployments</li>
          </ul>
        </div>

        <div className="exp-card">
          <div className="row-1">
            <h3>Cloud Engineer</h3>
            <span className="date-badge">2017 — 2019</span>
          </div>
          <div className="org">Capital One · McLean, VA</div>
          <ul>
            <li>Led cloud-native transformation migrating 80+ applications from on-prem to AWS</li>
            <li>Developed compliance-as-code framework for PCI-DSS achieving automated audit readiness</li>
          </ul>
        </div>

        <div className="split">
          <div>
            <div className="sec-title">Skills</div>
            <div className="skill-cluster">
              <h4>Cloud & Infra</h4>
              <div className="skill-pills">
                <span className="purple">AWS</span>
                <span className="purple">GCP</span>
                <span className="purple">Kubernetes</span>
                <span className="purple">Docker</span>
                <span className="purple">Terraform</span>
              </div>
            </div>
            <div className="skill-cluster">
              <h4>Automation</h4>
              <div className="skill-pills">
                <span className="teal">CI/CD</span>
                <span className="teal">ArgoCD</span>
                <span className="teal">GitHub Actions</span>
                <span className="teal">Ansible</span>
              </div>
            </div>
            <div className="skill-cluster">
              <h4>Observability</h4>
              <div className="skill-pills">
                <span className="purple">Prometheus</span>
                <span className="purple">Grafana</span>
                <span className="purple">Datadog</span>
                <span className="purple">OpenTelemetry</span>
              </div>
            </div>
            <div className="skill-cluster">
              <h4>Languages</h4>
              <div className="skill-pills">
                <span className="teal">Go</span>
                <span className="teal">Python</span>
                <span className="teal">Bash</span>
                <span className="teal">HCL</span>
              </div>
            </div>
          </div>

          <div>
            <div className="sec-title">Education</div>
            <div className="edu-block">
              <h4>M.S. Computer Science</h4>
              <p>Georgia Tech (OMSCS)<br /><span className="yr">2019</span></p>
            </div>
            <div className="edu-block">
              <h4>B.S. Information Technology</h4>
              <p>Virginia Tech<br /><span className="yr">2017</span></p>
            </div>

            <div className="sec-title">Certifications</div>
            <ul className="cert-list">
              <li><span className="cert-dot"></span> AWS Solutions Architect — Professional</li>
              <li><span className="cert-dot"></span> Certified Kubernetes Administrator (CKA)</li>
              <li><span className="cert-dot"></span> Google Cloud Professional Cloud Architect</li>
              <li><span className="cert-dot"></span> HashiCorp Terraform Associate</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export function Resume10ArtDecoRevivalPreview({ data }: PreviewProps) {
  const res = useDynamicData(data || {}, 'art_deco_revival')
  return (
    <div className="art_deco_revival-wrapper">

      <div className="deco-frame"></div>

      <div className="header-deco">
        <h1>{res.name}</h1>
        <div className="divider-line"></div>
        <div className="role">Investment Banking · Managing Director</div>
        <div className="contact-line">
          New York, NY <span className="sep">◆</span>
          (555) 704-8312 <span className="sep">◆</span>
          i.fontaine@email.com <span className="sep">◆</span>
          linkedin.com/in/ifontaine
        </div>
      </div>

      <div className="body-wrap">
        <div className="section-head"><h2>Profile</h2></div>
        <p className="summary-deco">
          Managing Director with 16 years in investment banking specializing in cross-border M&A,
          capital markets, and financial restructuring. Led advisory on $28B+ in completed transactions
          across technology, healthcare, and industrials. Known for building deep client relationships
          and delivering creative deal structures in complex situations.
        </p>

        <div className="section-head"><h2>Experience</h2></div>

        <div className="exp-entry">
          <div className="exp-header">
            <h3>Managing Director, M&A</h3>
            <span className="dates">2020 — Present</span>
          </div>
          <div className="exp-org">Goldman Sachs · New York, NY</div>
          <ul>
            <li>Lead cross-border M&A advisory practice for technology sector with $12B+ in active mandates</li>
            <li>Advised on $8.4B acquisition of European SaaS platform — largest tech deal of 2023</li>
            <li>Manage team of 28 bankers across New York, London, and Hong Kong offices</li>
            <li>Grew client revenue 45% by developing strategic relationships with PE sponsors</li>
          </ul>
        </div>

        <div className="exp-entry">
          <div className="exp-header">
            <h3>Executive Director</h3>
            <span className="dates">2016 — 2020</span>
          </div>
          <div className="exp-org">Morgan Stanley · New York, NY</div>
          <ul>
            <li>Executed 20+ M&A and capital markets transactions totaling $15B in enterprise value</li>
            <li>Structured $3.2B leveraged buyout for industrial conglomerate with complex carve-out</li>
            <li>Named to internal "High Potential Leaders" program — top 2% of VP/ED cohort</li>
          </ul>
        </div>

        <div className="exp-entry">
          <div className="exp-header">
            <h3>Vice President</h3>
            <span className="dates">2012 — 2016</span>
          </div>
          <div className="exp-org">Lazard · Paris / New York</div>
          <ul>
            <li>Advised European corporates on US market entry and transatlantic M&A transactions</li>
            <li>Led financial restructuring advisory for €2.1B distressed media conglomerate</li>
          </ul>
        </div>

        <div className="section-head"><h2>Credentials</h2></div>

        <div className="three-col">
          <div className="col-block">
            <h4>Education</h4>
            <div className="edu-mini">
              <h5>MBA, Finance</h5>
              <p>INSEAD<br /><span className="yr">2012</span></p>
            </div>
            <div className="edu-mini">
              <h5>M.S. Financial Engineering</h5>
              <p>Sciences Po Paris<br /><span className="yr">2009</span></p>
            </div>
          </div>

          <div className="col-block">
            <h4>Expertise</h4>
            <ul>
              <li>Cross-Border M&A</li>
              <li>Capital Markets</li>
              <li>Financial Restructuring</li>
              <li>LBO Structuring</li>
              <li>Fairness Opinions</li>
              <li>Client Origination</li>
            </ul>
          </div>

          <div className="col-block">
            <h4>Recognition</h4>
            <ul>
              <li>Dealogic Top 10 Tech M&A Advisor 2023</li>
              <li>Financial Times "Rising Star in Banking"</li>
              <li>Women in Finance Award 2022</li>
              <li>CFA Charterholder</li>
              <li>Series 7, 63, 79</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-deco">
        <p>References and transaction list available upon request</p>
      </div>

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
  brutalist_raw: Resume6BrutalistRawPreview,
  warm_earth: Resume7WarmEarthPreview,
  monochrome_precision: Resume8MonochromePrecisionPreview,
  gradient_horizon: Resume9GradientHorizonPreview,
  art_deco_revival: Resume10ArtDecoRevivalPreview,
  phd: PhdResumePreview,

  classic: ClassicPreview,
  minimalist: MinimalistPreview,
  sidebar: SidebarPreview,
  creative: CreativePreview,
  dark: DarkPreview,
  editorial: EditorialPreview,
  bold: BoldPreview,
  teal: TealPreview,
  timeline: TimelinePreview,
  grande: GrandePreview,
  blob: BlobPreview,
  split: SplitPreview,
  obsidian: ObsidianPreview,
  ivory: IvoryPreview,
  noir: NoirPreview,
  rose: RosePreview,
  executive: ExecutivePreview,
  terminal: TerminalPreview,
  healthcare: HealthcarePreview,

  scifi: ScifiPreview,
  sophisticated: SophisticatedPreview,

  futuristic: FuturisticPreview,
}
