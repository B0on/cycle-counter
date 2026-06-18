# Chrome Web Store Listing Copy

Copy and paste when submitting to the store.

## Basic info

| Field | Value |
|-------|-------|
| Name | Cycle Counter |
| Category | Productivity |
| Primary language | English |
| Supported locales | English, Japanese (UI toggle in popup) |

## Short description (max 132 characters)

```
Auto-incrementing counter based on daily rate. For savings, learning, stamina. Data stored locally only, no external transmission.
```

## Detailed description

```
Cycle Counter automatically increments a value each day based on your configured daily rate.

【Use cases】
• Savings goal progress
• Workout or study point tracking
• Game stamina recovery tracking
• Any counter that resets on a cycle

【Features】
• Current value always visible on the toolbar badge
• Popup shows value, elapsed days, and progress bar
• Customize daily increment, cycle length, and start date
• Automatically resets to day 1 when a cycle completes
• English UI by default; Japanese available in Language settings

【Privacy】
All data is stored on your device only.
No data is sent to external servers.

【Permissions】
• storage: save your settings
• alarms: refresh the badge display
```

## Japanese store listing (optional secondary locale)

### Short description

```
1日あたりの増加量で自動カウント。貯金・学習・スタミナ管理に。データは端末内のみ保存、外部送信なし。
```

### Detailed description

See previous Japanese version in git history, or translate from the English listing above.

## Permission justification (for review)

### storage
Stores user settings (daily increment, cycle length, start date, language preference) on the device.

### alarms
Refreshes the toolbar badge when the date changes and periodically in the background. No network activity.

## Screenshots

You already captured a Japanese UI screenshot — that works well for the Japanese locale listing.

For the **primary English listing**, take one more screenshot with Language set to **English** in the popup.

Recommended size: 1280×800 or 640×400

## Pre-launch checklist

- [ ] Developer account registered ($5 one-time)
- [ ] Privacy policy URL published (GitHub Pages, etc.)
- [ ] English screenshot (+ optional Japanese screenshot)
- [ ] 128×128 store icon (`icons/icon128.png`)
- [ ] ZIP package (include `_locales/`, `i18n.js`; exclude `docs/`, `README.md`)
- [ ] Test install, save, reset, language switch
- [ ] No errors on `chrome://extensions`

## Privacy policy URL

```
https://b0on.github.io/cycle-counter/privacy-policy.html
```

Repository: https://github.com/B0on/cycle-counter
