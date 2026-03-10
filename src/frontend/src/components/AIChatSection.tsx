import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Globe, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Language = "en" | "hi" | "es" | "fr" | "ar" | "zh" | "ja";

const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
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
      "I specialize in cybersecurity. Try asking about firewalls, VPN, malware, phishing, ransomware, encryption, or DDoS attacks.",
    suggestions: [
      "What is a VPN?",
      "What is ransomware?",
      "What is phishing?",
      "How to secure my phone?",
    ],
  },
  hi: {
    title: "AI साइबर सहायक",
    subtitle: "अपनी भाषा में साइबर सुरक्षा के बारे में पूछें",
    placeholder: "साइबर सुरक्षा प्रश्न पूछें...",
    thinking: "खतरे का विश्लेषण हो रहा है...",
    fallback:
      "मैं साइबर सुरक्षा में विशेषज्ञ हूं। फ़ायरवॉल, VPN, मैलवेयर, फ़िशिंग, रैनसमवेयर, एन्क्रिप्शन या DDoS हमलों के बारे में पूछें।",
    suggestions: [
      "VPN क्या है?",
      "रैनसमवेयर क्या है?",
      "फ़िशिंग क्या है?",
      "फोन को सुरक्षित कैसे करें?",
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
    hi: "फ़ायरवॉल एक नेटवर्क सुरक्षा उपकरण है जो पूर्व-निर्धारित सुरक्षा नियमों के आधार पर नेटवर्क ट्रैफ़िक की निगरानी और नियंत्रण करता है। यह विश्वसनीय आंतरिक नेटवर्क और अविश्वसनीय बाहरी नेटवर्क के बीच एक अवरोध के रूप में कार्य करता है।",
    es: "Un firewall es un dispositivo de seguridad de red que monitorea y controla el tráfico de red según reglas de seguridad predefinidas. Actúa como barrera entre una red interna de confianza y redes externas no confiables, bloqueando accesos no autorizados.",
    fr: "Un pare-feu est un dispositif de sécurité réseau qui surveille et contrôle le trafic réseau entrant et sortant selon des règles de sécurité prédéfinies. Il agit comme une barrière entre un réseau interne de confiance et des réseaux externes non fiables.",
    ar: "جدار الحماية هو جهاز أمان للشبكة يراقب ويتحكم في حركة مرور الشبكة الواردة والصادرة بناءً على قواعد أمان محددة مسبقاً. يعمل كحاجز بين شبكة داخلية موثوقة والشبكات الخارجية غير الموثوقة.",
    zh: "防火墙是一种网络安全设备，根据预定义的安全规则监控和控制进出网络的流量。它充当可信内部网络与不可信外部网络之间的屏障，阻止未经授权的访问，同时允许合法通信。",
    ja: "ファイアウォールは、事前に定義されたセキュリティルールに基づいてネットワークトラフィックを監視・制御するネットワークセキュリティデバイスです。信頼できる内部ネットワークと信頼できない外部ネットワークの間のバリアとして機能し、不正アクセスをブロックします。",
  },
  vpn: {
    en: "A VPN (Virtual Private Network) creates an encrypted tunnel for your internet traffic, masking your IP address and location. It protects your data on public Wi-Fi, bypasses geo-restrictions, and prevents ISPs from monitoring your browsing. Use reputable VPN services with a no-log policy for maximum privacy.",
    hi: "VPN (वर्चुअल प्राइवेट नेटवर्क) आपके इंटरनेट ट्रैफ़िक के लिए एक एन्क्रिप्टेड टनल बनाता है, जिससे आपका IP पता और स्थान छुप जाता है। यह पब्लिक Wi-Fi पर आपके डेटा को सुरक्षित रखता है और ISP को आपकी ब्राउज़िंग से रोकता है।",
    es: "Una VPN (Red Privada Virtual) crea un túnel cifrado para tu tráfico de internet, ocultando tu dirección IP y ubicación. Protege tus datos en Wi-Fi público y evita que los ISP monitoreen tu navegación.",
    fr: "Un VPN (Réseau Privé Virtuel) crée un tunnel chiffré pour votre trafic internet, masquant votre adresse IP et votre localisation. Il protège vos données sur le Wi-Fi public et empêche les FAI de surveiller votre navigation.",
    ar: "الشبكة الافتراضية الخاصة (VPN) تنشئ نفقاً مشفراً لحركة مرور الإنترنت الخاصة بك، مع إخفاء عنوان IP الخاص بك وموقعك. تحمي بياناتك على شبكة Wi-Fi العامة وتمنع مزودي خدمة الإنترنت من مراقبة تصفحك.",
    zh: "VPN（虚拟专用网络）为您的互联网流量创建加密隧道，隐藏您的IP地址和位置。它保护您在公共Wi-Fi上的数据，防止ISP监控您的浏览活动。建议使用有不记录日志政策的可靠VPN服务。",
    ja: "VPN（仮想プライベートネットワーク）はインターネットトラフィックのための暗号化トンネルを作成し、IPアドレスと場所を隠します。公共Wi-Fiでのデータを保護し、ISPがブラウジングを監視するのを防ぎます。",
  },
  ransomware: {
    en: "Ransomware is malicious software that encrypts your files and demands payment (ransom) to restore access. Attackers typically spread it via phishing emails or infected downloads. Prevention: keep backups offline, update software regularly, avoid suspicious links. Never pay the ransom — it doesn't guarantee file recovery.",
    hi: "रैनसमवेयर दुर्भावनापूर्ण सॉफ़्टवेयर है जो आपकी फ़ाइलों को एन्क्रिप्ट करता है और पहुंच बहाल करने के लिए भुगतान की मांग करता है। रोकथाम: ऑफलाइन बैकअप रखें, सॉफ़्टवेयर अपडेट करें, संदिग्ध लिंक से बचें। कभी भी फिरौती न दें।",
    es: "El ransomware es software malicioso que cifra tus archivos y exige un pago para restaurar el acceso. Prevención: mantén copias de seguridad sin conexión, actualiza el software regularmente, evita enlaces sospechosos. Nunca pagues el rescate.",
    fr: "Le ransomware est un logiciel malveillant qui chiffre vos fichiers et exige un paiement pour restaurer l'accès. Prévention : gardez des sauvegardes hors ligne, mettez régulièrement à jour les logiciels, évitez les liens suspects. Ne payez jamais la rançon.",
    ar: "برنامج الفدية هو برنامج ضار يشفر ملفاتك ويطالب بالدفع لاستعادة الوصول إليها. الوقاية: احتفظ بنسخ احتياطية دون اتصال، وقم بتحديث البرامج بانتظام، وتجنب الروابط المشبوهة. لا تدفع الفدية أبداً.",
    zh: "勒索软件是一种恶意软件，会加密您的文件并要求支付赎金才能恢复访问。预防措施：保持离线备份、定期更新软件、避免可疑链接。永远不要支付赎金，因为这不能保证文件恢复。",
    ja: "ランサムウェアはファイルを暗号化してアクセスの回復と引き換えに身代金を要求するマルウェアです。予防策：オフラインバックアップの維持、ソフトウェアの定期更新、不審なリンクの回避。身代金は絶対に支払わないでください。",
  },
  sql: {
    en: "SQL injection is an attack where malicious SQL code is inserted into input fields to manipulate a database. Attackers can steal, modify, or delete data, and even gain admin access. Prevention: use parameterized queries, input validation, and stored procedures. It's one of the most common and dangerous web vulnerabilities (OWASP Top 10).",
    hi: "SQL इंजेक्शन एक हमला है जहाँ दुर्भावनापूर्ण SQL कोड इनपुट फ़ील्ड में डाला जाता है। हमलावर डेटा चुरा, बदल या हटा सकते हैं। रोकथाम: पैरामीटरयुक्त क्वेरी, इनपुट सत्यापन और स्टोर्ड प्रोसीजर का उपयोग करें।",
    es: "La inyección SQL es un ataque donde se inserta código SQL malicioso en campos de entrada para manipular una base de datos. Prevención: usa consultas parametrizadas, validación de entrada y procedimientos almacenados.",
    fr: "L'injection SQL est une attaque où du code SQL malveillant est inséré dans des champs de saisie pour manipuler une base de données. Prévention : utilisez des requêtes paramétrées, la validation des entrées et des procédures stockées.",
    ar: "حقن SQL هو هجوم يتم فيه إدراج كود SQL ضار في حقول الإدخال للتلاعب بقاعدة البيانات. الوقاية: استخدم الاستعلامات ذات المعاملات والتحقق من الإدخال والإجراءات المخزنة.",
    zh: "SQL注入是将恶意SQL代码插入输入字段以操纵数据库的攻击。攻击者可以窃取、修改或删除数据，甚至获得管理员访问权限。预防：使用参数化查询、输入验证和存储过程。",
    ja: "SQLインジェクションは、悪意のあるSQLコードを入力フィールドに挿入してデータベースを操作する攻撃です。予防策：パラメータ化クエリ、入力検証、ストアドプロシージャを使用してください。",
  },
  phishing: {
    en: "Phishing is a social engineering attack using fake emails, messages, or websites to trick users into revealing sensitive information like passwords or credit card numbers. Red flags: urgency, generic greetings, suspicious URLs, grammar errors. Always verify sender identity and never click unsolicited links.",
    hi: "फ़िशिंग एक सोशल इंजीनियरिंग हमला है जो नकली ईमेल या वेबसाइट का उपयोग करके उपयोगकर्ताओं को पासवर्ड या क्रेडिट कार्ड नंबर जैसी संवेदनशील जानकारी देने के लिए प्रेरित करता है। संदिग्ध URL और व्याकरण की गलतियों से सावधान रहें।",
    es: "El phishing es un ataque de ingeniería social que usa correos electrónicos o sitios web falsos para engañar a los usuarios para que revelen información sensible. Señales de alerta: urgencia, URLs sospechosas, errores gramaticales.",
    fr: "Le phishing est une attaque d'ingénierie sociale utilisant de faux e-mails ou sites web pour tromper les utilisateurs et leur faire révéler des informations sensibles. Signes d'alerte : urgence, URLs suspects, erreurs grammaticales.",
    ar: "التصيد الاحتيالي هو هجوم هندسة اجتماعية يستخدم رسائل بريد إلكتروني أو مواقع ويب مزيفة لخداع المستخدمين للكشف عن معلومات حساسة. علامات التحذير: الإلحاح، عناوين URL المشبوهة، الأخطاء النحوية.",
    zh: "网络钓鱼是利用虚假电子邮件、消息或网站欺骗用户透露密码或信用卡号等敏感信息的社会工程攻击。警示信号：紧迫感、可疑URL、语法错误。务必验证发件人身份，切勿点击不明链接。",
    ja: "フィッシングは、偽のメールやウェブサイトを使ってユーザーからパスワードやクレジットカード番号などの機密情報を騙し取るソーシャルエンジニアリング攻撃です。注意サイン：緊急性、怪しいURL、文法エラー。",
  },
  malware: {
    en: "Malware (malicious software) is any software designed to harm, exploit, or otherwise compromise a device or network. Types include viruses, worms, trojans, spyware, adware, and rootkits. Protection: use updated antivirus, avoid pirated software, don't open unknown attachments, enable firewall.",
    hi: "मैलवेयर (दुर्भावनापूर्ण सॉफ़्टवेयर) कोई भी सॉफ़्टवेयर है जो डिवाइस या नेटवर्क को नुकसान पहुंचाने के लिए डिज़ाइन किया गया है। प्रकार: वायरस, वर्म्स, ट्रोजन, स्पाइवेयर। सुरक्षा: अपडेटेड एंटीवायरस उपयोग करें, पायरेटेड सॉफ़्टवेयर से बचें।",
    es: "El malware es cualquier software diseñado para dañar o comprometer un dispositivo. Tipos: virus, gusanos, troyanos, spyware. Protección: usa antivirus actualizado, evita software pirata, no abras archivos adjuntos desconocidos.",
    fr: "Le malware est tout logiciel conçu pour endommager un appareil ou un réseau. Types : virus, vers, chevaux de Troie, spyware. Protection : utilisez un antivirus à jour, évitez les logiciels piratés, n'ouvrez pas les pièces jointes inconnues.",
    ar: "البرامج الضارة هي أي برنامج مصمم لإلحاق الضرر بجهاز أو شبكة. الأنواع: الفيروسات، الديدان، أحصنة طروادة، برامج التجسس. الحماية: استخدم برنامج مكافحة فيروسات محدثاً، وتجنب البرامج المقرصنة.",
    zh: "恶意软件是任何旨在损害、利用或破坏设备或网络的软件。类型包括：病毒、蠕虫、木马、间谍软件、广告软件和rootkit。防护：使用最新的杀毒软件、避免盗版软件、不打开未知附件。",
    ja: "マルウェアはデバイスやネットワークに害を与えるよう設計されたソフトウェアです。種類：ウイルス、ワーム、トロイの木馬、スパイウェア。保護：最新のウイルス対策ソフトを使用し、不正コピーソフトを避け、未知の添付ファイルを開かないでください。",
  },
  "2fa": {
    en: "Two-Factor Authentication (2FA) adds a second layer of security beyond passwords. Even if your password is stolen, attackers need a second factor — usually a time-based code (TOTP), SMS, or biometric. Enable 2FA on all critical accounts especially email, banking, and social media. Use an authenticator app over SMS for stronger security.",
    hi: "दो-कारक प्रमाणीकरण (2FA) पासवर्ड से परे सुरक्षा की एक दूसरी परत जोड़ता है। यदि आपका पासवर्ड चोरी हो जाता है, तो हमलावरों को दूसरे कारक की आवश्यकता होती है। सभी महत्वपूर्ण खातों पर 2FA सक्षम करें।",
    es: "La autenticación de dos factores (2FA) agrega una segunda capa de seguridad más allá de las contraseñas. Incluso si tu contraseña es robada, los atacantes necesitan un segundo factor. Habilita 2FA en todas las cuentas críticas.",
    fr: "L'authentification à deux facteurs (2FA) ajoute une deuxième couche de sécurité au-delà des mots de passe. Même si votre mot de passe est volé, les attaquants ont besoin d'un second facteur. Activez le 2FA sur tous les comptes critiques.",
    ar: "المصادقة الثنائية (2FA) تضيف طبقة أمان ثانية إلى جانب كلمات المرور. حتى لو سُرقت كلمة مرورك، يحتاج المهاجمون إلى عامل ثانٍ. قم بتفعيل 2FA على جميع الحسابات المهمة.",
    zh: "双因素认证（2FA）在密码之外增加了第二层安全防护。即使密码被盗，攻击者也需要第二个因素——通常是基于时间的代码（TOTP）、短信或生物特征。在所有重要账户上启用2FA，建议使用身份验证器应用而非短信。",
    ja: "二要素認証（2FA）はパスワード以外に第二の安全層を追加します。パスワードが盗まれても、攻撃者には第二の要素が必要です。特にメール、銀行、SNSの重要アカウントで2FAを有効にしてください。",
  },
  encryption: {
    en: "Encryption converts readable data into an unreadable format using algorithms and keys. Only authorized parties with the decryption key can access the original data. Types: symmetric (same key for encrypt/decrypt) and asymmetric (public/private key pair). Essential for protecting data in transit (HTTPS) and at rest (disk encryption).",
    hi: "एन्क्रिप्शन एल्गोरिदम और कुंजियों का उपयोग करके पठनीय डेटा को अपठनीय प्रारूप में परिवर्तित करता है। केवल डिक्रिप्शन कुंजी वाले अधिकृत पक्ष ही मूल डेटा तक पहुंच सकते हैं।",
    es: "El cifrado convierte datos legibles en un formato ilegible usando algoritmos y claves. Solo las partes autorizadas con la clave de descifrado pueden acceder a los datos originales. Esencial para proteger datos en tránsito y en reposo.",
    fr: "Le chiffrement convertit des données lisibles en format illisible à l'aide d'algorithmes et de clés. Seules les parties autorisées avec la clé de déchiffrement peuvent accéder aux données originales. Essentiel pour protéger les données en transit et au repos.",
    ar: "التشفير يحول البيانات القابلة للقراءة إلى تنسيق غير قابل للقراءة باستخدام الخوارزميات والمفاتيح. يمكن فقط للأطراف المصرح لها بمفتاح فك التشفير الوصول إلى البيانات الأصلية.",
    zh: "加密使用算法和密钥将可读数据转换为不可读格式。只有拥有解密密钥的授权方才能访问原始数据。类型：对称加密（相同密钥）和非对称加密（公钥/私钥对）。对于保护传输中和静止状态的数据至关重要。",
    ja: "暗号化はアルゴリズムとキーを使用して読み取り可能なデータを読み取り不可能な形式に変換します。復号化キーを持つ承認された当事者のみが元のデータにアクセスできます。HTTPSによる転送中のデータ保護と、ディスク暗号化による保存データの保護に不可欠です。",
  },
  darkweb: {
    en: "The dark web is an encrypted part of the internet accessible only via special software like Tor. While it has legitimate uses (privacy, censorship bypass, journalism), it also hosts illegal marketplaces. Stolen data, credentials, and malware are frequently traded there. Monitoring services can alert you if your data appears on the dark web.",
    hi: "डार्क वेब इंटरनेट का एन्क्रिप्टेड भाग है जो केवल Tor जैसे विशेष सॉफ़्टवेयर के माध्यम से सुलभ है। इसके वैध उपयोग हैं, लेकिन यह अवैध बाज़ारों की भी मेजबानी करता है जहाँ चोरी किया डेटा कारोबार होता है।",
    es: "La dark web es una parte cifrada de internet accesible solo a través de software especial como Tor. Aunque tiene usos legítimos, también alberga mercados ilegales donde se comercian datos robados y credenciales.",
    fr: "Le dark web est une partie chiffrée d'internet accessible uniquement via un logiciel spécial comme Tor. Bien qu'il ait des utilisations légitimes, il héberge également des marchés illégaux où données volées et identifiants sont échangés.",
    ar: "الويب المظلم هو جزء مشفر من الإنترنت لا يمكن الوصول إليه إلا عبر برامج خاصة مثل Tor. على الرغم من وجود استخدامات مشروعة، إلا أنه يستضيف أيضاً أسواقاً غير مشروعة حيث يتم تداول البيانات المسروقة.",
    zh: "暗网是互联网的加密部分，只能通过Tor等特殊软件访问。虽然有合法用途（隐私、绕过审查、新闻），但也托管着非法市场，盗窃数据和凭据在那里频繁交易。",
    ja: "ダークウェブはTorなどの特別なソフトウェアでのみアクセスできる暗号化されたインターネットの一部です。正当な用途（プライバシー、検閲回避）もありますが、違法なマーケットプレイスも存在し、盗まれたデータが取引されています。",
  },
  phone: {
    en: "To secure your phone: 1) Use a strong PIN/biometrics. 2) Enable full-disk encryption. 3) Keep OS and apps updated. 4) Only install apps from official stores. 5) Use a VPN on public Wi-Fi. 6) Enable remote wipe. 7) Be cautious of suspicious SMS links (smishing). 8) Disable Bluetooth when not in use. 9) Review app permissions regularly.",
    hi: "फोन सुरक्षित करने के लिए: 1) मजबूत PIN/बायोमेट्रिक्स उपयोग करें। 2) फुल-डिस्क एन्क्रिप्शन सक्षम करें। 3) OS और ऐप्स को अपडेट रखें। 4) केवल आधिकारिक स्टोर से ऐप्स इंस्टॉल करें। 5) पब्लिक Wi-Fi पर VPN उपयोग करें।",
    es: "Para asegurar tu teléfono: 1) Usa un PIN/biometría fuerte. 2) Habilita cifrado completo. 3) Mantén OS y apps actualizadas. 4) Solo instala apps de tiendas oficiales. 5) Usa VPN en Wi-Fi público. 6) Habilita borrado remoto.",
    fr: "Pour sécuriser votre téléphone : 1) Utilisez un PIN/biométrie fort. 2) Activez le chiffrement complet. 3) Gardez l'OS et les applications à jour. 4) Installez des applications uniquement depuis les stores officiels. 5) Utilisez un VPN sur le Wi-Fi public.",
    ar: "لتأمين هاتفك: 1) استخدم رمز PIN قوي أو المقاييس الحيوية. 2) تمكين التشفير الكامل للقرص. 3) إبقاء نظام التشغيل والتطبيقات محدثة. 4) تثبيت التطبيقات من المتاجر الرسمية فقط. 5) استخدم VPN على شبكة Wi-Fi العامة.",
    zh: "保护手机的方法：1) 使用强密码/生物识别。2) 启用全盘加密。3) 保持操作系统和应用程序更新。4) 只从官方商店安装应用。5) 在公共Wi-Fi使用VPN。6) 启用远程擦除。7) 警惕可疑短信链接。",
    ja: "スマホを安全にするには：1) 強力なPIN/生体認証を使用する。2) フルディスク暗号化を有効にする。3) OSとアプリを常に更新する。4) 公式ストアからのみアプリをインストールする。5) 公共Wi-FiではVPNを使用する。6) リモートワイプを有効にする。",
  },
  ddos: {
    en: "A DDoS (Distributed Denial of Service) attack floods a server with massive traffic from thousands of compromised devices (botnets), making it unavailable to legitimate users. Mitigation: CDN with DDoS protection (Cloudflare), rate limiting, traffic filtering, and scalable cloud infrastructure. It can take down entire websites in minutes.",
    hi: "DDoS (वितरित सेवा अस्वीकृति) हमला हजारों समझौता किए गए उपकरणों से सर्वर पर भारी ट्रैफ़िक भेजता है, जिससे वैध उपयोगकर्ताओं के लिए सेवा अनुपलब्ध हो जाती है। समाधान: Cloudflare, रेट लिमिटिंग, ट्रैफ़िक फ़िल्टरिंग।",
    es: "Un ataque DDoS inunda un servidor con tráfico masivo de miles de dispositivos comprometidos, haciéndolo no disponible para usuarios legítimos. Mitigación: CDN con protección DDoS, limitación de velocidad, filtrado de tráfico.",
    fr: "Une attaque DDoS inonde un serveur avec un trafic massif provenant de milliers d'appareils compromis, le rendant indisponible pour les utilisateurs légitimes. Atténuation : CDN avec protection DDoS, limitation de débit, filtrage du trafic.",
    ar: "هجوم DDoS يغمر الخادم بحركة مرور هائلة من آلاف الأجهزة المخترقة، مما يجعله غير متاح للمستخدمين الشرعيين. التخفيف: CDN مع حماية من DDoS، تحديد معدل الطلبات، تصفية حركة المرور.",
    zh: "DDoS（分布式拒绝服务）攻击用来自数千个受损设备（僵尸网络）的大量流量淹没服务器，使其对合法用户不可用。缓解措施：带DDoS保护的CDN（Cloudflare）、速率限制、流量过滤。",
    ja: "DDoS（分散型サービス拒否）攻撃は、数千の侵害されたデバイス（ボットネット）から大量のトラフィックをサーバーに送り付け、正当なユーザーが利用できなくします。対策：DDoS保護付きCDN（Cloudflare）、レート制限、トラフィックフィルタリング。",
  },
  social: {
    en: "Social engineering exploits human psychology rather than technical vulnerabilities. Attackers manipulate people through trust, fear, urgency, or authority to gain access or information. Types: phishing, pretexting, baiting, tailgating. Defense: security awareness training, verify identity before sharing info, be skeptical of unsolicited contacts.",
    hi: "सोशल इंजीनियरिंग तकनीकी कमजोरियों के बजाय मानव मनोविज्ञान का शोषण करती है। हमलावर विश्वास, भय, तात्कालिकता के माध्यम से लोगों को जोड़-तोड़कर पहुंच या जानकारी प्राप्त करते हैं। बचाव: सुरक्षा जागरूकता प्रशिक्षण।",
    es: "La ingeniería social explota la psicología humana en lugar de vulnerabilidades técnicas. Los atacantes manipulan a las personas mediante confianza, miedo o urgencia. Defensa: formación en concienciación sobre seguridad, verificar identidad antes de compartir información.",
    fr: "L'ingénierie sociale exploite la psychologie humaine plutôt que les vulnérabilités techniques. Les attaquants manipulent les gens par la confiance, la peur ou l'urgence. Défense : formation à la sensibilisation à la sécurité, vérifier l'identité avant de partager des informations.",
    ar: "الهندسة الاجتماعية تستغل علم النفس البشري بدلاً من الثغرات التقنية. يتلاعب المهاجمون بالناس من خلال الثقة والخوف والإلحاح. الدفاع: التدريب على التوعية الأمنية، والتحقق من الهوية قبل مشاركة المعلومات.",
    zh: "社会工程学利用人类心理而非技术漏洞。攻击者通过信任、恐惧、紧迫感或权威来操纵人们获取访问权或信息。类型：网络钓鱼、假托、诱骗、尾随。防御：安全意识培训、验证身份后再分享信息。",
    ja: "ソーシャルエンジニアリングは技術的な脆弱性ではなく人間心理を悪用します。攻撃者は信頼、恐怖、緊急性を通じて人々を操作してアクセスや情報を得ます。防御：セキュリティ意識向上トレーニング、情報共有前の身元確認。",
  },
};

