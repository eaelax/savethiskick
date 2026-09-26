'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

export type LanguageCode = 'en' | 'fr' | 'ar' | 'de' | 'ch';

export interface Translations {
  nav: {
    howTo: string;
    about: string;
    contact: string;
    faq: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  input: {
    placeholder: string;
    clear: string;
    paste: string;
    download: string;
    analyzing: string;
  };
  proTip: {
    label: string;
    beforeWord: string;
    afterWord: string;
    exampleBefore: string;
    exampleAfter: string;
  };
  details: {
    formatLabel: string;
    fullVideo: string;
    onlyAudio: string;
    qualityLabel: string;
    audioQualityLabel: string;
    audioPill: string;
    downloadAction: string;
    downloadOnlyAudio: string;
    downloadAgain: string;
    autoResolvedBadge: string;
  };
  progress: {
    downloadingVideo: string;
    downloadingAudio: string;
    eta: string;
    cancel: string;
    completeTitle: string;
    saved: string;
    saveAgain: string;
    retry: string;
  };
  steps: {
    sectionTitle: string;
    sectionSubtitle: string;
    step1: {
      num: string;
      title: string;
      desc: string;
      tip: string;
    };
    step2: {
      num: string;
      title: string;
      desc: string;
      tip: string;
    };
    step3: {
      num: string;
      title: string;
      desc: string;
      tip: string;
    };
  };
  faq: {
    sectionTitle: string;
    sectionSubtitle: string;
    quickTipTitle: string;
    quickTipDesc: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  footer: {
    desc: string;
    disclaimer: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    dmca: string;
    howTo: string;
    faq: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    nav: {
      howTo: 'How to Download',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
    },
    hero: {
      title: 'Kick VOD Downloader',
      subtitle:
        'Save full Kick broadcasts, past streams, and extracted MP3 audio in original 1080p source quality directly to your device.',
    },
    input: {
      placeholder: 'Paste Kick VOD link here...',
      clear: 'CLEAR',
      paste: 'PASTE',
      download: 'DOWNLOAD',
      analyzing: 'ANALYZING',
    },
    proTip: {
      label: 'Pro Tip:',
      beforeWord: 'Simply add',
      afterWord: 'before kick in any VOD URL (e.g.,',
      exampleBefore: 'https://www.',
      exampleAfter: 'kick.com/video/...)',
    },
    details: {
      formatLabel: 'Download Format',
      fullVideo: 'FULL VIDEO',
      onlyAudio: 'ONLY AUDIO',
      qualityLabel: 'Quality Resolution',
      audioQualityLabel: 'Audio Stream Quality',
      audioPill: '320kbps MP3',
      downloadAction: 'DOWNLOAD',
      downloadOnlyAudio: 'DOWNLOAD ONLY AUDIO',
      downloadAgain: 'DOWNLOAD AGAIN',
      autoResolvedBadge: 'Latest broadcast video automatically resolved for broadcaster',
    },
    progress: {
      downloadingVideo: 'DOWNLOADING VIDEO',
      downloadingAudio: 'DOWNLOADING AUDIO',
      eta: 'ETA:',
      cancel: 'Cancel',
      completeTitle: 'DOWNLOAD COMPLETE',
      saved: 'Saved:',
      saveAgain: 'Save Again',
      retry: 'Retry',
    },
    steps: {
      sectionTitle: 'How to Download Kick VODs & Audio in 3 Easy Steps',
      sectionSubtitle:
        'Follow these simple steps to save any Kick stream or clip directly to your device with zero software installation.',
      step1: {
        num: '01',
        title: 'Copy Kick URL',
        desc: 'Open Kick.com and locate any past broadcast, VOD, or viral clip. Copy the full link from your browser address bar.',
        tip: 'Supports full past broadcasts, clips, and streamer archives.',
      },
      step2: {
        num: '02',
        title: 'Paste or Use Shortcut',
        desc: 'Paste the URL into the input bar above, or simply type "savethis" directly before "kick.com" in your browser address bar for instant redirect.',
        tip: 'Use our 1-click PASTE button directly from your clipboard.',
      },
      step3: {
        num: '03',
        title: 'Choose Quality & Save',
        desc: 'Select your preferred source resolution (1080p60, 720p60, 480p, or high-bitrate MP3 Audio) and click Download to save the original file.',
        tip: '100% free, authentic original quality, zero watermarks.',
      },
    },
    faq: {
      sectionTitle: 'Frequently Asked Questions',
      sectionSubtitle:
        'Everything you need to know about downloading Kick past broadcasts, clips, audio tracks, and using our instant URL shortcut.',
      quickTipTitle: 'Quick Tip',
      quickTipDesc:
        'Bookmark SaveThisKick in your browser toolbar for instant 1-click downloads anytime you are watching Kick streams.',
      items: [
        {
          q: 'How do I download a Kick VOD or Clip using SaveThisKick?',
          a: 'You have two effortless options: (1) Copy any stream or clip URL from Kick.com, paste it into our search bar, and click Download. (2) Even faster: simply insert "savethis" before "kick.com" in your browser address bar while watching any VOD (e.g. savethiskick.com/streamer/videos/...), and you will be taken straight to the download options.',
        },
        {
          q: 'Are 1080p 60 FPS source resolutions and 720p supported?',
          a: 'Yes. SaveThisKick connects directly to Kick streaming servers, preserving the exact broadcast bitrate, 1080p60 framerate, and uncompressed AAC/MP3 audio channels without any server-side compression degradation.',
        },
        {
          q: 'Can I download very long 8+ hour Kick past broadcasts?',
          a: 'Absolutely. We support multi-hour broadcasts up to 24 hours. Because our tool repackages HLS stream chunks without heavy video re-encoding, long files are processed smoothly directly in your browser.',
        },
        {
          q: 'Do I need to install software, extensions, or register an account?',
          a: 'No. SaveThisKick is 100% web-based and completely free. You do not need an account, login credentials, or browser extensions to save VODs or clips.',
        },
        {
          q: 'Why do Kick VODs sometimes disappear or expire?',
          a: 'Kick automatically deletes past broadcast VODs after 30 to 60 days depending on streamer tier, and streamers can delete or unpublish VODs at any moment. Using SaveThisKick allows you to archive your favorite streams permanently offline before they are removed.',
        },
        {
          q: 'What video file formats are provided upon download?',
          a: 'Full video downloads are delivered in standard .MPG container format, ensuring instant desktop compatibility with Windows Media Player, QuickTime, VLC, and video editing software. For audio-only requests, files are delivered as high-bitrate .MP3 audio.',
        },
      ],
    },
    footer: {
      desc: 'Fast, free online utility to download Kick past broadcasts and viral clips in original 1080p60 quality and high-bitrate MP3 audio. Use the web tool or prefix any kick.com URL with savethis.',
      disclaimer: '© 2026 SaveThisKick. Independent utility tool. Not affiliated with, endorsed by, or sponsored by Kick.com.',
      about: 'About Us',
      contact: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      dmca: 'DMCA Disclaimer',
      howTo: 'How to Download',
      faq: 'FAQ',
    },
  },
  fr: {
    nav: {
      howTo: 'Comment télécharger',
      about: 'À propos',
      contact: 'Contact',
      faq: 'FAQ',
    },
    hero: {
      title: 'Téléchargeur de VOD Kick',
      subtitle:
        'Enregistrez les rediffusions complètes de Kick, les streams passés et l’audio MP3 extrait en qualité source 1080p d’origine directement sur votre appareil.',
    },
    input: {
      placeholder: 'Collez le lien de la VOD Kick ici...',
      clear: 'EFFACER',
      paste: 'COLLER',
      download: 'TÉLÉCHARGER',
      analyzing: 'ANALYSE EN COURS',
    },
    proTip: {
      label: 'Astuce :',
      beforeWord: 'Ajoutez simplement',
      afterWord: 'devant kick dans n’importe quelle URL de VOD (ex. :',
      exampleBefore: 'https://www.',
      exampleAfter: 'kick.com/video/...)',
    },
    details: {
      formatLabel: 'Format de téléchargement',
      fullVideo: 'VIDÉO COMPLÈTE',
      onlyAudio: 'AUDIO SEULEMENT',
      qualityLabel: 'Résolution et qualité',
      audioQualityLabel: 'Qualité du flux audio',
      audioPill: 'MP3 320 kbps',
      downloadAction: 'TÉLÉCHARGER',
      downloadOnlyAudio: 'TÉLÉCHARGER UNIQUEMENT L’AUDIO',
      downloadAgain: 'TÉLÉCHARGER À NOUVEAU',
      autoResolvedBadge: 'Dernière vidéo de diffusion automatiquement résolue pour le diffuseur',
    },
    progress: {
      downloadingVideo: 'TÉLÉCHARGEMENT DE LA VIDÉO',
      downloadingAudio: 'TÉLÉCHARGEMENT DE L’AUDIO',
      eta: 'Temps restant :',
      cancel: 'Annuler',
      completeTitle: 'TÉLÉCHARGEMENT TERMINÉ',
      saved: 'Enregistré :',
      saveAgain: 'Enregistrer à nouveau',
      retry: 'Réessayer',
    },
    steps: {
      sectionTitle: 'Comment télécharger des VOD et audios Kick en 3 étapes faciles',
      sectionSubtitle:
        'Suivez ces étapes simples pour enregistrer n’importe quel stream ou clip Kick directement sur votre appareil sans aucune installation.',
      step1: {
        num: '01',
        title: 'Copiez l’URL Kick',
        desc: 'Ouvrez Kick.com et trouvez une rediffusion, VOD ou clip. Copiez le lien complet depuis la barre d’adresse de votre navigateur.',
        tip: 'Prend en charge les rediffusions entières, les clips et les archives.',
      },
      step2: {
        num: '02',
        title: 'Collez ou utilisez le raccourci',
        desc: 'Collez l’URL dans la barre ci-dessus ou tapez "savethis" directement avant "kick.com" dans votre barre d’adresse pour une redirection instantanée.',
        tip: 'Utilisez notre bouton COLLER en 1 clic directement depuis votre presse-papiers.',
      },
      step3: {
        num: '03',
        title: 'Choisissez la qualité et enregistrez',
        desc: 'Sélectionnez votre résolution source préférée (1080p60, 720p60, 480p ou audio MP3 haute fidélité) et cliquez sur Télécharger.',
        tip: '100% gratuit, qualité source authentique, aucun filigrane.',
      },
    },
    faq: {
      sectionTitle: 'Foire Aux Questions',
      sectionSubtitle:
        'Tout ce que vous devez savoir pour télécharger des rediffusions Kick, des clips, des pistes audio et utiliser notre raccourci instantané.',
      quickTipTitle: 'Astuce rapide',
      quickTipDesc:
        'Ajoutez SaveThisKick à vos favoris pour des téléchargements instantanés en un clic lorsque vous regardez des flux Kick.',
      items: [
        {
          q: 'Comment télécharger une VOD ou un clip Kick avec SaveThisKick ?',
          a: 'Vous avez deux options simples : (1) Copiez l’URL depuis Kick.com, collez-la dans notre barre de recherche et cliquez sur Télécharger. (2) Encore plus rapide : insérez simplement "savethis" avant "kick.com" dans la barre d’adresse de votre navigateur pendant que vous regardez une VOD.',
        },
        {
          q: 'Les résolutions 1080p 60 FPS et 720p sont-elles prises en charge ?',
          a: 'Oui. SaveThisKick se connecte directement aux serveurs Kick, préservant le débit exact de diffusion, le framerate 60 FPS et les canaux audio AAC/MP3 sans perte.',
        },
        {
          q: 'Puis-je télécharger de très longs streams de plus de 8 heures ?',
          a: 'Absolument. Nous prenons en charge des diffusions de plusieurs heures jusqu’à 24 heures sans ré-encodage lourd.',
        },
        {
          q: 'Dois-je installer un logiciel ou créer un compte ?',
          a: 'Non. SaveThisKick fonctionne entièrement sur le web et est 100% gratuit, sans inscription ni extension requise.',
        },
        {
          q: 'Pourquoi les VOD Kick expirent-elles parfois ?',
          a: 'Kick supprime automatiquement les rediffusions passées après 30 à 60 jours selon le niveau du streamer. SaveThisKick vous permet de les archiver pour toujours.',
        },
        {
          q: 'Quels formats de fichiers sont fournis lors du téléchargement ?',
          a: 'Les téléchargements vidéo complets sont fournis au format .MPG standard, assurant une lecture fluide sur VLC, QuickTime et Windows Media Player. Les fichiers audio sont au format .MP3.',
        },
      ],
    },
    footer: {
      desc: 'Outil en ligne rapide et gratuit pour télécharger les rediffusions et clips Kick en qualité 1080p60 et audio MP3 haute fidélité.',
      disclaimer: '© 2026 SaveThisKick. Outil utilitaire indépendant. Non affilié à ni sponsorisé par Kick.com.',
      about: 'À propos',
      contact: 'Contact',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d’utilisation',
      dmca: 'Avis DMCA',
      howTo: 'Comment télécharger',
      faq: 'FAQ',
    },
  },
  ar: {
    nav: {
      howTo: 'طريقة التحميل',
      about: 'من نحن',
      contact: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
    },
    hero: {
      title: 'تحميل فيديوهات وبثوث كيك VOD',
      subtitle:
        'احفظ كامل بثوث كيك السابقة ومقاطع الفيديو ومسارات الصوت MP3 بأعلى جودة أصلية 1080p مباشرة على جهازك دون أي برامج.',
    },
    input: {
      placeholder: 'الصق رابط فيديو أو بث كيك هنا...',
      clear: 'مسح',
      paste: 'لصق',
      download: 'تحميل الآن',
      analyzing: 'جاري التحليل...',
    },
    proTip: {
      label: 'نصيحة سريعة:',
      beforeWord: 'فقط اكتب',
      afterWord: 'قبل كلمة kick في أي رابط للبث (مثال:',
      exampleBefore: 'https://www.',
      exampleAfter: 'kick.com/video/...)',
    },
    details: {
      formatLabel: 'صيغة التحميل',
      fullVideo: 'فيديو كامل',
      onlyAudio: 'صوت فقط MP3',
      qualityLabel: 'دقة وجودة الفيديو',
      audioQualityLabel: 'جودة الصوت',
      audioPill: 'MP3 عالي الجودة 320kbps',
      downloadAction: 'تحميل',
      downloadOnlyAudio: 'تحميل الصوت فقط MP3',
      downloadAgain: 'تحميل مرة أخرى',
      autoResolvedBadge: 'تم استخراج أحدث بث مسجل للقناة تلقائياً لصاحب البث',
    },
    progress: {
      downloadingVideo: 'جاري تحميل الفيديو...',
      downloadingAudio: 'جاري تحميل الصوت...',
      eta: 'الوقت المتبقي:',
      cancel: 'إلغاء',
      completeTitle: 'اكتمل التحميل بنجاح',
      saved: 'تم حفظ:',
      saveAgain: 'حفظ مجدداً',
      retry: 'إعادة المحاولة',
    },
    steps: {
      sectionTitle: 'كيفية تحميل بثوث وفيديوهات كيك في 3 خطوات بسيطة',
      sectionSubtitle:
        'اتبع هذه الخطوات السهلة لحفظ أي بث أو مقطع من منصة Kick مباشرة على جهازك بسرعة فائقة وبدون تثبيت برامج.',
      step1: {
        num: '01',
        title: 'انسخ رابط كيك',
        desc: 'افتح موقع Kick.com واعثر على أي بث سابق أو مقطع ترغب في حفظه، ثم انسخ الرابط من شريط عنوان المتصفح.',
        tip: 'يدعم جميع البثوث الطويلة والمقاطع وأرشيف القنوات بالكامل.',
      },
      step2: {
        num: '02',
        title: 'الصق الرابط أو استخدم الاختصار',
        desc: 'الصق الرابط في مربع البحث أعلاه، أو ببساطة اكتب "savethis" مباشرة قبل "kick.com" في شريط عنوان المتصفح للتحويل التلقائي.',
        tip: 'استخدم زر لصق السريع من الحافظة بضغطة زر واحدة.',
      },
      step3: {
        num: '03',
        title: 'اختر الجودة وابدأ التحميل',
        desc: 'حدد دقة العرض المفضلة لديك (1080p60 أو 720p60 أو 480p أو صوت MP3 عالي الدقة) وانقر فوق تحميل لحفظ الملف الأصلي.',
        tip: 'مجاني 100%، جودة أصلية خام، وبدون أي علامات مائية.',
      },
    },
    faq: {
      sectionTitle: 'الأسئلة الشائعة والأجوبة',
      sectionSubtitle:
        'كل ما تحتاج لمعرفته حول تحميل تسجيلات البثوث، المقاطع الصوتية، واستخدام اختصار الرابط الفوري.',
      quickTipTitle: 'نصيحة مفيدة',
      quickTipDesc:
        'أضف SaveThisKick إلى شريط إشارات متصفحك لتحميل البثوث بضغطة واحدة في أي وقت تشاهد فيه منصة Kick.',
      items: [
        {
          q: 'كيف يمكنني تحميل فيديو أو بث من منصة كيك عبر SaveThisKick؟',
          a: 'لديك خياران سهلان: (1) انسخ رابط أي بث أو مقطع من Kick.com، والصقه في شريط البحث لدينا ثم انقر فوق تحميل. (2) أو الأسرع: اكتب "savethis" قبل "kick.com" في شريط عنوان المتصفح أثناء مشاهدة البث.',
        },
        {
          q: 'هل يدعم الموقع دقة المصدر الأصلية 1080p 60fps وجودة 720p؟',
          a: 'نعم بالتأكيد. يتصل SaveThisKick بخوادم البث المباشر لمنصة كيك الأصلية، ويحفظ معدل البت الكامل وإطارات 60 إطاراً في الثانية دون أي ضغط أو تقليل للجودة.',
        },
        {
          q: 'هل يمكن تحميل البثوث الطويلة التي تتجاوز مدتها 8 ساعات؟',
          a: 'نعم، يدعم نظامنا البثوث الطويلة حتى 24 ساعة بكل سلاسة مباشرة في متصفحك دون الحاجة لإعادة ترميز ثقيلة.',
        },
        {
          q: 'هل يتطلب الموقع تثبيت برامج أو تسجيل حساب؟',
          a: 'لا نهائياً. الأداة مجانية 100% وتعمل عبر المتصفح مباشرة دون الحاجة لأي حساب أو تسجيل دخول أو تثبيت أي إضافات.',
        },
        {
          q: 'لماذا تختفي أو تُحذف بعض بثوث كيك المسجلة؟',
          a: 'تقوم منصة كيك بحذف تسجيلات البثوث السابقة تلقائياً بعد 30 إلى 60 يوماً، كما يمكن لصانع المحتوى حذفها بأي وقت. تتيح لك أداة SaveThisKick أرشفتها على قرصك للأبد.',
        },
        {
          q: 'ما هي صيغ الملفات التي يتم تسليمها عند التنزيل؟',
          a: 'يتم تسليم الفيديوهات بصيغة .MPG المتوافقة مع جميع مشغلات الفيديو مثل VLC وQuickTime وWindows Media Player، وتُسلم الملفات الصوتية بصيغة .MP3 نقية.',
        },
      ],
    },
    footer: {
      desc: 'أداة مجانية وسريعة عبر الإنترنت لتحميل بثوث ومقاطع كيك السابقة بأعلى دقة 1080p60 واستخراج الصوت MP3.',
      disclaimer: '© 2026 SaveThisKick. أداة خدمية مستقلة. غير تابعة أو مدعومة أو برعاية Kick.com.',
      about: 'من نحن',
      contact: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      dmca: 'حقوق الملكية والنشر',
      howTo: 'طريقة التحميل',
      faq: 'الأسئلة الشائعة',
    },
  },
  de: {
    nav: {
      howTo: 'Anleitung',
      about: 'Über uns',
      contact: 'Kontakt',
      faq: 'FAQ',
    },
    hero: {
      title: 'Kick VOD Downloader',
      subtitle:
        'Speichern Sie vollständige Kick-Liveübertragungen, vergangene Streams und extrahiertes MP3-Audio in nativer 1080p-Quellqualität direkt auf Ihrem Gerät.',
    },
    input: {
      placeholder: 'Kick VOD-Link hier einfügen...',
      clear: 'LÖSCHEN',
      paste: 'EINFÜGEN',
      download: 'HERUNTERLADEN',
      analyzing: 'ANALYSIERE...',
    },
    proTip: {
      label: 'Profi-Tipp:',
      beforeWord: 'Einfach',
      afterWord: 'vor kick in jede VOD-URL einfügen (z.B.',
      exampleBefore: 'https://www.',
      exampleAfter: 'kick.com/video/...)',
    },
    details: {
      formatLabel: 'Download-Format',
      fullVideo: 'KOMPLETTES VIDEO',
      onlyAudio: 'NUR AUDIO',
      qualityLabel: 'Auflösung und Qualität',
      audioQualityLabel: 'Audio-Stream-Qualität',
      audioPill: '320kbps MP3',
      downloadAction: 'HERUNTERLADEN',
      downloadOnlyAudio: 'NUR AUDIO HERUNTERLADEN',
      downloadAgain: 'ERNEUT HERUNTERLADEN',
      autoResolvedBadge: 'Neuestes Übertragungsvideo automatisch für den Streamer ermittelt',
    },
    progress: {
      downloadingVideo: 'VIDEO WIRD HERUNTERGELADEN',
      downloadingAudio: 'AUDIO WIRD HERUNTERGELADEN',
      eta: 'Verbleibend:',
      cancel: 'Abbrechen',
      completeTitle: 'DOWNLOAD ABGESCHLOSSEN',
      saved: 'Gespeichert:',
      saveAgain: 'Erneut speichern',
      retry: 'Wiederholen',
    },
    steps: {
      sectionTitle: 'Kick VODs & Audio in 3 einfachen Schritten herunterladen',
      sectionSubtitle:
        'Befolgen Sie diese einfachen Schritte, um beliebige Kick-Streams oder Clips ohne Softwareinstallation direkt auf Ihrem Gerät zu speichern.',
      step1: {
        num: '01',
        title: 'Kick-URL kopieren',
        desc: 'Öffnen Sie Kick.com, suchen Sie eine Übertragung, ein VOD oder einen Clip und kopieren Sie den Link aus der Adresszeile.',
        tip: 'Unterstützt komplette vergangene Streams, Clips und Streamer-Archive.',
      },
      step2: {
        num: '02',
        title: 'Einfügen oder Shortcut nutzen',
        desc: 'Fügen Sie die URL in das Suchfeld oben ein oder tippen Sie "savethis" direkt vor "kick.com" in die Browser-Adresszeile ein.',
        tip: 'Nutzen Sie die 1-Klick-Einfügen-Schaltfläche direkt aus Ihrer Zwischenablage.',
      },
      step3: {
        num: '03',
        title: 'Qualität wählen & speichern',
        desc: 'Wählen Sie Ihre gewünschte Auflösung (1080p60, 720p60, 480p oder MP3-Audio) und klicken Sie auf Herunterladen.',
        tip: '100% kostenlos, echte Originalqualität, keine Wasserzeichen.',
      },
    },
    faq: {
      sectionTitle: 'Häufig gestellte Fragen (FAQ)',
      sectionSubtitle:
        'Alles, was Sie über das Herunterladen von Kick-Streams, Clips und die Nutzung unseres Sofort-Shortcuts wissen müssen.',
      quickTipTitle: 'Schnelltipp',
      quickTipDesc:
        'Setzen Sie ein Lesezeichen für SaveThisKick für 1-Klick-Downloads beim Ansehen von Kick-Streams.',
      items: [
        {
          q: 'Wie lade ich ein Kick VOD mit SaveThisKick herunter?',
          a: 'Kopieren Sie einfach die URL von Kick.com und fügen Sie sie in unser Suchfeld ein. Noch schneller: Schreiben Sie einfach "savethis" vor "kick.com" in Ihrer Adressleiste.',
        },
        {
          q: 'Werden 1080p 60 FPS und 720p unterstützt?',
          a: 'Ja. SaveThisKick verbindet sich direkt mit den Servern von Kick und erhält die volle Bitrate und Framerate ohne Qualitätsverlust.',
        },
        {
          q: 'Kann ich lange Streams mit über 8 Stunden Dauer herunterladen?',
          a: 'Absolut. Wir unterstützen mehrstündige Streams bis zu 24 Stunden reibungslos im Browser.',
        },
        {
          q: 'Muss ich Software installieren oder ein Konto registrieren?',
          a: 'Nein. SaveThisKick ist 100% webbasiert und völlig kostenlos, ohne Anmeldung oder Erweiterungen.',
        },
        {
          q: 'Warum verschwinden Kick VODs manchmal?',
          a: 'Kick löscht vergangene VODs automatisch nach 30 bis 60 Tagen. Mit SaveThisKick sichern Sie Ihre Lieblingsstreams dauerhaft offline.',
        },
        {
          q: 'Welche Dateiformate werden bereitgestellt?',
          a: 'Volle Videos werden im universellen .MPG-Format für sofortige Kompatibilität bereitgestellt. Für Audio-Downloads erhalten Sie hochwertige .MP3-Dateien.',
        },
      ],
    },
    footer: {
      desc: 'Schnelles, kostenloses Online-Tool zum Herunterladen von Kick-Streams und Clips in 1080p60 und High-Bitrate MP3-Audio.',
      disclaimer: '© 2026 SaveThisKick. Unabhängiges Hilfsprogramm. Nicht mit Kick.com verbunden oder gesponsert.',
      about: 'Über uns',
      contact: 'Kontakt',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      dmca: 'DMCA-Hinweis',
      howTo: 'Anleitung',
      faq: 'FAQ',
    },
  },
  ch: {
    nav: {
      howTo: '下载教程',
      about: '关于我们',
      contact: '联系我们',
      faq: '常见问题',
    },
    hero: {
      title: 'Kick 视频直播回放下载器',
      subtitle:
        '无需安装任何软件，直接将 Kick 完整直播回放、精彩剪辑和提取的 MP3 音频以原始 1080p 高清画质保存到您的设备。',
    },
    input: {
      placeholder: '在此粘贴 Kick 视频或回放链接...',
      clear: '清空',
      paste: '粘贴',
      download: '立即下载',
      analyzing: '正在解析...',
    },
    proTip: {
      label: '快捷技巧：',
      beforeWord: '只需在任意视频网址的 kick 前添加',
      afterWord: '即可自动跳转（例如：',
      exampleBefore: 'https://www.',
      exampleAfter: 'kick.com/video/...)',
    },
    details: {
      formatLabel: '下载格式',
      fullVideo: '完整视频',
      onlyAudio: '纯音频 MP3',
      qualityLabel: '画质分辨率',
      audioQualityLabel: '音频流质量',
      audioPill: '320kbps 高清 MP3',
      downloadAction: '下载',
      downloadOnlyAudio: '仅下载 MP3 音频',
      downloadAgain: '重新下载',
      autoResolvedBadge: '已自动为主播解析最新直播回放视频',
    },
    progress: {
      downloadingVideo: '正在下载视频',
      downloadingAudio: '正在下载音频',
      eta: '预计剩余时间：',
      cancel: '取消',
      completeTitle: '下载完成',
      saved: '已保存：',
      saveAgain: '再次保存',
      retry: '重试',
    },
    steps: {
      sectionTitle: '只需 3 步轻松下载 Kick 视频与音频',
      sectionSubtitle:
        '按照以下简易步骤，无需安装任何客户端，直接将任意 Kick 直播或剪辑保存到您的本地设备。',
      step1: {
        num: '01',
        title: '复制 Kick 链接',
        desc: '打开 Kick.com，找到任意直播回放、VOD 或剪辑，从浏览器地址栏复制完整链接。',
        tip: '支持长达数小时的直播回放、短视频与主播归档。',
      },
      step2: {
        num: '02',
        title: '粘贴或使用快捷前缀',
        desc: '将链接粘贴到上方搜索栏，或者直接在浏览器地址栏的 kick.com 前加上 savethis 即可秒速跳转。',
        tip: '点击一键粘贴按钮直接读取剪贴板内容。',
      },
      step3: {
        num: '03',
        title: '选择画质并保存',
        desc: '选择您心仪的分辨率（1080p60 原画、720p60、480p 或高码率 MP3 音频），点击下载即可保存原文件。',
        tip: '100% 免费，真实原画质，绝无多余水印。',
      },
    },
    faq: {
      sectionTitle: '常见问题解答',
      sectionSubtitle:
        '了解有关下载 Kick 直播回放、剪辑片段、提取音频以及使用网址快捷前缀的所有详情。',
      quickTipTitle: '实用提示',
      quickTipDesc:
        '将 SaveThisKick 添加到您的浏览器书签栏，随时在观看 Kick 直播时一键高速下载。',
      items: [
        {
          q: '如何使用 SaveThisKick 下载 Kick 直播回放或剪辑？',
          a: '两种便捷方式：(1) 从 Kick.com 复制网址，粘贴到我们的搜索栏中点击下载；(2) 更快捷：在正在观看的 VOD 地址栏中，直接在 kick.com 前输入 savethis 即可自动进入下载页。',
        },
        {
          q: '是否支持 1080p 60 FPS 原画和 720p 分辨率？',
          a: '完全支持。SaveThisKick 直接连接 Kick 原生视频流服务器，保持原汁原味的码率、60 帧率与 AAC/MP3 声道，绝无二次压缩损耗。',
        },
        {
          q: '能否下载超过 8 小时的超长直播回放？',
          a: '当然可以。我们支持长达 24 小时的超长直播流，无需重编码，在浏览器中即可高速整合流分片。',
        },
        {
          q: '是否需要安装软件、浏览器扩展或注册账号？',
          a: '完全不需要。SaveThisKick 是一款 100% 网页端在线工具，终身免费，无需注册账户或安装任何插件。',
        },
        {
          q: '为什么某些 Kick 直播回放会失效或被删除？',
          a: 'Kick 平台通常会在 30 至 60 天后自动清理过往直播，主播也可随时删除。使用 SaveThisKick 能将心仪的直播永久离线备份。',
        },
        {
          q: '下载后的视频文件是什么格式？',
          a: '完整视频采用标准 .MPG 容器格式交付，完美兼容 Windows 媒体播放器、VLC、QuickTime 及各类剪辑软件；纯音频则为标准的 .MP3 格式。',
        },
      ],
    },
    footer: {
      desc: '快速、免费的在线工具，轻松将 Kick 直播回放和精彩片段下载为 1080p60 高清视频与 MP3 音频。',
      disclaimer: '© 2026 SaveThisKick. 独立在线工具。与 Kick.com 无任何附属、认可或赞助关系。',
      about: '关于我们',
      contact: '联系我们',
      privacy: '隐私政策',
      terms: '服务条款',
      dmca: '版权声明',
      howTo: '下载教程',
      faq: '常见问题',
    },
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  isRtl: false,
});

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('kick_lang') as LanguageCode | null;
    if (saved && ['en', 'fr', 'ar', 'de', 'ch'].includes(saved)) {
      return saved;
    }
  } catch {}
  return 'en';
}

function getServerSnapshot(): LanguageCode {
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const isArabic = language === 'ar';
    document.documentElement.lang = isArabic ? 'ar' : language === 'ch' ? 'zh' : language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    if (isArabic) {
      document.body.classList.add('font-almarai');
    } else {
      document.body.classList.remove('font-almarai');
    }
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    try {
      localStorage.setItem('kick_lang', lang);
    } catch {}
    emitChange();
  };

  const isRtl = language === 'ar';
  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
