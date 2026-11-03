import { RetrievedSource } from '../types/chat';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Admissions' | 'Academics' | 'Placements' | 'Campus Life' | 'Examinations' | 'Administration';
  section: string;
  sourceUrl: string;
  content: string;
  keywords: string[];
}

export const AEC_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'aec-overview-01',
    title: 'AEC Institutional Overview & Accreditations (Brochure 2024-25)',
    category: 'Administration',
    section: 'Section 1.1 - Establishment & Affiliations',
    sourceUrl: 'http://www.aecwb.edu.in/about-us',
    keywords: ['established', 'estd', '1998', 'makaut', 'aicte', 'wbut', 'location', 'asansol', 'kanyapur', 'about'],
    content: `Asansol Engineering College (AEC) was established in the year 1998 under the aegis of JIS Group and Techno India Group joint initiative. It is approved by the All India Council for Technical Education (AICTE), New Delhi, and affiliated to Maulana Abul Kalam Azad University of Technology (MAKAUT), formerly known as WBUT. The campus is sprawling across Vivekananda Sarani, Kanyapur, Asansol - 713305, Paschim Bardhaman, West Bengal. AEC is one of the premier private engineering colleges in West Bengal with NBA accredited engineering streams.`
  },
  {
    id: 'aec-courses-02',
    title: 'Undergraduate & Postgraduate Degree Programs & Intake (Prospectus 2024)',
    category: 'Academics',
    section: 'Section 2.0 - Academic Programs & Seat Matrix',
    sourceUrl: 'http://www.aecwb.edu.in/academics/departments',
    keywords: ['courses', 'branches', 'departments', 'btech', 'cse', 'it', 'ece', 'ee', 'me', 'ce', 'aiml', 'iot', 'mca', 'bca', 'bba', 'seats', 'intake'],
    content: `AEC offers the following 4-Year B.Tech degree programs affiliated to MAKAUT:
1. Computer Science & Engineering (CSE) - 180 seats
2. Computer Science & Engineering (AI & ML) - 60 seats
3. Computer Science & Engineering (Internet of Things) - 60 seats
4. Information Technology (IT) - 90 seats
5. Electronics & Communication Engineering (ECE) - 120 seats
6. Electrical Engineering (EE) - 90 seats
7. Mechanical Engineering (ME) - 60 seats
8. Civil Engineering (CE) - 60 seats

Postgraduate and Professional Programs:
- Master of Computer Applications (MCA) - 60 seats (2-Year)
- Bachelor of Computer Applications (BCA) - 90 seats (3-Year / 4-Year NEP)
- Bachelor of Business Administration (BBA) - 60 seats
- M.Tech in Electrical Engineering & ECE`
  },
  {
    id: 'aec-admission-03',
    title: 'B.Tech & Lateral Entry Admission Guidelines (Session 2024-2025)',
    category: 'Admissions',
    section: 'Section 3.1 - Eligibility Criteria & Counseling Process',
    sourceUrl: 'http://www.aecwb.edu.in/admission',
    keywords: ['admission', 'eligibility', 'wbjee', 'jee main', 'jelet', 'criteria', 'cutoff', 'counseling', 'rank', 'process', 'apply'],
    content: `B.Tech Admission Eligibility:
- Candidates must pass 10+2 examination with Physics and Mathematics as compulsory subjects along with Chemistry / Biotechnology / Biology / Computer Science.
- Minimum marks: 45% in the combination of the 3 subjects (40% for SC/ST/OBC-A/OBC-B candidates). Must also pass English with at least 30%.
- Admission Routes: 90% seats are allotted through Centralized Online Counseling conducted by WBJEEB based on WBJEE rank; 10% seats are allotted through JEE Main rank via WBJEEB counseling.
- Lateral Entry: 2nd year B.Tech admission is available for 3-year Diploma holders and B.Sc graduates through JELET examination and WBJEEB counseling.
- MCA Admissions: Conducted through WB JECA rank list.`
  },
  {
    id: 'aec-fees-04',
    title: 'Tuition Fee Structure & Payment Schedule (Academic Year 2024-2025)',
    category: 'Admissions',
    section: 'Section 3.4 - Schedule of Fees and Dues',
    sourceUrl: 'http://www.aecwb.edu.in/fees',
    keywords: ['fee', 'fees', 'tuition', 'cost', 'payment', 'semester fee', 'hostel fee', 'structure', 'charges', 'installment'],
    content: `The approved semester fee for B.Tech programs at Asansol Engineering College is approx:
- 1st Semester Admission & Tuition Fee: approx ₹55,000 to ₹62,000 (including one-time caution deposit and university registration).
- 2nd through 8th Semesters: approx ₹45,000 to ₹48,000 per semester.
- Total 4-Year B.Tech Tuition: approximately ₹3,80,000 to ₹4,10,000 (as per West Bengal Fee Regulatory Committee guidelines).
- Hostel Accommodation & Mess Charges: approx ₹28,000 to ₹32,000 per semester (includes lodging, food, Wi-Fi, and 24x7 power backup).
- Note: Examination and MAKAUT registration fees are payable directly to the university portal.`
  },
  {
    id: 'aec-placements-05',
    title: 'Training & Placement Department Report (Batch 2023-2024)',
    category: 'Placements',
    section: 'Section 4.0 - Placement Statistics & Top Recruiters',
    sourceUrl: 'http://www.aecwb.edu.in/placement',
    keywords: ['placement', 'placements', 'jobs', 'salary', 'package', 'highest package', 'average package', 'tpo', 'tcs', 'wipro', 'cognizant', 'infosys', 'capgemini', 'recruiters'],
    content: `The Training and Placement Cell (T&P) at AEC conducts pre-placement aptitude training, technical mock interviews, soft skills development, and industrial visits.
Key Placement Highlights:
- Over 78% eligible students placed across leading software, product, and core engineering firms.
- Highest International/National CTC: ₹18.5 LPA to ₹24 LPA in recent hiring seasons.
- Average CTC: ₹4.8 LPA to ₹5.2 LPA.
- Major Recruiters: Tata Consultancy Services (TCS), Cognizant Technology Solutions, Wipro Technologies, Infosys, Capgemini, IBM India, Hexaware, Persistent Systems, Mindtree, Virtusa, L&T Infotech, Pinnacle Infotech, and Tech Mahindra.
- On-campus coding clubs and HackerRank / LeetCode bootcamps run throughout the 5th to 7th semesters.`
  },
  {
    id: 'aec-hostel-campus-06',
    title: 'Campus Infrastructure, Central Library & Hostel Facilities',
    category: 'Campus Life',
    section: 'Section 5.2 - Residential and Academic Facilities',
    sourceUrl: 'http://www.aecwb.edu.in/facilities',
    keywords: ['hostel', 'library', 'campus', 'facilities', 'gym', 'sports', 'wifi', 'cafeteria', 'canteen', 'boys hostel', 'girls hostel', 'room'],
    content: `AEC campus features modern amenities designed for holistic student life:
- Hostels: Separate multi-storeyed hostels for boys and girls with warden supervision, security CCTV, study halls, high-speed Wi-Fi, hot water in winter, and hygienic multi-cuisine mess food.
- Central Library: Houses 70,000+ volumes, 2,500+ CD-ROMs, online subscriptions to IEEE Xplore, DELNET, ScienceDirect, and a fully automated air-conditioned reading room with e-resource kiosks.
- Computing Facilities: 1,000+ high-end networked terminals, high-speed 1 Gbps dedicated leased line internet.
- Sports & Recreation: Large football/cricket ground, basketball court, volleyball court, table tennis, and indoor gym.
- Medical & Bank: On-campus medical room with visiting doctor and tie-ups with nearby Asansol hospitals. ATM facility adjacent to main gate.`
  },
  {
    id: 'aec-clubs-events-07',
    title: 'Student Life, Technical & Cultural Festivals, Student Chapters',
    category: 'Campus Life',
    section: 'Section 6.1 - Co-curricular & Extra-Curricular Activities',
    sourceUrl: 'http://www.aecwb.edu.in/campus-life',
    keywords: ['fest', 'clubs', 'events', 'legenza', 'anwesan', 'gdsc', 'robotics', 'cultural', 'tech fest', 'hackathon', 'coding'],
    content: `Student life at Asansol Engineering College is vibrant with multiple student bodies:
- 'LEGENZA': The flagship annual cultural festival featuring music bands, choreography, fashion shows, and drama competitions.
- 'ANWESAN': The annual inter-college technical extravaganza featuring Hackathons, Robo-Wars, Circuit Design, Web-a-Thon, and Gaming leagues.
- Active Student Societies:
  * Google Developer Student Club (GDSC AEC)
  * IEEE Student Branch
  * AEC CodeClub & Competitive Programming Group
  * Robotics & IoT Innovation Club
  * Rotaract Youth Club
  * College Literary & Debate Society`
  },
  {
    id: 'aec-exams-makaut-08',
    title: 'Academic Calendar, MAKAUT Evaluation Scheme & MAR/MOOCs Points',
    category: 'Examinations',
    section: 'Section 7.0 - Examination Guidelines & MAR System',
    sourceUrl: 'http://www.aecwb.edu.in/academics/curriculum',
    keywords: ['exam', 'makaut', 'ca', 'pca', 'semester', 'mar', 'moocs', 'nptel', 'grading', 'sgpa', 'cgpa', 'routine', 'internal'],
    content: `Curriculum and Evaluation follow the latest MAKAUT CBCS (Choice Based Credit System) guidelines:
- Continuous Assessments (CA): 4 Continuous Assessments (CA1 to CA4) conducted each semester. Best scores are submitted to the MAKAUT portal.
- Practical Assessments (PCA): PCA1 and PCA2 evaluate laboratory performance and project files.
- Mandatory Additional Requirements (MAR): Every B.Tech student must earn 100 MAR points across 4 years (25 points/year) through sports, cultural events, tree plantation, social work, technical conferences, or webinars to obtain degree with honors.
- MOOCs (SWAYAM / NPTEL): Minimum 20 credits via online MOOCs required for B.Tech (Honours) degree.`
  },
  {
    id: 'aec-contact-09',
    title: 'Official College Contact Information & Emergency Helpdesks',
    category: 'Administration',
    section: 'Section 8.0 - Directory & Communication Channels',
    sourceUrl: 'http://www.aecwb.edu.in/contact-us',
    keywords: ['contact', 'phone', 'email', 'helpline', 'address', 'principal', 'admission office', 'location', 'tpo contact', 'how to reach'],
    content: `Official Directory of Asansol Engineering College:
- Campus Address: Vivekananda Sarani, Kanyapur, Asansol - 713305, Paschim Bardhaman, West Bengal, India.
- Landline: (0341) 2253057 / (0341) 2252108
- Admission Toll-Free / Mobile Helplines: +91 9434005886 / +91 9434005887 / +91 7001460515
- General & Academic Enquiries Email: principal.aecwb@gmail.com, admission@aecwb.edu.in
- TPO & Placement Cell: tpo@aecwb.edu.in
- Transport Connectivity: Located 5 km from Asansol Junction Railway Station (ASN) and 3 km from NH-19 (GT Road). Auto-rickshaws, city buses, and app cabs are readily available from Asansol station to Kanyapur campus.`
  }
];

