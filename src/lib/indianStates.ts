export interface IndianState {
  code: string;
  nameEn: string;
  nameHi: string;
  isUT?: boolean;
}

export const INDIAN_STATES: IndianState[] = [
  // 28 States
  { code: 'AP', nameEn: 'Andhra Pradesh', nameHi: 'आंध्र प्रदेश' },
  { code: 'AR', nameEn: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश' },
  { code: 'AS', nameEn: 'Assam', nameHi: 'असम' },
  { code: 'BR', nameEn: 'Bihar', nameHi: 'बिहार' },
  { code: 'CG', nameEn: 'Chhattisgarh', nameHi: 'छत्तीसगढ़' },
  { code: 'GA', nameEn: 'Goa', nameHi: 'गोवा' },
  { code: 'GJ', nameEn: 'Gujarat', nameHi: 'गुजरात' },
  { code: 'HR', nameEn: 'Haryana', nameHi: 'हरियाणा' },
  { code: 'HP', nameEn: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश' },
  { code: 'JH', nameEn: 'Jharkhand', nameHi: 'झारखंड' },
  { code: 'KA', nameEn: 'Karnataka', nameHi: 'कर्नाटक' },
  { code: 'KL', nameEn: 'Kerala', nameHi: 'केरल' },
  { code: 'MP', nameEn: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश' },
  { code: 'MH', nameEn: 'Maharashtra', nameHi: 'महाराष्ट्र' },
  { code: 'MN', nameEn: 'Manipur', nameHi: 'मणिपुर' },
  { code: 'ML', nameEn: 'Meghalaya', nameHi: 'मेघालय' },
  { code: 'MZ', nameEn: 'Mizoram', nameHi: 'मिजोरम' },
  { code: 'NL', nameEn: 'Nagaland', nameHi: 'नागालैंड' },
  { code: 'OD', nameEn: 'Odisha', nameHi: 'ओडिशा' },
  { code: 'PB', nameEn: 'Punjab', nameHi: 'पंजाब' },
  { code: 'RJ', nameEn: 'Rajasthan', nameHi: 'राजस्थान' },
  { code: 'SK', nameEn: 'Sikkim', nameHi: 'सिक्किम' },
  { code: 'TN', nameEn: 'Tamil Nadu', nameHi: 'तमिलनाडु' },
  { code: 'TS', nameEn: 'Telangana', nameHi: 'तेलंगाना' },
  { code: 'TR', nameEn: 'Tripura', nameHi: 'त्रिपुरा' },
  { code: 'UP', nameEn: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश' },
  { code: 'UK', nameEn: 'Uttarakhand', nameHi: 'उत्तराखंड' },
  { code: 'WB', nameEn: 'West Bengal', nameHi: 'पश्चिम बंगाल' },

  // 8 Union Territories
  { code: 'AN', nameEn: 'Andaman and Nicobar Islands', nameHi: 'अंडमान और निकोबार द्वीप समूह', isUT: true },
  { code: 'CH', nameEn: 'Chandigarh', nameHi: 'चंडीगढ़', isUT: true },
  { code: 'DH', nameEn: 'Dadra & Nagar Haveli and Daman & Diu', nameHi: 'दादरा और नगर हवेली एवं दमन और दीव', isUT: true },
  { code: 'DL', nameEn: 'Delhi (NCT)', nameHi: 'दिल्ली (एनसीटी)', isUT: true },
  { code: 'JK', nameEn: 'Jammu and Kashmir', nameHi: 'जम्मू और कश्मीर', isUT: true },
  { code: 'LA', nameEn: 'Ladakh', nameHi: 'लद्दाख', isUT: true },
  { code: 'LD', nameEn: 'Lakshadweep', nameHi: 'लक्षद्वीप', isUT: true },
  { code: 'PY', nameEn: 'Puducherry', nameHi: 'पुदुचेरी', isUT: true },
];

export const CASTE_CATEGORIES = [
  { id: 'General', nameEn: 'General / Unreserved', nameHi: 'सामान्य / अनारक्षित' },
  { id: 'OBC', nameEn: 'Other Backward Class (OBC)', nameHi: 'अन्य पिछड़ा वर्ग (ओबीसी)' },
  { id: 'SC', nameEn: 'Scheduled Caste (SC)', nameHi: 'अनुसूचित जाति (एससी)' },
  { id: 'ST', nameEn: 'Scheduled Tribe (ST)', nameHi: 'अनुसूचित जनजाति (एसटी)' },
  { id: 'EWS', nameEn: 'Economically Weaker Section (EWS)', nameHi: 'आर्थिक रूप से कमजोर वर्ग (ईडब्ल्यूएस)' },
  { id: 'Minority', nameEn: 'Religious Minority', nameHi: 'अल्पसंख्यक वर्ग' },
  { id: 'Divyangjan', nameEn: 'Person with Disability (Divyangjan)', nameHi: 'दिव्यांगजन (विशेष योग्यजन)' },
];

export const OCCUPATIONS = [
  { id: 'Student', nameEn: 'Student', nameHi: 'विद्यार्थी / छात्र' },
  { id: 'Farmer', nameEn: 'Farmer / Cultivator', nameHi: 'किसान / काश्तकार' },
  { id: 'Agricultural Worker', nameEn: 'Agricultural Labourer', nameHi: 'कृषि मजदूर' },
  { id: 'Self-Employed', nameEn: 'Self-Employed / Small Business', nameHi: 'स्वरोजगार / छोटा व्यापारी' },
  { id: 'Daily Wage', nameEn: 'Daily Wage Worker / Street Vendor', nameHi: 'दैनिक मजदूर / रेहड़ी-पटरी' },
  { id: 'Salaried', nameEn: 'Private / Government Salaried', nameHi: 'वेतनभोगी कर्मचारी' },
  { id: 'Unemployed', nameEn: 'Unemployed Job Seeker', nameHi: 'बेरोजगार युवा' },
  { id: 'Senior Citizen', nameEn: 'Senior Citizen / Retired', nameHi: 'वरिष्ठ नागरिक / सेवानिवृत्त' },
  { id: 'Homemaker', nameEn: 'Homemaker', nameHi: 'गृहणी' },
];

export const EDUCATION_LEVELS = [
  { id: 'Below 10th', nameEn: 'Below 10th Standard', nameHi: '10वीं से कम' },
  { id: '10th Pass', nameEn: '10th Pass (Matriculation)', nameHi: '10वीं पास (मैट्रिक)' },
  { id: '12th Pass', nameEn: '12th Pass (Higher Secondary)', nameHi: '12वीं पास (इंटरमीडिएट)' },
  { id: 'ITI/Diploma', nameEn: 'ITI / Polytechnic / Diploma', nameHi: 'आईटीआई / डिप्लोमा' },
  { id: 'Graduate', nameEn: 'Graduate (Bachelor’s Degree)', nameHi: 'स्नातक (ग्रेजुएट)' },
  { id: 'Post Graduate', nameEn: 'Post Graduate / Doctorate', nameHi: 'स्नातकोत्तर (पोस्ट ग्रेजुएट)' },
];
