import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Globe,
  Send,
  Shield,
  Sparkles,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Language =
  | "en"
  | "hi"
  | "es"
  | "fr"
  | "ar"
  | "zh"
  | "ja"
  | "gu"
  | "hary"
  | "pa";

const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { code: "hary", label: "Haryanvi", nativeLabel: "हरियाणवी" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
];

const UI_TEXT: Record<
  Language,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    thinking: string;
    fallback: string;
    suggestions: string[];
  }
> = {
  en: {
    title: "AI Cyber Assistant",
    subtitle: "Ask anything about cybersecurity in your language",
    placeholder: "Ask a cybersecurity question...",
    thinking: "Analyzing threat...",
    fallback:
      "I specialize in cybersecurity. Try asking about firewalls, VPN, malware, phishing, ransomware, CMD troubleshooting, Wi-Fi security, password safety, slow PC fixes, or browser security.",
    suggestions: [
      "What is a VPN?",
      "CMD troubleshoot tips",
      "How to remove virus?",
      "Slow PC fix",
    ],
  },
  hi: {
    title: "AI साइबर सहायक",
    subtitle: "अपनी भाषा में साइबर सुरक्षा के बारे में पूछें",
    placeholder: "साइबर सुरक्षा प्रश्न पूछें...",
    thinking: "खतरे का विश्लेषण हो रहा है...",
    fallback:
      "मैं साइबर सुरक्षा में विशेषज्ञ हूं। फ़ायरवॉल, VPN, मैलवेयर, फ़िशिंग, रैनसमवेयर, CMD ट्रबलशूट, Wi-Fi सुरक्षा के बारे में पूछें।",
    suggestions: [
      "VPN क्या है?",
      "CMD ट्रबलशूट?",
      "वायरस कैसे हटाएं?",
      "धीमा PC ठीक करें",
    ],
  },
  gu: {
    title: "AI સાઈબર સહાયક",
    subtitle: "તમારી ભાષામાં સાઈબર સુરક્ષા વિશે પૂછો",
    placeholder: "સાઈબર સુરક્ષા પ્રશ્ન પૂછો...",
    thinking: "ખતરાનું વિશ્લેષણ થઈ રહ્યું છે...",
    fallback:
      "હું સાઈબર સુરક્ષામાં નિષ્ણાત છું. ફાયરવોલ, VPN, મૈલવેર, ફિશિંગ, રેન્સમવેર વિશે પૂછો.",
    suggestions: [
      "VPN શું છે?",
      "રેન્સમવેર શું છે?",
      "ફોન સુરક્ષિત કેવી રીતે?",
      "CMD ટ્રબલશૂટ?",
    ],
  },
  hary: {
    title: "AI साइबर सहायक",
    subtitle: "आपणी भाषा म्हें साइबर सुरक्षा के बारे म्हें पूछो",
    placeholder: "साइबर सुरक्षा सवाल पूछो...",
    thinking: "खतरे का विश्लेषण हो रह्या...",
    fallback:
      "म्हें साइबर सुरक्षा म्हें माहर सूं। फायरवॉल, VPN, मैलवेयर, फिशिंग के बारे म्हें पूछो।",
    suggestions: [
      "VPN क्या सै?",
      "रैनसमवेयर क्या सै?",
      "फोन नै सुरक्षित कैसे करें?",
      "CMD ट्रबलशूट?",
    ],
  },
  pa: {
    title: "AI ਸਾਈਬਰ ਸਹਾਇਕ",
    subtitle: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਾਈਬਰ ਸੁਰੱਖਿਆ ਬਾਰੇ ਪੁੱਛੋ",
    placeholder: "ਸਾਈਬਰ ਸੁਰੱਖਿਆ ਸਵਾਲ ਪੁੱਛੋ...",
    thinking: "ਖਤਰੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
    fallback: "ਮੈਂ ਸਾਈਬਰ ਸੁਰੱਖਿਆ ਵਿੱਚ ਮਾਹਰ ਹਾਂ। ਫਾਇਰਵਾਲ, VPN, ਮਾਲਵੇਅਰ, ਫਿਸ਼ਿੰਗ ਬਾਰੇ ਪੁੱਛੋ।",
    suggestions: [
      "VPN ਕੀ ਹੈ?",
      "ਰੈਨਸਮਵੇਅਰ ਕੀ ਹੈ?",
      "ਫੋਨ ਸੁਰੱਖਿਅਤ ਕਿਵੇਂ ਕਰੀਏ?",
      "CMD ਟ੍ਰਬਲਸ਼ੂਟ?",
    ],
  },
  es: {
    title: "Asistente de Ciberseguridad IA",
    subtitle: "Pregunta cualquier cosa sobre ciberseguridad en tu idioma",
    placeholder: "Haz una pregunta de ciberseguridad...",
    thinking: "Analizando amenaza...",
    fallback:
      "Me especializo en ciberseguridad. Pregunta sobre firewalls, VPN, malware, phishing, ransomware, cifrado o ataques DDoS.",
    suggestions: [
      "¿Qué es una VPN?",
      "¿Qué es el ransomware?",
      "¿Qué es el phishing?",
      "¿Cómo proteger mi teléfono?",
    ],
  },
  fr: {
    title: "Assistant IA Cybersécurité",
    subtitle: "Posez des questions sur la cybersécurité dans votre langue",
    placeholder: "Posez une question de cybersécurité...",
    thinking: "Analyse de la menace...",
    fallback:
      "Je me spécialise en cybersécurité. Posez des questions sur les pare-feu, VPN, malware, phishing, ransomware, chiffrement ou attaques DDoS.",
    suggestions: [
      "Qu'est-ce qu'un VPN?",
      "Qu'est-ce que le ransomware?",
      "Qu'est-ce que le phishing?",
      "Comment sécuriser mon téléphone?",
    ],
  },
  ar: {
    title: "مساعد الأمن السيبراني AI",
    subtitle: "اسأل عن أي شيء يتعلق بالأمن السيبراني بلغتك",
    placeholder: "اطرح سؤالاً عن الأمن السيبراني...",
    thinking: "تحليل التهديد...",
    fallback:
      "أتخصص في الأمن السيبراني. اسأل عن جدران الحماية، VPN، البرامج الضارة، التصيد الاحتيالي، برامج الفدية، التشفير أو هجمات DDoS.",
    suggestions: [
      "ما هو VPN؟",
      "ما هو برنامج الفدية؟",
      "ما هو التصيد الاحتيالي؟",
      "كيف أؤمّن هاتفي؟",
    ],
  },
  zh: {
    title: "AI 网络安全助手",
    subtitle: "用您的语言询问任何网络安全问题",
    placeholder: "提问网络安全问题...",
    thinking: "正在分析威胁...",
    fallback:
      "我专注于网络安全。请询问有关防火墙、VPN、恶意软件、网络钓鱼、勒索软件、加密或 DDoS 攻击的问题。",
    suggestions: [
      "什么是VPN？",
      "什么是勒索软件？",
      "什么是网络钓鱼？",
      "如何保护我的手机？",
    ],
  },
  ja: {
    title: "AIサイバーアシスタント",
    subtitle: "あなたの言語でサイバーセキュリティについて質問してください",
    placeholder: "サイバーセキュリティの質問を入力...",
    thinking: "脅威を分析中...",
    fallback:
      "私はサイバーセキュリティを専門としています。ファイアウォール、VPN、マルウェア、フィッシング、ランサムウェア、暗号化、DDoS攻撃について質問してください。",
    suggestions: [
      "VPNとは？",
      "ランサムウェアとは？",
      "フィッシングとは？",
      "スマホを安全にするには？",
    ],
  },
};