const KEYWORD_MAP: Record<string, string> = {
  firewall: "firewall",
  "fire wall": "firewall",
  vpn: "vpn",
  "virtual private": "vpn",
  ransomware: "ransomware",
  ransom: "ransomware",
  sql: "sql",
  "sql injection": "sql",
  phishing: "phishing",
  malware: "malware",
  "2fa": "2fa",
  "two factor": "2fa",
  "two-factor": "2fa",
  "dvi faktor": "2fa",
  encryption: "encryption",
  encrypt: "encryption",
  darkweb: "darkweb",
  "dark web": "darkweb",
  phone: "phone",
  mobile: "phone",
  smartphone: "phone",
  ddos: "ddos",
  "denial of service": "ddos",
  "social engineering": "social",
  "social engineer": "social",
  // Hindi keywords
  "vpn क्या": "vpn",
  रैनसमवेयर: "ransomware",
  फ़िशिंग: "phishing",
  फोन: "phone",
  फ़ायरवॉल: "firewall",
  मैलवेयर: "malware",
  एन्क्रिप्शन: "encryption",
  // Spanish keywords
  cortafuegos: "firewall",
  cifrado: "encryption",
  "ingeniería social": "social",
  // French keywords
  "pare-feu": "firewall",
  chiffrement: "encryption",
  // Chinese keywords
  防火墙: "firewall",
  加密: "encryption",
  勒索软件: "ransomware",
  网络钓鱼: "phishing",
  // Japanese keywords
  ファイアウォール: "firewall",
  暗号化: "encryption",
  ランサムウェア: "ransomware",
  フィッシング: "phishing",
};

