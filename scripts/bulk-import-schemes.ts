import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ==========================================
// 1. SMART CATEGORY & BENEFIT TYPE MAPPING
// ==========================================

const CATEGORY_MAP: Record<string, string> = {
  // Education / Students
  education: 'students',
  scholarship: 'students',
  scholarships: 'students',
  student: 'students',
  students: 'students',
  youth: 'students',
  skill: 'students',
  learning: 'students',

  // Agriculture / Farmers
  agriculture: 'farmers',
  farmer: 'farmers',
  farmers: 'farmers',
  kisan: 'farmers',
  farming: 'farmers',
  krishi: 'farmers',
  crop: 'farmers',
  horticulture: 'farmers',
  animal: 'farmers',
  dairy: 'farmers',
  fisheries: 'farmers',

  // Women & Child
  women: 'women',
  woman: 'women',
  girl: 'women',
  girls: 'women',
  maternity: 'women',
  mother: 'women',
  child: 'women',
  matru: 'women',
  mahila: 'women',
  kanya: 'women',

  // Healthcare
  health: 'health',
  healthcare: 'health',
  medical: 'health',
  hospital: 'health',
  ayushman: 'health',
  arogya: 'health',
  swasthya: 'health',
  medicine: 'health',
  insurance: 'health',

  // Employment & Business
  employment: 'employment',
  job: 'employment',
  jobs: 'employment',
  business: 'employment',
  msme: 'employment',
  startup: 'employment',
  enterprise: 'employment',
  mudra: 'employment',
  loan: 'employment',
  rojpani: 'employment',
  livelihood: 'employment',

  // Senior Citizens
  senior: 'seniors',
  seniors: 'seniors',
  elderly: 'seniors',
  pension: 'seniors',
  vridha: 'seniors',
  aged: 'seniors',

  // Divyangjan / Disability
  disability: 'divyangjan',
  disabled: 'divyangjan',
  divyang: 'divyangjan',
  divyangjan: 'divyangjan',
  inclusion: 'divyangjan',
  handicapped: 'divyangjan',

  // Housing & Infrastructure
  housing: 'housing',
  house: 'housing',
  awas: 'housing',
  rural: 'housing',
  urban: 'housing',
  shelter: 'housing',
  sanitation: 'housing',
  swachh: 'housing',
};

function determineCategorySlug(categoryRaw?: string, title?: string, description?: string): string {
  const text = `${categoryRaw || ''} ${title || ''} ${description || ''}`.toLowerCase();

  for (const [keyword, slug] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(keyword)) {
      return slug;
    }
  }

  return 'employment'; // Default fallback category
}

function determineBenefitType(benefitsText?: string, typeRaw?: string): string {
  const combined = `${typeRaw || ''} ${benefitsText || ''}`.toLowerCase();
  if (combined.includes('scholarship') || combined.includes('fee') || combined.includes('stipend')) return 'Educational';
  if (combined.includes('health') || combined.includes('hospital') || combined.includes('treatment') || combined.includes('medical')) return 'Health';
  if (combined.includes('house') || combined.includes('awas') || combined.includes('construction')) return 'Housing';
  if (combined.includes('job') || combined.includes('skill') || combined.includes('training') || combined.includes('loan') || combined.includes('mudra')) return 'Livelihood';
  if (combined.includes('pension') || combined.includes('insurance') || combined.includes('social security')) return 'Social Security';
  return 'Financial';
}

