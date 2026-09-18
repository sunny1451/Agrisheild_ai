import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Lightbulb, RefreshCw, Mic, MicOff, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types/user';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

// Browser Web Speech Recognition locale mappings
const SPEECH_LOCALE_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN'
};

const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  te: 'తెలుగు (Telugu)',
  hi: 'हिंदी (Hindi)',
  ta: 'தமிழ் (Tamil)'
};

export const AgriAdvisorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const {
    currentReading,
    selectedField,
    pumpDetails,
    aiMotorRisk,
    irrigationRecommendation,
    language,
    t
  } = useApp();

  // Initial welcome message in the active language
  const getGreeting = (lang: LanguageCode): string => {
    switch (lang) {
      case 'te':
        return `నమస్కారం రైతు సోదరులారా! నేను మీ అగ్రిషీల్డ్ AI వ్యవసాయ & మోటార్ నిపుణుడిని. ప్రస్తుతం **${selectedField.name}** (${selectedField.cropType}) పరిశీలిస్తున్నాను. నేల తేమ **${currentReading.soilMoisture}%**, పంప్ స్థితి **${pumpDetails.status}**, మరియు మోటార్ ప్రమాద స్థాయి **${aiMotorRisk.riskLevel}**. నేను మీకు ఎలా సహాయపడగలను?`;
      case 'hi':
        return `नमस्ते किसान भाई! मैं आपका एग्रीशील्ड AI कृषि एवं मोटर विशेषज्ञ हूँ। वर्तमान में **${selectedField.name}** (${selectedField.cropType}) की समीक्षा कर रहा हूँ। मिट्टी की नमी **${currentReading.soilMoisture}%** है और पंप स्थिति **${pumpDetails.status}** (${aiMotorRisk.riskLevel} जोखिम)। मैं आज आपकी क्या मदद कर सकता हूँ?`;
      case 'ta':
        return `வணக்கம் விவசாய தோழரே! நான் உங்கள் அக்ரிஷீல்ட் AI பயிர் மற்றும் மோட்டார் நிபுணர். தற்போது **${selectedField.name}** (${selectedField.cropType}) நிலையை ஆய்வு செய்கிறேன். மண் ஈரம் **${currentReading.soilMoisture}%** மற்றும் பம்ப் நிலை **${pumpDetails.status}** (${aiMotorRisk.riskLevel} ஆபத்து). இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்?`;
      case 'en':
      default:
        return `Hello Farmer! I am your AgriShield AI Agronomist & Motor Specialist. Currently reviewing **${selectedField.name}** (${selectedField.cropType}). Soil moisture is **${currentReading.soilMoisture}%** and pump is **${pumpDetails.status}** with **${aiMotorRisk.riskLevel}** motor risk. How can I help you today?`;
    }
  };

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'm1',
      sender: 'ai',
      text: getGreeting(language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [hasBrowserSpeechSupport, setHasBrowserSpeechSupport] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check browser speech support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setHasBrowserSpeechSupport(!!SpeechRecognition);
    }
  }, []);

  // Stop listening when modal closes or unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Stop listening gracefully if user switches language while microphone is active
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, [language]);

  // Scroll to bottom when messages update or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Language-specific quick suggestions
  const getQuickPrompts = (lang: LanguageCode): string[] => {
    switch (lang) {
      case 'te':
        return [
          'బోర్‌వెల్ డ్రై-రన్ ఎలా నివారించాలి?',
          'ప్రస్తుత పంట దశకు సరైన నీటి షెడ్యూల్ ఏమిటి?',
          'తక్కువ వోల్టేజ్ మోటార్‌కి ఎందుకు ప్రమాదకరం?',
          'ప్రస్తుత AI మోటార్ ఆరోగ్య స్కోరు వివరించండి'
        ];
      case 'hi':
        return [
          'बोरवेल में ड्राई-रन को कैसे रोकें?',
          'वर्तमान फसल के लिए उपयुक्त सिंचाई समय क्या है?',
          'कम वोल्टेज 7.5HP मोटर के लिए क्यों खतरनाक है?',
          'वर्तमान AI मोटर स्वास्थ्य स्कोर समझाएं'
        ];
      case 'ta':
        return [
          'போர்வெல் ட்ரை-ரன் ஏற்படுவதை தடுப்பது எப்படி?',
          'தற்போதைய பயிருக்கு உகந்த பாசன அட்டவணை என்ன?',
          'குறைந்த மின்னழுத்தம் மோட்டாருக்கு ஏன் ஆபத்தானது?',
          'AI மோட்டார் சுகாதார மதிப்பெண்ணை விளக்குங்கள்'
        ];
      case 'en':
      default:
        return [
          'How do I prevent dry-run in borewell?',
          'Optimal irrigation schedule for current crop stage?',
          'Why is voltage fluctuation risky for 7.5HP motor?',
          'Explain current AI motor health score'
        ];
    }
  };

  const quickPrompts = getQuickPrompts(language);

  // Toggle voice recognition
  const handleToggleVoiceInput = () => {
    setSpeechError(null);

    // If currently listening, clicking again stops it
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping speech recognition:', e);
        }
      }
      setIsListening(false);
      return;
    }

    // Detect browser support before requesting
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechError(
        t.aiAdvisorVoiceUnsupported ||
          'Voice input is not supported in this browser. Please type your question.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      const targetLocale = SPEECH_LOCALE_MAP[language] || 'en-IN';
      recognition.lang = targetLocale;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const recognizedText = (finalTranscript || interimTranscript).trim();
        if (recognizedText) {
          // Put the recognized speech into the input box for the user to review and edit
          setInput(recognizedText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError(
            t.aiAdvisorMicDenied ||
              'Microphone access was denied. Please allow microphone permission in your browser settings to use voice input, or type your question.'
          );
        } else if (event.error === 'no-speech') {
          // Silence detected, no error message needed
          setSpeechError(null);
        } else if (event.error === 'language-not-supported') {
          setSpeechError(
            `Voice recognition for ${LANGUAGE_LABELS[language] || language} is not supported in this browser. Please type your question.`
          );
        } else {
          setSpeechError(
            t.aiAdvisorMicError ||
              'Voice input error occurred. Please try again or type your question.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Speech recognition initialization error:', err);
      setIsListening(false);
      setSpeechError(
        t.aiAdvisorMicError ||
          'Failed to initialize microphone. Please type your question.'
      );
    }
  };

  // Generate response in the currently selected application language
  const generateResponseInLanguage = (query: string, lang: LanguageCode): string => {
    const q = query.toLowerCase();

    const isDryRunQuery =
      q.includes('dry-run') ||
      q.includes('dry run') ||
      q.includes('water level') ||
      q.includes('borewell') ||
      q.includes('డ్రై-రన్') ||
      q.includes('బోర్') ||
      q.includes('నీరు') ||
      q.includes('ड्राई-रन') ||
      q.includes('बोरवेल') ||
      q.includes('पानी') ||
      q.includes('ட்ரை-ரன்') ||
      q.includes('போர்வெல்') ||
      q.includes('தண்ணீர்');

    const isIrrigationQuery =
      q.includes('irrigation') ||
      q.includes('schedule') ||
      q.includes('moisture') ||
      q.includes('water') ||
      q.includes('పంట') ||
      q.includes('తేమ') ||
      q.includes('తడి') ||
      q.includes('షెడ్యూల్') ||
      q.includes('सिंचाई') ||
      q.includes('नमी') ||
      q.includes('फसल') ||
      q.includes('பாசனம்') ||
      q.includes('ஈரம்') ||
      q.includes('அட்டவணை');

    const isElectricalQuery =
      q.includes('voltage') ||
      q.includes('motor') ||
      q.includes('current') ||
      q.includes('amp') ||
      q.includes('health score') ||
      q.includes('hp') ||
      q.includes('వోల్టేజ్') ||
      q.includes('మోటార్') ||
      q.includes('కరెంట్') ||
      q.includes('విద్యుత్') ||
      q.includes('मोटर') ||
      q.includes('वोल्टेज') ||
      q.includes('बिजली') ||
      q.includes('மோட்டார்') ||
      q.includes('மின்னழுத்தம்') ||
      q.includes('மின்னோட்டம்');

    if (isDryRunQuery) {
      switch (lang) {
        case 'te':
          return `**బోర్‌వెల్ డ్రై-రన్ రక్షణ వ్యూహం:**\n\n1. **కట్-ఆఫ్ నియమం:** మోటార్ పంపు నీరు లేకుండా నడిచినప్పుడు (కరెంట్ < 1.5A 10 సెకన్ల కంటే ఎక్కువ), నీటి సరఫరా లేక ఇంపెల్లర్ వేడెక్కి మెకానికల్ సీల్స్ మరియు బేరింగ్స్ 90 సెకన్లలో పాడవుతాయి.\n2. **అగ్రిషీల్డ్ ఆటో-కట్ ఆఫ్:** మా హార్డ్‌వేర్ సెన్సార్ కరెంట్‌ను నిరంతరం గమనించి వెంటనే మోటార్‌ను ఆపివేస్తుంది.\n3. **రైతుకు సలహా:** మీ **${selectedField.name}** బోర్‌వెల్‌లో భూగర్భ జలాలు రీచార్జ్ కావడానికి 2 నుండి 4 గంటల సమయం ఇచ్చి మళ్ళీ ఆన్ చేయండి.`;
        case 'hi':
          return `**ड्राई-रन सुरक्षा रणनीति:**\n\n1. **कट-ऑफ थ्रेशोल्ड:** जब सबमर्सिबल पंप बिना पानी के चलता है (करंट < 1.5A लगातार 10 सेकंड), तो पानी का स्नेहन न होने से पंप इम्पेलर और बियरिंग 90 सेकंड में गर्म होकर खराब हो सकते हैं।\n2. **एग्रीशील्ड ऑटो-कटऑफ:** हमारा सीटी करंट सेंसर तुरंत मोटर को बंद कर देता है।\n3. **किसान के लिए सलाह:** आपके **${selectedField.name}** बोरवेल में जल स्तर पुनः भरने के लिए 2 से 4 घंटे का समय दें, फिर मोटर चालू करें।`;
        case 'ta':
          return `**ட்ரை-ரன் பாதுகாப்பு உத்தி:**\n\n1. **கட்-ஆஃப் வரம்பு:** சப்மர்சிபிள் பம்ப் தண்ணீரின்றி இயங்கும் போது (மின்னோட்டம் < 1.5A 10 வினாடிகளுக்கு மேல்), நீர் உயவு இல்லாததால் இம்பெல்லர் மற்றும் பேரிங் 90 வினாடிகளில் சேதமடையும்.\n2. **அக்ரிஷீல்ட் தானியங்கி நிறுத்தம்:** எங்களின் ஹார்டுவேர் சென்சார் உடனடியாக மோட்டாரை தானாகவே நிறுத்துகிறது.\n3. **விவசாயிக்கு ஆலோசனை:** உங்கள் **${selectedField.name}** போர்வெல்லில் நிலத்தடி நீர் மட்டம் உயர 2 முதல் 4 மணி நேரம் வரை காத்திருந்து பிறகு பம்பை இயக்கவும்.`;
        case 'en':
        default:
          return `**Dry-Run Protection Strategy:**\n\n1. **Threshold Logic:** When your submersible pump motor runs unloaded (current < 1.5A for >10s), the impeller spins without water lubrication, which rapidly melts mechanical seals and seizes bearings within 90 seconds.\n2. **AgriShield Auto-Cutoff:** Our hardware guard continuously monitors CT current and trips the contactor automatically.\n3. **Recovery Advice:** Allow 2 to 4 hours for the local water column in your ${selectedField.name} borewell to recharge.`;
      }
    }

    if (isIrrigationQuery) {
      switch (lang) {
        case 'te':
          return `**${selectedField.cropType} పంటకు సాగునీటి మార్గదర్శనం:**\n\n- ప్రస్తుత నేల తేమ: **${currentReading.soilMoisture}%**.\n- పరిసర ఉష్ణోగ్రత: **${currentReading.temperature}°C**, గాలిలో తేమ: **${currentReading.humidity}%**.\n- **AI సిఫార్సు:** ${irrigationRecommendation.advice}\n- **ఉత్తమ విధానం:** నీటి ఆవిరి నష్టాన్ని 28% వరకు తగ్గించడానికి ఉదయం (6:00 - 8:30) లేదా సాయంత్రం (5:30 - 7:30) సమయంలో నీరు పెట్టండి.`;
        case 'hi':
          return `**${selectedField.cropType} फसल के लिए सिंचाई मार्गदर्शन:**\n\n- वर्तमान मिट्टी की नमी: **${currentReading.soilMoisture}%**।\n- परिवेश का तापमान: **${currentReading.temperature}°C**, आर्द्रता: **${currentReading.humidity}%**।\n- **AI सिफारिश:** ${irrigationRecommendation.advice}\n- **सर्वोत्तम तरीका:** वाष्पीकरण को 28% तक कम करने के लिए सुबह (6:00 - 8:30 AM) या शाम (5:30 - 7:30 PM) में सिंचाई करें।`;
        case 'ta':
          return `**${selectedField.cropType} பயிருக்கான பாசன வழிகாட்டுதல்:**\n\n- தற்போதைய மண் ஈரம்: **${currentReading.soilMoisture}%**.\n- வெப்பநிலை: **${currentReading.temperature}°C**, காற்றின் ஈரப்பதம்: **${currentReading.humidity}%**.\n- **AI பரிந்துரை:** ${irrigationRecommendation.advice}\n- **சிறந்த நடைமுறை:** ஆவியாதலை 28% குறைக்க அதிகாலை (6:00 - 8:30 AM) அல்லது மாலை (5:30 - 7:30 PM) வேளையில் பாசனம் செய்யவும்.`;
        case 'en':
        default:
          return `**Irrigation Guidance for ${selectedField.cropType}:**\n\n- Current soil moisture is **${currentReading.soilMoisture}%**.\n- Ambient temperature is **${currentReading.temperature}°C** with humidity at **${currentReading.humidity}%**.\n- **Recommendation:** ${irrigationRecommendation.advice}\n- **Best Practice:** Water in early morning (6:00 - 8:30 AM) or evening (5:30 - 7:30 PM) to reduce evaporative loss by up to 28%.`;
      }
    }

    if (isElectricalQuery) {
      switch (lang) {
        case 'te':
          return `**విద్యుత్ మరియు మోటార్ ఆరోగ్య విశ్లేషణ:**\n\n- లైన్ వోల్టేజ్: **${currentReading.voltage} V** (సాధారణ పరిమితి: 220-230V).\n- మోటార్ కరెంట్: **${currentReading.motorCurrent.toFixed(1)} A**.\n- మోటార్ సామర్థ్యం: **${pumpDetails.hpRating} HP** (స్థితి: ${pumpDetails.status}).\n- **ప్రమాద కారకం:** మోటార్‌ను 190V కంటే తక్కువ వోల్టేజ్‌లో నడిపితే టార్క్ కోసం అధిక కరెంట్ లాగి వైండింగ్ 115°C కంటే ఎక్కువ వేడెక్కుతుంది. అగ్రిషీల్డ్ ఆటోమేటిక్‌గా మోటార్‌ను రక్షిస్తుంది.`;
        case 'hi':
          return `**विद्युत एवं मोटर स्वास्थ्य विश्लेषण:**\n\n- लाइन वोल्टेज: **${currentReading.voltage} V** (सामान्य सीमा: 220-230V)।\n- मोटर करंट: **${currentReading.motorCurrent.toFixed(1)} A**।\n- मोटर रेटिंग: **${pumpDetails.hpRating} HP** (स्थिति: ${pumpDetails.status})।\n- **जोखिम कारक:** 190V से कम वोल्टेज पर मोटर चलाने से टॉर्क बनाए रखने के लिए अधिक करंट खिंचता है, जिससे वाइंडिंग अत्यधिक गर्म हो जाती है। एग्रीशील्ड इसे सुरक्षित रखता है।`;
        case 'ta':
          return `**மின்சாரம் மற்றும் மோட்டார் சுகாதார பகுப்பாய்வு:**\n\n- மின்னழுத்தம்: **${currentReading.voltage} V** (இயல்பான அளவு: 220-230V).\n- மோட்டார் மின்னோட்டம்: **${currentReading.motorCurrent.toFixed(1)} A**.\n- மோட்டார் திறன்: **${pumpDetails.hpRating} HP** (நிலை: ${pumpDetails.status}).\n- **ஆபத்து காரணி:** 190V-க்கு குறைவான மின்னழுத்தத்தில் மோட்டாரை இயக்கினால் வைண்டிங் சூடாகி மோட்டார் பழுதடையும். அக்ரிஷீல்ட் பாதுகாப்பு அமைப்பு மோட்டாரை பாதுகாக்கிறது.`;
        case 'en':
        default:
          return `**Electrical Health Analysis:**\n\n- Line Voltage: **${currentReading.voltage} V** (Nominal: 220-230V).\n- Motor Current Draw: **${currentReading.motorCurrent.toFixed(1)} A**.\n- Motor Rating: **${pumpDetails.hpRating} HP** (${pumpDetails.status}).\n- **Risk Factor:** Operating your ${pumpDetails.hpRating} HP motor below 190V forces it to draw excessive amperage to maintain torque, heating winding insulation beyond 115°C. AgriShield automatically logs and safeguards against undervoltage stress.`;
      }
    }

    // Default Telemetry & Agronomy status in current language
    switch (lang) {
      case 'te':
        return `**${selectedField.name}** డిజిటల్ ట్విన్ తాజా సమాచారం ఆధారంగా:\n\n- పొలం ఆరోగ్య స్కోరు: **${aiMotorRisk.riskScore < 30 ? 'ఉత్తమం' : 'మధ్యస్థం'}**\n- మోటార్ రిస్క్: **${aiMotorRisk.riskLevel} (${aiMotorRisk.faultType})**\n- పంట దశ: **${selectedField.stage}** (${selectedField.cropType})\n- నేల తేమ: **${currentReading.soilMoisture}%** | ఉష్ణోగ్రత: **${currentReading.temperature}°C**\n\nఅన్ని IoT సెన్సార్ నోడ్‌లు (మట్టి తేమ, కరెంట్, వోల్టేజ్, వాటర్ లెవల్) నిరంతరం సురక్షిత డేటాను అందిస్తున్నాయి.`;
      case 'hi':
        return `**${selectedField.name}** डिजिटल ट्विन टेलीमेट्री के आधार पर:\n\n- खेत स्वास्थ्य स्कोर: **${aiMotorRisk.riskScore < 30 ? 'उत्कृष्ट' : 'मध्यम'}**\n- मोटर जोखिम: **${aiMotorRisk.riskLevel} (${aiMotorRisk.faultType})**\n- फसल चरण: **${selectedField.stage}** (${selectedField.cropType})\n- मिट्टी की नमी: **${currentReading.soilMoisture}%** | तापमान: **${currentReading.temperature}°C**\n\nसभी IoT सेंसर नोड सुरक्षित डेटा स्ट्रीम कर रहे हैं।`;
      case 'ta':
        return `**${selectedField.name}** டிஜிட்டல் இரட்டை தகவல்களின் அடிப்படையில்:\n\n- வயல் ஆரோக்கிய மதிப்பீடு: **${aiMotorRisk.riskScore < 30 ? 'மிக நன்று' : 'மிதமானது'}**\n- மோட்டார் ஆபத்து நிலை: **${aiMotorRisk.riskLevel} (${aiMotorRisk.faultType})**\n- பயிர் நிலை: **${selectedField.stage}** (${selectedField.cropType})\n- மண் ஈரம்: **${currentReading.soilMoisture}%** | வெப்பநிலை: **${currentReading.temperature}°C**\n\nஅனைத்து IoT சென்சார்களும் நேரலையாக தரவை வழங்கி வருகின்றன.`;
      case 'en':
      default:
        return `Based on current digital twin telemetry for **${selectedField.name}**:\n\n- Field Health Score: **${aiMotorRisk.riskScore < 30 ? 'High' : 'Moderate'}**\n- Motor Risk: **${aiMotorRisk.riskLevel} (${aiMotorRisk.faultType})**\n- Crop Stage: ${selectedField.stage} (${selectedField.cropType})\n- Soil Moisture: **${currentReading.soilMoisture}%** | Temperature: **${currentReading.temperature}°C**\n\nAll sensor nodes (Soil probe, CT current, PT voltage, Ultrasonic level) are actively streaming data over secure MQTT channels.`;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query) return;

    // Stop microphone if currently listening
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSpeechError(null);
    setIsTyping(true);

    // Response generated in the CURRENT application language
    setTimeout(() => {
      const reply = generateResponseInLanguage(query, language);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div
      id="agri-advisor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="agri-advisor-modal-container"
        className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full h-[620px] max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center shadow-inner shrink-0">
              <Bot className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base truncate">
                  {t.aiAdvisorTitle || 'AgriShield AI Advisor'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-700 shrink-0">
                  {t.aiAdvisorDigitalTwinActive || 'Digital Twin Active'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/70 text-emerald-300 border border-emerald-600/40 uppercase tracking-wider">
                  {LANGUAGE_LABELS[language] || language}
                </span>
              </div>
              <p className="text-xs text-emerald-300 truncate">
                {t.aiAdvisorSubtitle || 'Crop & Pump Health Specialist'} • {selectedField.name}
              </p>
            </div>
          </div>
          <button
            id="close-ai-advisor-modal"
            onClick={onClose}
            aria-label="Close Advisor"
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div
          id="advisor-message-log"
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 sm:space-y-4 bg-slate-50"
        >
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-2.5 sm:gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line break-words">{m.text}</div>
                <div
                  className={`text-[10px] font-medium mt-1 text-right ${
                    m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 w-fit shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>{t.aiAdvisorSynthesizing || 'AgriShield AI is synthesizing agronomic telemetry...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions in Current Language */}
        <div className="px-3 sm:px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap shrink-0">
          <span className="text-slate-600 font-semibold flex items-center gap-1 shrink-0 text-[11px] sm:text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            {t.aiAdvisorSuggestions || 'Suggestions:'}
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-[11px] font-medium transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Active Listening Indicator */}
        {isListening && (
          <div
            id="speech-recognition-active-banner"
            className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-in fade-in shrink-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <span className="font-bold truncate">
                {t.aiAdvisorListening || `Listening in ${LANGUAGE_LABELS[language]}... Speak your question`}
              </span>
              <div className="hidden sm:flex items-center gap-0.5 ml-2">
                <span className="w-1 h-3 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-rose-600 rounded-full animate-pulse delay-75"></span>
                <span className="w-1 h-4 bg-rose-500 rounded-full animate-pulse delay-150"></span>
                <span className="w-1 h-2 bg-rose-400 rounded-full animate-pulse delay-200"></span>
              </div>
            </div>
            <button
              onClick={handleToggleVoiceInput}
              className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              {t.aiAdvisorTapToStop || 'Stop'}
            </button>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div
            id="speech-recognition-error-banner"
            className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in shrink-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">{speechError}</span>
            </div>
            <button
              onClick={() => setSpeechError(null)}
              className="p-1 text-amber-700 hover:text-amber-900 cursor-pointer shrink-0 ml-2"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            id="advisor-chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t.aiAdvisorPlaceholder || 'Ask about crop health, pump maintenance, or irrigation...'}
            className="flex-1 min-w-0 px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
          />

          {/* Microphone Voice Input Button */}
          <button
            id="advisor-mic-button"
            type="button"
            onClick={handleToggleVoiceInput}
            aria-label={
              isListening
                ? t.aiAdvisorTapToStop || 'Stop voice input'
                : `Voice input in ${LANGUAGE_LABELS[language] || language}`
            }
            title={
              isListening
                ? t.aiAdvisorTapToStop || 'Stop listening'
                : `Click to speak in ${LANGUAGE_LABELS[language] || language}`
            }
            className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center cursor-pointer transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/50 shadow-md animate-pulse'
                : hasBrowserSpeechSupport
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-emerald-800" />
            )}
          </button>

          {/* Send Message Button */}
          <button
            id="advisor-send-button"
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            aria-label="Send query"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
