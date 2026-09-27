export interface PassageItem {
  id: number;
  text: string;
  topic: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en' | 'hi';
}

export const PASSAGES: PassageItem[] = [
  // English Easy
  {
    id: 1,
    language: 'en',
    difficulty: 'easy',
    topic: 'Solar System and Planets',
    category: 'General Science',
    text: "The solar system consists of the sun and everything bound to it by gravity. The eight planets orbit around the central star in orderly paths. Earth is the third planet from the sun and is the only known world that supports life. Water covers more than seventy percent of our home planet. Clean energy from sunlight and wind will power the future of transportation and modern industry."
  },
  {
    id: 2,
    language: 'en',
    difficulty: 'easy',
    topic: 'Democratic Participation',
    category: 'Civics & Society',
    text: "Good governance requires transparency, accountability, and the rule of law. A democracy flourishes when citizens actively participate in elections and public debates. Public libraries and community centers provide access to knowledge for every child. Hard work combined with honesty always produces sustainable success in personal and professional life."
  },
  {
    id: 3,
    language: 'en',
    difficulty: 'easy',
    topic: 'Digital Touch Typing',
    category: 'Skill Education',
    text: "Digital literacy is vital for students in the twenty-first century. Learning to type with all fingers without looking at the keyboard saves hundreds of hours every year. Practice typing every morning for fifteen minutes to build finger muscle memory and boost your daily confidence."
  },
  {
    id: 4,
    language: 'en',
    difficulty: 'easy',
    topic: 'Forest Conservation',
    category: 'Environment',
    text: "Forests are the green lungs of our planet. They absorb carbon dioxide from the air and release pure oxygen for all living species. Conserving natural wildlife and planting native trees prevents severe soil erosion and preserves freshwater reservoirs for upcoming generations."
  },

  // English Medium
  {
    id: 11,
    language: 'en',
    difficulty: 'medium',
    topic: 'Digital Governance and Credit Inclusion',
    category: 'Economic Development',
    text: "Economic development in emerging nations relies on robust public infrastructure, quality education, and reliable healthcare systems. Digital payment systems such as the Unified Payments Interface have transformed commerce across rural and urban markets. Financial inclusion empowers millions of micro-entrepreneurs by granting direct access to formal banking credits without bureaucratic friction."
  },
  {
    id: 12,
    language: 'en',
    difficulty: 'medium',
    topic: 'Indian Constitutional Heritage',
    category: 'Constitutional Law',
    text: "The Constitution of India is the supreme law of the land. It lays down the fundamental political code, structure, procedures, powers, and duties of government institutions. It sets out fundamental rights, directive principles, and the duties of citizens. It is the longest written national constitution in the world, drafted meticulously under the leadership of Dr. Bhimrao Ramji Ambedkar."
  },
  {
    id: 13,
    language: 'en',
    difficulty: 'medium',
    topic: 'Space Exploration Achievements',
    category: 'Science & Technology',
    text: "India has made remarkable strides in space exploration through the Indian Space Research Organisation. The Chandrayaan missions demonstrated indigenous technical prowess by landing gently near the lunar south pole. Space technology now aids weather forecasting, disaster warning, agricultural mapping, and tele-education in remote Himalayan valleys and coastal zones."
  },
  {
    id: 14,
    language: 'en',
    difficulty: 'medium',
    topic: 'Administrative Citizen Delivery',
    category: 'Public Administration',
    text: "Information technology has revolutionized administrative services across public departments. Citizens can now apply for identity cards, passports, agricultural subsidies, and driving licenses through centralized citizen service portals. This digital transition minimizes administrative delays and promotes corruption-free governance across public agencies."
  },
  {
    id: 15,
    language: 'en',
    difficulty: 'medium',
    topic: 'Renewable Energy Transition',
    category: 'National Economy',
    text: "Harnessing solar and wind power forms the cornerstone of green transition in emerging industrial economies. Large-scale photovoltaic parks across western regions contribute significantly to the national electric grid. Decentralized rooftop installations provide clean electricity to rural clinics, schools, and cold storage units, reducing reliance on conventional thermal generation."
  },

  // English Hard
  {
    id: 21,
    language: 'en',
    difficulty: 'hard',
    topic: 'Judicial Review and Basic Structure',
    category: 'Judicial Administration',
    text: "Judicial review constitutes an indispensable cornerstone of the constitutional architecture, ensuring that legislative enactments and executive proclamations conform rigorously to constitutional guarantees. The doctrine of the basic structure articulates that Parliament cannot alter the essential identity of the organic charter, preserving thereby democratic pluralism and institutional checks."
  },
  {
    id: 22,
    language: 'en',
    difficulty: 'hard',
    topic: 'Macroeconomic Deficit Management',
    category: 'Public Finance',
    text: "Macroeconomic stability necessitates prudent fiscal deficit management, counter-cyclical monetary policy interventions, and calibrated trade facilitation mechanisms. Disruption in global supply chains, fluctuating hydrocarbon commodities, and geostrategic uncertainties mandate comprehensive structural reforms to stimulate export competitiveness and sustain industrial employment."
  },
  {
    id: 23,
    language: 'en',
    difficulty: 'hard',
    topic: 'Metropolitan Solid Waste Systems',
    category: 'Urban Planning',
    text: "Sustainable urbanization demands integrated multimodal transport transit networks, zero-discharge wastewater recycling infrastructure, and stringent decentralized municipal solid waste segregation protocols. Metropolitan municipal corporations must mobilize green municipal bonds and leverage geospatial satellite telemetry to mitigate urban heat island phenomena."
  },

  // Hindi Easy (Unicode Mangal Font)
  {
    id: 31,
    language: 'hi',
    difficulty: 'easy',
    topic: 'हमारा प्यारा भारत',
    category: 'राष्ट्रीय संस्कृति',
    text: "भारत एक विशाल और सुंदर देश है। यहाँ विभिन्न धर्मों, भाषाओं और संस्कृतियों के लोग प्रेम और सद्भाव के साथ मिलजुलकर रहते हैं। हिमालय के ऊंचे पर्वत उत्तर दिशा में भारत की रक्षा करते हैं। गंगा और यमुना जैसी पवित्र नदियाँ हमारी भूमि को उपजाऊ और हरा-भरा बनाती हैं।"
  },
  {
    id: 32,
    language: 'hi',
    difficulty: 'easy',
    topic: 'शिक्षा का वास्तविक महत्व',
    category: 'नैतिक शिक्षा',
    text: "शिक्षा जीवन का सबसे महत्वपूर्ण आधार है। एक शिक्षित व्यक्ति न केवल अपना भविष्य संवारता है, बल्कि समाज और राष्ट्र के निर्माण में भी सकारात्मक योगदान देता है। हमें प्रतिदिन कुछ नया सीखने का निरंतर प्रयास करना चाहिए और समय का सदुपयोग करना चाहिए।"
  },
  {
    id: 33,
    language: 'hi',
    difficulty: 'easy',
    topic: 'कंप्यूटर और आधुनिक जीवन',
    category: 'सूचना प्रौद्योगिकी',
    text: "कंप्यूटर और इंटरनेट ने हमारे दैनिक जीवन को बहुत सरल बना दिया है। आजकल विद्यार्थी घर बैठे ही देश-विदेश की उत्कृष्ट पुस्तकें पढ़ सकते हैं। सही दिशा में किया गया परिश्रम ही सच्ची सफलता की कुंजी है।"
  },

  // Hindi Medium
  {
    id: 41,
    language: 'hi',
    difficulty: 'medium',
    topic: 'भारतीय संविधान एवं नागरिक कर्तव्य',
    category: 'संविधान एवं राजनीति',
    text: "भारतीय संविधान विश्व का सबसे विस्तृत और प्रभावशाली लिखित संविधान है। यह प्रत्येक नागरिक को समानता, स्वतंत्रता और न्याय का मौलिक अधिकार प्रदान करता है। डॉ. भीमराव आंबेडकर की अध्यक्षता में तैयार किया गया यह पवित्र दस्तावेज हमारे लोकतंत्र की आत्मा है। नागरिकों को अपने अधिकारों के साथ-साथ मौलिक कर्तव्यों का भी निष्ठापूर्वक पालन करना चाहिए।"
  },
  {
    id: 42,
    language: 'hi',
    difficulty: 'medium',
    topic: 'डिजिटल इंडिया अभियान',
    category: 'लोक प्रशासन',
    text: "डिजिटल इंडिया अभियान ने सरकारी सेवाओं को जन-जन तक सुलभ बनाया है। आधार कार्ड, डिजिटल लॉकर और प्रत्यक्ष लाभ अंतरण योजना से बिचौलियों की भूमिका समाप्त हुई है। अब सुदूर ग्रामीण अंचलों में भी किसान भाई मौसम की जानकारी और अपनी फसलों का उचित मूल्य मोबाइल के माध्यम से आसानी से प्राप्त कर रहे हैं।"
  },
  {
    id: 43,
    language: 'hi',
    difficulty: 'medium',
    topic: 'स्वच्छ भारत एवं जन स्वास्थ्य',
    category: 'सामुदायिक विकास',
    text: "स्वच्छ भारत अभियान ने देश में स्वच्छता के प्रति एक व्यापक जनक्रांति को जन्म दिया है। जब प्रत्येक नागरिक अपने मोहल्ले, गांव और शहर को स्वच्छ रखने का संकल्प लेता है, तभी राष्ट्र का समग्र विकास संभव होता है। स्वच्छता से अनेक घातक बीमारियों की रोकथाम होती है और जीवन स्तर में अभूतपूर्व सुधार आता है।"
  },

  // Hindi Hard
  {
    id: 51,
    language: 'hi',
    difficulty: 'hard',
    topic: 'लोक प्रशासन में पारदर्शिता एवं संवेदनशीलता',
    category: 'प्रशासनिक सुधार',
    text: "प्रशासनिक दक्षता एवं सुशासन की स्थापना हेतु लोकसेवकों में पारदर्शिता, संवेदनशीलता और जवाबदेही की भावना का समावेशन परमावश्यक है। समकालीन युग में लोक प्रशासन केवल पारंपरिक विधि-व्यवस्था संधारण तक सीमित न रहकर कल्याणकारी सामाजिक परिवर्तन और समावेशी संवृद्धि का सशक्त संवाहक बन चुका है।"
  },
  {
    id: 52,
    language: 'hi',
    difficulty: 'hard',
    topic: 'न्यायपालिका की स्वतंत्रता एवं विशेषाधिकार',
    category: 'न्यायिक प्रणाली',
    text: "न्यायपालिका की स्वतंत्रता हमारे संवैधानिक तंत्र का अक्षुण्ण स्तम्भ है। संविधान के अनुच्छेद बत्तीस तथा दो सौ छब्बीस के अंतर्गत न्याय सम्बन्धी परमादेश जारी करने का सामर्थ्य यह सुनिश्चित करता है कि कार्यपालिका अथवा व्यवस्थापिका द्वारा नागरिकों के मूलभूत अधिकारों का अतिक्रमण कदापि न हो सके।"
  },
  {
    id: 53,
    language: 'hi',
    difficulty: 'hard',
    topic: 'पर्यावरणीय संतुलन एवं संपोषणीय विकास',
    category: 'पारिस्थितिकी विज्ञान',
    text: "सतत संधारणीय विकास के लक्ष्यों की संसिद्धि हेतु पारिस्थितिक संतुलन, नवीकरणीय ऊर्जा स्रोतों का संवर्धन तथा जल संचयन की पारंपरिक पद्धतियों का पुनरुद्धार अपरिहार्य हो चुका है। अनियंत्रित औद्योगिकीकरण से जनित जलवायु परिवर्तन के दुष्प्रभावों से निपटने हेतु वैश्विक स्तर पर समन्वित नीतिगत अनुपालन आवश्यक है।"
  }
];