function extractStructuredEligibility(rawEligibility?: string): any {
  if (!rawEligibility) {
    return {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      categories: ['All'],
      occupations: ['All'],
      states: ['All'],
      education: ['All'],
    };
  }

  const text = rawEligibility.toLowerCase();

  // Extract Age
  let minAge: number | undefined;
  let maxAge: number | undefined;
  const ageMatch = text.match(/(\d{1,2})\s*(?:to|-|and)\s*(\d{1,2})\s*years?/i);
  if (ageMatch) {
    minAge = parseInt(ageMatch[1], 10);
    maxAge = parseInt(ageMatch[2], 10);
  } else {
    const minMatch = text.match(/(?:at least|minimum|above|age of)\s*(\d{1,2})/i);
    if (minMatch) minAge = parseInt(minMatch[1], 10);
    const maxMatch = text.match(/(?:up to|maximum|below|not exceeding)\s*(\d{1,2})/i);
    if (maxMatch) maxAge = parseInt(maxMatch[1], 10);
  }

  // Extract Gender
  let gender = 'All';
  if (text.includes('female') || text.includes('women') || text.includes('girl') || text.includes('mahila')) {
    gender = 'Female';
  } else if (text.includes('male only') || text.includes('men only')) {
    gender = 'Male';
  }

  // Extract Castes
  const categories: string[] = [];
  if (text.includes('sc') || text.includes('scheduled caste')) categories.push('SC');
  if (text.includes('st') || text.includes('scheduled tribe')) categories.push('ST');
  if (text.includes('obc') || text.includes('other backward')) categories.push('OBC');
  if (text.includes('ews') || text.includes('economically weaker')) categories.push('EWS');
  if (text.includes('minority') || text.includes('minorities')) categories.push('Minority');
  if (text.includes('divyang') || text.includes('disab')) categories.push('Divyangjan');
  if (categories.length === 0) categories.push('All');

  // Extract Occupations
  const occupations: string[] = [];
  if (text.includes('student') || text.includes('studying')) occupations.push('Student');
  if (text.includes('farmer') || text.includes('kisan') || text.includes('cultivat')) occupations.push('Farmer');
  if (text.includes('unemployed')) occupations.push('Unemployed');
  if (text.includes('self-employed') || text.includes('artisan') || text.includes('weaver')) occupations.push('Self-Employed');
  if (text.includes('daily wage') || text.includes('construction worker') || text.includes('migrant')) occupations.push('Daily Wage');
  if (text.includes('senior') || text.includes('elderly')) occupations.push('Senior Citizen');
  if (occupations.length === 0) occupations.push('All');

  return {
    minAge: minAge || 18,
    maxAge: maxAge || 70,
    gender,
    categories,
    occupations,
    states: ['All'],
    education: ['All'],
  };
}

// ==========================================
// 2. CSV PARSER (RFC-4180 COMPLIANT)
// ==========================================

