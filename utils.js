/**
 * Cycle Counter - Shared utilities
 * Used by background.js (importScripts) and popup.js (script tag).
 */

const DEFAULTS = {
  dailyIncrement: 3.3,
  cycleLength: 30,
  startDate: null,
};

const STORAGE_KEYS = ['dailyIncrement', 'cycleLength', 'startDate'];
const ALARM_HOURLY = 'cycleCounterHourly';
const ALARM_MIDNIGHT = 'cycleCounterMidnight';
const BADGE_COLOR = '#4CAF50';
const MS_PER_DAY = 86400000;
const MAX_BADGE_CHARS = 4;
const MAX_DAILY_INCREMENT = 999;
const MAX_CYCLE_LENGTH = 365;

/**
 * Returns today's date as YYYY-MM-DD in local timezone.
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a Date at local midnight.
 */
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calculates elapsed full days since startDate (minimum 0).
 */
function getElapsedDays(startDate, now = Date.now()) {
  const startMidnight = parseLocalDate(startDate).getTime();
  return Math.max(0, Math.floor((now - startMidnight) / MS_PER_DAY));
}

/**
 * Returns the day index within the current cycle (0-based).
 */
function getCycleDay(elapsedDays, cycleLength) {
  const mod = elapsedDays % cycleLength;
  return mod < 0 ? mod + cycleLength : mod;
}

/**
 * Returns progress info: current day in cycle, value, and percent.
 */
function calculateProgress(settings, now = Date.now()) {
  const elapsed = getElapsedDays(settings.startDate, now);
  const cycleDay = getCycleDay(elapsed, settings.cycleLength);
  const currentDay = cycleDay + 1;
  const value = currentDay * settings.dailyIncrement;
  const percent = Math.round((currentDay / settings.cycleLength) * 100);

  return { elapsed, cycleDay, currentDay, value, percent };
}

/**
 * Calculates the current counter value based on settings.
 */
function calculateCurrentValue(settings, now = Date.now()) {
  return calculateProgress(settings, now).value;
}

/**
 * Formats a value for the toolbar badge (max 1 decimal, strip trailing .0).
 * Values that exceed 4 characters are shown as "99+".
 */
function formatBadgeValue(value) {
  const rounded = Math.round(value * 10) / 10;
  let text = rounded.toFixed(1);
  if (text.endsWith('.0')) {
    text = text.slice(0, -2);
  }
  if (text.length > MAX_BADGE_CHARS) {
    return '99+';
  }
  return text;
}

/**
 * Formats a value for popup display (always 1 decimal place).
 */
function formatDisplayValue(value) {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toFixed(1);
}

/**
 * Returns timestamp of the next local midnight.
 */
function getNextMidnightTimestamp(now = Date.now()) {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
}

/**
 * Reads settings from chrome.storage.local with defaults applied.
 */
async function getSettings() {
  const stored = await chrome.storage.local.get(STORAGE_KEYS);
  return {
    dailyIncrement: stored.dailyIncrement ?? DEFAULTS.dailyIncrement,
    cycleLength: stored.cycleLength ?? DEFAULTS.cycleLength,
    startDate: stored.startDate ?? getTodayDateString(),
  };
}

/**
 * Validates settings object. Returns { valid, errors } with error keys for i18n.
 */
function validateSettings({ dailyIncrement, cycleLength, startDate }) {
  const errors = {};

  if (isNaN(dailyIncrement) || dailyIncrement <= 0) {
    errors.dailyIncrement = 'errorDailyIncrementPositive';
  } else if (dailyIncrement > MAX_DAILY_INCREMENT) {
    errors.dailyIncrement = 'errorDailyIncrementMax';
  }

  if (isNaN(cycleLength) || cycleLength < 1 || !Number.isInteger(cycleLength)) {
    errors.cycleLength = 'errorCycleLengthPositive';
  } else if (cycleLength > MAX_CYCLE_LENGTH) {
    errors.cycleLength = 'errorCycleLengthMax';
  }

  if (!startDate || isNaN(parseLocalDate(startDate).getTime())) {
    errors.startDate = 'errorStartDateInvalid';
  } else if (startDate > getTodayDateString()) {
    errors.startDate = 'errorStartDateFuture';
  }

  const maxBadgeValue = cycleLength * dailyIncrement;
  if (
    !errors.dailyIncrement &&
    !errors.cycleLength &&
    formatBadgeValue(maxBadgeValue).length > MAX_BADGE_CHARS
  ) {
    errors.dailyIncrement = 'errorBadgeOverflow';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
