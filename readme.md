# agentjacking.ru

Static, zero-dependency, two-page site:

- `index.html` — a live canvas diagram explaining **AI agent hijacking** (indirect prompt injection), doubling as the sales page for the domain `agentjacking.ru`.
- `interview_prep.html` — a self-contained Russian-language course that prepares network engineers for interviews: 18 topics each with a one-line essence, a plain-language "for beginners" explainer and diagram anchors; 59 self-check Q&A with instant explanations and retry; 35 mini-quizzes with answer breakdowns; 6 practical incident-case labs; a subnet drill trainer plus an IPv4 subnet calculator (/0–/32); a final exam mode (10 random questions, 70% pass threshold); and gamified progress (XP, levels 1–10, streaks, six achievement badges). Light high-contrast theme. Ships with its own structural + headless-browser test suite.

No build step, no framework, no package install. Open either HTML file directly or serve the directory as-is.

## Files

| File | Purpose |
|---|---|
| `index.html` | agentjacking.ru page: canvas animation, meta tags, JSON-LD structured data, no-JS fallback text |
| `interview_prep.html` | Standalone interactive network-engineer interview course (Russian): 18 topics with plain-language explainers, 59 Q&A, 35 quizzes, 6 case labs, subnet drill + calculator, final exam mode, XP/levels/badges gamification — fully self-contained, light theme |
| `robots.txt` | Crawler directives, incl. explicit AI-answer-engine crawler allowlist |
| `sitemap.xml` | Both URLs with tracked `lastmod` |
| `llms.txt` | Machine-readable site summary for LLM / AI-answer-engine crawlers ([llmstxt.org](https://llmstxt.org) standard), incl. key facts and feature inventory |
| `test_interview_prep.mjs` | Structural + headless-browser test suite for `interview_prep.html` |
| `package.json` | `npm test` entrypoint for the interview-prep test suite |

## Testing

```
npm test
```

Runs `test_interview_prep.mjs` against `interview_prep.html`: verifies all 18 required topic sections exist, nav links match section ids, visual-diagram coverage per topic (currently 18/18), practical phrasing checks, JSON/meta integrity, and does two headless-browser smoke runs to confirm the page loads and renders consistently.

## AI indexing rules (GEO setup)

This site is written for three readers at once: a human watching the animation or studying the handbook, a classic search crawler, and an AI answer engine (ChatGPT, Claude, Perplexity, Google AI Overviews) that may never execute JavaScript and needs to cite the page correctly anyway.

The setup follows current GEO practice on five pillars: **(1)** let AI crawlers in, **(2)** give them a machine-readable summary (`llms.txt`) with citable key facts, **(3)** ship structured data, **(4)** keep every meaningful sentence server-side readable, and **(5)** format passages so they can be lifted and cited out of context. The rules below are what's implemented, and what must stay in sync when page content changes.

### 1. AI crawlers are explicitly allowed — `robots.txt`

| User-agent | Owner | Purpose |
|---|---|---|
| `GPTBot` | OpenAI | Crawling for ChatGPT |
| `OAI-SearchBot` | OpenAI | ChatGPT search results |
| `ChatGPT-User` | OpenAI | Real-time fetch triggered by a ChatGPT user |
| `ClaudeBot` | Anthropic | Crawling for Claude |
| `Claude-User` | Anthropic | Real-time fetch triggered by a Claude user |
| `Claude-SearchBot` | Anthropic | Claude search features |
| `anthropic-ai` | Anthropic | Model training |
| `PerplexityBot` | Perplexity | Search indexing |
| `Perplexity-User` | Perplexity | Real-time fetch triggered by a Perplexity user |
| `Google-Extended` | Google | Gemini / AI Overviews grounding & training |
| `Applebot` | Apple | Apple search indexing |
| `Applebot-Extended` | Apple | Apple Intelligence (grounding & training) |
| `Bingbot` | Microsoft | Bing search indexing |
| `adidxbot` | Microsoft | Bing Copilot / AI answer previews |
| `Meta-ExternalAgent` | Meta | Meta AI search |
| `Meta-ExternalFetcher` | Meta | Meta AI content fetching |
| `YouBot` | You.com | You.com AI search indexing |
| `Amazonbot` | Amazon | Amazon AI crawler |
| `AI2Bot` | Allen Institute for AI | AI2 academic crawler |
| `YandexBot` | Yandex | Search indexing (`.ru` domain) |
| `Bytespider` | ByteDance | TikTok/Douyin AI |
| `cohere-ai` | Cohere | Model training |
| `CCBot` | Common Crawl | Open dataset used by most AI labs |

Adding a new AI crawler worth targeting: add `User-agent: X` / `Allow: /` to `robots.txt`, add it to `llms.txt`'s machine-readable-files section, and add a row here.

### 2. `llms.txt` — the canonical AI summary

Follows the llms.txt convention: H1 title, blockquote summary, the attack-chain definition (six numbered steps + one-line takeaway), `## Pages` describing both URLs including the handbook's full feature set, `## Key facts` (language, topic/Q&A counts, calculator coverage, gamification mechanics, test suite), `## Machine-readable files`, and the domain-for-sale/contact block.

Keep in sync with `index.html`'s `<meta name="description">` and with the animation's step list — if the six attack-chain captions change, update the definition in `llms.txt` too. If the handbook gains features or topics change, update its Pages entry and Key facts.

### 3. Structured data — JSON-LD

`index.html` ships a single `@graph` with:
- `WebPage` (page identity, `dateModified`, languages `en`/`ru`)
- `WebSite`
- `DefinedTerm` — "Agent hijacking" with alternate names (`Indirect prompt injection`, `Prompt injection`, `AI agent hijacking`) and a full plain-text definition, so AI answer engines can lift a self-contained definition directly
- `Product` + `Offer` — the domain itself as the thing for sale, with seller name and contact email

`interview_prep.html` ships WebPage + Section/Article JSON-LD listing its 18 topics, with descriptions naming the interactive features (59 self-check questions, quiz explanations, subnet calculator, gamified progress) so snippets match what users actually get.

### 4. Server-side readable content (no-JS fallback)

AI crawlers do not execute JavaScript, and both pages rely on interactive rendering (canvas on the landing page; toggles, calculator and gamification in the handbook). Both therefore keep their substance in static markup:

- `index.html` puts the full attack-chain explanation as plain `<p>` text (English + Russian) inside `<canvas>`.
- `interview_prep.html` keeps every topic's core content static: one-line essence, ASCII diagram anchor, interview-style answer, and Q&A pairs in plain HTML. JavaScript only powers the Q&A toggles, subnet calculator, progress panel and XP/badges layer.

These fallbacks are the source of truth. If the animated timeline or any JS-rendered block changes, update the static text too — it's easy for the two to drift.

### 5. Passage-level citability

Copy on both pages is formatted so an AI engine can lift a passage without surrounding context:

- Definitions follow the "X is…" pattern and stand alone (the attack-chain definition exists identically on the landing page and in `llms.txt`).
- Each handbook topic opens with a self-contained one-line essence followed by a direct interview-style answer.
- Question-based Q&A headings; lists and tables instead of walls of text.
- The `robots` meta allows unlimited snippet length (`max-snippet:-1`) plus large image previews, so engines can quote generously.

### 6. Meta tags

Each page keeps `<meta name="description">`, `og:description`, and `twitter:description` consistent in meaning (descriptions name the concrete features: topics, question counts, calculator, gamification). Canonical URL is set on both pages. OpenGraph + Twitter cards are populated. `og:locale` (+ `og:locale:alternate` on the bilingual landing page) declares content language.

### 7. Sitemap & freshness discipline

`sitemap.xml` carries both URLs with manually tracked `lastmod`. Bump `sitemap.xml` `lastmod` and the page's JSON-LD `dateModified` together whenever a page changes meaningfully — AI and classic crawlers both use these signals for freshness.

## Content-sync contract

When you change something, these must move together:

| You changed | Must update |
|---|---|
| Handbook features/topics/Q&A counts | `<meta name="description">`, `og:description`, `twitter:description`, JSON-LD `name`/`description`/`dateModified` in `interview_prep.html`; `llms.txt` Pages entry + Key facts; `sitemap.xml` lastmod |
| Attack-chain captions | `llms.txt` definition; no-JS fallback text (EN+RU) inside `<canvas>` in `index.html`; JSON-LD `dateModified`; `sitemap.xml` lastmod |
| Contact / domain-sale status | `llms.txt` blockquote + Domain-for-sale section; JSON-LD `Product`/`Offer` in `index.html`; visible badge |
| New/removed AI crawler | `robots.txt`; crawler table above; `llms.txt` machine-readable-files section |

## Maintenance checklist

When editing either page's content:

- [ ] Keep `<meta name="description">`, `og:description`, and `twitter:description` aligned
- [ ] Bump JSON-LD `dateModified` and `sitemap.xml` `lastmod` together
- [ ] Update `llms.txt` if page purpose, attack-chain definition, topics/features, or contact info changes
- [ ] Update the no-JS fallback text (EN + RU) if the JS-rendered or animated content changes
- [ ] Update `robots.txt` (and the table above) if adding/removing an allowed AI crawler
- [ ] Re-run `npm test` after touching `interview_prep.html`

## Domain for sale

`agentjacking.ru` — contact: **mss777@mail.ru**

Declared machine-readably in three places: the `Product`/`Offer` JSON-LD in `index.html`, the visible "for sale" badge on the page, and `llms.txt`.