function parseCSV(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // Ignore carriage return
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.replace(/^["']|["']$/g, '').trim());
  const records: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const item: Record<string, string> = {};
    for (let c = 0; c < headers.length; c++) {
      item[headers[c]] = row[c] || '';
    }
    records.push(item);
  }

  return records;
}

// ==========================================
// 3. MAIN BULK IMPORT RUNNER
// ==========================================

export async function runBulkImport(filePath?: string) {
  console.log('====================================================');
  console.log('🏛️  YOGYASETU BULK GOVERNMENT SCHEMES IMPORTER');
  console.log('====================================================');

  // Ensure Database Categories exist
  const existingCategories = await prisma.category.findMany();
  if (existingCategories.length === 0) {
    console.error('❌ Error: No master categories found in the database. Please run "npm run seed" first.');
    return;
  }

  const categoryMapBySlug = new Map<string, string>();
  for (const cat of existingCategories) {
    categoryMapBySlug.set(cat.slug, cat.id);
  }

  // Determine file to read
  let rawRecords: any[] = [];
  let sourceFileName = 'Embedded myScheme.gov.in Dataset';

  const possiblePaths = [
    filePath,
    path.join(process.cwd(), 'data', 'schemes.json'),
    path.join(process.cwd(), 'data', 'schemes.csv'),
    path.join(process.cwd(), 'schemes.json'),
    path.join(process.cwd(), 'schemes.csv'),
    path.join(process.cwd(), 'prisma', 'schemes.json'),
    path.join(process.cwd(), 'prisma', 'schemes.csv'),
  ].filter(Boolean) as string[];

  let loadedFile: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      loadedFile = p;
      break;
    }
  }

  if (loadedFile) {
    sourceFileName = path.basename(loadedFile);
    console.log(`📂 Reading dataset from: ${loadedFile}`);
    const fileContent = fs.readFileSync(loadedFile, 'utf8');

    if (loadedFile.endsWith('.json')) {
      try {
        const parsed = JSON.parse(fileContent);
        rawRecords = Array.isArray(parsed) ? parsed : parsed.schemes || parsed.data || [];
      } catch (err: any) {
        console.error('❌ Failed to parse JSON file:', err.message);
        return;
      }
    } else if (loadedFile.endsWith('.csv')) {
      rawRecords = parseCSV(fileContent);
    }
  } else {
    console.log('ℹ️  No external CSV/JSON file path provided. Processing comprehensive seed repository catalog...');
    rawRecords = getDefaultSchemeDataset();
  }

  console.log(`📊 Found ${rawRecords.length} raw scheme records to process.`);

  // Load existing schemes from database to prevent duplicates
  const existingSchemes = await prisma.scheme.findMany({
    select: { titleEn: true, officialLink: true },
  });

  const existingTitles = new Set(existingSchemes.map((s) => s.titleEn.trim().toLowerCase()));
  const existingLinks = new Set(existingSchemes.map((s) => s.officialLink.trim().toLowerCase()));

  let importedCount = 0;
  let skippedDuplicateCount = 0;
  let skippedMissingDataCount = 0;
  const categoryStats: Record<string, number> = {};

  for (let i = 0; i < rawRecords.length; i++) {
    const raw = rawRecords[i];

    // Normalize keys regardless of CSV/JSON schema variations
    const titleEn = (raw.title_en || raw.titleEn || raw.scheme_name || raw['Scheme Name'] || raw.title || raw.Name || '').trim();
    const titleHi = (raw.title_hi || raw.titleHi || raw.scheme_name_hi || raw['Scheme Name (Hindi)'] || titleEn).trim();
    const descriptionEn = (raw.description_en || raw.descriptionEn || raw.details || raw.Description || raw.summary || raw.brief || '').trim();
    const descriptionHi = (raw.description_hi || raw.descriptionHi || raw.details_hi || descriptionEn).trim();
    const benefitsEn = (raw.benefits_en || raw.benefitsEn || raw.benefits || raw.Benefits || '').trim();
    const benefitsHi = (raw.benefits_hi || raw.benefitsHi || raw.benefits_hi || benefitsEn).trim();
    const rawCategory = (raw.category || raw.scheme_category || raw.Category || raw.tags || '').trim();
    const rawEligibility = (raw.eligibility || raw.eligibility_criteria || raw['Eligibility Criteria'] || raw.eligibility_json || '').trim();
    const officialLink = (raw.official_link || raw.officialLink || raw.scheme_link || raw.url || raw.portal_url || raw['Official Link'] || 'https://myscheme.gov.in').trim();
    const departmentEn = (raw.department_en || raw.departmentEn || raw.nodal_ministry || raw.Ministry || raw.Department || 'Government of India').trim();
    const departmentHi = (raw.department_hi || raw.departmentHi || departmentEn).trim();
    const level = (raw.level || raw.scheme_level || 'Central').trim();
    const benefitAmount = (raw.benefit_amount || raw.benefitAmount || raw.amount || null);

    // Validation: Title is mandatory
    if (!titleEn || titleEn.length < 3) {
      skippedMissingDataCount++;
      continue;
    }

    // Duplicate Check
    const normalizedTitle = titleEn.toLowerCase();
    const normalizedLink = officialLink.toLowerCase();

    if (existingTitles.has(normalizedTitle) || (officialLink !== 'https://myscheme.gov.in' && existingLinks.has(normalizedLink))) {
      skippedDuplicateCount++;
      continue;
    }

    // Determine Category ID
    const targetSlug = determineCategorySlug(rawCategory, titleEn, descriptionEn);
    const categoryId = categoryMapBySlug.get(targetSlug) || categoryMapBySlug.get('employment') || existingCategories[0].id;

    // Process Structured Eligibility JSON
    let eligibilityJsonStr = '';
    if (typeof raw.eligibilityJson === 'object') {
      eligibilityJsonStr = JSON.stringify(raw.eligibilityJson);
    } else if (typeof raw.eligibility_json === 'string' && raw.eligibility_json.startsWith('{')) {
      eligibilityJsonStr = raw.eligibility_json;
    } else {
      eligibilityJsonStr = JSON.stringify(extractStructuredEligibility(rawEligibility || descriptionEn));
    }

    // Process Documents Required
    let documentsRequiredStr = '["Aadhaar Card", "Bank Account Details", "Passport Size Photograph"]';
    if (raw.documents_required || raw.documentsRequired || raw.documents) {
      const docs = raw.documents_required || raw.documentsRequired || raw.documents;
      if (Array.isArray(docs)) {
        documentsRequiredStr = JSON.stringify(docs);
      } else if (typeof docs === 'string') {
        if (docs.startsWith('[')) {
          documentsRequiredStr = docs;
        } else {
          documentsRequiredStr = JSON.stringify(docs.split(/[,;\n]+/).map((d: string) => d.trim()).filter(Boolean));
        }
      }
    }

    // Process Application Process Steps
    let applicationProcessStr = '["Visit the official government portal", "Register using mobile number and Aadhaar OTP", "Fill out the online application form and upload documents", "Submit and track application status"]';
    if (raw.application_process || raw.applicationProcess || raw.how_to_apply) {
      const proc = raw.application_process || raw.applicationProcess || raw.how_to_apply;
      if (Array.isArray(proc)) {
        applicationProcessStr = JSON.stringify(proc);
      } else if (typeof proc === 'string') {
        if (proc.startsWith('[')) {
          applicationProcessStr = proc;
        } else {
          applicationProcessStr = JSON.stringify(proc.split(/[\n\d+\.]+/).map((p: string) => p.trim()).filter((p: string) => p.length > 5));
        }
      }
    }

    const benefitType = determineBenefitType(benefitsEn, raw.benefit_type || raw.benefitType);

    // Insert as DRAFT status for administrator verification workflow
    try {
      await prisma.scheme.create({
        data: {
          categoryId,
          titleEn,
          titleHi,
          descriptionEn: descriptionEn || `${titleEn} is an official welfare scheme administered by ${departmentEn}.`,
          descriptionHi: descriptionHi || `${titleHi} ${departmentHi} द्वारा संचालित एक आधिकारिक कल्याणकारी योजना है।`,
          benefitsEn: benefitsEn || 'Direct benefit transfer, subsidy, or welfare support as per guidelines.',
          benefitsHi: benefitsHi || 'दिशानिर्देशों के अनुसार प्रत्यक्ष लाभ अंतरण, सब्सिडी या कल्याण सहायता।',
          benefitType,
          benefitAmount: benefitAmount ? String(benefitAmount) : null,
          eligibilityJson: eligibilityJsonStr,
          documentsRequired: documentsRequiredStr,
          applicationProcess: applicationProcessStr,
          officialLink,
          departmentEn,
          departmentHi,
          level: level.includes('State') ? 'State' : 'Central',
          status: 'DRAFT', // As requested: all imported schemes start in DRAFT status for review
        },
      });

      existingTitles.add(normalizedTitle);
      if (officialLink !== 'https://myscheme.gov.in') existingLinks.add(normalizedLink);

      importedCount++;
      categoryStats[targetSlug] = (categoryStats[targetSlug] || 0) + 1;
    } catch (err: any) {
      console.error(`⚠️ Failed to import "${titleEn}":`, err.message);
      skippedMissingDataCount++;
    }
  }

  // ==========================================
  // 4. SUMMARY REPORT
  // ==========================================
  console.log('\n====================================================');
  console.log('📈 IMPORT EXECUTION SUMMARY REPORT');
  console.log('====================================================');
  console.log(`📁 Source Dataset       : ${sourceFileName}`);
  console.log(`🔢 Total Schemes Read   : ${rawRecords.length}`);
  console.log(`✅ Successfully Imported : ${importedCount} (Saved as DRAFT)`);
  console.log(`⏭️  Skipped (Duplicates)  : ${skippedDuplicateCount}`);
  console.log(`⚠️  Skipped (Invalid/Err): ${skippedMissingDataCount}`);
  console.log('----------------------------------------------------');
  console.log('📂 Category-wise Breakdown:');
  for (const [slug, count] of Object.entries(categoryStats)) {
    console.log(`   • ${slug.padEnd(16)}: ${count} schemes`);
  }
  console.log('====================================================');
  console.log('✨ Import completed! You can review and publish them');
  console.log('   from the YogyaSetu Admin Portal (/admin).');
  console.log('====================================================\n');
}