export const AEC_NOTICES = [
  {
    id: 'n-1',
    title: 'MAKAUT Odd Semester Examination 2024-25 Schedule Released',
    date: 'Nov 02, 2024',
    category: 'Exam' as const,
    isUrgent: true,
    queryTrigger: 'What is the schedule and guidelines for the upcoming MAKAUT semester examinations?'
  },
  {
    id: 'n-2',
    title: 'TCS Digital & Ninja National Hiring Drive - Registration Open for 2025 Batch',
    date: 'Oct 28, 2024',
    category: 'Placement' as const,
    isUrgent: true,
    queryTrigger: 'What are the eligibility and test pattern details for the TCS campus recruitment drive?'
  },
  {
    id: 'n-3',
    title: 'B.Tech Decentralized Admission 2024 Against Vacant Seats (WBJEE)',
    date: 'Oct 22, 2024',
    category: 'Admission' as const,
    queryTrigger: 'How can I apply for decentralized vacant seat admission for B.Tech 2024 at AEC?'
  },
  {
    id: 'n-4',
    title: 'Call for Registrations: ANWESAN 2025 Inter-College Hackathon',
    date: 'Oct 15, 2024',
    category: 'Event' as const,
    queryTrigger: 'Tell me about the ANWESAN hackathon and robotics competitions at AEC.'
  }
];

