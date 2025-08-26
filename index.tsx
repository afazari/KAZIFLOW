// --- TYPES ---
interface CycleLog {
  startDate: string; // ISO string
  endDate?: string;   // ISO string
}

type LanguageCode = 'rw' | 'en' | 'sw' | 'fr' | 'es' | 'pt' | 'ar' | 'ko' | 'hi' | 'zh';
interface Language {
  code: LanguageCode;
  name: string;
}

const supportedLanguages: Language[] = [
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' },
];

type ThemeName = 'midnight' | 'peach' | 'rose' | 'sage';

interface Theme {
  name: string;
  colors: Record<string, string>;
}

const themes: Record<ThemeName, Theme> = {
  midnight: {
    name: 'Midnight',
    colors: {
      '--background': '#121212',
      '--surface': '#1E1E1E',
      '--primary-text': '#EAEAEA',
      '--secondary-text': '#A0A0A0',
      '--accent-period': '#FF6B6B',
      '--accent-fertile': '#FFAA71',
      '--accent-safe': '#4ECDC4',
      '--border-color': '#333333',
      '--button-text': '#FFFFFF',
      '--popup-bg': '#F0F0F0',
      '--popup-text': '#121212',
      '--cover-bg': '#FFF8F0',
      '--cover-text': '#5D5555',
      '--cover-peach': '#FFDAB9',
      '--cover-lavender': '#E6E6FA',
      '--cover-pink': '#FFB6C1',
    },
  },
  peach: {
    name: 'Pastel Peach',
    colors: {
      '--background': '#FFF8F0',
      '--surface': '#FFFFFF',
      '--primary-text': '#5D5555',
      '--secondary-text': '#A09B9B',
      '--accent-period': '#FFB6C1',
      '--accent-fertile': '#FFDAB9',
      '--accent-safe': '#B0E0E6',
      '--border-color': '#EAEAEA',
      '--button-text': '#FFFFFF',
      '--popup-bg': '#FFFFFF',
      '--popup-text': '#5D5555',
      '--cover-bg': '#FFF8F0',
      '--cover-text': '#5D5555',
      '--cover-peach': '#FFDAB9',
      '--cover-lavender': '#E6E6FA',
      '--cover-pink': '#FFB6C1',
    },
  },
  rose: {
    name: 'Misty Rose',
    colors: {
      '--background': '#FDF6F6',
      '--surface': '#FFFFFF',
      '--primary-text': '#4B4453',
      '--secondary-text': '#9E98A3',
      '--accent-period': '#E0B3B3',
      '--accent-fertile': '#D4C1EC',
      '--accent-safe': '#B392AC',
      '--border-color': '#F0E5E5',
      '--button-text': '#FFFFFF',
      '--popup-bg': '#FFFFFF',
      '--popup-text': '#4B4453',
      '--cover-bg': '#FFF8F0',
      '--cover-text': '#5D5555',
      '--cover-peach': '#FFDAB9',
      '--cover-lavender': '#E6E6FA',
      '--cover-pink': '#FFB6C1',
    },
  },
  sage: {
    name: 'Sage Grove',
    colors: {
      '--background': '#F4F4F0',
      '--surface': '#FFFFFF',
      '--primary-text': '#4A574A',
      '--secondary-text': '#8A9A8A',
      '--accent-period': '#E6BFB8',
      '--accent-fertile': '#F0D6A7',
      '--accent-safe': '#A6BCA9',
      '--border-color': '#E8E8E2',
      '--button-text': '#FFFFFF',
      '--popup-bg': '#FFFFFF',
      '--popup-text': '#4A574A',
      '--cover-bg': '#FFF8F0',
      '--cover-text': '#5D5555',
      '--cover-peach': '#FFDAB9',
      '--cover-lavender': '#E6E6FA',
      '--cover-pink': '#FFB6C1',
    },
  },
};

interface AppState {
  avgCycleLength: number;
  avgPeriodLength: number;
  cycleHistory: CycleLog[];
  isInitialized: boolean;
  currentLanguage: LanguageCode;
  currentTheme: ThemeName;
  smsEnabled: boolean;
  phoneNumber: string;
  periodReminderDays: number; // 0 for no reminder
  fertileReminderDays: number; // 0 for no reminder
  lastPeriodReminderSentForCycle: string | null; // start date of cycle for which reminder was sent
  lastFertileReminderSentForCycle: string | null; // start date of cycle for which reminder was sent
}

type View = 'cover' | 'onboarding' | 'home' | 'calendar' | 'history' | 'settings';

// --- CONSTANTS ---
const APP_STATE_KEY = 'kaziFlowState';
const appContainer = document.getElementById('app-container') as HTMLDivElement;