type QAMap = Record<string, Record<Language, string>>;

const KNOWLEDGE_BASE: QAMap = {
  firewall: {
    en: "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. It acts as a barrier between a trusted internal network and untrusted external networks, blocking unauthorized access while permitting legitimate communications.",
    hi: "फ़ायरवॉल एक नेटवर्क सुरक्षा उपकरण है जो पूर्व-निर्धारित सुरक्षा नियमों के आधार पर नेटवर्क ट्रैफ़िक की निगरानी और नियंत्रण करता है।",
    gu: "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
    hary: "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
    pa: "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
    es: "Un firewall es un dispositivo de seguridad de red que monitorea y controla el tráfico de red según reglas de seguridad predefinidas.",
    fr: "Un pare-feu est un dispositif de sécurité réseau qui surveille et contrôle le trafic réseau entrant et sortant selon des règles de sécurité prédéfinies.",
    ar: "جدار الحماية هو جهاز أمان للشبكة يراقب ويتحكم في حركة مرور الشبكة.",
    zh: "防火墙是一种网络安全设备，根据预定义的安全规则监控和控制进出网络的流量。",
    ja: "ファイアウォールは、事前に定義されたセキュリティルールに基づいてネットワークトラフィックを監視・制御するネットワークセキュリティデバイスです。",
  },
  vpn: {
    en: "A VPN (Virtual Private Network) creates an encrypted tunnel for your internet traffic, masking your IP address and location. It protects your data on public Wi-Fi, bypasses geo-restrictions, and prevents ISPs from monitoring your browsing. Use reputable VPN services with a no-log policy for maximum privacy.",
    hi: "VPN (वर्चुअल प्राइवेट नेटवर्क) आपके इंटरनेट ट्रैफ़िक के लिए एक एन्क्रिप्टेड टनल बनाता है, जिससे आपका IP पता और स्थान छुप जाता है।",
    gu: "A VPN (Virtual Private Network) creates an encrypted tunnel for your internet traffic, masking your IP address and location. It protects your data on public Wi-Fi and prevents ISPs from monitoring your browsing.",
    hary: "A VPN (Virtual Private Network) creates an encrypted tunnel for your internet traffic, masking your IP address and location. It protects your data on public Wi-Fi and prevents ISPs from monitoring your browsing.",
    pa: "A VPN (Virtual Private Network) creates an encrypted tunnel for your internet traffic, masking your IP address and location. It protects your data on public Wi-Fi and prevents ISPs from monitoring your browsing.",
    es: "Una VPN (Red Privada Virtual) crea un túnel cifrado para tu tráfico de internet, ocultando tu dirección IP y ubicación.",
    fr: "Un VPN (Réseau Privé Virtuel) crée un tunnel chiffré pour votre trafic internet, masquant votre adresse IP et votre localisation.",
    ar: "الشبكة الافتراضية الخاصة (VPN) تنشئ نفقاً مشفراً لحركة مرور الإنترنت الخاصة بك.",
    zh: "VPN（虚拟专用网络）为您的互联网流量创建加密隧道，隐藏您的IP地址和位置。",
    ja: "VPN（仮想プライベートネットワーク）はインターネットトラフィックのための暗号化トンネルを作成し、IPアドレスと場所を隠します。",
  },
  ransomware: {
    en: "Ransomware is malicious software that encrypts your files and demands payment (ransom) to restore access. Attackers typically spread it via phishing emails or infected downloads. Prevention: keep backups offline, update software regularly, avoid suspicious links. Never pay the ransom — it doesn't guarantee file recovery.",
    hi: "रैनसमवेयर दुर्भावनापूर्ण सॉफ़्टवेयर है जो आपकी फ़ाइलों को एन्क्रिप्ट करता है और पहुंच बहाल करने के लिए भुगतान की मांग करता है। कभी भी फिरौती न दें।",
    gu: "Ransomware is malicious software that encrypts your files and demands payment to restore access. Never pay the ransom. Keep backups offline and update software regularly.",
    hary: "Ransomware is malicious software that encrypts your files and demands payment to restore access. Never pay the ransom. Keep backups offline and update software regularly.",
    pa: "Ransomware is malicious software that encrypts your files and demands payment to restore access. Never pay the ransom. Keep backups offline and update software regularly.",
    es: "El ransomware es software malicioso que cifra tus archivos y exige un pago para restaurar el acceso. Nunca pagues el rescate.",
    fr: "Le ransomware est un logiciel malveillant qui chiffre vos fichiers et exige un paiement pour restaurer l'accès. Ne payez jamais la rançon.",
    ar: "برنامج الفدية هو برنامج ضار يشفر ملفاتك ويطالب بالدفع لاستعادة الوصول إليها. لا تدفع الفدية أبداً.",
    zh: "勒索软件会加密您的文件并要求支付赎金才能恢复访问。永远不要支付赎金。",
    ja: "ランサムウェアはファイルを暗号化してアクセスの回復と引き換えに身代金を要求するマルウェアです。身代金は絶対に支払わないでください。",
  },
  sql: {
    en: "SQL injection is an attack where malicious SQL code is inserted into input fields to manipulate a database. Attackers can steal, modify, or delete data. Prevention: use parameterized queries, input validation, and stored procedures.",
    hi: "SQL इंजेक्शन एक हमला है जहाँ दुर्भावनापूर्ण SQL कोड इनपुट फ़ील्ड में डाला जाता है। रोकथाम: पैरामीटरयुक्त क्वेरी और इनपुट सत्यापन उपयोग करें।",
    gu: "SQL injection is an attack where malicious SQL code is inserted into input fields to manipulate a database. Use parameterized queries and input validation.",
    hary: "SQL injection is an attack where malicious SQL code is inserted into input fields to manipulate a database. Use parameterized queries and input validation.",
    pa: "SQL injection is an attack where malicious SQL code is inserted into input fields to manipulate a database. Use parameterized queries and input validation.",
    es: "La inyección SQL es un ataque donde se inserta código SQL malicioso en campos de entrada para manipular una base de datos.",
    fr: "L'injection SQL est une attaque où du code SQL malveillant est inséré dans des champs de saisie pour manipuler une base de données.",
    ar: "حقن SQL هو هجوم يتم فيه إدراج كود SQL ضار في حقول الإدخال للتلاعب بقاعدة البيانات.",
    zh: "SQL注入是将恶意SQL代码插入输入字段以操纵数据库的攻击。",
    ja: "SQLインジェクションは、悪意のあるSQLコードを入力フィールドに挿入してデータベースを操作する攻撃です。",
  },
  phishing: {
    en: "Phishing is a social engineering attack using fake emails, messages, or websites to trick users into revealing sensitive information like passwords or credit card numbers. Red flags: urgency, generic greetings, suspicious URLs, grammar errors. Always verify sender identity and never click unsolicited links.",
    hi: "फ़िशिंग एक सोशल इंजीनियरिंग हमला है जो नकली ईमेल या वेबसाइट का उपयोग करके उपयोगकर्ताओं को पासवर्ड जैसी संवेदनशील जानकारी देने के लिए प्रेरित करता है।",
    gu: "Phishing uses fake emails or websites to trick users into revealing passwords. Always verify sender identity and never click suspicious links.",
    hary: "Phishing uses fake emails or websites to trick users into revealing passwords. Always verify sender identity and never click suspicious links.",
    pa: "Phishing uses fake emails or websites to trick users into revealing passwords. Always verify sender identity and never click suspicious links.",
    es: "El phishing usa correos electrónicos o sitios web falsos para engañar a los usuarios para que revelen información sensible.",
    fr: "Le phishing utilise de faux e-mails ou sites web pour tromper les utilisateurs et leur faire révéler des informations sensibles.",
    ar: "التصيد الاحتيالي هو هجوم هندسة اجتماعية يستخدم رسائل بريد إلكتروني أو مواقع ويب مزيفة لخداع المستخدمين.",
    zh: "网络钓鱼利用虚假电子邮件或网站欺骗用户透露密码等敏感信息。",
    ja: "フィッシングは偽のメールやウェブサイトを使ってユーザーから機密情報を騙し取るソーシャルエンジニアリング攻撃です。",
  },
  malware: {
    en: "Malware (malicious software) is any software designed to harm, exploit, or otherwise compromise a device or network. Types include viruses, worms, trojans, spyware, adware, and rootkits. Protection: use updated antivirus, avoid pirated software, don't open unknown attachments, enable firewall.",
    hi: "मैलवेयर (दुर्भावनापूर्ण सॉफ़्टवेयर) कोई भी सॉफ़्टवेयर है जो डिवाइस या नेटवर्क को नुकसान पहुंचाने के लिए डिज़ाइन किया गया है। सुरक्षा: अपडेटेड एंटीवायरस उपयोग करें।",
    gu: "Malware is any software designed to harm a device. Types include viruses, worms, trojans, spyware. Use updated antivirus and avoid pirated software.",
    hary: "Malware is any software designed to harm a device. Types include viruses, worms, trojans, spyware. Use updated antivirus and avoid pirated software.",
    pa: "Malware is any software designed to harm a device. Types include viruses, worms, trojans, spyware. Use updated antivirus and avoid pirated software.",
    es: "El malware es cualquier software diseñado para dañar o comprometer un dispositivo. Tipos: virus, gusanos, troyanos, spyware.",
    fr: "Le malware est tout logiciel conçu pour endommager un appareil ou un réseau. Types : virus, vers, chevaux de Troie, spyware.",
    ar: "البرامج الضارة هي أي برنامج مصمم لإلحاق الضرر بجهاز أو شبكة.",
    zh: "恶意软件是任何旨在损害设备或网络的软件。类型包括病毒、蠕虫、木马、间谍软件。",
    ja: "マルウェアはデバイスやネットワークに害を与えるよう設計されたソフトウェアです。",
  },
  "2fa": {
    en: "Two-Factor Authentication (2FA) adds a second layer of security beyond passwords. Even if your password is stolen, attackers need a second factor — usually a time-based code (TOTP), SMS, or biometric. Enable 2FA on all critical accounts especially email, banking, and social media.",
    hi: "दो-कारक प्रमाणीकरण (2FA) पासवर्ड से परे सुरक्षा की एक दूसरी परत जोड़ता है। सभी महत्वपूर्ण खातों पर 2FA सक्षम करें।",
    gu: "Two-Factor Authentication (2FA) adds a second layer of security. Enable 2FA on all critical accounts including email and banking.",
    hary: "Two-Factor Authentication (2FA) adds a second layer of security. Enable 2FA on all critical accounts including email and banking.",
    pa: "Two-Factor Authentication (2FA) adds a second layer of security. Enable 2FA on all critical accounts including email and banking.",
    es: "La autenticación de dos factores (2FA) agrega una segunda capa de seguridad más allá de las contraseñas.",
    fr: "L'authentification à deux facteurs (2FA) ajoute une deuxième couche de sécurité au-delà des mots de passe.",
    ar: "المصادقة الثنائية (2FA) تضيف طبقة أمان ثانية إلى جانب كلمات المرور.",
    zh: "双因素认证（2FA）在密码之外增加了第二层安全防护。",
    ja: "二要素認証（2FA）はパスワード以外に第二の安全層を追加します。",
  },
  encryption: {
    en: "Encryption converts readable data into an unreadable format using algorithms and keys. Only authorized parties with the decryption key can access the original data. Types: symmetric (same key for encrypt/decrypt) and asymmetric (public/private key pair). Essential for protecting data in transit (HTTPS) and at rest (disk encryption).",
    hi: "एन्क्रिप्शन एल्गोरिदम और कुंजियों का उपयोग करके पठनीय डेटा को अपठनीय प्रारूप में परिवर्तित करता है।",
    gu: "Encryption converts readable data into an unreadable format using algorithms and keys. Essential for HTTPS and disk encryption.",
    hary: "Encryption converts readable data into an unreadable format using algorithms and keys. Essential for HTTPS and disk encryption.",
    pa: "Encryption converts readable data into an unreadable format using algorithms and keys. Essential for HTTPS and disk encryption.",
    es: "El cifrado convierte datos legibles en un formato ilegible usando algoritmos y claves.",
    fr: "Le chiffrement convertit des données lisibles en un format illisible à l'aide d'algorithmes et de clés.",
    ar: "التشفير يحوّل البيانات القابلة للقراءة إلى تنسيق غير قابل للقراءة باستخدام الخوارزميات والمفاتيح.",
    zh: "加密使用算法和密钥将可读数据转换为不可读格式。",
    ja: "暗号化はアルゴリズムと鍵を使って読み取り可能なデータを読み取り不可能な形式に変換します。",
  },
  ddos: {
    en: "A DDoS (Distributed Denial of Service) attack overwhelms a server with traffic from multiple sources, making it unavailable. Protection: use CDN providers (Cloudflare), rate limiting, traffic filtering, and DDoS-mitigating hosting. It's a common attack against websites and online services.",
    hi: "DDoS (डिस्ट्रीब्यूटेड डिनायल ऑफ सर्विस) हमला कई स्रोतों से ट्रैफिक से सर्वर को अभिभूत करता है। सुरक्षा: CDN और रेट लिमिटिंग का उपयोग करें।",
    gu: "A DDoS attack overwhelms a server with traffic making it unavailable. Use CDN providers like Cloudflare for protection.",
    hary: "A DDoS attack overwhelms a server with traffic making it unavailable. Use CDN providers like Cloudflare for protection.",
    pa: "A DDoS attack overwhelms a server with traffic making it unavailable. Use CDN providers like Cloudflare for protection.",
    es: "Un ataque DDoS abruma un servidor con tráfico de múltiples fuentes. Protección: usa proveedores CDN, limitación de velocidad.",
    fr: "Une attaque DDoS submerge un serveur avec du trafic provenant de plusieurs sources. Protection : utilisez des CDN, limitez le débit.",
    ar: "هجوم DDoS يُغرق خادماً بحركة مرور من مصادر متعددة. الحماية: استخدم مزودي CDN وتحديد المعدل.",
    zh: "DDoS攻击用来自多个来源的流量淹没服务器。防护：使用CDN提供商（Cloudflare）、速率限制。",
    ja: "DDoS攻撃は複数のソースからのトラフィックでサーバーを圧倒します。保護：CDNプロバイダーとレート制限を使用してください。",
  },
  cmd: {
    en: "Common CMD commands for troubleshooting:\n1) `ipconfig /all` — view network config\n2) `ping google.com` — test internet connection\n3) `netstat -an` — see all open ports\n4) `sfc /scannow` — scan and fix Windows files\n5) `chkdsk /f` — fix disk errors\n6) `tasklist` — see running processes\n7) `netsh wlan show profiles` — see saved Wi-Fi\n8) `tracert google.com` — trace network route\n9) `arp -a` — see ARP table\n10) `nslookup domain.com` — DNS lookup\n\nTip: Run CMD as Administrator for best results!",
    hi: "CMD ट्रबलशूटिंग कमांड:\n1) `ipconfig /all` — नेटवर्क कॉन्फिग देखें\n2) `ping google.com` — इंटरनेट टेस्ट करें\n3) `netstat -an` — खुले पोर्ट देखें\n4) `sfc /scannow` — Windows फाइलें स्कैन करें\n5) `chkdsk /f` — डिस्क त्रुटियां ठीक करें\n6) `tasklist` — चलती प्रक्रियाएं देखें\n7) `netsh wlan show profiles` — Wi-Fi प्रोफाइल देखें\n8) `tracert google.com` — नेटवर्क रूट ट्रेस\n9) `arp -a` — ARP टेबल\n10) `nslookup domain.com` — DNS लुकअप\n\nव्यवस्थापक के रूप में CMD चलाएं।",
    gu: "Common CMD commands for troubleshooting:\n1) `ipconfig /all` — view network config\n2) `ping google.com` — test internet connection\n3) `netstat -an` — see all open ports\n4) `sfc /scannow` — scan and fix Windows files\n5) `chkdsk /f` — fix disk errors\n6) `tasklist` — see running processes\n7) `tracert google.com` — trace network route\n\nRun CMD as Administrator for best results!",
    hary: "Common CMD commands for troubleshooting:\n1) `ipconfig /all` — view network config\n2) `ping google.com` — test internet connection\n3) `netstat -an` — see all open ports\n4) `sfc /scannow` — scan and fix Windows files\n5) `chkdsk /f` — fix disk errors\n\nRun CMD as Administrator for best results!",
    pa: "Common CMD commands for troubleshooting:\n1) `ipconfig /all` — view network config\n2) `ping google.com` — test internet connection\n3) `netstat -an` — see all open ports\n4) `sfc /scannow` — scan and fix Windows files\n5) `chkdsk /f` — fix disk errors\n\nRun CMD as Administrator for best results!",
    es: "Comandos CMD para solución de problemas:\n1) `ipconfig /all` — ver config de red\n2) `ping google.com` — probar internet\n3) `netstat -an` — ver puertos abiertos\n4) `sfc /scannow` — escanear archivos Windows\n5) `tracert google.com` — rastrear ruta de red",
    fr: "Commandes CMD pour le dépannage:\n1) `ipconfig /all` — voir la config réseau\n2) `ping google.com` — tester internet\n3) `netstat -an` — voir les ports ouverts\n4) `sfc /scannow` — analyser les fichiers Windows\n5) `tracert google.com` — tracer la route réseau",
    ar: "أوامر CMD لاستكشاف الأخطاء:\n1) `ipconfig /all` — عرض إعدادات الشبكة\n2) `ping google.com` — اختبار الإنترنت\n3) `netstat -an` — رؤية المنافذ المفتوحة\n4) `sfc /scannow` — فحص ملفات Windows",
    zh: "CMD故障排除命令:\n1) `ipconfig /all` — 查看网络配置\n2) `ping google.com` — 测试网络\n3) `netstat -an` — 查看开放端口\n4) `sfc /scannow` — 扫描修复Windows文件\n5) `tracert google.com` — 跟踪网络路由\n\n以管理员身份运行CMD效果最佳！",
    ja: "CMDトラブルシューティングコマンド:\n1) `ipconfig /all` — ネットワーク設定表示\n2) `ping google.com` — インターネットテスト\n3) `netstat -an` — 開いているポートを表示\n4) `sfc /scannow` — Windowsファイルをスキャン\n5) `tracert google.com` — ネットワークルートを追跡\n\n管理者としてCMDを実行してください！",
  },
  virus_removal: {
    en: "Virus removal steps:\n1) Disconnect from internet immediately\n2) Boot into Safe Mode (press F8 on startup)\n3) Run full scan with Windows Defender or Malwarebytes\n4) Check startup programs: `msconfig` → Startup tab\n5) Delete temp files: type `%temp%` in Run dialog\n6) Check Task Manager for suspicious processes\n7) Update all software after cleaning\n8) Change all passwords from a clean device\n9) Consider full reinstall if infection persists\n\nFree tools: Malwarebytes, Windows Defender, HitmanPro",
    hi: "वायरस हटाने के चरण:\n1) तुरंत इंटरनेट डिस्कनेक्ट करें\n2) Safe Mode में बूट करें (F8 दबाएं)\n3) Windows Defender या Malwarebytes से पूर्ण स्कैन करें\n4) `msconfig` से स्टार्टअप प्रोग्राम जांचें\n5) `%temp%` में अस्थायी फाइलें हटाएं\n6) Task Manager में संदिग्ध प्रक्रियाएं जांचें\n7) सफाई के बाद सभी पासवर्ड बदलें",
    gu: "Virus removal steps:\n1) Disconnect from internet immediately\n2) Boot into Safe Mode (F8 on startup)\n3) Run full scan with Windows Defender or Malwarebytes\n4) Delete temp files: `%temp%` in Run dialog\n5) Check startup programs via `msconfig`\n6) Change all passwords after cleaning",
    hary: "Virus removal steps:\n1) Disconnect from internet immediately\n2) Boot into Safe Mode (F8 on startup)\n3) Run full scan with Windows Defender or Malwarebytes\n4) Delete temp files: `%temp%` in Run dialog\n5) Check startup programs via `msconfig`\n6) Change all passwords after cleaning",
    pa: "Virus removal steps:\n1) Disconnect from internet immediately\n2) Boot into Safe Mode (F8 on startup)\n3) Run full scan with Windows Defender or Malwarebytes\n4) Delete temp files: `%temp%` in Run dialog\n5) Check startup programs via `msconfig`\n6) Change all passwords after cleaning",
    es: "Pasos para eliminar virus:\n1) Desconecta de internet inmediatamente\n2) Inicia en Modo Seguro (F8)\n3) Ejecuta análisis completo con Windows Defender o Malwarebytes\n4) Revisa programas de inicio: `msconfig`\n5) Elimina archivos temporales: `%temp%`",
    fr: "Étapes de suppression de virus:\n1) Déconnecter d'internet immédiatement\n2) Démarrer en Mode sans échec (F8)\n3) Lancer une analyse complète avec Windows Defender ou Malwarebytes\n4) Vérifier les programmes de démarrage: `msconfig`",
    ar: "خطوات إزالة الفيروسات:\n1) قطع الاتصال بالإنترنت فوراً\n2) التشغيل في الوضع الآمن (F8)\n3) إجراء فحص كامل بـ Windows Defender أو Malwarebytes\n4) حذف الملفات المؤقتة: `%temp%`",
    zh: "病毒清除步骤:\n1) 立即断开网络连接\n2) 进入安全模式（F8）\n3) 使用Windows Defender或Malwarebytes全面扫描\n4) 检查启动程序：`msconfig`\n5) 删除临时文件：`%temp%`\n6) 清理后更改所有密码",
    ja: "ウイルス除去手順:\n1) すぐにインターネット接続を切断\n2) セーフモードで起動（F8キー）\n3) Windows DefenderまたはMalwarebytesで完全スキャン\n4) スタートアッププログラムを確認：`msconfig`\n5) 一時ファイルを削除：`%temp%`",
  },
  wifi: {
    en: "Wi-Fi security & troubleshooting:\n1) Use WPA3 or WPA2 encryption (avoid WEP)\n2) Change default router password\n3) Use a strong Wi-Fi passphrase (12+ chars)\n4) Enable firewall on router\n5) Disable WPS (vulnerable to brute force)\n\nFor connection issues:\n- Restart router\n- Run `ipconfig /release` then `ipconfig /renew`\n- Check `netsh wlan show interfaces`\n- Use `netsh wlan disconnect` and reconnect\n- Update router firmware\n- Use 5GHz band for better security",
    hi: "Wi-Fi सुरक्षा और ट्रबलशूटिंग:\n1) WPA3 या WPA2 एन्क्रिप्शन उपयोग करें\n2) डिफ़ॉल्ट राउटर पासवर्ड बदलें\n3) मजबूत पासफ्रेज़ उपयोग करें\n4) WPS अक्षम करें\n\nकनेक्शन समस्या के लिए:\n- `ipconfig /release` फिर `ipconfig /renew` चलाएं",
    gu: "Wi-Fi security & troubleshooting:\n1) Use WPA3 or WPA2 encryption (avoid WEP)\n2) Change default router password\n3) Disable WPS\n4) For issues: `ipconfig /release` then `ipconfig /renew`\n5) Update router firmware",
    hary: "Wi-Fi security & troubleshooting:\n1) Use WPA3 or WPA2 encryption (avoid WEP)\n2) Change default router password\n3) Disable WPS\n4) For issues: `ipconfig /release` then `ipconfig /renew`\n5) Update router firmware",
    pa: "Wi-Fi security & troubleshooting:\n1) Use WPA3 or WPA2 encryption (avoid WEP)\n2) Change default router password\n3) Disable WPS\n4) For issues: `ipconfig /release` then `ipconfig /renew`\n5) Update router firmware",
    es: "Seguridad y solución de problemas Wi-Fi:\n1) Usa cifrado WPA3 o WPA2\n2) Cambia la contraseña del router\n3) Deshabilita WPS\n4) Para problemas: `ipconfig /release` luego `ipconfig /renew`",
    fr: "Sécurité et dépannage Wi-Fi:\n1) Utiliser le chiffrement WPA3 ou WPA2\n2) Changer le mot de passe du routeur par défaut\n3) Désactiver WPS\n4) Pour les problèmes: `ipconfig /release` puis `ipconfig /renew`",
    ar: "أمان Wi-Fi واستكشاف الأخطاء:\n1) استخدم تشفير WPA3 أو WPA2\n2) غيّر كلمة مرور الراوتر الافتراضية\n3) عطّل WPS\n4) لمشاكل الاتصال: `ipconfig /release` ثم `ipconfig /renew`",
    zh: "Wi-Fi安全与故障排除:\n1) 使用WPA3或WPA2加密\n2) 更改路由器默认密码\n3) 禁用WPS\n4) 连接问题：`ipconfig /release`然后`ipconfig /renew`\n5) 更新路由器固件",
    ja: "Wi-Fiセキュリティとトラブルシューティング:\n1) WPA3またはWPA2暗号化を使用\n2) ルーターのデフォルトパスワードを変更\n3) WPSを無効化\n4) 接続問題：`ipconfig /release`後に`ipconfig /renew`",
  },
  password: {
    en: "Password security best practices:\n1) Use 12+ character passwords with mix of upper/lower/numbers/symbols\n2) Never reuse passwords across sites\n3) Use a password manager (Bitwarden, 1Password)\n4) Enable 2FA everywhere\n5) Forgot Windows password: boot with recovery drive or use `net user username newpassword` from recovery CMD\n6) Check for leaked passwords at haveibeenpwned.com\n7) Use passphrases (4+ random words) for memorability\n8) Change passwords every 6-12 months for critical accounts",
    hi: "पासवर्ड सुरक्षा:\n1) 12+ वर्णों का पासवर्ड उपयोग करें\n2) एक ही पासवर्ड कई साइटों पर न दोहराएं\n3) पासवर्ड मैनेजर (Bitwarden) उपयोग करें\n4) Windows पासवर्ड भूल गए: रिकवरी CMD में `net user username newpassword` चलाएं\n5) haveibeenpwned.com पर लीक की जांच करें",
    gu: "Password security best practices:\n1) Use 12+ character passwords\n2) Never reuse passwords\n3) Use a password manager (Bitwarden)\n4) Enable 2FA everywhere\n5) Check haveibeenpwned.com for leaked passwords",
    hary: "Password security best practices:\n1) Use 12+ character passwords\n2) Never reuse passwords\n3) Use a password manager (Bitwarden)\n4) Enable 2FA everywhere\n5) Check haveibeenpwned.com for leaked passwords",
    pa: "Password security best practices:\n1) Use 12+ character passwords\n2) Never reuse passwords\n3) Use a password manager (Bitwarden)\n4) Enable 2FA everywhere\n5) Check haveibeenpwned.com for leaked passwords",
    es: "Mejores prácticas de seguridad de contraseñas:\n1) Usa contraseñas de 12+ caracteres\n2) Nunca reutilices contraseñas\n3) Usa un gestor de contraseñas (Bitwarden)\n4) Activa 2FA en todas partes",
    fr: "Meilleures pratiques de sécurité des mots de passe:\n1) Utilisez des mots de passe de 12+ caractères\n2) Ne réutilisez jamais les mots de passe\n3) Utilisez un gestionnaire de mots de passe (Bitwarden)\n4) Activez le 2FA partout",
    ar: "أفضل ممارسات أمان كلمات المرور:\n1) استخدم كلمات مرور من 12+ حرفاً\n2) لا تعيد استخدام كلمات المرور\n3) استخدم مدير كلمات المرور (Bitwarden)\n4) فعّل المصادقة الثنائية في كل مكان",
    zh: "密码安全最佳实践:\n1) 使用12+字符密码\n2) 不要重复使用密码\n3) 使用密码管理器（Bitwarden）\n4) 到处启用2FA\n5) 在haveibeenpwned.com检查密码泄露",
    ja: "パスワードセキュリティのベストプラクティス:\n1) 12文字以上のパスワードを使用\n2) パスワードを使い回さない\n3) パスワードマネージャーを使用（Bitwarden）\n4) どこでも2FAを有効化\n5) haveibeenpwned.comで流出確認",
  },
  slow_pc: {
    en: "Fix slow PC/device:\n1) Open Task Manager (Ctrl+Shift+Esc) — kill high CPU/RAM processes\n2) Run `cleanmgr` (Disk Cleanup)\n3) Disable startup programs: Task Manager → Startup tab\n4) Run `sfc /scannow` in admin CMD\n5) Check for malware with Malwarebytes\n6) Defrag HDD: `defrag C: /U /V` (not for SSD)\n7) Add more RAM or upgrade to SSD\n8) Update Windows and drivers\n9) Check disk health: `wmic diskdrive get status`\n10) Clear browser cache and extensions",
    hi: "धीमे PC को ठीक करें:\n1) Task Manager खोलें (Ctrl+Shift+Esc) — उच्च CPU प्रक्रियाएं बंद करें\n2) `cleanmgr` चलाएं\n3) स्टार्टअप प्रोग्राम अक्षम करें\n4) `sfc /scannow` चलाएं\n5) Malwarebytes से मैलवेयर जांचें",
    gu: "Fix slow PC:\n1) Open Task Manager (Ctrl+Shift+Esc) — kill high CPU processes\n2) Run `cleanmgr` (Disk Cleanup)\n3) Disable startup programs\n4) Run `sfc /scannow` in admin CMD\n5) Check for malware with Malwarebytes",
    hary: "Fix slow PC:\n1) Open Task Manager (Ctrl+Shift+Esc) — kill high CPU processes\n2) Run `cleanmgr` (Disk Cleanup)\n3) Disable startup programs\n4) Run `sfc /scannow` in admin CMD\n5) Check for malware with Malwarebytes",
    pa: "Fix slow PC:\n1) Open Task Manager (Ctrl+Shift+Esc) — kill high CPU processes\n2) Run `cleanmgr` (Disk Cleanup)\n3) Disable startup programs\n4) Run `sfc /scannow` in admin CMD\n5) Check for malware with Malwarebytes",
    es: "Reparar PC lenta:\n1) Abre el Administrador de tareas (Ctrl+Shift+Esc)\n2) Ejecuta `cleanmgr`\n3) Deshabilita programas de inicio\n4) Ejecuta `sfc /scannow` como administrador",
    fr: "Réparer un PC lent:\n1) Ouvrir le Gestionnaire des tâches (Ctrl+Shift+Esc)\n2) Exécuter `cleanmgr`\n3) Désactiver les programmes de démarrage\n4) Exécuter `sfc /scannow` en admin",
    ar: "إصلاح الكمبيوتر البطيء:\n1) افتح مدير المهام (Ctrl+Shift+Esc)\n2) شغّل `cleanmgr`\n3) عطّل برامج البدء التلقائي\n4) شغّل `sfc /scannow` كمسؤول",
    zh: "修复慢速PC:\n1) 打开任务管理器（Ctrl+Shift+Esc）— 终止高CPU进程\n2) 运行`cleanmgr`（磁盘清理）\n3) 禁用启动程序\n4) 以管理员身份运行`sfc /scannow`\n5) 使用Malwarebytes检查恶意软件",
    ja: "スローPCを修正:\n1) タスクマネージャーを開く（Ctrl+Shift+Esc）\n2) `cleanmgr`を実行\n3) スタートアッププログラムを無効化\n4) 管理者CMDで`sfc /scannow`を実行\n5) Malwarebytesでマルウェアチェック",
  },
  browser: {
    en: "Browser security tips:\n1) Always use HTTPS (look for padlock icon)\n2) Keep browser updated\n3) Install uBlock Origin for ad/malware blocking\n4) Disable or review extensions regularly\n5) Use private/incognito mode on shared devices\n6) Clear cookies/cache monthly\n7) Never save passwords in browser — use a password manager\n8) Check site safety via Google Safe Browsing\n9) Use separate browsers for banking vs general browsing",
    hi: "ब्राउज़र सुरक्षा:\n1) हमेशा HTTPS उपयोग करें\n2) ब्राउज़र अपडेट रखें\n3) uBlock Origin इंस्टॉल करें\n4) एक्सटेंशन नियमित जांचें\n5) ब्राउज़र में पासवर्ड सहेजें नहीं — पासवर्ड मैनेजर उपयोग करें",
    gu: "Browser security tips:\n1) Always use HTTPS\n2) Keep browser updated\n3) Install uBlock Origin\n4) Never save passwords in browser — use a password manager\n5) Use private mode on shared devices",
    hary: "Browser security tips:\n1) Always use HTTPS\n2) Keep browser updated\n3) Install uBlock Origin\n4) Never save passwords in browser — use a password manager\n5) Use private mode on shared devices",
    pa: "Browser security tips:\n1) Always use HTTPS\n2) Keep browser updated\n3) Install uBlock Origin\n4) Never save passwords in browser — use a password manager\n5) Use private mode on shared devices",
    es: "Consejos de seguridad del navegador:\n1) Usa siempre HTTPS\n2) Mantén el navegador actualizado\n3) Instala uBlock Origin\n4) Nunca guardes contraseñas en el navegador",
    fr: "Conseils de sécurité du navigateur:\n1) Toujours utiliser HTTPS\n2) Maintenir le navigateur à jour\n3) Installer uBlock Origin\n4) Ne jamais enregistrer de mots de passe dans le navigateur",
    ar: "نصائح أمان المتصفح:\n1) استخدم HTTPS دائماً\n2) حافظ على تحديث المتصفح\n3) ثبّت uBlock Origin\n4) لا تحفظ كلمات المرور في المتصفح",
    zh: "浏览器安全提示:\n1) 始终使用HTTPS\n2) 保持浏览器更新\n3) 安装uBlock Origin\n4) 定期检查扩展程序\n5) 不要在浏览器中保存密码 — 使用密码管理器",
    ja: "ブラウザセキュリティのヒント:\n1) 常にHTTPSを使用\n2) ブラウザを最新状態に保つ\n3) uBlock Originをインストール\n4) ブラウザにパスワードを保存しない — パスワードマネージャーを使用",
  },
};