export const AEC_DEPARTMENTS = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    intake: 180,
    established: 1998,
    hodName: 'Dr. Debabrata Sarddar',
    highlights: ['NBA Accredited', 'AI & Cloud Computing Labs', 'Top Recruiter Favorite', 'High Placement Rate']
  },
  {
    code: 'IT',
    name: 'Information Technology',
    intake: 90,
    established: 2000,
    hodName: 'Prof. Soumen Roy',
    highlights: ['Software Systems Focus', 'Full Stack Development Lab', 'Industry-Aligned Curriculum']
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engg.',
    intake: 120,
    established: 1998,
    hodName: 'Dr. M. K. Ghosh',
    highlights: ['VLSI & Embedded Systems', 'IoT Development Lab', 'Core Electronics Hiring']
  },
  {
    code: 'CSE-AIML',
    name: 'CSE (Artificial Intelligence & ML)',
    intake: 60,
    established: 2020,
    hodName: 'Dr. Arindam Ghosh',
    highlights: ['Deep Learning Workstations', 'NLP & Computer Vision', 'High In-Demand Track']
  },
  {
    code: 'EE',
    name: 'Electrical Engineering',
    intake: 90,
    established: 1998,
    hodName: 'Prof. S. Sengupta',
    highlights: ['Smart Grid & EV Systems', 'Renewable Energy Lab', 'Core PSU Preparation']
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    intake: 60,
    established: 1998,
    hodName: 'Dr. P. C. Roy',
    highlights: ['CAD/CAM/SolidWorks Lab', 'Automobile Workshop', 'Robotics Specialization']
  }
];