const translations: Record<LanguageCode, Record<string, any>> = {
  en: { slogan: "Be ready, not surprised.", logPeriod: "Log Period", viewCalendar: "View Calendar", cycleHistory: "Cycle History", onboarding: { title: "Welcome to KaziFlow", subtitle: "Let's set up your cycle tracking. You can change this information at any time.", cycleLength: "Average Cycle Length (days)", periodLength: "Average Period Length (days)", lastPeriodStart: "First Day of Last Period", getStarted: "Get Started" }, calendar: { title: "Calendar", legendPeriod: "Period", legendFertile: "Fertile Window" }, history: { title: "Cycle History", noHistory: "No history yet. Log your first period to get started.", ongoing: "Ongoing", days: "days", cycle: "Cycle", period: "Period" }, log: { confirmEnd: "A period is currently logged. Mark today as the end date?", alertEnd: "Period end date logged!", confirmStart: "Log the start of a new period for today?", alertStart: "New period logged!" }, back: "Back to Home", confirm: "Confirm", cancel: "Cancel", settings: { title: "Settings", save: "Save Settings", saved: "Settings saved!", sms: { title: "SMS Reminders", enable: "Enable SMS Reminders", phone: "Phone Number", phonePlaceholder: "e.g. +1234567890", periodReminder: "Remind me before my period", fertileReminder: "Remind me before my fertile window", noReminder: "No reminder", dayBeforeSingular: "day before", dayBeforePlural: "days before", disclaimer: "Standard message rates may apply." }, appearance: { title: "Appearance", theme: "App Theme" } } },
  rw: { slogan: "Baho witeguye, ntutangazwe.", logPeriod: "Andika Imihango", viewCalendar: "Reba Kalendari", cycleHistory: "Amateka y'Ukwezi", onboarding: { title: "Ikaze kuri KaziFlow", subtitle: "Reka dutangire gukurikirana ukwezi kwawe. Ushobora guhindura ibi amakuru igihe cyose.", cycleLength: "Impuzandengo y'iminsi y'ukwezi (iminsi)", periodLength: "Impuzandengo y'iminsi y'imihango (iminsi)", lastPeriodStart: "Umunsi wa mbere w'imihango iheruka", getStarted: "Tangira" }, calendar: { title: "Kalendari", legendPeriod: "Imihango", legendFertile: "Igihe cy'uburumbuke" }, history: { title: "Amateka y'Ukwezi", noHistory: "Nta mateka arahari. Andika imihango yawe ya mbere kugirango utangire.", ongoing: "Biracyakomeza", days: "iminsi", cycle: "Ukwezi", period: "Imihango" }, log: { confirmEnd: "Hari imihango yanditse. Urashaka gushyiraho uyu munsi nk'uwo irangiriraho?", alertEnd: "Itariki y'iherezo ry'imihango yanditswe!", confirmStart: "Wandike itangiriro ry'imihango mishya uyu munsi?", alertStart: "Imihango mishya yanditswe!" }, back: "Subira ahabanza", confirm: "Emeza", cancel: "Hagarika", settings: { title: "Igenamiterere", save: "Bika Igenamiterere", saved: "Igenamiterere ryabitswe!", sms: { title: "Kwibutsa kwa SMS", enable: "Emera kwibutsa kwa SMS", phone: "Nimero ya Terefone", phonePlaceholder: "urugero. +2507...", periodReminder: "Nyibutsa imihango itaratangira", fertileReminder: "Nyibutsa igihe cy'uburumbuke", noReminder: "Nta kwibutsa", dayBeforeSingular: "umunsi mbere", dayBeforePlural: "iminsi mbere", disclaimer: "Igiciro gisanzwe cy'ubutumwa gishobora gukurikizwa." }, appearance: { title: "Imigaragarire", theme: "Insanganyamatsiko y'Porogaramu" } } },
  sw: { slogan: "Kuwa tayari, usishangazwe.", logPeriod: "Weka Hedhi", viewCalendar: "Tazama Kalenda", cycleHistory: "Historia ya Mzunguko", onboarding: { title: "Karibu KaziFlow", subtitle: "Tuanze kufuatilia mzunguko wako. Unaweza kubadilisha habari hii wakati wowote.", cycleLength: "Wastani wa Urefu wa Mzunguko (siku)", periodLength: "Wastani wa Urefu wa Hedhi (siku)", lastPeriodStart: "Siku ya Kwanza ya Hedhi ya Mwisho", getStarted: "Anza" }, calendar: { title: "Kalenda", legendPeriod: "Hedhi", legendFertile: "Dirisha la Uzazi" }, history: { title: "Historia ya Mzunguko", noHistory: "Hakuna historia bado. Weka hedhi yako ya kwanza ili uanze.", ongoing: "Inaendelea", days: "siku", cycle: "Mzunguko", period: "Hedhi" }, log: { confirmEnd: "Hedhi inaendelea. Je, unataka kuweka leo kama siku ya mwisho?", alertEnd: "Tarehe ya mwisho wa hedhi imewekwa!", confirmStart: "Weka mwanzo wa hedhi mpya leo?", alertStart: "Hedhi mpya imewekwa!" }, back: "Rudi Mwanzo", confirm: "Thibitisha", cancel: "Ghairi", settings: { title: "Mipangilio", save: "Hifadhi Mipangilio", saved: "Mipangilio imehifadhiwa!", sms: { title: "Vikumbusho vya SMS", enable: "Wezesha Vikumbusho vya SMS", phone: "Nambari ya Simu", phonePlaceholder: "k.m. +255...", periodReminder: "Nikumbushe kabla ya hedhi", fertileReminder: "Nikumbushe kabla ya dirisha la uzazi", noReminder: "Hakuna kikumbusho", dayBeforeSingular: "siku kabla", dayBeforePlural: "siku kabla", disclaimer: "Viwango vya kawaida vya ujumbe vinaweza kutozwa." }, appearance: { title: "Muonekano", theme: "Mandhari ya Programu" } } },
  fr: { slogan: "Sois prête, pas surprise.", logPeriod: "Enregistrer les règles", viewCalendar: "Voir le calendrier", cycleHistory: "Historique du cycle", onboarding: { title: "Bienvenue sur KaziFlow", subtitle: "Commençons à suivre votre cycle. Vous pouvez modifier ces informations à tout moment.", cycleLength: "Durée moyenne du cycle (jours)", periodLength: "Durée moyenne des règles (jours)", lastPeriodStart: "Premier jour des dernières règles", getStarted: "Commencer" }, calendar: { title: "Calendrier", legendPeriod: "Règles", legendFertile: "Période de fertilité" }, history: { title: "Historique du cycle", noHistory: "Aucun historique pour le moment. Enregistrez vos premières règles pour commencer.", ongoing: "En cours", days: "jours", cycle: "Cycle", period: "Règles" }, log: { confirmEnd: "Des règles sont en cours. Voulez-vous marquer aujourd'hui comme date de fin ?", alertEnd: "Date de fin des règles enregistrée !", confirmStart: "Enregistrer le début de nouvelles règles pour aujourd'hui ?", alertStart: "Nouvelles règles enregistrées !" }, back: "Retour à l'accueil", confirm: "Confirmer", cancel: "Annuler", settings: { title: "Paramètres", save: "Enregistrer", saved: "Paramètres enregistrés !", sms: { title: "Rappels par SMS", enable: "Activer les rappels par SMS", phone: "Numéro de téléphone", phonePlaceholder: "ex. +33...", periodReminder: "Me rappeler avant mes règles", fertileReminder: "Me rappeler avant ma période de fertilité", noReminder: "Aucun rappel", dayBeforeSingular: "jour avant", dayBeforePlural: "jours avant", disclaimer: "Des frais de messagerie standard peuvent s'appliquer." }, appearance: { title: "Apparence", theme: "Thème de l'application" } } },
  es: { slogan: "Prepárate, no te sorprendas.", logPeriod: "Registrar Periodo", viewCalendar: "Ver Calendario", cycleHistory: "Historial del Ciclo", onboarding: { title: "Bienvenida a KaziFlow", subtitle: "Configuremos el seguimiento de tu ciclo. Puedes cambiar esta información en cualquier momento.", cycleLength: "Duración media del ciclo (días)", periodLength: "Duración media del periodo (días)", lastPeriodStart: "Primer día del último periodo", getStarted: "Empezar" }, calendar: { title: "Calendario", legendPeriod: "Periodo", legendFertile: "Ventana Fértil" }, history: { title: "Historial del Ciclo", noHistory: "Aún no hay historial. Registra tu primer periodo para empezar.", ongoing: "En curso", days: "días", cycle: "Ciclo", period: "Periodo" }, log: { confirmEnd: "Hay un periodo en curso. ¿Marcar hoy como fecha de finalización?", alertEnd: "¡Fecha de finalización del periodo registrada!", confirmStart: "¿Registrar el inicio de un nuevo periodo para hoy?", alertStart: "¡Nuevo periodo registrado!" }, back: "Volver al Inicio", confirm: "Confirmar", cancel: "Cancelar", settings: { title: "Ajustes", save: "Guardar Ajustes", saved: "¡Ajustes guardados!", sms: { title: "Recordatorios por SMS", enable: "Habilitar recordatorios por SMS", phone: "Número de teléfono", phonePlaceholder: "ej. +34...", periodReminder: "Recordarme antes de mi periodo", fertileReminder: "Recordarme antes de mi ventana fértil", noReminder: "Sin recordatorio", dayBeforeSingular: "día antes", dayBeforePlural: "días antes", disclaimer: "Pueden aplicarse tarifas de mensajes estándar." }, appearance: { title: "Apariencia", theme: "Tema de la aplicación" } } },
  pt: { slogan: "Esteja pronta, não surpreendida.", logPeriod: "Registar Período", viewCalendar: "Ver Calendário", cycleHistory: "Histórico do Ciclo", onboarding: { title: "Bem-vinda ao KaziFlow", subtitle: "Vamos configurar o acompanhamento do seu ciclo. Você pode alterar esta informação a qualquer momento.", cycleLength: "Duração média do ciclo (dias)", periodLength: "Duração média do período (dias)", lastPeriodStart: "Primeiro dia do último período", getStarted: "Começar" }, calendar: { title: "Calendário", legendPeriod: "Período", legendFertile: "Janela Fértil" }, history: { title: "Histórico do Ciclo", noHistory: "Nenhum histórico ainda. Registe o seu primeiro período para começar.", ongoing: "Em andamento", days: "dias", cycle: "Ciclo", period: "Período" }, log: { confirmEnd: "Um período está em andamento. Marcar hoje como data de término?", alertEnd: "Data de término do período registada!", confirmStart: "Registar o início de um novo período para hoje?", alertStart: "Novo período registado!" }, back: "Voltar ao Início", confirm: "Confirmar", cancel: "Cancelar", settings: { title: "Configurações", save: "Salvar Configurações", saved: "Configurações salvas!", sms: { title: "Lembretes por SMS", enable: "Ativar lembretes por SMS", phone: "Número de telefone", phonePlaceholder: "ex. +351...", periodReminder: "Lembrar-me antes do meu período", fertileReminder: "Lembrar-me antes da minha janela fértil", noReminder: "Nenhum lembrete", dayBeforeSingular: "dia antes", dayBeforePlural: "dias antes", disclaimer: "Podem ser aplicadas taxas de mensagens padrão." }, appearance: { title: "Aparência", theme: "Tema da aplicação" } } },
  ar: { slogan: "كوني مستعدة، لا متفاجئة.", logPeriod: "تسجيل الدورة", viewCalendar: "عرض التقويم", cycleHistory: "سجل الدورة", onboarding: { title: "مرحباً بك في KaziFlow", subtitle: "لنقم بإعداد تتبع دورتك. يمكنك تغيير هذه المعلومات في أي وقت.", cycleLength: "متوسط طول الدورة (أيام)", periodLength: "متوسط طول الدورة الشهرية (أيام)", lastPeriodStart: "اليوم الأول من آخر دورة شهرية", getStarted: "ابدئي" }, calendar: { title: "التقويم", legendPeriod: "الدورة الشهرية", legendFertile: "فترة الخصوبة" }, history: { title: "سجل الدورة", noHistory: "لا يوجد سجل حتى الآن. سجلي دورتك الأولى للبدء.", ongoing: "جارٍ", days: "أيام", cycle: "الدورة", period: "الحيض" }, log: { confirmEnd: "هناك دورة مسجلة حالياً. هل تريدين تحديد اليوم كتاريخ انتهاء؟", alertEnd: "تم تسجيل تاريخ انتهاء الدورة!", confirmStart: "هل تريدين تسجيل بدء دورة جديدة اليوم؟", alertStart: "تم تسجيل دورة جديدة!" }, back: "العودة للرئيسية", confirm: "تأكيد", cancel: "إلغاء", settings: { title: "الإعدادات", save: "حفظ الإعدادات", saved: "تم حفظ الإعدادات!", sms: { title: "تذكيرات الرسائل القصيرة", enable: "تمكين تذكيرات الرسائل القصيرة", phone: "رقم الهاتف", phonePlaceholder: "مثال +966...", periodReminder: "ذكريني قبل دورتي الشهرية", fertileReminder: "ذكريني قبل فترة الخصوبة", noReminder: "لا يوجد تذكير", dayBeforeSingular: "يوم قبل", dayBeforePlural: "أيام قبل", disclaimer: "قد يتم تطبيق أسعار الرسائل القياسية." }, appearance: { title: "المظهر", theme: "سمة التطبيق" } } },
  ko: { slogan: "놀라지 말고 준비하세요.", logPeriod: "생리 기록", viewCalendar: "캘린더 보기", cycleHistory: "주기 기록", onboarding: { title: "KaziFlow에 오신 것을 환영합니다", subtitle: "주기 추적을 설정해 보겠습니다. 이 정보는 언제든지 변경할 수 있습니다.", cycleLength: "평균 주기 길이 (일)", periodLength: "평균 생리 기간 (일)", lastPeriodStart: "마지막 생리 시작일", getStarted: "시작하기" }, calendar: { title: "캘린더", legendPeriod: "생리", legendFertile: "가임기" }, history: { title: "주기 기록", noHistory: "아직 기록이 없습니다. 첫 생리를 기록하여 시작하세요.", ongoing: "진행 중", days: "일", cycle: "주기", period: "생리" }, log: { confirmEnd: "현재 생리가 기록되어 있습니다. 오늘을 종료일로 표시하시겠습니까?", alertEnd: "생리 종료일이 기록되었습니다!", confirmStart: "오늘 새로운 생리 시작을 기록하시겠습니까?", alertStart: "새로운 생리가 기록되었습니다!" }, back: "홈으로 돌아가기", confirm: "확인", cancel: "취소", settings: { title: "설정", save: "설정 저장", saved: "설정이 저장되었습니다!", sms: { title: "SMS 알림", enable: "SMS 알림 활성화", phone: "전화번호", phonePlaceholder: "예: +82...", periodReminder: "생리 전에 미리 알림", fertileReminder: "가임기 전에 미리 알림", noReminder: "알림 없음", dayBeforeSingular: "일 전", dayBeforePlural: "일 전", disclaimer: "표준 메시지 요금이 적용될 수 있습니다." }, appearance: { title: "디자인", theme: "앱 테마" } } },
  hi: { slogan: "तैयार रहें, हैरान नहीं।", logPeriod: "पीरियड लॉग करें", viewCalendar: "कैलेंडर देखें", cycleHistory: "चक्र इतिहास", onboarding: { title: "KaziFlow में आपका स्वागत है", subtitle: "आइए आपके चक्र की ट्रैकिंग सेट करें। आप यह जानकारी किसी भी समय बदल सकते हैं।", cycleLength: "औसत चक्र लंबाई (दिन)", periodLength: "औसत पीरियड लंबाई (दिन)", lastPeriodStart: "अंतिम पीरियड का पहला दिन", getStarted: "शुरू करें" }, calendar: { title: "कैलेंडर", legendPeriod: "पीरियड", legendFertile: "फर्टाइल विंडो" }, history: { title: "चक्र इतिहास", noHistory: "अभी तक कोई इतिहास नहीं है। शुरू करने के लिए अपना पहला पीरियड लॉग करें।", ongoing: "जारी है", days: "दिन", cycle: "चक्र", period: "पीरियड" }, log: { confirmEnd: "एक पीरियड वर्तमान में लॉग किया गया है। क्या आज को अंतिम तिथि के रूप में चिह्नित करना है?", alertEnd: "पीरियड की अंतिम तिथि लॉग हो गई!", confirmStart: "क्या आज के लिए एक नए पीरियड की शुरुआत लॉग करनी है?", alertStart: "नया पीरियड लॉग हो गया!" }, back: "होम पर वापस", confirm: "पुष्टि करें", cancel: "रद्द करें", settings: { title: "सेटिंग्स", save: "सेटिंग्स सहेजें", saved: "सेटिंग्स सहेज ली गई हैं!", sms: { title: "एसएमएस रिमाइंडर", enable: "एसएमएस रिमाइंडर सक्षम करें", phone: "फोन नंबर", phonePlaceholder: "उदा. +91...", periodReminder: "मेरे पीरियड से पहले मुझे याद दिलाएं", fertileReminder: "मेरी फर्टाइल विंडो से पहले मुझे याद दिलाएं", noReminder: "कोई रिमाइंडर नहीं", dayBeforeSingular: "दिन पहले", dayBeforePlural: "दिन पहले", disclaimer: "मानक संदेश दरें लागू हो सकती हैं।" }, appearance: { title: "दिखावट", theme: "ऐप थीम" } } },
  zh: { slogan: "有备无患，从容应对。", logPeriod: "记录经期", viewCalendar: "查看日历", cycleHistory: "周期历史", onboarding: { title: "欢迎来到 KaziFlow", subtitle: "让我们来设置您的周期跟踪。您可以随时更改这些信息。", cycleLength: "平均周期长度 (天)", periodLength: "平均经期长度 (天)", lastPeriodStart: "上次经期第一天", getStarted: "开始" }, calendar: { title: "日历", legendPeriod: "经期", legendFertile: "易孕期" }, history: { title: "周期历史", noHistory: "暂无历史记录。记录您的第一次经期以开始。", ongoing: "进行中", days: "天", cycle: "周期", period: "经期" }, log: { confirmEnd: "当前有经期记录。要将今天标记为结束日期吗？", alertEnd: "经期结束日期已记录！", confirmStart: "要记录今天开始新的经期吗？", alertStart: "新的经期已记录！" }, back: "返回首页", confirm: "确认", cancel: "取消", settings: { title: "设置", save: "保存设置", saved: "设置已保存！", sms: { title: "短信提醒", enable: "启用短信提醒", phone: "电话号码", phonePlaceholder: "例如 +86...", periodReminder: "经期前提醒我", fertileReminder: "易孕期前提醒我", noReminder: "无提醒", dayBeforeSingular: "天前", dayBeforePlural: "天前", disclaimer: "可能产生标准短信费用。" }, appearance: { title: "外观", theme: "应用主题" } } }
};