const KEYWORD_MAP: Record<string, string> = {
  firewall: "firewall",
  "fire wall": "firewall",
  फ़ायरवॉल: "firewall",
  vpn: "vpn",
  "virtual private": "vpn",
  ransomware: "ransomware",
  ransom: "ransomware",
  रैनसमवेयर: "ransomware",
  sql: "sql",
  "sql injection": "sql",
  injection: "sql",
  phishing: "phishing",
  फ़िशिंग: "phishing",
  malware: "malware",
  मैलवेयर: "malware",
  "2fa": "2fa",
  "two factor": "2fa",
  "multi factor": "2fa",
  authentication: "2fa",
  encrypt: "encryption",
  encryption: "encryption",
  एन्क्रिप्शन: "encryption",
  ddos: "ddos",
  "denial of service": "ddos",
  // CMD / troubleshooting
  cmd: "cmd",
  "command prompt": "cmd",
  ipconfig: "cmd",
  netstat: "cmd",
  sfc: "cmd",
  tracert: "cmd",
  ping: "cmd",
  "windows command": "cmd",
  troubleshoot: "cmd",
  ट्रबलशूट: "cmd",
  कमांड: "cmd",
  // Virus removal
  "virus removal": "virus_removal",
  "remove virus": "virus_removal",
  "virus clean": "virus_removal",
  malwarebytes: "virus_removal",
  "safe mode": "virus_removal",
  "वायरस हटाएं": "virus_removal",
  // Wi-Fi
  wifi: "wifi",
  "wi-fi": "wifi",
  wireless: "wifi",
  router: "wifi",
  "internet not working": "wifi",
  "no internet": "wifi",
  // Password
  password: "password",
  pass: "password",
  पासवर्ड: "password",
  // Slow PC
  "slow pc": "slow_pc",
  "slow computer": "slow_pc",
  "pc slow": "slow_pc",
  "slow phone": "slow_pc",
  "device slow": "slow_pc",
  // Browser
  browser: "browser",
  chrome: "browser",
  firefox: "browser",
  ब्राउज़र: "browser",
};

