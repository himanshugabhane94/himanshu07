export interface CategoryConfig {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  color: string;
  accent: string;
  taglineEn: string;
  taglineHi: string;
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    id: 'women',
    slug: 'women',
    nameEn: 'Women & Child',
    nameHi: 'महिला एवं बाल विकास',
    icon: 'HeartHandshake',
    color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
    accent: '#E11D48',
    taglineEn: 'Maternity, girl child, self-help groups & women empowerment schemes',
    taglineHi: 'मातृत्व, बालिका, स्वयं सहायता समूह और महिला सशक्तिकरण योजनाएं',
  },
  {
    id: 'students',
    slug: 'students',
    nameEn: 'Students & Youth',
    nameHi: 'छात्र एवं युवा',
    icon: 'GraduationCap',
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    accent: '#2563EB',
    taglineEn: 'Pre-matric, post-matric, higher education scholarships & coaching assistance',
    taglineHi: 'प्री-मैट्रिक, पोस्ट-मैट्रिक, उच्च शिक्षा छात्रवृत्तियां एवं कोचिंग सहायता',
  },
  {
    id: 'farmers',
    slug: 'farmers',
    nameEn: 'Farmers & Agriculture',
    nameHi: 'किसान एवं कृषि',
    icon: 'Sprout',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
    accent: '#059669',
    taglineEn: 'Direct income support, crop insurance, solar pumps & subsidized credit',
    taglineHi: 'प्रत्यक्ष आय सहायता, फसल बीमा, सोलर पंप एवं रियायती ऋण',
  },
  {
    id: 'senior-citizens',
    slug: 'senior-citizens',
    nameEn: 'Senior Citizens',
    nameHi: 'वरिष्ठ नागरिक',
    icon: 'Award',
    color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
    accent: '#D97706',
    taglineEn: 'Old age pensions, assisted living aids & senior citizen safety nets',
    taglineHi: 'वृद्धावस्था पेंशन, सहायक जीवन उपकरण एवं वरिष्ठ सामाजिक सुरक्षा',
  },
  {
    id: 'divyangjan',
    slug: 'divyangjan',
    nameEn: 'Divyangjan (PwD)',
    nameHi: 'दिव्यांगजन',
    icon: 'Accessibility',
    color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
    accent: '#7C3AED',
    taglineEn: 'Assistive devices, disability pensions, UDID card benefits & equal opportunity',
    taglineHi: 'सहायक उपकरण, दिव्यांगता पेंशन, यूडीआईडी कार्ड लाभ एवं समान अवसर',
  },
  {
    id: 'employment',
    slug: 'employment',
    nameEn: 'Employment & Skills',
    nameHi: 'रोजगार एवं कौशल',
    icon: 'Briefcase',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100',
    accent: '#0891B2',
    taglineEn: 'Free vocational training, guaranteed rural employment & street vendor micro-loans',
    taglineHi: 'मुफ्त व्यावसायिक प्रशिक्षण, गारंटीकृत ग्रामीण रोजगार एवं सूक्ष्म ऋण',
  },
  {
    id: 'housing',
    slug: 'housing',
    nameEn: 'Housing & Shelter',
    nameHi: 'आवास एवं आश्रय',
    icon: 'Home',
    color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
    accent: '#EA580C',
    taglineEn: 'Pucca house grants and interest subsidies for urban and rural families',
    taglineHi: 'शहरी व ग्रामीण परिवारों के लिए पक्का मकान अनुदान व ब्याज सब्सिडी',
  },
  {
    id: 'health',
    slug: 'health',
    nameEn: 'Health & Wellness',
    nameHi: 'स्वास्थ्य एवं परिवार कल्याण',
    icon: 'HeartPulse',
    color: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100',
    accent: '#0D9488',
    taglineEn: 'Cashless hospital treatment, Jan Aushadhi generic medicines & universal vaccine cover',
    taglineHi: 'निशुल्क अस्पताल इलाज, जन औषधि जेनेरिक दवाएं और सार्वभौमिक टीकाकरण',
  },
];
