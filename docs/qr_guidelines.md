# QR 読み取りガイドライン

本ドキュメントは、スマートフォンのブラウザ（Chrome / Safari / Edge など）上でカメラを起動して QR コードを読み取る際に発生する読取失敗を最小化するためのガイドラインです。

---

## 1. 読み取り失敗の代表的原因

| カテゴリ | 主な原因 | 症状 |
|----------|----------|------|
| **物理的** | QR サイズが小さい / 余白不足 / コントラスト不足 | 焦点が合わずデコード不可、ピント合わせに時間がかかる |
| **環境** | 暗所・逆光・反射・汚れ | カメラプレビューが暗い / 白飛び / 黒つぶれ |
| **端末** | 低解像度カメラ・オートフォーカス性能不足 | 旧型 Android 端末で読み取りに 3〜5 秒以上 |
| **ブラウザ API** | getUserMedia の制限・解像度低下 | iOS Safari (旧版) でプレビューが 720p 制限 |
| **実装** | デコードライブラリ単一・リサイズ処理不足 | 一部端末だけ読み取れないケースが残る |

※[WebKit 公式バグレポート](https://bugs.webkit.org/show_bug.cgi?id=179994)によると、iOS Safari 11.x の制限は 720p（1280×720）であることを確認

---

## 2. QR コード情報量による影響

今回は約 110〜120 文字程度の場合に限定して言及

* **エンコードサイズ**: 英数字 120 文字は QR Version 5 (37×37) に収まる
  - **レベル M**: 122 文字まで収容可能
  - **レベル Q**: 87 文字まで収容可能 
* **物理サイズ目安**: Version 5 を 300 dpi で印刷する場合、
  - **実際の計算値**: 約 **15.5 mm 四方**（37×37モジュール × 0.42mm/モジュール）
  - **推奨サイズ**: 20〜25 mm 四方（読み取り余裕を考慮）
* **余白 (Quiet Zone)**: 4 モジュール (= 約 2.5〜3 mm) 必須。
    * M (15%)→Q (25%) へ上げると汚れに強くなりますが、データ容量が減少する。

**📋 参考資料**: 
* [QR code > Error Correction Feature](https://www.qrcode.com/en/about/error_correction.html)
* [QR code > Character Capacities](https://www.thonky.com/qr-code-tutorial/character-capacities)
* [QR code > Point for Setting the mdule size](https://www.qrcode.com/en/howto/cell.html)
    * 300 dpi、5ドット構成で0.42mm/モジュール

> **結論**: 110〜120 文字程度であれば、適切な物理サイズと余白を確保すれば読取率に大きな影響はない。ただし、レベルQでは120文字は収容できないため、レベルMの使用が必要

---

## 3. 機種依存の影響（Web アプリの場合）

| 項目 | 影響度 | 説明・対策 |
|------|--------|------------|
| 解像度 | ★★★ | 720p 未満だと検出精度低下。`ideal: 1280` 以上を要求する。
| オートフォーカス | ★★☆ | 旧 Android / iOS < 16 は AF が遅い。プレビュー開始後 0.5 秒待機してからデコード開始。
| 低照度性能 | ★★☆ | f/値の大きいカメラは暗所でノイズ増。LED ライト常設 or UI で明るい場所へ誘導。
| センサー品質 | ★★☆ | エントリーモデルは歪み・色収差大。`whiteBalanceMode: 'continuous'` が使える場合は設定。

---

## 4. ブラウザ毎の差異

| ブラウザ | モバイル実装状況 | 特有の注意点 |
|-----------|----------------|--------------|
| Chrome (Blink) | ◎ 最も安定 | `focusMode` 連続 AF 可。解像度指定がほぼそのまま適用。[追加制御機能](https://www.dynamsoft.com/codepool/camera-focus-control-on-web.html)でzoom・torch・focus対応。|
| Safari (WebKit) | ○ iOS 16+ は良好 | iOS 15 以下: AF 遅延・解像度 720p 制限。カメラ許可フローが煩雑。|
| Edge (Chromium) | ◎ | Chrome と同挙動。|
| Firefox | △ | モバイル版は AF API 未実装。旧端末で遅い。|

### 推奨ブラウザ
* **モバイル**: Chrome 最新版 / Safari 16 以上 / Edge 最新版
* **案内文**: 初回アクセス時に推奨ブラウザとカメラ権限手順をモーダル表示

**📋 事実確認結果**: Chrome for Android では getUserMedia を通じて [zoom、torch、focus の拡張制御](https://www.dynamsoft.com/codepool/camera-focus-control-on-web.html)が可能です。

---

## 5. ネイティブアプリ vs Web アプリの読取性能

| 項目 | ネイティブ | Web (getUserMedia) |
|------|------------|------------------|
| カメラ制御 | 解像度・露出・ISO・AF 点を細かく制御可 | ブラウザ抽象化層による制限あり |
| デコード速度 | 端末 CPU + 専用ライブラリ (ZXing, MLKit) | WASM + JS (ZXing-js) で 1〜2 秒遅延 |
| UX | 全画面プレビュー・ハプティクス | アドレスバー・権限ポップアップが表示される |

> **留意**: Version 5 程度の QR であれば実運用上は Web でも十分な読取速度。ただし暗所や大量データではネイティブ優位。

---

## 6. 実装レベルの追加対策

1. **デコード並列化**  
   `@zxing/library` と `jsQR` を並列実行し、どちらか早く解読できた方を採用。
2. **ROI（Region of Interest）解析**  
   スキャン枠内の中央 75% だけを `canvas` に描画して解析し、パフォーマンス向上。
3. **フォールバック入力**  
   スキャン失敗 3 秒で自動的に「固定コード入力」フィールドへフォーカス。
4. **読取ログの収集**  
   端末 UA / OS / ブラウザ / 解像度 / 成否 を送信し、失敗端末を統計解析。
5. **ガイダンス UI**  
   「QR を枠に合わせてください」「明るい場所で試してください」といったヒントをオーバーレイ表示。

---

## 7. 物理サイズ・印刷要件

### 最小サイズ要件
- **ISO 18004 規格**: [最小スキャン可能サイズ 1cm×1cm](https://coastlabel.com/how-small-can-a-qr-code-be/)
- **実用推奨サイズ**: ほとんどのスマートフォンで確実に読み取るには **2cm×2cm 以上**
- **印刷解像度**: 300 DPI 以上推奨（シャープな印刷品質確保）

### Version 5 の具体的サイズ（37×37 モジュール）
- **300 DPI、5ドット構成**: 15.5mm 四方
- **推奨印刷サイズ**: 20〜25mm 四方（余白・読み取り余裕込み）
- **必須余白**: 4モジュール = 約 1.7mm 四方

---

## 8. チェックリスト

- [ ] QR の物理サイズは **20 mm 以上**か？（Version 5 の場合）
- [ ] 余白 4 モジュール以上か？
- [ ] 高コントラスト（黒 #000 / 白 #FFF）で印刷されているか？
- [ ] ブラウザは最新か？（Chrome / Safari / Edge）
- [ ] カメラ権限ポップアップを許可しているか？
- [ ] 暗所での利用時はライトを準備しているか？
- [ ] 固定コード入力の代替導線を提示しているか？
- [ ] 英数字120文字を使用する場合、誤り訂正レベルMを選択しているか？

---

## 9. まとめ

* **物理要件** と **ソフトウェア実装** の両輪で読取率を高める。  
* Web アプリでも Version 5 程度までなら十分実用レベル。  
* 読取不能時のフォールバックと、失敗ログの収集が長期的な改善につながる。
* **重要**: 印刷サイズやブラウザ制限については、本ドキュメントの修正内容を参考に、最新の公式仕様を確認することを推奨。

---

## 10. 参考資料・検証根拠

- [DENSO WAVE - QR Code 公式仕様](https://www.qrcode.com/en/about/standards.html)
- [QR Code バージョン・容量表](https://www.qrcode.com/en/about/version.html)
- [誤り訂正レベル仕様](https://www.qrcode.com/en/about/error_correction.html)
- [印刷サイズ計算方法](https://www.qrcode.com/en/howto/cell.html)
- [文字容量詳細表](https://www.thonky.com/qr-code-tutorial/character-capacities)
- [ISO 18004 最小サイズ要件](https://coastlabel.com/how-small-can-a-qr-code-be/)
- [WebKit getUserMedia 制限](https://bugs.webkit.org/show_bug.cgi?id=179994)
- [ブラウザカメラ制御機能](https://www.dynamsoft.com/codepool/camera-focus-control-on-web.html)