function findAnswer(query: string, lang: Language): string | null {
  const q = query.toLowerCase();
  for (const [kw, key] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(kw)) {
      return KNOWLEDGE_BASE[key]?.[lang] ?? null;
    }
  }
  return null;
}

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  displayedText?: string;
  isTyping?: boolean;
}

let msgIdCounter = 0;

// Floating orb animation CSS
const orbKeyframes = `
@keyframes floatOrb1 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
  33% { transform: translateY(-18px) translateX(8px) scale(1.08); opacity: 0.7; }
  66% { transform: translateY(10px) translateX(-6px) scale(0.95); opacity: 0.3; }
}
@keyframes floatOrb2 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
  40% { transform: translateY(15px) translateX(-10px) scale(1.1); opacity: 0.6; }
  70% { transform: translateY(-8px) translateX(12px) scale(0.92); opacity: 0.5; }
}
@keyframes floatOrb3 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.25; }
  50% { transform: translateY(-12px) translateX(5px) scale(1.05); opacity: 0.55; }
}
@keyframes scanLine {
  0% { top: 0%; opacity: 0.9; }
  95% { top: 100%; opacity: 0.5; }
  100% { top: 100%; opacity: 0; }
}
@keyframes borderGlow {
  0%, 100% { border-color: oklch(0.55 0.22 25); box-shadow: 0 0 10px oklch(0.55 0.22 25 / 0.4); }
  33% { border-color: oklch(0.55 0.18 280); box-shadow: 0 0 18px oklch(0.55 0.18 280 / 0.4); }
  66% { border-color: oklch(0.55 0.20 160); box-shadow: 0 0 14px oklch(0.55 0.20 160 / 0.4); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 12px oklch(0.55 0.22 25 / 0.5); }
  50% { box-shadow: 0 0 28px oklch(0.55 0.22 25 / 0.9); }
}
@keyframes matrixRain {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}
`;

