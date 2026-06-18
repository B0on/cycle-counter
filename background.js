/**
 * Cycle Counter - Background Service Worker
 * Handles badge updates, alarms, and storage initialization.
 */

importScripts('utils.js');

/**
 * Updates the extension toolbar badge with the current value.
 */
async function updateBadge() {
  const settings = await getSettings();
  const value = calculateCurrentValue(settings);
  const text = formatBadgeValue(value);

  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR });
}

/**
 * Registers the hourly alarm for periodic badge refresh.
 */
function setupHourlyAlarm() {
  chrome.alarms.create(ALARM_HOURLY, { periodInMinutes: 60 });
}

/**
 * Schedules a one-shot alarm at the next local midnight.
 */
function scheduleMidnightAlarm() {
  chrome.alarms.create(ALARM_MIDNIGHT, { when: getNextMidnightTimestamp() });
}

/**
 * Registers all recurring and one-shot alarms.
 */
function setupAlarms() {
  setupHourlyAlarm();
  scheduleMidnightAlarm();
}

/**
 * Initializes default settings on first install.
 */
async function initializeOnInstall() {
  const stored = await chrome.storage.local.get(STORAGE_KEYS);
  const settings = {
    dailyIncrement: stored.dailyIncrement ?? DEFAULTS.dailyIncrement,
    cycleLength: stored.cycleLength ?? DEFAULTS.cycleLength,
    startDate: stored.startDate ?? getTodayDateString(),
    locale: stored.locale ?? 'en',
  };
  await chrome.storage.local.set(settings);
}

// Extension installed or updated
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await initializeOnInstall();
  }
  setupAlarms();
  await updateBadge();
});

// Chrome browser startup
chrome.runtime.onStartup.addListener(async () => {
  setupAlarms();
  await updateBadge();
});

// Alarm ticks (hourly refresh + midnight date rollover)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_HOURLY || alarm.name === ALARM_MIDNIGHT) {
    await updateBadge();
    if (alarm.name === ALARM_MIDNIGHT) {
      scheduleMidnightAlarm();
    }
  }
});

// Settings changed in storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;
  const hasRelevantChange = STORAGE_KEYS.some((key) => key in changes);
  if (hasRelevantChange) {
    updateBadge();
    scheduleMidnightAlarm();
  }
});

// Message from popup for immediate badge refresh
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    updateBadge().then(() => sendResponse({ success: true }));
    return true;
  }
});

// Service worker wake-up: ensure alarms exist and badge is current
setupAlarms();
updateBadge();