// Fallback high-quality catalog if no local CSV/JSON file is provided
function getDefaultSchemeDataset() {
  return [
    {
      title_en: 'PM Vishwakarma Scheme',
      title_hi: 'पीएम विश्वकर्मा योजना',
      category: 'employment',
      description_en: 'End-to-end support to traditional artisans and craftspeople with collateral-free enterprise development loans, skill training, and modern toolkit incentives.',
      benefits_en: 'Collateral-free credit up to Rs 3 Lakh at 5% interest rate, Rs 15,000 toolkit incentive, and Rs 500/day stipend during skill training.',
      benefit_type: 'Financial',
      benefit_amount: '₹3,00,000',
      eligibility_criteria: 'Traditional artisans and craftspeople aged 18 to 65 engaged in 18 notified family-based trades.',
      official_link: 'https://pmvishwakarma.gov.in',
      nodal_ministry: 'Ministry of Micro, Small and Medium Enterprises',
      level: 'Central',
    },
    {
      title_en: 'PM Surya Ghar Muft Bijli Yojana',
      title_hi: 'पीएम सूर्य घर मुफ्त बिजली योजना',
      category: 'housing',
      description_en: 'National solar rooftop initiative providing financial subsidies to install solar panels on residential households to provide up to 300 units of free electricity per month.',
      benefits_en: 'Direct subsidy up to Rs 78,000 for 3 kW solar rooftop systems and 300 units free monthly electricity.',
      benefit_type: 'Financial',
      benefit_amount: '₹78,000',
      eligibility_criteria: 'Residential households with suitable rooftop space and valid electricity connection.',
      official_link: 'https://pmsuryaghar.gov.in',
      nodal_ministry: 'Ministry of New and Renewable Energy',
      level: 'Central',
    },
    {
      title_en: 'Lakhpati Didi Scheme',
      title_hi: 'लखपति दीदी योजना',
      category: 'women',
      description_en: 'Empowerment initiative enabling Women Self Help Group (SHG) members to earn a sustainable annual income of at least Rs 1 Lakh through micro-enterprises and skill training.',
      benefits_en: 'Interest subvention on bank loans, market linkage support, digital financial literacy, and technical training.',
      benefit_type: 'Livelihood',
      benefit_amount: '₹1,00,000/year income target',
      eligibility_criteria: 'Women aged 18 to 60 who are active members of Deendayal Antyodaya Yojana - NRLM Self Help Groups.',
      official_link: 'https://nrlm.gov.in',
      nodal_ministry: 'Ministry of Rural Development',
      level: 'Central',
    },
    {
      title_en: 'National Apprenticeship Promotion Scheme (NAPS)',
      title_hi: 'राष्ट्रीय शिक्षुता संवर्धन योजना (NAPS)',
      category: 'students',
      description_en: 'Scheme promoting apprenticeship training by sharing 25% of prescribed stipend up to Rs 1,500 per month per apprentice with industrial employers.',
      benefits_en: 'Government stipend support up to Rs 1,500/month along with industry certification.',
      benefit_type: 'Educational',
      benefit_amount: '₹1,500/month',
      eligibility_criteria: 'Youth aged 14 and above with minimum 5th to Graduate qualification seeking on-the-job apprenticeship.',
      official_link: 'https://www.apprenticeshipindia.gov.in',
      nodal_ministry: 'Ministry of Skill Development and Entrepreneurship',
      level: 'Central',
    },
    {
      title_en: 'Kisan Credit Card (KCC) Scheme',
      title_hi: 'किसान क्रेडिट कार्ड (KCC) योजना',
      category: 'farmers',
      description_en: 'Timely and adequate credit support to farmers from the banking system for crop cultivation, post-harvest expenses, and maintenance of farm assets.',
      benefits_en: 'Subsidized loan up to Rs 3 Lakh at 4% effective interest rate with prompt repayment incentive.',
      benefit_type: 'Financial',
      benefit_amount: '₹3,00,000',
      eligibility_criteria: 'All farmers, tenant farmers, oral lessees, and sharecroppers aged 18 to 75 years.',
      official_link: 'https://www.myscheme.gov.in/schemes/kcc',
      nodal_ministry: 'Ministry of Agriculture and Farmers Welfare',
      level: 'Central',
    },
    {
      title_en: 'Stand-Up India Scheme',
      title_hi: 'स्टैंड-अप इंडिया योजना',
      category: 'employment',
      description_en: 'Bank loans between Rs 10 Lakh and Rs 1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
      benefits_en: 'Composite bank loan from Rs 10 Lakh to Rs 1 Crore covering up to 85% of project cost.',
      benefit_type: 'Financial',
      benefit_amount: '₹10,00,000 - ₹1,00,00,000',
      eligibility_criteria: 'SC/ST and Women entrepreneurs aged above 18 years for new greenfield manufacturing, services, or agri-allied ventures.',
      official_link: 'https://www.standupmitra.in',
      nodal_ministry: 'Ministry of Finance',
      level: 'Central',
    },
    {
      title_en: 'Senior Citizen Savings Scheme (SCSS)',
      title_hi: 'वरिष्ठ नागरिक बचत योजना (SCSS)',
      category: 'seniors',
      description_en: 'Government-backed savings scheme for individuals aged 60 and above offering high sovereign-guaranteed quarterly interest and tax benefits under Section 80C.',
      benefits_en: 'Current 8.2% annual interest paid quarterly with deposit limit up to Rs 30 Lakh.',
      benefit_type: 'Financial',
      benefit_amount: 'Up to ₹30,00,000 deposit',
      eligibility_criteria: 'Indian citizens aged 60 years and above (or 55 years for retired defense personnel/VRS).',
      official_link: 'https://www.myscheme.gov.in/schemes/scss',
      nodal_ministry: 'Ministry of Finance',
      level: 'Central',
    },
    {
      title_en: 'ADIP Scheme for Divyangjan (Assistance to Disabled Persons)',
      title_hi: 'दिव्यांगजनों के लिए एडिप योजना',
      category: 'divyangjan',
      description_en: 'Financial assistance for procurement of modern, durable, and scientifically manufactured aids and assistive appliances to persons with disabilities.',
      benefits_en: 'Free or heavily subsidized motorized tricycles, wheelchairs, hearing aids, braille kits, and artificial limbs.',
      benefit_type: 'Health',
      benefit_amount: 'Free Assistive Aids',
      eligibility_criteria: 'Indian citizens holding 40% or more benchmark disability certificate with monthly family income up to Rs 20,000.',
      official_link: 'https://adip.depwd.gov.in',
      nodal_ministry: 'Ministry of Social Justice and Empowerment',
      level: 'Central',
    }
  ];
}

// Direct Execution Handler
const targetFilePath = process.argv[2];
runBulkImport(targetFilePath)
  .catch((err) => {
    console.error('Fatal execution error during bulk import:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

