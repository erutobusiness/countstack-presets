# countstack-presets — プリセットデータリポジトリ

countstack アプリが実行時に GitHub Pages から取得するプリセット JSON 群。
**main への push = deploy.yml による即公開**（`erutobusiness.github.io/countstack-presets/`）。

## 構成

- `registry.json` — プリセット一覧（アプリが最初に読む）
- `presets/<id>/preset.json` — 各プリセット本体
- `schema/` — AJV スキーマ（validate-pr.mjs が使用）

スキーマ変更は countstack 本体と必ず同時コミット（`/preset-sync` スキルを使う。スキルは countstack 側にある）。

## 品質ゲート

品質チェック共通原則（`@projects/CLAUDE.md`）に従う。

- 散文 lint: なし
- 表示テキスト lint: なし（機械検査は構造のみ）。ただし `LocalizedString {ja, en}` の名前・説明・注記は**ユーザーの画面にそのまま出る**。文言を追加・変更したら、push 前に ja/en 両方を読み直す（push = 即公開のため）
- 出荷コマンド: `git push`（main）→ `.github/workflows/deploy.yml` が Pages へ公開。構造ゲートは `.githooks/pre-commit`（JSON 構文＋generate:build）と `validate.yml`（PR 時の AJV スキーマ検証）が担保
- LLM レビュー: オンデマンドのみ

## コミット・push

- Conventional Commits、本文は日本語
- push はユーザーの明示的な指示後のみ（このリポジトリでは push = 公開）