// --- STATE MANAGEMENT ---
const getInitialState = (): AppState => {
  const browserLang = navigator.language.split('-')[0] as LanguageCode;
  const initialLang = supportedLanguages.some(l => l.code === browserLang) ? browserLang : 'en';

  return {
    avgCycleLength: 28,
    avgPeriodLength: 5,
    cycleHistory: [],
    isInitialized: false,
    currentLanguage: initialLang,
    currentTheme: 'midnight',
    smsEnabled: false,
    phoneNumber: '',
    periodReminderDays: 2,
    fertileReminderDays: 1,
    lastPeriodReminderSentForCycle: null,
    lastFertileReminderSentForCycle: null,
  };
};

const loadState = (): AppState => {
  const storedState = localStorage.getItem(APP_STATE_KEY);
  const initialState = getInitialState();
  if (storedState) {
    return { ...initialState, ...JSON.parse(storedState) };
  }
  return initialState;
};

const saveState = (state: AppState): void => {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
};

let state = loadState();
let currentView: View = 'cover';
let calendarDate = new Date(); // State for the calendar view
let isLangMenuOpen = false;
let activePopup: { type: 'toast' | 'confirm', message: string, onConfirm?: () => void } | null = null;

// --- POPUP LOGIC ---
const closePopup = () => {
    const overlay = document.getElementById('popup-overlay');
    if (overlay) {
        overlay.remove();
    }
    activePopup = null;
};