function findAnswer(question: string, lang: Language): string | null {
  const q = question.toLowerCase();
  for (const [keyword, key] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(keyword)) {
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

  const sendMessage = (text: string) => {
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

    setTimeout(() => {
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
    }, 300);
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              AI Powered
            </span>
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
            <button
              key={l.code}
              type="button"
              data-ocid="ai.tab"
              onClick={() => setLang(l.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                lang === l.code
                  ? "bg-primary text-primary-foreground border-primary glow-border"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {l.nativeLabel}
            </button>
          ))}
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-cyber rounded-xl border border-border overflow-hidden"
        >
          {/* Terminal Header Bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/50">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-primary/70" />
            <span className="ml-2 text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> tyson-ai — {currentLang.nativeLabel}
            </span>
          </div>

          {/* Messages */}
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
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm font-body max-w-xs">
                  {ui.subtitle}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${
                  msg.role === "user"
                    ? isRTL
                      ? "flex-row-reverse"
                      : "flex-row-reverse"
                    : "flex-row"
                }`}
                data-ocid={`ai.item.${i + 1}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm font-body leading-relaxed ${
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

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
                data-ocid="ai.loading_state"
              >
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary border border-border rounded-xl px-4 py-2.5 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-mono mr-2">
                    {ui.thinking}
                  </span>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div
            className="px-4 pb-2 flex flex-wrap gap-2"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            {ui.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                data-ocid="ai.secondary_button"
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors font-mono"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 pt-2 border-t border-border">
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
