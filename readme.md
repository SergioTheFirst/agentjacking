# agentjacking.ru

Static, zero-dependency, two-page site:

- `index.html` — a live canvas diagram explaining **AI agent hijacking** (indirect prompt injection), doubling as the sales page for the domain `agentjacking.ru`.
- `interview_prep.html` — a self-contained Russian-language network-engineer interview handbook (18 topics, self-check Q&A, subnet calculator), with its own structural + headless-browser test suite.

No build step, no framework, no package install. Open either HTML file directly or serve the directory as-is.

## Files

| File | Purpose |
|---|---|
| `index.html` | agentjacking.ru page: canvas animation, meta tags, JSON-LD structured data, no-JS fallback text |
| `interview_prep.html` | Standalone network-engineering interview handbook (Russian), fully self-contained |
| `robots.txt` | Crawler directives, incl. explicit AI-answer-engine crawler allowlist |
| `sitemap.xml` | Both URLs with tracked `lastmod` |
| `llms.txt` | Machine-readable site summary for LLM / AI-answer-engine crawlers ([llmstxt.org](https://llmstxt.org) standard) |
| `test_interview_prep.mjs` | Structural + headless-browser test suite for `interview_prep.html` |
| `package.json` | `npm test` entrypoint for the interview-prep test suite |

## Testing

```
npm test
```

Runs `test_interview_prep.mjs` against `interview_prep.html`: verifies required topic sections exist, nav links match section ids, visual-diagram coverage per topic, and does two headless-browser smoke runs to confirm the page loads and renders consistently.

## AI indexing rules (GEO setup)

This site is written for three readers at once: a human watching the animation or studying the handbook, a classic search crawler, and an AI answer engine (ChatGPT, Claude, Perplexity, Google AI Overviews) that may never execute JavaScript and needs to cite the page correctly anyway. The rules below are what's implemented, and what must stay in sync when page content changes.

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

Adding a new AI crawler worth targeting: add `User-agent: X` / `Allow: /` to `robots.txt`, and add a row here.

### 2. `llms.txt` — the canonical AI summary

Follows the llms.txt convention: H1 title, blockquote summary, `## About`, the attack-chain definition, `## Pages` listing both URLs, a machine-readable-files section, and the domain-for-sale/contact block.

Keep in sync with `index.html`'s `<meta name="description">` and with the animation's step list — if the six attack-chain captions change, update the definition in `llms.txt` too.

### 3. Structured data — JSON-LD

`index.html` ships a single `@graph` with:
- `WebPage` (page identity, `dateModified`, languages `en`/`ru`)
- `WebSite`
- `DefinedTerm` — "Agent hijacking" with alternate names (`Indirect prompt injection`, `Prompt injection`, `AI agent hijacking`) and a full plain-text definition, so AI answer engines can lift a self-contained definition directly
- `Product` + `Offer` — the domain itself as the thing for sale, with seller name and contact email

`interview_prep.html` ships WebPage + WebSite + ListItem/Article (Topic) JSON-LD describing its structure and 18 topics.

### 4. No-JS fallback text

AI crawlers don't execute JavaScript, and both pages rely on interactive rendering (canvas on the landing page, JS-built Q&A on the handbook). Each page therefore carries plain, static fallback content that non-JS clients and crawlers actually read:

- `index.html` puts the full attack-chain explanation as plain `<p>` text (English + Russian) inside `<canvas>`.
- `interview_prep.html` keeps every topic's core content in static markup; the JS only powers the submnet calculator and interactive Q&A toggles.

These fallbacks are the source of truth. If the animated timeline or JS-rendered blocks change, update the static text too — it's easy for the two to drift.

### 5. Meta tags

`robots` meta allows unlimited snippet/image/video preview length (`max-snippet:-1`, `max-image-preview:large`, `max-video-preview:-1`) so AI and search engines can quote generously. Canonical URL is set. OpenGraph + Twitter cards are populated. `og:locale` + `og:locale:alternate` declare the bilingual content.

### 6. Sitemap

Two URLs, `lastmod` tracked manually — update whenever either page changes meaningfully. `sitemap.xml`.

## Maintenance checklist

When editing either page's content:

- [ ] Keep `<meta name="description">`, `og:description`, and `twitter:description` identical
- [ ] Bump JSON-LD `dateModified` and `sitemap.xml` `lastmod` together
- [ ] Update `llms.txt` if the page's purpose, attack-chain definition, topics list, or contact info changes
- [ ] Update the no-JS fallback text (EN + RU) if the JS-rendered or animated content changes
- [ ] Update `robots.txt` (and the table above) if adding/removing an allowed AI crawler
- [ ] Re-run `npm test` after touching `interview_prep.html`

## Domain for sale

`agentjacking.ru` — contact: **mss777@mail.ru**

Declared machine-readably in three places: the `Product`/`Offer` JSON-LD in `index.html`, the visible "for sale" badge on the page, and `llms.txt`.