const renderPopup = () => {
    const existingOverlay = document.getElementById('popup-overlay');
    if (existingOverlay) existingOverlay.remove();
    
    if (!activePopup) return;

    const overlay = document.createElement('div');
    overlay.id = 'popup-overlay';
    
    if (activePopup.type === 'toast') {
        overlay.className = 'toast-container'; // No dark background for toasts
        overlay.innerHTML = `<div class="toast-notification show">${activePopup.message}</div>`;
        document.body.appendChild(overlay);
    } else if (activePopup.type === 'confirm') {
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-modal">
                <p>${activePopup.message}</p>
                <div class="popup-actions">
                    <button id="popup-cancel" class="button button-secondary">${t('cancel')}</button>
                    <button id="popup-confirm" class="button">${t('confirm')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('popup-confirm')?.addEventListener('click', () => {
            activePopup?.onConfirm?.();
            closePopup();
        });
        
        document.getElementById('popup-cancel')?.addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });
    }
};

const showToast = (message: string, duration: number = 2500) => {
    activePopup = { type: 'toast', message };
    renderPopup();
    setTimeout(() => {
        const toast = document.querySelector('.toast-notification');
        toast?.classList.remove('show');
        toast?.classList.add('hide');
        toast?.addEventListener('transitionend', closePopup, { once: true });
    }, duration);
};

