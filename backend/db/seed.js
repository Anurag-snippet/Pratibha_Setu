const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import Models
const User = require('../models/User');
const Institution = require('../models/Institution');
const Student = require('../models/Student');
const Academician = require('../models/Academician');
const Industry = require('../models/Industry');
const Skill = require('../models/Skill');
const AssessmentQuestion = require('../models/AssessmentQuestion');
const AssessmentResponse = require('../models/AssessmentResponse');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const PortfolioItem = require('../models/PortfolioItem');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pratibha_setu';

async function seedDatabase() {
  try {
    console.log(`[Seed] Connecting to MongoDB: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log(`[Seed] Connected successfully.`);

    // 1. Clear existing collections
    console.log(`[Seed] Clearing existing collections...`);
    await Promise.all([
      User.deleteMany({}),
      Institution.deleteMany({}),
      Student.deleteMany({}),
      Academician.deleteMany({}),
      Industry.deleteMany({}),
      Skill.deleteMany({}),
      AssessmentQuestion.deleteMany({}),
      AssessmentResponse.deleteMany({}),
      Opportunity.deleteMany({}),
      Application.deleteMany({}),
      PortfolioItem.deleteMany({}),
      Document.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log(`[Seed] Database cleaned.`);

    // 2. Insert Skills (~15 skills across Ayush categories)
    console.log(`[Seed] Inserting Skills taxonomy...`);
    const skillData = [
      { name: 'Ayurvedic Pharmacology', category: 'Ayush Core' },
      { name: 'Herbal Formulation', category: 'Ayush Core' },
      { name: 'Formulation', category: 'Ayush Core' },
      { name: 'Quality Control & GMP', category: 'Quality & Compliance' },
      { name: 'Quality & GMP', category: 'Quality & Compliance' },
      { name: 'Clinical Research', category: 'Research & Data' },
      { name: 'Data Analysis', category: 'Research & Data' },
      { name: 'Panchakarma Practice', category: 'Clinical Practice' },
      { name: 'Panchakarma', category: 'Clinical Practice' },
      { name: 'Yoga Therapy', category: 'Clinical Practice' },
      { name: 'Regulatory Affairs', category: 'Regulatory' },
      { name: 'Regulatory', category: 'Regulatory' },
      { name: 'Supply Chain', category: 'Operations' },
      { name: 'Scientific Writing', category: 'Research & Data' },
      { name: 'Digital Marketing', category: 'Commercial' },
      { name: 'Lab Instrumentation', category: 'Quality & Compliance' },
      { name: 'Communication', category: 'Professional Skills' },
    ];

    const insertedSkills = await Skill.insertMany(skillData);
    const skillMap = new Map(insertedSkills.map((s) => [s.name, s]));
    console.log(`[Seed] Inserted ${insertedSkills.length} skills.`);

    // 3. Insert Institutions
    console.log(`[Seed] Inserting Institutions...`);
    const institution1 = await Institution.create({
      name: 'National Institute of Ayurveda, Jaipur',
      type: 'Deemed to be University (De-novo)',
      address: 'Jorawar Singh Gate, Amer Road, Jaipur, Rajasthan 302002',
      contactEmail: 'contact@nia.nic.in',
    });

    const institution2 = await Institution.create({
      name: 'All India Institute of Ayurveda, New Delhi',
      type: 'Autonomous Institute under Ministry of Ayush',
      address: 'Gautampuri, Sarita Vihar, Mathura Road, New Delhi 110076',
      contactEmail: 'admin@aiia.gov.in',
    });

    // 4. Create Passwords & Users
    console.log(`[Seed] Creating Users & Profiles across roles...`);
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    // --- Student 1: Ananya Sharma (Primary demo student) ---
    const userStudent1 = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.in',
      passwordHash,
      role: 'student',
    });

    const student1 = await Student.create({
      userId: userStudent1._id,
      institutionId: institution1._id,
      course: 'BAMS',
      year: 4,
      bio: 'Final-year BAMS student focused on herbal formulation and quality systems. I have run 14 bench-scale trials, love translating classical texts into reproducible processes, and am looking for an R&D internship in a GMP-certified unit.',
      profilePhotoPath: '',
      skills: [
        {
          skillId: skillMap.get('Herbal Formulation')._id,
          skillName: 'Herbal Formulation',
          proficiencyScore: 86,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Formulation')._id,
          skillName: 'Formulation',
          proficiencyScore: 82,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Quality Control & GMP')._id,
          skillName: 'Quality Control & GMP',
          proficiencyScore: 74,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Panchakarma Practice')._id,
          skillName: 'Panchakarma Practice',
          proficiencyScore: 70,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Scientific Writing')._id,
          skillName: 'Scientific Writing',
          proficiencyScore: 66,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Data Analysis')._id,
          skillName: 'Data Analysis',
          proficiencyScore: 52,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Regulatory Affairs')._id,
          skillName: 'Regulatory Affairs',
          proficiencyScore: 44,
          assessedAt: new Date(),
        },
        {
          skillId: skillMap.get('Communication')._id,
          skillName: 'Communication',
          proficiencyScore: 88,
          assessedAt: new Date(),
        },
      ],
    });

    // --- Student 2: Sneha Patil ---
    const userStudent2 = await User.create({
      name: 'Sneha Patil',
      email: 'sneha.patil@example.in',
      passwordHash,
      role: 'student',
    });

    const student2 = await Student.create({
      userId: userStudent2._id,
      institutionId: institution1._id,
      course: 'B.Pharm (Ayurveda)',
      year: 4,
      bio: 'QC Trainee focused on herbal pharmacology and high-performance thin-layer chromatography.',
      skills: [
        {
          skillId: skillMap.get('Quality Control & GMP')._id,
          skillName: 'Quality Control & GMP',
          proficiencyScore: 88,
        },
        {
          skillId: skillMap.get('Lab Instrumentation')._id,
          skillName: 'Lab Instrumentation',
          proficiencyScore: 85,
        },
        {
          skillId: skillMap.get('Herbal Formulation')._id,
          skillName: 'Herbal Formulation',
          proficiencyScore: 80,
        },
      ],
    });

    // --- Student 3: Rohit Menon ---
    const userStudent3 = await User.create({
      name: 'Rohit Menon',
      email: 'rohit.menon@example.in',
      passwordHash,
      role: 'student',
    });

    const student3 = await Student.create({
      userId: userStudent3._id,
      institutionId: institution1._id,
      course: 'BAMS',
      year: 3,
      bio: 'Third-year student with special interest in panchakarma therapies and clinical protocol adherence.',
      skills: [
        {
          skillId: skillMap.get('Panchakarma Practice')._id,
          skillName: 'Panchakarma Practice',
          proficiencyScore: 78,
        },
        {
          skillId: skillMap.get('Clinical Research')._id,
          skillName: 'Clinical Research',
          proficiencyScore: 65,
        },
      ],
    });

    // --- Academician: Dr. R. Venkatesan ---
    const userAcademician = await User.create({
      name: 'Dr. R. Venkatesan',
      email: 'dr.venkatesan@nia.nic.in',
      passwordHash,
      role: 'academician',
    });

    const academician = await Academician.create({
      userId: userAcademician._id,
      institutionId: institution1._id,
      department: 'Rasashastra & Bhaishajya Kalpana (Pharmaceuticals)',
      designation: 'Associate Professor',
    });

    // --- Industry 1: Himalaya Wellness ---
    const userIndustry1 = await User.create({
      name: 'Priya Deshpande (Himalaya Wellness)',
      email: 'priya.deshpande@himalayawellness.com',
      passwordHash,
      role: 'industry',
    });

    const industry1 = await Industry.create({
      userId: userIndustry1._id,
      companyName: 'Himalaya Wellness',
      industrySector: 'Ayurveda & Herbal Formulations',
      website: 'https://himalayawellness.in',
      verified: true,
    });

    // --- Industry 2: Dabur Research Foundation ---
    const userIndustry2 = await User.create({
      name: 'Dr. Rajesh Khanna (Dabur)',
      email: 'rajesh.khanna@dabur.com',
      passwordHash,
      role: 'industry',
    });

    const industry2 = await Industry.create({
      userId: userIndustry2._id,
      companyName: 'Dabur Research Foundation',
      industrySector: 'Ayurvedic Consumer Care & Research',
      website: 'https://dabur.com',
      verified: true,
    });

    // --- Industry 3: Patanjali Wellness Institute ---
    const userIndustry3 = await User.create({
      name: 'Acharya Balkrishna (Patanjali)',
      email: 'recruitment@patanjaliwellness.com',
      passwordHash,
      role: 'industry',
    });

    const industry3 = await Industry.create({
      userId: userIndustry3._id,
      companyName: 'Patanjali Wellness Institute',
      industrySector: 'Yoga & Naturopathy Therapeutics',
      website: 'https://patanjali.org',
      verified: true,
    });

    // --- Institution Admin ---
    const userAdmin = await User.create({
      name: 'Dr. S. Bhattacharya (Institution Admin)',
      email: 'admin.dean@nia.nic.in',
      passwordHash,
      role: 'institution_admin',
    });

    // 5. Insert Opportunities
    console.log(`[Seed] Inserting Opportunities...`);
    const opp1 = await Opportunity.create({
      postedByIndustryId: industry1._id,
      type: 'internship',
      title: 'Herbal Formulation R&D Intern',
      description:
        'Work alongside the formulation team on classical and proprietary Ayurvedic dosage forms. You will support batch trials, stability studies and documentation for new product development.',
      responsibilities: [
        'Assist bench-scale formulation trials for churna, kwatha and tablet forms',
        'Maintain batch manufacturing records and stability logs',
        'Support QC in raw-material identity and purity testing',
      ],
      location: 'Bengaluru, KA',
      mode: 'On-site',
      stipend: 25000,
      duration: '6 months',
      isRemote: false,
      deadline: new Date('2026-10-12'),
      status: 'open',
      audience: 'student',
      requiredSkills: [
        { skillId: skillMap.get('Herbal Formulation')._id, skillName: 'Herbal Formulation' },
        { skillId: skillMap.get('Quality Control & GMP')._id, skillName: 'Quality Control & GMP' },
        { skillId: skillMap.get('Lab Instrumentation')._id, skillName: 'Lab Instrumentation' },
      ],
    });

    const opp2 = await Opportunity.create({
      postedByIndustryId: industry2._id,
      type: 'job',
      title: 'Clinical Research Associate — Ayurveda Trials',
      description:
        'Coordinate multi-centre clinical studies evaluating classical Ayurvedic interventions, from protocol drafting to site monitoring and data closure.',
      responsibilities: [
        'Draft protocols, ICFs and CRFs under investigator guidance',
        'Monitor sites for protocol and GCP compliance',
        'Prepare interim data summaries and study reports',
      ],
      location: 'New Delhi, DL',
      mode: 'Hybrid',
      stipend: 52000,
      duration: 'Full-time',
      isRemote: false,
      deadline: new Date('2026-09-30'),
      status: 'open',
      audience: 'student',
      requiredSkills: [
        { skillId: skillMap.get('Clinical Research')._id, skillName: 'Clinical Research' },
        { skillId: skillMap.get('Scientific Writing')._id, skillName: 'Scientific Writing' },
        { skillId: skillMap.get('Data Analysis')._id, skillName: 'Data Analysis' },
      ],
    });

    const opp3 = await Opportunity.create({
      postedByIndustryId: industry2._id,
      type: 'internship',
      title: 'Quality Control Analyst Trainee',
      description:
        'Hands-on QC training across wet chemistry, chromatography and microbiology for herbal raw materials and finished goods.',
      responsibilities: [
        'Perform identity, purity and assay tests per pharmacopoeial methods',
        'Operate HPLC, UV-Vis and moisture analysers',
        'Document results in line with GLP practices',
      ],
      location: 'Ghaziabad, UP',
      mode: 'On-site',
      stipend: 18000,
      duration: '4 months',
      isRemote: false,
      deadline: new Date('2026-10-05'),
      status: 'open',
      audience: 'student',
      requiredSkills: [
        { skillId: skillMap.get('Quality Control & GMP')._id, skillName: 'Quality Control & GMP' },
        { skillId: skillMap.get('Lab Instrumentation')._id, skillName: 'Lab Instrumentation' },
      ],
    });

    const opp4 = await Opportunity.create({
      postedByIndustryId: industry3._id,
      type: 'job',
      title: 'Yoga Therapy Programme Facilitator',
      description:
        'Design and deliver therapeutic yoga programmes for lifestyle-disorder cohorts within a residential wellness setting.',
      responsibilities: [
        'Assess participants and design graded therapy plans',
        'Run daily group and individual sessions',
        'Track outcomes and report programme effectiveness',
      ],
      location: 'Haridwar, UK',
      mode: 'On-site',
      stipend: 38000,
      duration: 'Full-time',
      isRemote: false,
      deadline: new Date('2026-11-02'),
      status: 'open',
      audience: 'student',
      requiredSkills: [
        { skillId: skillMap.get('Yoga Therapy')._id, skillName: 'Yoga Therapy' },
        { skillId: skillMap.get('Panchakarma Practice')._id, skillName: 'Panchakarma Practice' },
      ],
    });

    const opp5 = await Opportunity.create({
      postedByIndustryId: industry1._id,
      type: 'workshop',
      title: 'Regulatory Affairs Workshop — Ayush Exports',
      description:
        'A three-day intensive on export documentation, certification schemes and market-access requirements for Ayush products.',
      responsibilities: [
        'Attend all three live modules',
        'Complete the case-study submission',
        'Sit the closing assessment for certification',
      ],
      location: 'Online',
      mode: 'Remote',
      stipend: 0,
      duration: '3 days',
      isRemote: true,
      deadline: new Date('2026-09-25'),
      status: 'open',
      audience: 'student',
      requiredSkills: [
        { skillId: skillMap.get('Regulatory Affairs')._id, skillName: 'Regulatory Affairs' },
        { skillId: skillMap.get('Supply Chain')._id, skillName: 'Supply Chain' },
      ],
    });

    const opp6 = await Opportunity.create({
      postedByIndustryId: industry1._id,
      type: 'fdp',
      title: 'FDP: Modern Analytics for Ayurveda Faculty',
      description:
        'A faculty development programme building analytical and research-design capability for Ayush educators, with a funded fellowship for participants.',
      responsibilities: [
        'Attend all sessions and lab practicals',
        'Submit a course-redesign artefact',
        'Mentor two students on an applied mini-project',
      ],
      location: 'New Delhi, DL',
      mode: 'Hybrid',
      stipend: 0,
      duration: '2 weeks',
      isRemote: false,
      deadline: new Date('2026-10-08'),
      status: 'open',
      audience: 'faculty',
      requiredSkills: [
        { skillId: skillMap.get('Data Analysis')._id, skillName: 'Data Analysis' },
        { skillId: skillMap.get('Scientific Writing')._id, skillName: 'Scientific Writing' },
        { skillId: skillMap.get('Clinical Research')._id, skillName: 'Clinical Research' },
      ],
    });

    // 6. Insert Applications
    console.log(`[Seed] Inserting Applications...`);
    await Application.create({
      opportunityId: opp1._id,
      studentId: student1._id,
      status: 'shortlisted',
      coverNote: 'Excited to contribute to bench-scale formulation trials at Himalaya Wellness.',
      mentorFeedback: 'Strong lab fundamentals and positive review.',
      timeline: [
        { label: 'Application submitted', date: '21 Aug 2026', done: true },
        { label: 'Profile reviewed by recruiter', date: '24 Aug 2026', done: true },
        { label: 'Shortlisted for interview', date: '01 Sep 2026', done: true },
      ],
    });

    await Application.create({
      opportunityId: opp3._id,
      studentId: student1._id,
      status: 'selected',
      coverNote: 'Trained in HPLC and moisture analysers.',
      mentorFeedback: 'Offer released.',
      timeline: [
        { label: 'Application submitted', date: '14 Aug 2026', done: true },
        { label: 'Technical screening cleared', date: '22 Aug 2026', done: true },
        { label: 'Offer released', date: '03 Sep 2026', done: true },
      ],
    });

    await Application.create({
      opportunityId: opp5._id,
      studentId: student1._id,
      status: 'applied',
      coverNote: 'Keen to understand international Ayush export standards.',
      timeline: [{ label: 'Application submitted', date: '02 Sep 2026', done: true }],
    });

    await Application.create({
      opportunityId: opp1._id,
      studentId: student2._id,
      status: 'selected',
      coverNote: 'Specialized in herbal QA and tablet formulations.',
    });

    // 7. Insert Portfolio Items
    console.log(`[Seed] Inserting Portfolio Items...`);
    await PortfolioItem.create([
      {
        studentId: student1._id,
        type: 'certificate',
        title: 'GMP Essentials for Ayush Units',
        issuer: 'Quality Council of India (QCI)',
        year: '2026',
        tags: ['GMP', 'Quality'],
        verified: true,
      },
      {
        studentId: student1._id,
        type: 'certificate',
        title: 'Good Clinical Practice (GCP)',
        issuer: 'NIDA Clinical Trials Network',
        year: '2025',
        tags: ['GCP', 'Research'],
        verified: true,
      },
      {
        studentId: student1._id,
        type: 'project',
        title: 'Stability profiling of a Triphala tablet',
        description:
          'Six-month accelerated stability study comparing three binder systems; produced a recommended formulation with improved disintegration.',
        tags: ['Formulation', 'QC'],
        verified: false,
      },
      {
        studentId: student1._id,
        type: 'achievement',
        title: 'Winner — Ayush Startup Ideathon 2026 (state round)',
        description: 'First place for novel water-soluble curcumin dosage form presentation.',
        verified: true,
      },
    ]);

    // 8. Insert Assessment Questions
    console.log(`[Seed] Inserting Assessment Questions...`);
    await AssessmentQuestion.create([
      {
        section: 'Core Ayush Knowledge',
        questionType: 'multiple_choice',
        questionText: 'Which classical text is the primary reference for Ayurvedic formulations?',
        options: [
          'Charaka Samhita',
          'Sushruta Samhita',
          'Ashtanga Hridaya',
          'Bhaishajya Ratnavali',
        ],
        correctAnswerIndex: 3,
        skillId: skillMap.get('Formulation')._id,
        skillName: 'Formulation',
      },
      {
        section: 'Core Ayush Knowledge',
        questionType: 'multiple_choice',
        questionText: 'Kwatha churna is prepared primarily for which dosage form?',
        options: ['Decoction', 'Tablet', 'Oil', 'Fermented liquid'],
        correctAnswerIndex: 0,
        skillId: skillMap.get('Formulation')._id,
        skillName: 'Formulation',
      },
      {
        section: 'Core Ayush Knowledge',
        questionType: 'rating',
        questionText: 'Rate your hands-on confidence with Panchakarma procedures.',
        options: ['1', '2', '3', '4', '5'],
        skillId: skillMap.get('Panchakarma Practice')._id,
        skillName: 'Panchakarma Practice',
      },
      {
        section: 'Quality & Compliance',
        questionType: 'multiple_choice',
        questionText: 'GMP for Ayush manufacturing units in India is governed by which schedule?',
        options: ['Schedule M', 'Schedule T', 'Schedule Y', 'Schedule H'],
        correctAnswerIndex: 1,
        skillId: skillMap.get('Quality Control & GMP')._id,
        skillName: 'Quality Control & GMP',
      },
      {
        section: 'Quality & Compliance',
        questionType: 'multiple_choice',
        questionText: 'Which test is standard for detecting heavy metals in herbal raw material?',
        options: ['HPLC', 'AAS / ICP-MS', 'Karl Fischer', 'Disintegration test'],
        correctAnswerIndex: 1,
        skillId: skillMap.get('Quality Control & GMP')._id,
        skillName: 'Quality Control & GMP',
      },
      {
        section: 'Quality & Compliance',
        questionType: 'rating',
        questionText: 'Rate your familiarity with Ayush export & licensing documentation.',
        options: ['1', '2', '3', '4', '5'],
        skillId: skillMap.get('Regulatory Affairs')._id,
        skillName: 'Regulatory Affairs',
      },
      {
        section: 'Research & Data',
        questionType: 'multiple_choice',
        questionText: 'In a randomised controlled trial, blinding primarily reduces which bias?',
        options: ['Selection bias', 'Observer bias', 'Recall bias', 'Publication bias'],
        correctAnswerIndex: 1,
        skillId: skillMap.get('Clinical Research')._id,
        skillName: 'Clinical Research',
      },
      {
        section: 'Research & Data',
        questionType: 'multiple_choice',
        questionText: 'Which measure best describes the spread of a skewed dataset?',
        options: ['Mean', 'Interquartile range', 'Mode', 'Sum'],
        correctAnswerIndex: 1,
        skillId: skillMap.get('Data Analysis')._id,
        skillName: 'Data Analysis',
      },
      {
        section: 'Research & Data',
        questionType: 'rating',
        questionText: 'Rate your comfort analysing datasets in Excel / Python / R.',
        options: ['1', '2', '3', '4', '5'],
        skillId: skillMap.get('Data Analysis')._id,
        skillName: 'Data Analysis',
      },
      {
        section: 'Professional Skills',
        questionType: 'multiple_choice',
        questionText: 'A patient-facing consultation summary should primarily be:',
        options: [
          'Highly technical',
          'Clear, plain-language and actionable',
          'As short as possible',
          'Written in Sanskrit terminology only',
        ],
        correctAnswerIndex: 1,
        skillId: skillMap.get('Communication')._id,
        skillName: 'Communication',
      },
      {
        section: 'Professional Skills',
        questionType: 'rating',
        questionText: 'Rate your confidence presenting work to an industry panel.',
        options: ['1', '2', '3', '4', '5'],
        skillId: skillMap.get('Communication')._id,
        skillName: 'Communication',
      },
    ]);

    // 9. Insert Demo Notifications
    console.log(`[Seed] Inserting Notifications...`);
    await Notification.create([
      {
        userId: userStudent1._id,
        kind: 'match',
        title: 'New 94% match',
        message: 'Herbal Formulation R&D Intern at Himalaya Wellness fits your skill profile.',
        isRead: false,
      },
      {
        userId: userStudent1._id,
        kind: 'application',
        title: 'You were shortlisted',
        message: 'Himalaya Wellness moved your application to Shortlisted.',
        isRead: false,
      },
      {
        userId: userStudent1._id,
        kind: 'assessment',
        title: 'Assessment refresh due',
        message: 'Your skill assessment is 40 days old. Retake it to improve match accuracy.',
        isRead: false,
      },
      {
        userId: userStudent1._id,
        kind: 'system',
        title: 'Portfolio verified',
        message: 'Your certification "GMP Essentials" was verified by your institution.',
        isRead: true,
      },
    ]);

    console.log(`====================================================`);
    console.log(`🌿 Database Seeding Completed Successfully!`);
    console.log(`----------------------------------------------------`);
    console.log(`Sample Credentials (password for all: 'password123'):`);
    console.log(`👨‍🎓 Student:           ananya.sharma@example.in`);
    console.log(`👨‍🏫 Academician:       dr.venkatesan@nia.nic.in`);
    console.log(`🏭 Industry Partner:   priya.deshpande@himalayawellness.com`);
    console.log(`🏛️ Institution Admin: admin.dean@nia.nic.in`);
    console.log(`====================================================`);

    await mongoose.disconnect();
    console.log(`[Seed] Disconnected from MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Database seeding failed:`, error);
    process.exit(1);
  }
}

seedDatabase();
