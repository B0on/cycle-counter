# Chrome Web Store Listing Copy

Copy and paste when submitting to the store.

**Status:** Submission in progress (June 2026)

## Basic info

| Field | Value |
|-------|-------|
| Name | Cycle Counter |
| Category | Productivity |
| Primary language | English |
| Supported locales | English, Japanese (UI toggle in popup) |
| Version | 1.2.0 |

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

```
Cycle Counter は、設定した1日あたりの増加量に基づいて、毎日自動で値を増やす拡張機能です。

【こんな用途に】
• 貯金目標の進捗管理
• ワークアウトや学習ポイントの記録
• ゲームのスタミナ回復の追跡
• 周期でリセットされるカウンター全般

【機能】
• ツールバーバッジに現在値を常時表示
• ポップアップで現在値・経過日数・進捗バーを表示
• 1日あたりの増加量・周期日数・開始日を自由に設定
• 周期が完了すると自動で1日目にリセット
• デフォルトは英語UI。設定から日本語に切り替え可能

【プライバシー】
すべてのデータは端末内にのみ保存されます。
外部サーバーへの送信は行いません。

【権限】
• storage: 設定の保存
• alarms: バッジ表示の更新
```

---

## Privacy practices tab (Dashboard → Privacy)

Use these fields in the Chrome Web Store **Privacy** tab. Adjust only if the extension behavior changes.

### Single purpose description

```
Cycle Counter displays an auto-incrementing daily counter on the toolbar badge based on user-configured settings (daily increment, cycle length, and start date). The extension stores settings locally and updates the badge when the date changes. It does not read or modify web page content, connect to external services, or collect personal information.
```

### Remote code

**Does your extension use remote code?** → **No**

All extension logic ships inside the uploaded package (`background.js`, `utils.js`, `i18n.js`, `popup.js`). No scripts, WASM, or eval’d code are loaded from remote servers at runtime.

### Host permissions

**None.** The manifest does not request `<all_urls>`, `activeTab`, or any other host permission.

### Data usage (certification fields)

| Question | Answer |
|----------|--------|
| Collects or transmits user data? | **No** (settings stay on device via `chrome.storage.local`) |
| Sells user data? | **No** |
| Uses data for unrelated purposes? | **No** |
| Uses data for creditworthiness or lending? | **No** |

**Data types stored locally (not transmitted):**

| Data | Purpose |
|------|---------|
| Daily increment | Counter calculation |
| Cycle length | Reset interval |
| Start date | Elapsed-day calculation |
| Language preference | UI locale (English or Japanese) |

No personally identifiable information is collected.

### Permission justifications

Paste into each permission’s justification field in the Privacy tab.

#### storage

```
Saves the user's counter settings on the device: daily increment, cycle length, start date, and language preference. Data is stored only in chrome.storage.local and is never sent to external servers.
```

#### alarms

```
Schedules local background alarms to refresh the toolbar badge when the calendar date changes (midnight) and periodically (hourly). Alarms trigger only local badge updates; they do not perform network requests or access web pages.
```

### Privacy policy URL

```
https://b0on.github.io/cycle-counter/privacy-policy.html
```

Source in repo: [docs/privacy-policy.html](privacy-policy.html)

Repository: https://github.com/B0on/cycle-counter

---

## Permission justification (store review notes)

Additional context if reviewers ask (not always a separate form field):

### storage

Stores user settings (daily increment, cycle length, start date, language preference) on the device.

### alarms

Refreshes the toolbar badge when the date changes and periodically in the background. No network activity.

---

## Screenshots and promotional images

Generated assets are in `store-screenshots/`:

| File | Size | Use |
|------|------|-----|
| `screenshot-en-1280x800.png` | 1280×800 | Primary English listing |
| `screenshot-en-640x400.png` | 640×400 | English (alternate size) |
| `screenshot-ja-1280x800.png` | 1280×800 | Japanese locale listing |
| `screenshot-ja-640x400.png` | 640×400 | Japanese (alternate size) |
| `promo-tile-small-440x280.png` | 440×280 | Small promo tile |
| `promo-tile-marquee-1400x560.png` | 1400×560 | Marquee promo tile |

Regenerate:

```bash
python3 scripts/generate_store_screenshots.py
```

Requires Pillow (`pip install pillow`). Raw popup captures are composited with branded frames; see script for asset paths.

---

## Pre-launch checklist

- [ ] Developer account registered ($5 one-time)
- [x] Privacy policy URL published — https://b0on.github.io/cycle-counter/privacy-policy.html
- [x] English screenshot (`screenshot-en-1280x800.png`)
- [x] Japanese screenshot (`screenshot-ja-1280x800.png`)
- [x] Promotional tiles generated
- [x] 128×128 store icon (`icons/icon128.png`)
- [ ] ZIP package uploaded (include `_locales/`, `i18n.js`; exclude `docs/`, `README.md`, `store-screenshots/`, `scripts/`)
- [ ] Privacy tab completed (single purpose, permissions, remote code = No)
- [ ] Test install, save, reset, language switch
- [ ] No errors on `chrome://extensions`
- [ ] Store listing submitted for review