const showConfirmation = (message: string, onConfirm: () => void) => {
    activePopup = { type: 'confirm', message, onConfirm };
    renderPopup();
};


// --- UTILITIES ---
const t = (key: string): string => {
  const keys = key.split('.');
  let result: any = translations[state.currentLanguage];
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      // Fallback to English if translation is missing
      result = translations.en;
      for (const k_en of keys) {
         result = result?.[k_en];
      }
      return result || key;
    }
  }
  return result || key;
};

const applyTheme = (themeName: ThemeName) => {
  const theme = themes[themeName];
  if (!theme) return;

  for (const [key, value] of Object.entries(theme.colors)) {
    document.documentElement.style.setProperty(key, value);
  }
};


const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const diffDays = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0,0,0,0);
  d2.setHours(0,0,0,0);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(state.currentLanguage, { ...defaultOptions, ...options });
};


// --- CYCLE LOGIC ---
const recalculateAverages = () => {
    const completedCycles = state.cycleHistory.filter(c => c.endDate);
    if (completedCycles.length < 1) return;

    // Recalculate avgPeriodLength
    const totalPeriodDays = completedCycles.reduce((sum, cycle) => {
        return sum + diffDays(new Date(cycle.startDate), new Date(cycle.endDate!));
    }, 0);
    state.avgPeriodLength = Math.round(totalPeriodDays / completedCycles.length);

    // Recalculate avgCycleLength
    if (state.cycleHistory.length > 1) {
        let totalCycleDays = 0;
        let cycleCount = 0;
        for (let i = 1; i < state.cycleHistory.length; i++) {
            const cycleLength = diffDays(new Date(state.cycleHistory[i-1].startDate), new Date(state.cycleHistory[i].startDate)) - 1;
            totalCycleDays += cycleLength;
            cycleCount++;
        }
        if (cycleCount > 0) {
          state.avgCycleLength = Math.round(totalCycleDays / cycleCount);
        }
    }
};

const getCycleDataForDate = (date: Date, history: CycleLog[], avgCycleLength: number, avgPeriodLength: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // Check logged history first
    for (const cycle of history) {
        const start = new Date(cycle.startDate);
        start.setHours(0,0,0,0);
        const end = cycle.endDate ? new Date(cycle.endDate) : addDays(start, avgPeriodLength - 1);
        end.setHours(0,0,0,0);
        if (date >= start && date <= end) {
            return { isPeriod: true, isFertile: false };
        }
    }
    
    // Check predictions if no history matches
    if (history.length > 0) {
        const lastPeriodStart = new Date(history[history.length - 1].startDate);
        let nextPeriodDate = addDays(lastPeriodStart, avgCycleLength);
        
        // Find the closest future or past predicted cycle to the target date
        while(nextPeriodDate < date && diffDays(nextPeriodDate, date) > avgCycleLength/2) {
            nextPeriodDate = addDays(nextPeriodDate, avgCycleLength);
        }
        while(nextPeriodDate > date && diffDays(date, nextPeriodDate) > avgCycleLength/2) {
           nextPeriodDate = addDays(nextPeriodDate, -avgCycleLength);
        }

        const ovulationDate = addDays(nextPeriodDate, -14);
        const fertileStart = addDays(ovulationDate, -5);
        const fertileEnd = addDays(ovulationDate, 1);
        const periodEnd = addDays(nextPeriodDate, avgPeriodLength - 1);
        
        if(date >= nextPeriodDate && date <= periodEnd) return { isPeriod: true, isFertile: false };
        if(date >= fertileStart && date <= fertileEnd) return { isPeriod: false, isFertile: true };
    }

    return { isPeriod: false, isFertile: false };
};


// --- UI RENDERING ---

