# RecipeTube 

YouTubeのレシピ動画URLから手順を自動抽出し、巻き戻さずに確認できるWebアプリ。

**URL**: https://recipe-tube-azure.vercel.app/

---

## 概要

RecipeTubeは、YouTubeのレシピ動画URLを入力するだけで、AIが材料・分量・手順を自動で書き起こすWebアプリケーションです。
料理中に動画を何度も巻き戻す手間をなくし、レシピをテキストで確認できます。

### 主な機能

- YouTube動画URLを入力するだけでレシピを自動抽出
- AIによる材料・分量の解析・表示
- 登録不要ですぐに使える

---

## 技術スタック

### フロントエンド
| 技術 | 詳細 |
|------|------|
| Next.js (React) | フレームワーク |
| TypeScript | 言語 |
| Tailwind CSS | スタイリング |

### バックエンド
| 技術 | 詳細 |
|------|------|
| Ruby | 言語 |
| Ruby on Rails (APIモード) | フレームワーク |
| PostgreSQL | データベース |
| Neon | クラウドDB |

### インフラ
| 技術 | 詳細 |
|------|------|
| Vercel | フロントエンドデプロイ |
| Render | バックエンドデプロイ |
| Docker | 開発環境 |

### 外部API
| API | 用途 |
|-----|------|
| YouTube Data API v3 | 動画情報の取得 |
| Gemini API | レシピ情報の抽出・解析 |

---

## アーキテクチャ

フロントエンド（Next.js）とバックエンド（Ruby on Rails APIモード）を分離した構成で開発。

```
[ユーザー]
    ↓ YouTube URL入力
[フロントエンド: Next.js / Vercel]
    ↓ APIリクエスト
[バックエンド: Ruby on Rails / Render]
    ↓ 動画情報取得
[YouTube Data API v3]
    ↓ レシピ抽出
[Gemini API]
    ↓ レシピデータ保存
[PostgreSQL / Neon]
```

---

## 作成期間

2ヶ月

---

## 開発背景

料理動画を見ながら調理する際、材料や手順を確認するたびに動画を一時停止・巻き戻す手間を感じたことがきっかけで開発しました。AIを活用することで、動画の内容をテキスト化し、手を止めずに料理に集中できる体験を目指しました。