export interface ExamPreset {
  id: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  targetWpm: number;
  language: 'en' | 'hi';
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  tag: string;
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc_chsl',
    title: 'SSC CGL & CHSL (DEST)',
    subtitle: '15 Mins Standard Exam Pattern',
    durationSeconds: 900,
    targetWpm: 35,
    language: 'en',
    difficulty: 'medium',
    description: 'CHSL requires 35 WPM (10,500 KDPH in English) or 30 WPM (9,000 KDPH in Hindi). CGL Data Entry demands 2,000 key depressions in 15 mins (approx 27 WPM).',
    tag: '15 Mins'
  },
  {
    id: 'cpct_hindi',
    title: 'MP CPCT (Hindi + English)',
    subtitle: 'Unicode Mangal Font Practice',
    durationSeconds: 900,
    targetWpm: 20,
    language: 'hi',
    difficulty: 'medium',
    description: 'English qualifying score is 30 WPM (50%). Hindi typing test requires 20 WPM (50%) using Unicode Mangal Inscript layout.',
    tag: '15 Mins'
  },
  {
    id: 'high_court',
    title: 'High Court & Stenographer',
    subtitle: 'Court Stenographer & Clerk Exam',
    durationSeconds: 600,
    targetWpm: 40,
    language: 'en',
    difficulty: 'hard',
    description: 'Allahabad & Patna High Court tests require 30-40 WPM with high accuracy (over 95%). Mistakes are heavily penalized in court exams.',
    tag: '10 Mins'
  }
];