export const QUICK_PROMPT_CATEGORIES = [
  {
    label: 'Admissions & WBJEE',
    icon: 'GraduationCap',
    questions: [
      'What are the B.Tech eligibility criteria and WBJEE counseling process?',
      'What is the fee structure for 4-year B.Tech at AEC?',
      'Can I get lateral entry admission into 2nd year B.Tech?'
    ]
  },
  {
    label: 'Placements & Companies',
    icon: 'Briefcase',
    questions: [
      'What are the placement statistics and highest package offered at AEC?',
      'Which top companies visit AEC campus for placements?',
      'How does the AEC Training & Placement cell prepare students?'
    ]
  },
  {
    label: 'Departments & Intake',
    icon: 'BookOpen',
    questions: [
      'What engineering branches are offered and what is the seat intake?',
      'Tell me about the CSE (Artificial Intelligence & ML) program.',
      'Does AEC offer MCA and BCA degrees?'
    ]
  },
  {
    label: 'Hostel & Campus Life',
    icon: 'Home',
    questions: [
      'What hostel facilities are provided for boys and girls?',
      'Tell me about the Central Library and online research resources.',
      'What are Legenza and Anwesan festivals at AEC?'
    ]
  },
  {
    label: 'Exams & MAKAUT',
    icon: 'FileText',
    questions: [
      'How are Continuous Assessments (CA) and PCA evaluated under MAKAUT?',
      'What are the Mandatory Additional Requirements (MAR) points?',
      'How do I reach Asansol Engineering College from Asansol station?'
    ]
  }
];