const render = () => {
  document.documentElement.lang = state.currentLanguage;
  if (['ar', 'he'].includes(state.currentLanguage)) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }

  switch (currentView) {
    case 'cover':
      renderCover();
      break;
    case 'onboarding':
      renderOnboarding();
      break;
    case 'home':
      renderHome();
      break;
    case 'calendar':
      renderCalendar(calendarDate);
      break;
    case 'history':
      renderHistory();
      break;
    case 'settings':
      renderSettings();
      break;
  }
};

const navigate = (view: View) => {
  currentView = view;
  render();
};

const renderCover = () => {
  appContainer.innerHTML = `
    <div class="screen cover-screen">
      <div class="cover-blob blob1"></div>
      <div class="cover-blob blob2"></div>
      <div class="cover-blob blob3"></div>
      <div class="cover-content">
        <h1 class="cover-title">KaziFlow</h1>
        <p class="cover-tagline">Discreet Period & Fertility Tracker</p>
        <div class="cover-icons">
          <div class="cover-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="cover-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M9 12H5"></path><path d="M7 14V10"></path></svg>
          </div>
          <div class="cover-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2 2"></path><path d="M5 3 2 6"></path><path d="m22 6-3-3"></path></svg>
          </div>
          <div class="cover-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
          </div>
        </div>
      </div>
    </div>
  `;
};

const renderLangSwitcher = (): string => {
    let menuHtml = '';
    if (isLangMenuOpen) {
        const langItems = supportedLanguages.map(lang => 
            `<div class="lang-menu-item" data-lang="${lang.code}">${lang.name}</div>`
        ).join('');

        menuHtml = `
            <div id="lang-menu-overlay" class="lang-menu-overlay"></div>
            <div class="lang-menu">
                ${langItems}
            </div>
        `;
    }

    return `
        <div class="lang-switcher-container">
            <button id="lang-switch-btn" class="icon-button" aria-label="Switch Language">🌐</button>
            ${menuHtml}
        </div>
    `;
};

const addLangSwitcherListeners = () => {
    document.getElementById('lang-switch-btn')?.addEventListener('click', toggleLangMenu);
    
    if (isLangMenuOpen) {
        document.getElementById('lang-menu-overlay')?.addEventListener('click', toggleLangMenu);
        document.querySelectorAll('.lang-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const langCode = (e.currentTarget as HTMLElement).dataset.lang as LanguageCode;
                selectLanguage(langCode);
            });
        });
    }
};

const renderOnboarding = () => {
  appContainer.innerHTML = `
    <div id="onboarding-screen" class="screen">
      <h1>${t('onboarding.title')}</h1>
      <p>${t('onboarding.subtitle')}</p>
      <form id="onboarding-form">
        <div class="form-group">
          <label for="cycle-length">${t('onboarding.cycleLength')}</label>
          <input type="number" id="cycle-length" value="28" min="10" max="60" required />
        </div>
        <div class="form-group">
          <label for="period-length">${t('onboarding.periodLength')}</label>
          <input type="number" id="period-length" value="5" min="1" max="15" required />
        </div>
        <div class="form-group">
          <label for="last-period-start">${t('onboarding.lastPeriodStart')}</label>
          <input type="date" id="last-period-start" value="${new Date().toISOString().split('T')[0]}" required />
        </div>
        <button type="submit" class="button">${t('onboarding.getStarted')}</button>
      </form>
    </div>
  `;
  document.getElementById('onboarding-form')?.addEventListener('submit', handleOnboardingSubmit);
};

const renderHome = () => {
  appContainer.innerHTML = `
    <div class="screen home-screen">
      <div class="home-header">
        <div class="header-content">
          <h1>KaziFlow</h1>
          <p>${t('slogan')}</p>
        </div>
        <div class="header-actions">
          ${renderLangSwitcher()}
          <button id="settings-btn" class="icon-button" aria-label="${t('settings.title')}">⚙️</button>
        </div>
      </div>
      <div class="home-nav">
        <button id="log-period-btn" class="button-large">${t('logPeriod')}</button>
        <button id="view-calendar-btn" class="button-large">${t('viewCalendar')}</button>
        <button id="view-history-btn" class="button-large">${t('cycleHistory')}</button>
      </div>
    </div>
  `;
  document.getElementById('log-period-btn')?.addEventListener('click', handleLogPeriod);
  document.getElementById('view-calendar-btn')?.addEventListener('click', () => navigate('calendar'));
  document.getElementById('view-history-btn')?.addEventListener('click', () => navigate('history'));
  document.getElementById('settings-btn')?.addEventListener('click', () => navigate('settings'));
  addLangSwitcherListeners();
};


