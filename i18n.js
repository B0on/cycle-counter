/**
 * Cycle Counter - Internationalization
 * Default locale: English. Japanese available as an option.
 */

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'ja'];
const LOCALE_STORAGE_KEY = 'locale';

const MESSAGES = {
  en: {
    tagline: 'Savings, learning, stamina tracking & more',
    currentValue: 'Current Value',
    progressDays: '$1 / $2 days',
    nextUpdate: 'Next update: tomorrow 0:00 → $1',
    dailyIncrement: 'Daily Increment',
    cycleLength: 'Cycle Length (days)',
    startDate: 'Start Date',
    language: 'Language',
    langEn: 'English',
    langJa: '日本語',
    save: 'Save',
    reset: 'Reset',
    statusSaved: 'Settings saved.',
    statusReset: 'Counter reset to day 1.',
    statusCheckInput: 'Please check your input.',
    resetConfirm: 'Set start date to today and reset the counter to day 1?',
    errorDailyIncrementPositive: 'Daily increment must be a positive number.',
    errorDailyIncrementMax: 'Daily increment must be $1 or less.',
    errorCycleLengthPositive: 'Cycle length must be a positive integer.',
    errorCycleLengthMax: 'Cycle length must be $1 days or less.',
    errorStartDateInvalid: 'Please enter a valid start date.',
    errorStartDateFuture: 'Start date must be today or earlier.',
    errorBadgeOverflow: 'Badge display limit exceeded. Adjust increment or cycle length.',
  },
  ja: {
    tagline: '貯金・学習・スタミナ管理など',
    currentValue: '現在の値',
    progressDays: '$1 / $2 日',
    nextUpdate: '次の更新: 明日 0:00 → $1',
    dailyIncrement: '1日あたりの増加量',
    cycleLength: '周期日数',
    startDate: '開始日',
    language: '言語',
    langEn: 'English',
    langJa: '日本語',
    save: '保存',
    reset: 'リセット',
    statusSaved: '設定を保存しました。',
    statusReset: 'カウンターをリセットしました。',
    statusCheckInput: '入力内容を確認してください。',
    resetConfirm: '開始日を今日に設定し、カウンターを初日の状態に戻しますか？',
    errorDailyIncrementPositive: '1日あたりの増加量は正の数で入力してください。',
    errorDailyIncrementMax: '増加量は $1 以下にしてください。',
    errorCycleLengthPositive: '周期日数は1以上の整数で入力してください。',
    errorCycleLengthMax: '周期日数は $1 日以下にしてください。',
    errorStartDateInvalid: '有効な開始日を入力してください。',
    errorStartDateFuture: '開始日は今日以前の日付にしてください。',
    errorBadgeOverflow: 'バッジ表示上限を超えます。増加量か周期を調整してください。',
  },
};

let currentLocale = DEFAULT_LOCALE;

/**
 * Replaces $1, $2, ... placeholders in a message string.
 */
function formatMessage(template, substitutions = []) {
  return substitutions.reduce(
    (msg, sub, index) => msg.replace(`$${index + 1}`, String(sub)),
    template
  );
}

/**
 * Returns a translated string for the current locale.
 */
function t(key, ...substitutions) {
  const catalog = MESSAGES[currentLocale] || MESSAGES[DEFAULT_LOCALE];
  const template = catalog[key] || MESSAGES[DEFAULT_LOCALE][key] || key;
  return formatMessage(template, substitutions);
}

/**
 * Loads the user's locale preference from storage.
 */
async function loadLocale() {
  const stored = await chrome.storage.local.get(LOCALE_STORAGE_KEY);
  const locale = stored[LOCALE_STORAGE_KEY] || DEFAULT_LOCALE;
  currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  document.documentElement.lang = currentLocale;
}

/**
 * Saves locale preference and updates the active locale.
 */
async function saveLocale(locale) {
  currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  document.documentElement.lang = currentLocale;
  await chrome.storage.local.set({ [LOCALE_STORAGE_KEY]: currentLocale });
}

/**
 * Applies translations to all elements with data-i18n attribute.
 */
function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}
