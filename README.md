# Cycle Counter

An auto-incrementing counter Chrome extension based on a daily rate and cycle length.

**Default language: English.** Japanese is available via the Language selector in the popup.

## Use cases

- 貯金進捗の管理
- 筋トレ・学習ポイントの積み上げ
- ゲームスタミナの管理
- 任意の周期カウンター

## 機能

- ツールバーバッジに現在値を表示
- ポップアップで現在値・経過日数・進捗バーを確認
- 増加量・周期・開始日を自由に設定
- 周期終了後は自動でリセット
- すべてのデータは端末内（`chrome.storage.local`）にのみ保存

## 計算式

```
経過日数 = floor((現在日時 - 開始日) / 86400000)
周期内日数 = 経過日数 % 周期日数
現在値 = (周期内日数 + 1) × 1日あたり増加量
```

例（増加量 3.3、周期 30日）:

| 日 | 値 |
|----|-----|
| 1日目 | 3.3 |
| 2日目 | 6.6 |
| 30日目 | 99.0 |
| 31日目 | 3.3（リセット） |

## 開発者向け：ローカル読み込み

1. Chrome で `chrome://extensions` を開く
2. **デベロッパーモード** を ON
3. **パッケージ化されていない拡張機能を読み込む**
4. このフォルダを選択

## Chrome Web Store 公開用 ZIP の作成

```bash
zip -r cycle-counter.zip . \
  -x "*.git*" \
  -x ".cursor/*" \
  -x "docs/*" \
  -x "README.md" \
  -x "LICENSE" \
  -x "*.zip"
```

ZIP must include:

- `manifest.json`, `_locales/`
- `background.js`, `utils.js`, `i18n.js`
- `popup.html`, `popup.css`, `popup.js`
- `icons/`

## プライバシーポリシー

[docs/privacy-policy.html](docs/privacy-policy.html) を GitHub Pages 等で公開し、ストア申請時に URL を入力してください。

## 権限の説明

| 権限 | 理由 |
|------|------|
| `storage` | 設定（増加量・周期・開始日）の保存 |
| `alarms` | バッジの自動更新（1時間ごと・日付変更時） |

## ライセンス

MIT