const renderCalendar = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const dayHeaders = [...Array(7).keys()].map(i => {
        const d = new Date(Date.UTC(2023, 0, i + 1)); // A week that starts on Sunday
        return d.toLocaleString(state.currentLanguage, { weekday: 'narrow', timeZone: 'UTC' });
    });

    let daysHtml = dayHeaders.map(d => `<div class="calendar-day day-header">${d}</div>`).join('');

    for (let i = 0; i < firstDayOfMonth; i++) {
        daysHtml += `<div class="calendar-day day-empty"></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(year, month, i);
        const cycleData = getCycleDataForDate(currentDate, state.cycleHistory, state.avgCycleLength, state.avgPeriodLength);
        
        let classes = 'calendar-day day-in-month';
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            classes += ' day-today';
        }
        if (cycleData.isPeriod) classes += ' day-period';
        if (cycleData.isFertile) classes += ' day-fertile';
        
        daysHtml += `<div class="${classes}">${i}</div>`;
    }

    appContainer.innerHTML = `
        <div class="screen">
            <header class="view-header">
                <button id="back-btn" class="icon-button" aria-label="${t('back')}">&larr;</button>
                <h2>${t('calendar.title')}</h2>
                ${renderLangSwitcher()}
            </header>
            <main id="calendar-view">
                <div class="calendar-container">
                    <div class="calendar-nav">
                        <button id="prev-month-btn">&lt;</button>
                        <h3>${date.toLocaleString(state.currentLanguage, { month: 'long', year: 'numeric' })}</h3>
                        <button id="next-month-btn">&gt;</button>
                    </div>
                    <div class="calendar-grid">${daysHtml}</div>
                    <div class="calendar-legend">
                        <div><span class="legend-dot period"></span> ${t('calendar.legendPeriod')}</div>
                        <div><span class="legend-dot fertile"></span> ${t('calendar.legendFertile')}</div>
                    </div>
                </div>
            </main>
        </div>
    `;

    document.getElementById('back-btn')?.addEventListener('click', () => navigate('home'));
    document.getElementById('prev-month-btn')?.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        renderCalendar(calendarDate);
    });
    document.getElementById('next-month-btn')?.addEventListener('click', () => {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        renderCalendar(calendarDate);
    });
    addLangSwitcherListeners();
}

const renderHistory = () => {
    let listHtml = `<p>${t('history.noHistory')}</p>`;
    if (state.cycleHistory.length > 0) {
        listHtml = '';
        for (let i = state.cycleHistory.length - 1; i >= 0; i--) {
            const currentLog = state.cycleHistory[i];
            const startDate = new Date(currentLog.startDate);
            let periodDurationText = t('history.ongoing');
            if (currentLog.endDate) {
                const duration = diffDays(startDate, new Date(currentLog.endDate));
                periodDurationText = `${duration} ${t('history.days')}`;
            }

            let cycleLengthText = '—';
            if (i > 0) {
                const prevLog = state.cycleHistory[i-1];
                const cycleLength = diffDays(new Date(prevLog.startDate), startDate) - 1;
                cycleLengthText = `${cycleLength} ${t('history.days')}`;
            }

            listHtml += `
                <div class="history-item">
                    <div class="history-date">${formatDate(startDate, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div class="history-stats">
                        <div class="stat"><span>${t('history.cycle')}</span>${cycleLengthText}</div>
                        <div class="stat"><span>${t('history.period')}</span>${periodDurationText}</div>
                    </div>
                </div>
            `;
        }
    }

    appContainer.innerHTML = `
        <div class="screen">
            <header class="view-header">
                <button id="back-btn" class="icon-button" aria-label="${t('back')}">&larr;</button>
                <h2>${t('history.title')}</h2>
                 ${renderLangSwitcher()}
            </header>
            <main id="history-view">
                <div class="history-list">${listHtml}</div>
            </main>
        </div>
    `;
    document.getElementById('back-btn')?.addEventListener('click', () => navigate('home'));
    addLangSwitcherListeners();
}

const renderSettings = () => {
  const reminderOptions = [0, 1, 2, 3].map(i => {
      let text;
      if (i === 0) text = t('settings.sms.noReminder');
      else text = `${i} ${i === 1 ? t('settings.sms.dayBeforeSingular') : t('settings.sms.dayBeforePlural')}`;
      return { value: i, text };
  });

  const periodOptions = reminderOptions.map(opt => 
    `<option value="${opt.value}" ${state.periodReminderDays === opt.value ? 'selected' : ''}>${opt.text}</option>`
  ).join('');

  const fertileOptions = reminderOptions.map(opt => 
    `<option value="${opt.value}" ${state.fertileReminderDays === opt.value ? 'selected' : ''}>${opt.text}</option>`
  ).join('');

  const themeOptionsHtml = (Object.keys(themes) as ThemeName[]).map(key => {
    const theme = themes[key];
    const isSelected = key === state.currentTheme;
    return `
      <div class="theme-option ${isSelected ? 'selected' : ''}" data-theme="${key}" role="button" aria-pressed="${isSelected}" aria-label="${theme.name}">
        <div class="theme-preview" style="background-color: ${theme.colors['--surface']}; border-color: ${theme.colors['--accent-safe']};">
          <span style="background-color: ${theme.colors['--accent-period']};"></span>
          <span style="background-color: ${theme.colors['--accent-fertile']};"></span>
        </div>
        <p>${theme.name}</p>
      </div>
    `;
  }).join('');

  appContainer.innerHTML = `
    <div class="screen">
      <header class="view-header">
          <button id="back-btn" class="icon-button" aria-label="${t('back')}">&larr;</button>
          <h2>${t('settings.title')}</h2>
          <div style="width: 50px;"></div> <!-- spacer to balance header -->
      </header>
      <main id="settings-view" class="form-view">
          <form id="settings-form">
              <h3>${t('settings.appearance.title')}</h3>
              <div class="form-group">
                <label>${t('settings.appearance.theme')}</label>
                <div class="theme-selector">${themeOptionsHtml}</div>
              </div>

              <h3>${t('settings.sms.title')}</h3>
              <div class="form-group toggle-group">
                  <label for="sms-enabled">${t('settings.sms.enable')}</label>
                  <label class="switch">
                      <input type="checkbox" id="sms-enabled" ${state.smsEnabled ? 'checked' : ''}>
                      <span class="slider round"></span>
                  </label>
              </div>

              <fieldset id="sms-options" ${!state.smsEnabled ? 'disabled' : ''}>
                  <div class="form-group">
                      <label for="phone-number">${t('settings.sms.phone')}</label>
                      <input type="tel" id="phone-number" value="${state.phoneNumber}" placeholder="${t('settings.sms.phonePlaceholder')}" />
                  </div>
                  <div class="form-group">
                      <label for="period-reminder">${t('settings.sms.periodReminder')}</label>
                      <select id="period-reminder">${periodOptions}</select>
                  </div>
                   <div class="form-group">
                      <label for="fertile-reminder">${t('settings.sms.fertileReminder')}</label>
                      <select id="fertile-reminder">${fertileOptions}</select>
                  </div>
              </fieldset>
              
              <p class="disclaimer">${t('settings.sms.disclaimer')}</p>
              <button type="submit" class="button">${t('settings.save')}</button>
          </form>
      </main>
    </div>
  `;

  document.getElementById('back-btn')?.addEventListener('click', () => navigate('home'));
  document.getElementById('settings-form')?.addEventListener('submit', handleSettingsSubmit);
  document.getElementById('sms-enabled')?.addEventListener('change', (e) => {
      const isChecked = (e.target as HTMLInputElement).checked;
      (document.getElementById('sms-options') as HTMLFieldSetElement).disabled = !isChecked;
  });
  document.querySelector('.theme-selector')?.addEventListener('click', (e) => {
    // FIX: Specify that closest() should return an HTMLElement to allow access to the 'dataset' property.
    const target = (e.target as HTMLElement).closest<HTMLElement>('.theme-option');
    if (target && target.dataset.theme) {
        const themeName = target.dataset.theme as ThemeName;
        if (themeName !== state.currentTheme) {
          state.currentTheme = themeName;
          applyTheme(themeName);
          saveState(state);
          renderSettings(); // Re-render to update the 'selected' class
        }
    }
  });
};


// --- EVENT HANDLERS ---
const handleOnboardingSubmit = (e: Event) => {
  e.preventDefault();
  const cycleLengthInput = document.getElementById('cycle-length') as HTMLInputElement;
  const periodLengthInput = document.getElementById('period-length') as HTMLInputElement;
  const lastPeriodInput = document.getElementById('last-period-start') as HTMLInputElement;

  const cycleLength = parseInt(cycleLengthInput.value, 10);
  const periodLength = parseInt(periodLengthInput.value, 10);
  const lastPeriodStart = new Date(lastPeriodInput.value);
  
  const userTimezoneOffset = lastPeriodStart.getTimezoneOffset() * 60000;
  const correctedDate = new Date(lastPeriodStart.getTime() + userTimezoneOffset);

  state.avgCycleLength = cycleLength;
  state.avgPeriodLength = periodLength;
  state.cycleHistory.push({ startDate: correctedDate.toISOString() });
  state.isInitialized = true;
  saveState(state);
  navigate('home');
};

const handleSettingsSubmit = (e: Event) => {
    e.preventDefault();
    state.smsEnabled = (document.getElementById('sms-enabled') as HTMLInputElement).checked;
    state.phoneNumber = (document.getElementById('phone-number') as HTMLInputElement).value;
    state.periodReminderDays = parseInt((document.getElementById('period-reminder') as HTMLSelectElement).value, 10);
    state.fertileReminderDays = parseInt((document.getElementById('fertile-reminder') as HTMLSelectElement).value, 10);
    
    saveState(state);
    showToast(t('settings.saved'));
    navigate('home');
};

const toggleLangMenu = () => {
    isLangMenuOpen = !isLangMenuOpen;
    render();
};

const selectLanguage = (langCode: LanguageCode) => {
    state.currentLanguage = langCode;
    isLangMenuOpen = false;
    saveState(state);
    render();
};

const handleLogPeriod = () => {
    const lastCycle = state.cycleHistory.length > 0 ? state.cycleHistory[state.cycleHistory.length - 1] : null;
    const isPeriodActive = lastCycle && !lastCycle.endDate;

    if (isPeriodActive) {
        showConfirmation(t('log.confirmEnd'), () => {
            lastCycle.endDate = new Date().toISOString();
            recalculateAverages();
            saveState(state);
            showToast(t('log.alertEnd'));
        });
    } else {
        showConfirmation(t('log.confirmStart'), () => {
            const newCycle: CycleLog = { startDate: new Date().toISOString() };
            state.cycleHistory.push(newCycle);
            recalculateAverages();
            saveState(state);
            showToast(t('log.alertStart'));
        });
    }
};

// --- SMS LOGIC ---

/**
 * MOCK FUNCTION: In a real application, this would make an API call to a backend service (e.g., Twilio) to send an SMS.
 * @param phoneNumber The recipient's phone number.
 * @param message The message to send.
 */
const sendSmsReminder = async (phoneNumber: string, message: string): Promise<void> => {
    console.log(`Sending SMS to ${phoneNumber}: "${message}"`);
    // In a real app:
    // try {
    //   const response = await fetch('https://api.sms-service.com/send', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ to: phoneNumber, message: message, apiKey: '...' })
    //   });
    //   if (!response.ok) throw new Error('Failed to send SMS');
    //   console.log('SMS sent successfully.');
    // } catch (error) {
    //   console.error('Error sending SMS:', error);
    // }
    return Promise.resolve();
};

const checkAndSendReminders = async () => {
    if (!state.isInitialized || !state.smsEnabled || !state.phoneNumber || state.cycleHistory.length === 0) {
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCycle = state.cycleHistory[state.cycleHistory.length - 1];
    const lastPeriodStart = new Date(lastCycle.startDate);
    lastPeriodStart.setHours(0, 0, 0, 0);

    // --- Period Reminder Check ---
    if (state.periodReminderDays > 0) {
        const nextPeriodStart = addDays(lastPeriodStart, state.avgCycleLength);
        const daysToPeriod = diffDays(today, nextPeriodStart) - 1;
        
        if (daysToPeriod === state.periodReminderDays && state.lastPeriodReminderSentForCycle !== lastCycle.startDate) {
            const message = `KaziFlow Reminder: Your period is predicted to start in ${daysToPeriod} day(s).`;
            await sendSmsReminder(state.phoneNumber, message);
            state.lastPeriodReminderSentForCycle = lastCycle.startDate;
            saveState(state);
        }
    }

    // --- Fertile Window Reminder Check ---
    if (state.fertileReminderDays > 0) {
        const nextPeriodStartForFertile = addDays(lastPeriodStart, state.avgCycleLength);
        const ovulationDate = addDays(nextPeriodStartForFertile, -14);
        const fertileStart = addDays(ovulationDate, -5);
        const daysToFertile = diffDays(today, fertileStart) - 1;
        
        if (daysToFertile === state.fertileReminderDays && state.lastFertileReminderSentForCycle !== lastCycle.startDate) {
            const message = `KaziFlow Reminder: Your fertile window is predicted to start in ${daysToFertile} day(s).`;
            await sendSmsReminder(state.phoneNumber, message);
            state.lastFertileReminderSentForCycle = lastCycle.startDate;
            saveState(state);
        }
    }
};

// --- APP INITIALIZATION ---
const main = () => {
  applyTheme(state.currentTheme);
  render(); // This will render the cover screen first

  // Set a timeout to transition to the main app
  setTimeout(() => {
    // If we're still on the cover screen, navigate away
    if (currentView === 'cover') {
        navigate(state.isInitialized ? 'home' : 'onboarding');
        // We only want to check reminders once the app is actually running
        checkAndSendReminders();
    }
  }, 3000); // 3-second splash screen
};

main();