export default function AIChatSection() {
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ui = UI_TEXT[lang];
  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  });

  const typeMessage = (id: number, fullText: string) => {
    let idx = 0;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, displayedText: "", isTyping: true } : m,
      ),
    );
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      idx++;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                displayedText: fullText.slice(0, idx),
                isTyping: idx < fullText.length,
              }
            : m,
        ),
      );
      if (idx >= fullText.length) {
        if (typingRef.current) clearInterval(typingRef.current);
      }
    }, 15);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    setInput("");

    const userMsg: Message = {
      id: ++msgIdCounter,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a cybersecurity expert AI assistant called Tyson AI. Answer questions about cybersecurity, hacking, malware, phishing, VPN, firewalls, CMD commands, troubleshooting, Wi-Fi security, and all IT-related topics. Respond in the same language as the user's question. Be concise, practical, and use bullet points where helpful. Limit response to 200 words.",
            },
            { role: "user", content: trimmed },
          ],
          model: "openai",
          seed: 42,
          private: true,
        }),
      });
      clearTimeout(timeoutId);

      let answer = await res.text();
      if (!answer || answer.trim().length === 0) throw new Error("empty");

      const aiMsg: Message = {
        id: ++msgIdCounter,
        role: "ai",
        text: answer,
        displayedText: "",
        isTyping: true,
      };
      setIsThinking(false);
      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => typeMessage(aiMsg.id, answer), 50);
    } catch {
      const answer = findAnswer(trimmed, lang) ?? ui.fallback;
      const aiMsg: Message = {
        id: ++msgIdCounter,
        role: "ai",
        text: answer,
        displayedText: "",
        isTyping: true,
      };
      setIsThinking(false);
      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => typeMessage(aiMsg.id, answer), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage(input);
  };

  const isRTL = lang === "ar";

  return (
    <section
      id="ai-assistant"
      className="section-divider py-20 px-4 sm:px-6 lg:px-8"
    >
      <style>{orbKeyframes}</style>
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 relative"
        >
          {/* Floating orbs */}
          <div
            className="absolute w-24 h-24 rounded-full pointer-events-none"
            style={{
              background: "oklch(0.55 0.22 25 / 0.18)",
              filter: "blur(16px)",
              top: "-20px",
              left: "15%",
              animation: "floatOrb1 6s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-16 h-16 rounded-full pointer-events-none"
            style={{
              background: "oklch(0.55 0.18 280 / 0.15)",
              filter: "blur(12px)",
              top: "10px",
              right: "18%",
              animation: "floatOrb2 7.5s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-20 h-20 rounded-full pointer-events-none"
            style={{
              background: "oklch(0.55 0.20 160 / 0.12)",
              filter: "blur(14px)",
              bottom: "-10px",
              left: "40%",
              animation: "floatOrb3 9s ease-in-out infinite",
            }}
          />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              AI Powered — Real-time Support
            </span>
          </div>

          {/* Bot Avatar with spinning ring + pulse glow */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Rotating outer ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
                style={{
                  width: "88px",
                  height: "88px",
                  top: "-4px",
                  left: "-4px",
                  animation: "spinSlow 8s linear infinite",
                }}
              />
              {/* Pulse glow ring */}
              <div
                className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/50 flex items-center justify-center"
                style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
              >
                <Bot className="w-9 h-9 text-primary" />
              </div>
              {/* ONLINE badge */}
              <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-background border border-green-500/40 rounded-full px-2 py-0.5">
                <span
                  className="w-2 h-2 rounded-full bg-green-400"
                  style={{
                    animation: "pulse 1.5s ease-in-out infinite",
                    boxShadow: "0 0 6px oklch(0.68 0.20 142)",
                  }}
                />
                <span className="text-[10px] font-mono text-green-400 leading-none">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground mb-3 glow-text">
            {ui.title}
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            {ui.subtitle}
          </p>
        </motion.div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {LANGUAGES.map((l) => (
            <motion.button
              key={l.code}
              type="button"
              data-ocid="ai.tab"
              onClick={() => setLang(l.code)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: lang === l.code ? 1.05 : 1,
                boxShadow:
                  lang === l.code
                    ? "0 0 16px oklch(0.55 0.22 25 / 0.6)"
                    : "none",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                lang === l.code
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {l.nativeLabel}
            </motion.button>
          ))}
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl overflow-hidden"
          style={{
            animation: "borderGlow 5s ease-in-out infinite",
            border: "1px solid",
          }}
        >
          {/* Terminal Header Bar with matrix-rain effect */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b border-border relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.12 0.02 25) 0%, oklch(0.08 0.01 25) 50%, oklch(0.12 0.02 280) 100%)",
            }}
          >
            {/* Matrix background shimmer */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.55 0.22 25 / 0.3) 2px, oklch(0.55 0.22 25 / 0.3) 3px)",
                backgroundSize: "100% 8px",
                animation: "matrixRain 3s linear infinite",
              }}
            />
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-primary/70" />
            <span className="ml-2 text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-primary" />
              {" tyson-ai //"}
              <span className="text-primary">{currentLang.nativeLabel}</span>
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-[10px] font-mono text-green-400">
                SECURE
              </span>
            </div>
          </div>

          {/* Messages area with scanning line */}
          <div
            className="relative"
            style={{ background: "oklch(0.08 0.01 25)" }}
          >
            {/* Scanning line animation */}
            <div
              className="absolute left-0 right-0 h-px pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, oklch(0.55 0.22 25 / 0.6) 50%, transparent 100%)",
                animation: "scanLine 4s linear infinite",
              }}
            />

            <div
              ref={scrollRef}
              className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              {messages.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center h-full text-center gap-3"
                  data-ocid="ai.empty_state"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
                  >
                    <Bot className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-muted-foreground text-sm font-mono max-w-xs">
                    {ui.subtitle}
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    {[
                      { icon: Terminal, label: "CMD" },
                      { icon: Shield, label: "Security" },
                      { icon: Wifi, label: "Wi-Fi" },
                      { icon: Zap, label: "Quick Fix" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-1 text-xs font-mono text-muted-foreground/60 border border-border/40 rounded px-2 py-1"
                      >
                        <Icon className="w-3 h-3 text-primary/60" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                  data-ocid={`ai.item.${i + 1}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30 text-foreground ml-auto"
                        : "bg-secondary border border-border text-foreground"
                    }`}
                    style={{
                      direction: isRTL ? "rtl" : "ltr",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {msg.role === "ai"
                      ? (msg.displayedText ?? msg.text)
                      : msg.text}
                    {msg.role === "ai" && msg.isTyping && (
                      <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
                    )}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex gap-3"
                    data-ocid="ai.loading_state"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Bot className="w-4 h-4 text-primary" />
                      </motion.div>
                    </div>
                    <div className="bg-secondary border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {ui.thinking}
                      </span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: d * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div
            className="px-4 pb-2 pt-3 flex flex-wrap gap-2 border-t border-border/40"
            style={{
              background: "oklch(0.09 0.01 25)",
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {ui.suggestions.map((s) => (
              <motion.button
                key={s}
                type="button"
                data-ocid="ai.secondary_button"
                onClick={() => sendMessage(s)}
                whileHover={{
                  scale: 1.04,
                  backgroundColor: "oklch(0.55 0.22 25 / 0.15)",
                }}
                whileTap={{ scale: 0.97 }}
                className="text-xs px-3 py-1 rounded-full border border-primary/30 text-primary hover:text-primary transition-colors font-mono"
              >
                {s}
              </motion.button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            className="p-4 pt-2 border-t border-border"
            style={{ background: "oklch(0.09 0.01 25)" }}
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={ui.placeholder}
                disabled={isThinking}
                data-ocid="ai.input"
                className="flex-1 bg-input border-border font-mono text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary"
                style={{ direction: isRTL ? "rtl" : "ltr" }}
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={isThinking || !input.trim()}
                data-ocid="ai.submit_button"
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/80 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
