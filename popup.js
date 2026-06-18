/**
 * Cycle Counter - Popup Script
 * Renders display, handles settings form save/reset.
 */

// DOM elements
const currentValueEl = document.getElementById('current-value');
const nextUpdateEl = document.getElementById('next-update');
const cycleProgressTextEl = document.getElementById('cycle-progress-text');
const progressBarEl = document.getElementById('progress-bar');
const progressPercentEl = document.getElementById('progress-percent');
const progressTrackEl = document.querySelector('.progress-bar-track');
const settingsForm = document.getElementById('settings-form');
const dailyIncrementInput = document.getElementById('daily-increment');
const cycleLengthInput = document.getElementById('cycle-length');
const startDateInput = document.getElementById('start-date');
const localeSelect = document.getElementById('locale');
const resetBtn = document.getElementById('reset-btn');
const statusMessageEl = document.getElementById('status-message');

const fieldErrorEls = {
  dailyIncrement: document.getElementById('error-daily-increment'),
  cycleLength: document.getElementById('error-cycle-length'),
  startDate: document.getElementById('error-start-date'),
};

const fieldInputs = {
  dailyIncrement: dailyIncrementInput,
  cycleLength: cycleLengthInput,
  startDate: startDateInput,
};

const ERROR_KEY_MAP = {
  dailyIncrement: {
    errorDailyIncrementPositive: () => t('errorDailyIncrementPositive'),
    errorDailyIncrementMax: () => t('errorDailyIncrementMax', MAX_DAILY_INCREMENT),
    errorBadgeOverflow: () => t('errorBadgeOverflow'),
  },
  cycleLength: {
    errorCycleLengthPositive: () => t('errorCycleLengthPositive'),
    errorCycleLengthMax: () => t('errorCycleLengthMax', MAX_CYCLE_LENGTH),
  },
  startDate: {
    errorStartDateInvalid: () => t('errorStartDateInvalid'),
    errorStartDateFuture: () => t('errorStartDateFuture'),
  },
};

/**
 * Translates validation error keys into localized messages.
 */
function localizeErrors(errorKeys) {
  const errors = {};
  Object.entries(errorKeys).forEach(([field, key]) => {
    const mapper = ERROR_KEY_MAP[field]?.[key];
    errors[field] = mapper ? mapper() : key;
  });
  return errors;
}

/**
 * Populates form inputs with current settings.
 */
function populateForm(settings) {
  dailyIncrementInput.value = settings.dailyIncrement;
  cycleLengthInput.value = settings.cycleLength;
  startDateInput.value = settings.startDate;
  startDateInput.max = getTodayDateString();
}

/**
 * Clears all field-level validation errors.
 */
function clearFieldErrors() {
  Object.entries(fieldErrorEls).forEach(([key, el]) => {
    el.textContent = '';
    fieldInputs[key].classList.remove('input-error');
  });
}

/**
 * Shows field-level validation errors.
 */
function showFieldErrors(errors) {
  clearFieldErrors();
  Object.entries(errors).forEach(([key, message]) => {
    if (fieldErrorEls[key]) {
      fieldErrorEls[key].textContent = message;
      fieldInputs[key].classList.add('input-error');
    }
  });
}

/**
 * Updates the display section with current value and progress.
 */
function renderDisplay(settings) {
  const { currentDay, value, percent } = calculateProgress(settings);
  const nextMidnight = getNextMidnightTimestamp();
  const tomorrowValue = formatDisplayValue(
    calculateProgress(settings, nextMidnight).value
  );

  currentValueEl.textContent = formatDisplayValue(value);
  nextUpdateEl.textContent = t('nextUpdate', tomorrowValue);
  cycleProgressTextEl.textContent = t('progressDays', currentDay, settings.cycleLength);
  progressBarEl.style.width = `${percent}%`;
  progressPercentEl.textContent = `${percent}%`;
  progressTrackEl.setAttribute('aria-valuenow', String(percent));
}

/**
 * Shows a temporary status message.
 */
function showStatus(message, isError = false) {
  statusMessageEl.textContent = message;
  statusMessageEl.classList.toggle('error', isError);
  if (message) {
    setTimeout(() => {
      statusMessageEl.textContent = '';
      statusMessageEl.classList.remove('error');
    }, 2500);
  }
}

/**
 * Reads and validates form input values.
 */
function getFormSettings() {
  return {
    dailyIncrement: parseFloat(dailyIncrementInput.value),
    cycleLength: parseInt(cycleLengthInput.value, 10),
    startDate: startDateInput.value,
  };
}

/**
 * Requests background service worker to refresh the badge.
 */
function requestBadgeUpdate() {
  chrome.runtime.sendMessage({ type: 'UPDATE_BADGE' });
}

/**
 * Re-applies all UI strings after locale change.
 */
async function refreshUI(settings) {
  applyStaticTranslations();
  localeSelect.value = currentLocale;
  renderDisplay(settings);
}

/**
 * Handles language selection change.
 */
async function handleLocaleChange() {
  await saveLocale(localeSelect.value);
  const settings = await getSettings();
  await refreshUI(settings);
}

/**
 * Saves settings from the form to storage.
 */
async function handleSave(event) {
  event.preventDefault();
  clearFieldErrors();

  const settings = getFormSettings();
  const { valid, errors: errorKeys } = validateSettings(settings);

  if (!valid) {
    showFieldErrors(localizeErrors(errorKeys));
    showStatus(t('statusCheckInput'), true);
    return;
  }

  await chrome.storage.local.set(settings);
  renderDisplay(settings);
  requestBadgeUpdate();
  showStatus(t('statusSaved'));
}

/**
 * Resets start date to today after user confirmation.
 */
async function handleReset() {
  const confirmed = window.confirm(t('resetConfirm'));
  if (!confirmed) return;

  const settings = await getSettings();
  const today = getTodayDateString();
  const updated = { ...settings, startDate: today };

  await chrome.storage.local.set({ startDate: today });
  startDateInput.value = today;
  clearFieldErrors();
  renderDisplay(updated);
  requestBadgeUpdate();
  showStatus(t('statusReset'));
}

/**
 * Initializes popup: load locale, settings, render display, bind events.
 */
async function init() {
  await loadLocale();
  const settings = await getSettings();

  localeSelect.value = currentLocale;
  applyStaticTranslations();
  populateForm(settings);
  renderDisplay(settings);

  settingsForm.addEventListener('submit', handleSave);
  resetBtn.addEventListener('click', handleReset);
  localeSelect.addEventListener('change', handleLocaleChange);
}

init();
