# Cycle Counter

A Chrome extension that automatically increments a counter each day based on a configurable daily rate and cycle length.

**Default language: English.** Japanese is available via the Language selector in the popup.

## Use cases

- Savings goal progress
- Workout or study point tracking
- Game stamina recovery tracking
- Any counter that resets on a repeating cycle

## Features

- Current value shown on the toolbar badge
- Popup with current value, elapsed days, and progress bar
- Customizable daily increment, cycle length, and start date
- Automatically resets to day 1 when a cycle completes
- All data stored locally on your device (`chrome.storage.local` only)

## How it works

```
elapsedDays = floor((now - startDate) / 86400000)
cycleDay    = elapsedDays % cycleLength
currentValue = (cycleDay + 1) × dailyIncrement
```

Example (daily increment 3.3, cycle length 30 days):

| Day | Value |
|-----|-------|
| Day 1 | 3.3 |
| Day 2 | 6.6 |
| Day 30 | 99.0 |
| Day 31 | 3.3 (reset) |

## Install locally (developers)

1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder

## Build a ZIP for the Chrome Web Store

```bash
zip -r cycle-counter.zip . \
  -x "*.git*" \
  -x ".cursor/*" \
  -x "docs/*" \
  -x "README.md" \
  -x "LICENSE" \
  -x "store-screenshots/*" \
  -x "scripts/*" \
  -x "*.zip"
```

The ZIP must include:

- `manifest.json`, `_locales/`
- `background.js`, `utils.js`, `i18n.js`
- `popup.html`, `popup.css`, `popup.js`
- `icons/`

## Privacy policy

Published at: **https://b0on.github.io/cycle-counter/privacy-policy.html**

Source: [docs/privacy-policy.html](docs/privacy-policy.html)

## Permissions

| Permission | Purpose |
|------------|---------|
| `storage` | Save settings (daily increment, cycle length, start date, locale) |
| `alarms` | Refresh the badge hourly and at midnight |

## License

MIT
