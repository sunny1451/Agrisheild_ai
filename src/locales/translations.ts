import { LanguageCode } from '../types/user';

export interface Translations {
  appName: string;
  tagline: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  fieldHealth: string;
  fieldHealthExplanationGood: string;
  fieldHealthExplanationWarning: string;
  fieldHealthExplanationCritical: string;
  soilMoisture: string;
  motorCurrent: string;
  voltage: string;
  waterLevel: string;
  temperature: string;
  humidity: string;
  pumpStatus: string;
  running: string;
  stopped: string;
  startPump: string;
  stopPump: string;
  automaticSafetyCutoff: string;
  manualAction: string;
  dryRunDetected: string;
  overcurrentDetected: string;
  aiMotorRisk: string;
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;
  irrigationAdvice: string;
  recommendation: string;
  liveDataConnected: string;
  connectionUnstable: string;
  deviceOffline: string;
  alerts: string;
  dashboard: string;
  fields: string;
  pumpControl: string;
  aiInsights: string;
  reports: string;
  maintenance: string;
  devices: string;
  settings: string;
  simulator: string;
  normal: string;
  warning: string;
  critical: string;
  healthy: string;
  quickActions: string;
  lastUpdated: string;
  addMonitoredField: string;
  addPump: string;
  createPump: string;
  saveSettings: string;
  saveSuccess: string;
  farmerInfo: string;
  fullName: string;
  mobilePhone: string;
  emailAddress: string;
  farmName: string;
  hardwareThresholds: string;
  languageAndAccessibility: string;
  selectLanguage: string;
  fieldZones: string;
  switchField: string;
  close: string;
  cancel: string;
  createField: string;
  fieldName: string;
  cropTypeLabel: string;
  areaAcresLabel: string;
  soilTypeLabel: string;
  cropStageLabel: string;
  gatewayDevice: string;
  home: string;
  pumpNav: string;
  menu: string;
  aiAdvisorTitle: string;
  aiAdvisorSubtitle: string;
  aiAdvisorPlaceholder: string;
  aiAdvisorListening: string;
  aiAdvisorVoiceUnsupported: string;
  aiAdvisorMicDenied: string;
  aiAdvisorMicError: string;
  aiAdvisorSynthesizing: string;
  aiAdvisorSuggestions: string;
  aiAdvisorDigitalTwinActive: string;
  aiAdvisorTapToStop: string;
  aiAdvisorSpeakNow: string;
  aiAdvisorReviewText: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: "AgriShield AI",
    tagline: "Predictive Digital Twin for Smart Agriculture",
    greetingMorning: "Good Morning, Farmer",
    greetingAfternoon: "Good Afternoon, Farmer",
    greetingEvening: "Good Evening, Farmer",
    fieldHealth: "FIELD HEALTH",
    fieldHealthExplanationGood: "Your field and pump are operating normally.",
    fieldHealthExplanationWarning: "Moderate stress detected. Check moisture and voltage levels.",
    fieldHealthExplanationCritical: "Critical condition detected! Safety intervention active.",
    soilMoisture: "SOIL MOISTURE",
    motorCurrent: "MOTOR CURRENT",
    voltage: "VOLTAGE",
    waterLevel: "WATER LEVEL",
    temperature: "TEMPERATURE",
    humidity: "HUMIDITY",
    pumpStatus: "FARM PUMP",
    running: "RUNNING",
    stopped: "STOPPED",
    startPump: "START PUMP",
    stopPump: "STOP PUMP",
    automaticSafetyCutoff: "AUTOMATIC SAFETY CUTOFF",
    manualAction: "MANUAL ACTION",
    dryRunDetected: "DRY-RUN CONDITION DETECTED",
    overcurrentDetected: "OVERCURRENT DETECTED",
    aiMotorRisk: "AI MOTOR RISK",
    lowRisk: "LOW RISK",
    mediumRisk: "MEDIUM RISK",
    highRisk: "HIGH RISK",
    irrigationAdvice: "IRRIGATION ADVICE",
    recommendation: "Recommendation",
    liveDataConnected: "Live data connected",
    connectionUnstable: "Connection unstable",
    deviceOffline: "Device offline — showing last available data",
    alerts: "Alerts & Safety",
    dashboard: "Dashboard",
    fields: "Fields",
    pumpControl: "Pump Control",
    aiInsights: "AI Insights",
    reports: "Reports & Analytics",
    maintenance: "Predictive Maintenance",
    devices: "Device Gateway",
    settings: "Settings",
    simulator: "IoT Simulator",
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
    healthy: "Healthy",
    quickActions: "Quick Actions",
    lastUpdated: "Last updated",
    addMonitoredField: "Add Monitored Field",
    addPump: "Add Farm Pump",
    createPump: "Save & Connect Pump",
    saveSettings: "Save System Configurations",
    saveSuccess: "All configurations and preferences updated successfully!",
    farmerInfo: "Farmer Information & Contact",
    fullName: "Full Name",
    mobilePhone: "Mobile Phone (SMS Alerts)",
    emailAddress: "Email Address",
    farmName: "Farm / Landholding Name",
    hardwareThresholds: "Failsafe Trigger Thresholds (ESP32 Guard)",
    languageAndAccessibility: "Language & Farmer Accessibility",
    selectLanguage: "Select Language",
    fieldZones: "Farm Fields & Crop Blocks",
    switchField: "Switch Active Field",
    close: "Close",
    cancel: "Cancel",
    createField: "Save & Monitor Field",
    fieldName: "Field Name / Zone Identifier",
    cropTypeLabel: "Crop Variety",
    areaAcresLabel: "Land Area (Acres)",
    soilTypeLabel: "Soil Type",
    cropStageLabel: "Crop Growth Stage",
    gatewayDevice: "Assigned IoT Gateway Device",
    home: "Home",
    pumpNav: "Pump",
    menu: "Menu",
    aiAdvisorTitle: "AgriShield AI Advisor",
    aiAdvisorSubtitle: "Crop & Pump Health Specialist",
    aiAdvisorPlaceholder: "Ask about crop health, pump maintenance, or irrigation...",
    aiAdvisorListening: "Listening in English... Speak your question",
    aiAdvisorVoiceUnsupported: "Voice input is not supported in this browser. Please type your question.",
    aiAdvisorMicDenied: "Microphone permission denied. Please allow access in browser settings or type your question.",
    aiAdvisorMicError: "Voice input error occurred. Please try again or type your question.",
    aiAdvisorSynthesizing: "AgriShield AI is synthesizing agronomic telemetry...",
    aiAdvisorSuggestions: "Suggestions:",
    aiAdvisorDigitalTwinActive: "Digital Twin Active",
    aiAdvisorTapToStop: "Tap to stop listening",
    aiAdvisorSpeakNow: "Listening... speak clearly into your mic",
    aiAdvisorReviewText: "Speech recognized. Review or edit before sending."
  },
  te: {
    appName: "అగ్రిషీల్డ్ AI",
    tagline: "స్మార్ట్ వ్యవసాయం కొరకు ప్రిడిక్టివ్ డిజిటల్ ట్విన్",
    greetingMorning: "శుభోదయం, రైతు సోదరులారా",
    greetingAfternoon: "శుభ మధ్యాహ్నం, రైతు సోదరులారా",
    greetingEvening: "శుభ సాయంత్రం, రైతు సోదరులారా",
    fieldHealth: "పొలం ఆరోగ్య స్కోర్",
    fieldHealthExplanationGood: "మీ పొలం మరియు మోటార్ పంప్ సాధారణంగా పనిచేస్తున్నాయి.",
    fieldHealthExplanationWarning: "తేమ లేదా వోల్టేజ్ లో ఒడిదుడుకులు ఉన్నాయి. పరిశీలించండి.",
    fieldHealthExplanationCritical: "ప్రమాదకర పరిస్థితి! మోటార్ రక్షణ వ్యవస్థ చురుగ్గా ఉంది.",
    soilMoisture: "నేల తేమ శాతం",
    motorCurrent: "మోటార్ కరెంట్",
    voltage: "విద్యుత్ వోల్టేజ్",
    waterLevel: "నీటి మట్టం",
    temperature: "ఉష్ణోగ్రత",
    humidity: "గాలిలో తేమ",
    pumpStatus: "సాగునీటి పంపు",
    running: "నడుస్తున్నది (RUNNING)",
    stopped: "ఆపివేయబడింది (STOPPED)",
    startPump: "పంపు స్టార్ట్ చేయండి",
    stopPump: "పంపు ఆపివేయండి",
    automaticSafetyCutoff: "స్వయంచాలక భద్రతా కట్-ఆఫ్",
    manualAction: "రైతు సూచన (మాన్యువల్)",
    dryRunDetected: "డ్రై-రన్ (నీరు లేకపోవడం) గుర్తించబడింది",
    overcurrentDetected: "అధిక కరెంట్ (ఓవర్‌కరెంట్) గుర్తించబడింది",
    aiMotorRisk: "AI మోటార్ ప్రమాద అంచనా",
    lowRisk: "తక్కువ ప్రమాదం (సురక్షితం)",
    mediumRisk: "మధ్యస్థ ప్రమాదం",
    highRisk: "తీవ్ర ప్రమాదం (జాగ్రత్త)",
    irrigationAdvice: "సాగునీటి సలహా",
    recommendation: "AI సలహా",
    liveDataConnected: "సెన్సార్లు ఆన్‌లైన్‌లో ఉన్నాయి",
    connectionUnstable: "కనెక్షన్ బలహీనంగా ఉంది",
    deviceOffline: "డివైస్ ఆఫ్‌లైన్ — పాత సమాచారం చూపబడుతోంది",
    alerts: "హెచ్చరికలు & భద్రత",
    dashboard: "డాష్‌బోర్డ్",
    fields: "పొలాలు",
    pumpControl: "పంప్ కంట్రోల్",
    aiInsights: "AI విశ్లేషణ",
    reports: "నివేదికలు",
    maintenance: "మోటార్ నిర్వహణ",
    devices: "IoT డివైసెస్",
    settings: "సెట్టింగ్స్",
    simulator: "IoT సిమ్యులేటర్",
    normal: "సాధారణం",
    warning: "హెచ్చరిక",
    critical: "ప్రమాదం",
    healthy: "ఆరోగ్యకరం",
    quickActions: "త్వరిత చర్యలు",
    lastUpdated: "చివరిగా అప్‌డేట్",
    addMonitoredField: "కొత్త పొలాన్ని జోడించండి",
    addPump: "కొత్త మోటార్ పంపును జోడించండి",
    createPump: "పంపును సేవ్ చేసి కనెక్ట్ చేయండి",
    saveSettings: "సెట్టింగ్స్ సేవ్ చేయండి",
    saveSuccess: "అన్ని వివరాలు మరియు భాష విజయవంతంగా సేవ్ చేయబడ్డాయి!",
    farmerInfo: "రైతు సమాచారం & సంప్రదింపు",
    fullName: "రైతు పూర్తి పేరు",
    mobilePhone: "మొబైల్ ఫోన్ (SMS హెచ్చరికలు)",
    emailAddress: "ఈమెయిల్ చిరునామా",
    farmName: "వ్యవసాయ క్షేత్రం / భూమి పేరు",
    hardwareThresholds: "రక్షణ కట్-ఆఫ్ పరిమితులు (ESP32 Guard)",
    languageAndAccessibility: "భాష & రైతు అనుకూల సెట్టింగ్స్",
    selectLanguage: "భాషను ఎంచుకోండి",
    fieldZones: "పొలాలు & పంట విభాగాలు",
    switchField: "పొలాన్ని మార్చండి",
    close: "మూసివేయి",
    cancel: "రద్దు చేయి",
    createField: "పొలాన్ని సేవ్ చేసి మానిటర్ చేయండి",
    fieldName: "పొలం పేరు / విభాగం",
    cropTypeLabel: "పంట రకం",
    areaAcresLabel: "విస్తీర్ణం (ఎకరాలు)",
    soilTypeLabel: "నేల రకం",
    cropStageLabel: "పంట దశ",
    gatewayDevice: "అనుసంధానించిన IoT పరికరం",
    home: "హోమ్",
    pumpNav: "పంప్",
    menu: "మెనూ",
    aiAdvisorTitle: "అగ్రిషీల్డ్ AI వ్యవసాయ సలహాదారు",
    aiAdvisorSubtitle: "పంట & మోటార్ పంప్ ఆరోగ్య నిపుణుడు",
    aiAdvisorPlaceholder: "పంట ఆరోగ్యం, మోటార్ నిర్వహణ లేదా నీటి తడుల గురించి అడగండి...",
    aiAdvisorListening: "తెలుగులో వింటున్నది... మీ ప్రశ్నను మాట్లాడండి",
    aiAdvisorVoiceUnsupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.",
    aiAdvisorMicDenied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించండి లేదా టైప్ చేయండి.",
    aiAdvisorMicError: "వాయిస్ ఇన్‌పుట్ లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి లేదా టైప్ చేయండి.",
    aiAdvisorSynthesizing: "అగ్రిషీల్డ్ AI వ్యవసాయ మరియు మోటార్ సమాచారాన్ని విశ్లేషిస్తోంది...",
    aiAdvisorSuggestions: "సూచనలు:",
    aiAdvisorDigitalTwinActive: "డిజిటల్ ట్విన్ యాక్టివ్",
    aiAdvisorTapToStop: "వినడం ఆపడానికి తాకండి",
    aiAdvisorSpeakNow: "వింటున్నది... మైక్రోఫోన్‌లో స్పష్టంగా మాట్లాడండి",
    aiAdvisorReviewText: "మాటలు గుర్తించబడ్డాయి. పంపే ముందు సరిచూసుకోండి."
  },
  hi: {
    appName: "एग्रीशील्ड AI",
    tagline: "स्मार्ट कृषि के लिए प्रेडिक्टिव डिजिटल ट्विन",
    greetingMorning: "सुप्रभात, किसान भाई",
    greetingAfternoon: "शुभ दोपहर, किसान भाई",
    greetingEvening: "शुभ संध्या, किसान भाई",
    fieldHealth: "खेत का स्वास्थ्य स्कोर",
    fieldHealthExplanationGood: "आपका खेत और मोटर पंप सामान्य रूप से काम कर रहे हैं।",
    fieldHealthExplanationWarning: "हल्की परेशानी देखी गई है। नमी और वोल्टेज स्तर की जांच करें।",
    fieldHealthExplanationCritical: "गंभीर स्थिति! स्वचालित सुरक्षा कट-ऑफ सक्रिय है।",
    soilMoisture: "मिट्टी की नमी",
    motorCurrent: "मोटर करंट",
    voltage: "बिजली वोल्टेज",
    waterLevel: "जल स्तर",
    temperature: "तापमान",
    humidity: "हवा में नमी",
    pumpStatus: "सिंचाई पंप",
    running: "चालू है (RUNNING)",
    stopped: "बंद है (STOPPED)",
    startPump: "पंप चालू करें",
    stopPump: "पंप बंद करें",
    automaticSafetyCutoff: "स्वचालित सुरक्षा कट-ऑफ",
    manualAction: "मैनुअल कार्रवाई",
    dryRunDetected: "ड्राई-रन (पानी की कमी) का पता चला",
    overcurrentDetected: "ओवरकरंट (अधिक बिजली लोड) का पता चला",
    aiMotorRisk: "AI मोटर जोखिम",
    lowRisk: "कम जोखिम (सुरक्षित)",
    mediumRisk: "मध्यम जोखिम",
    highRisk: "उच्च जोखिम",
    irrigationAdvice: "सिंचाई सलाह",
    recommendation: "सिफारिश",
    liveDataConnected: "सेंसर ऑनलाइन जुड़े हैं",
    connectionUnstable: "कनेक्शन अस्थिर है",
    deviceOffline: "डिवाइस ऑफ़लाइन — पुराना डेटा प्रदर्शित",
    alerts: "अलर्ट और सुरक्षा",
    dashboard: "डैशबोर्ड",
    fields: "खेत",
    pumpControl: "पंप नियंत्रण",
    aiInsights: "AI अंतर्दृष्टि",
    reports: "रिपोर्ट्स",
    maintenance: "मोटर रखरखाव",
    devices: "IoT उपकरण",
    settings: "सेटिंग्स",
    simulator: "IoT सिम्युलेटर",
    normal: "सामान्य",
    warning: "चेतावनी",
    critical: "गंभीर",
    healthy: "स्वस्थ",
    quickActions: "त्वरित कार्रवाई",
    lastUpdated: "अंतिम अपडेट",
    addMonitoredField: "नया खेत जोड़ें",
    addPump: "नया फार्म पंप जोड़ें",
    createPump: "पंप सहेजें और कनेक्ट करें",
    saveSettings: "कॉन्फ़िगरेशन सहेजें",
    saveSuccess: "सभी कॉन्फ़िगरेशन और भाषा सफलतापूर्वक अपडेट हो गए!",
    farmerInfo: "किसान विवरण एवं संपर्क",
    fullName: "किसान का पूरा नाम",
    mobilePhone: "मोबाइल फोन (SMS अलर्ट)",
    emailAddress: "ईमेल पता",
    farmName: "खेत / भूमि का नाम",
    hardwareThresholds: "सुरक्षा कट-ऑफ सीमाएं (ESP32 Guard)",
    languageAndAccessibility: "भाषा एवं किसान सुगमता",
    selectLanguage: "भाषा चुनें",
    fieldZones: "खेत एवं फसल क्षेत्र",
    switchField: "खेत बदलें",
    close: "बंद करें",
    cancel: "रद्द करें",
    createField: "खेत सहेजें और निगरानी करें",
    fieldName: "खेत का नाम / क्षेत्र",
    cropTypeLabel: "फसल का प्रकार",
    areaAcresLabel: "क्षेत्रफल (एकड़)",
    soilTypeLabel: "मिट्टी का प्रकार",
    cropStageLabel: "फसल की स्थिति / चरण",
    gatewayDevice: "IoT गेटवे उपकरण",
    home: "होम",
    pumpNav: "पंप",
    menu: "मेनू",
    aiAdvisorTitle: "एग्रीशील्ड AI कृषि सलाहकार",
    aiAdvisorSubtitle: "फसल एवं मोटर पंप स्वास्थ्य विशेषज्ञ",
    aiAdvisorPlaceholder: "फसल स्वास्थ्य, पंप रखरखाव या सिंचाई के बारे में पूछें...",
    aiAdvisorListening: "हिंदी में सुन रहा है... अपना सवाल बोलें",
    aiAdvisorVoiceUnsupported: "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया टाइप करें।",
    aiAdvisorMicDenied: "माइक्रोफ़ोन अनुमति अस्वीकृत। ब्राउज़र सेटिंग्स में अनुमति दें या टाइप करें।",
    aiAdvisorMicError: "वॉयस इनपुट त्रुटि हुई। कृपया पुनः प्रयास करें या टाइप करें।",
    aiAdvisorSynthesizing: "एग्रीशील्ड AI कृषि टेलीमेट्री का विश्लेषण कर रहा है...",
    aiAdvisorSuggestions: "सुझाव:",
    aiAdvisorDigitalTwinActive: "डिजिटल ट्विन सक्रिय",
    aiAdvisorTapToStop: "सुनना बंद करने के लिए टैप करें",
    aiAdvisorSpeakNow: "सुन रहा है... माइक में स्पष्ट बोलें",
    aiAdvisorReviewText: "आवाज़ पहचानी गई। भेजने से पहले जांचें या संपादित करें।"
  },
  ta: {
    appName: "அக்ரிஷீல்ட் AI",
    tagline: "ஸ்மார்ட் விவசாயத்திற்கான முன்கணிப்பு டிஜிட்டல் இரட்டை",
    greetingMorning: "காலை வணக்கம், விவசாய தோழரே",
    greetingAfternoon: "மதிய வணக்கம், விவசாய தோழரே",
    greetingEvening: "மாலை வணக்கம், விவசாய தோழரே",
    fieldHealth: "நில ஆரோக்கியம்",
    fieldHealthExplanationGood: "உங்கள் வயல் மற்றும் மோட்டார் பம்ப் சீராக இயங்குகின்றன.",
    fieldHealthExplanationWarning: "மிதமான அழுத்தம் கண்டறியப்பட்டது. ஈரப்பதம் மற்றும் மின்னழுத்தத்தை சரிபார்க்கவும்.",
    fieldHealthExplanationCritical: "சிக்கலான நிலை! தானியங்கி பாதுகாப்பு இடைமறிப்பு செயலில் உள்ளது.",
    soilMoisture: "மண் ஈரப்பதம்",
    motorCurrent: "மோட்டார் மின்னோட்டம்",
    voltage: "மின்னழுத்தம்",
    waterLevel: "நீர் மட்டம்",
    temperature: "வெப்பநிலை",
    humidity: "காற்றின் ஈரப்பதம்",
    pumpStatus: "விவசாய பம்ப்",
    running: "இயங்குகிறது (RUNNING)",
    stopped: "நிறுத்தப்பட்டது (STOPPED)",
    startPump: "பம்ப் தொடங்கவும்",
    stopPump: "பம்ப் நிறுத்தவும்",
    automaticSafetyCutoff: "தானியங்கி பாதுகாப்பு கட்-ஆஃப்",
    manualAction: "கைமுறை செயல்பாடு",
    dryRunDetected: "ட்ரை-ரன் (தண்ணீரின்மை) கண்டறியப்பட்டது",
    overcurrentDetected: "அதிக மின்னோட்டம் (ஓவர்கரண்ட்) கண்டறியப்பட்டது",
    aiMotorRisk: "AI மோட்டார் ஆபத்து மதிப்பீடு",
    lowRisk: "குறைந்த ஆபத்து (பாதுகாப்பானது)",
    mediumRisk: "நடுத்தர ஆபத்து",
    highRisk: "அதிக ஆபத்து (எச்சரிக்கை)",
    irrigationAdvice: "பாசன ஆலோசனை",
    recommendation: "AI பரிந்துரை",
    liveDataConnected: "நேரலை சென்சார் இணைக்கப்பட்டுள்ளது",
    connectionUnstable: "இணைப்பு நிலையற்றது",
    deviceOffline: "சாதனம் ஆஃப்லைனில் உள்ளது — கடைசி தரவு காட்டப்படுகிறது",
    alerts: "எச்சரிக்கைகள் & பாதுகாப்பு",
    dashboard: "டாஷ்போர்டு",
    fields: "வயல்கள்",
    pumpControl: "பம்ப் கட்டுப்பாடு",
    aiInsights: "AI நுண்ணறிவு",
    reports: "அறிக்கைகள்",
    maintenance: "முன்கணிப்பு பராமரிப்பு",
    devices: "சாதன நுழைவாயில்",
    settings: "அமைப்புகள்",
    simulator: "IoT சிமுலேட்டர்",
    normal: "இயல்பானது",
    warning: "எச்சரிக்கை",
    critical: "சிக்கலானது",
    healthy: "ஆரோக்கியமானது",
    quickActions: "விரைவு செயல்கள்",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    addMonitoredField: "புதிய வயலைச் சேர்க்கவும்",
    addPump: "புதிய பம்பைச் சேர்க்கவும்",
    createPump: "பம்பை சேமித்து இணைக்கவும்",
    saveSettings: "அமைப்புகளைச் சேமிக்கவும்",
    saveSuccess: "அனைத்து அமைப்புகளும் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!",
    farmerInfo: "விவசாயி தகவல் & தொடர்பு",
    fullName: "முழு பெயர்",
    mobilePhone: "மொபைல் எண் (SMS எச்சரிக்கை)",
    emailAddress: "மின்னஞ்சல் முகவரி",
    farmName: "பண்ணை / நிலத்தின் பெயர்",
    hardwareThresholds: "பாதுகாப்பு தூண்டுதல் வரம்புகள் (ESP32 Guard)",
    languageAndAccessibility: "மொழி & அணுகல்தன்மை அமைப்புகள்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    fieldZones: "வயல் பகுதிகள் & பயிர் தொகுதிகள்",
    switchField: "செயலில் உள்ள வயலை மாற்றவும்",
    close: "மூடு",
    cancel: "ரத்து செய்",
    createField: "வயலை சேமித்து கண்காணிக்கவும்",
    fieldName: "வயல் பெயர் / பகுதி",
    cropTypeLabel: "பயிர் வகை",
    areaAcresLabel: "நிலப்பரப்பு (ஏக்கர்)",
    soilTypeLabel: "மண் வகை",
    cropStageLabel: "பயிர் வளர்ச்சி நிலை",
    gatewayDevice: "IoT நுழைவாயில் சாதனம்",
    home: "முகப்பு",
    pumpNav: "பம்ப்",
    menu: "பட்டியல்",
    aiAdvisorTitle: "அக்ரிஷீல்ட் AI விவசாய ஆலோசகர்",
    aiAdvisorSubtitle: "பயிர் & பம்ப் சுகாதார நிபுணர்",
    aiAdvisorPlaceholder: "பயிர் ஆரோக்கியம், பம்ப் பராமரிப்பு அல்லது பாசனம் பற்றி கேளுங்கள்...",
    aiAdvisorListening: "தமிழில் கேட்கிறது... உங்கள் கேள்வியைப் பேசுங்கள்",
    aiAdvisorVoiceUnsupported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. தயவுசெய்து தட்டச்சு செய்யவும்.",
    aiAdvisorMicDenied: "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவி அமைப்புகளில் அனுமதி வழங்கவும் அல்லது தட்டச்சு செய்யவும்.",
    aiAdvisorMicError: "குரல் உள்ளீட்டு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது தட்டச்சு செய்யவும்.",
    aiAdvisorSynthesizing: "அக்ரிஷீல்ட் AI தரவை பகுப்பாய்வு செய்கிறது...",
    aiAdvisorSuggestions: "பரிந்துரைகள்:",
    aiAdvisorDigitalTwinActive: "டிஜிட்டல் இரட்டை செயலில் உள்ளது",
    aiAdvisorTapToStop: "கேட்பதை நிறுத்த தட்டவும்",
    aiAdvisorSpeakNow: "கேட்கிறது... மைக்கில் தெளிவாகப் பேசுங்கள்",
    aiAdvisorReviewText: "பேச்சு அங்கீகரிக்கப்பட்டது. அனுப்புவதற்கு முன் சரிபார்க்கவும் அல்லது திருத்தவும்."
  }
};
