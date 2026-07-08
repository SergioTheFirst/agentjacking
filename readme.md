# agentjacking.ru

Static, single-page site: a live canvas diagram explaining AI agent hijacking (indirect prompt injection), doubling as the sales page for the domain `agentjacking.ru`.

No build step, no framework, no dependencies — `index.html` is the entire site (inline CSS/JS). Open it directly or serve the directory as-is.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page: canvas animation, meta tags, JSON-LD structured data, no-JS fallback text |
| `robots.txt` | Crawler directives, incl. explicit AI-crawler allowlist |
| `sitemap.xml` | Single-URL sitemap |
| `llms.txt` | Machine-readable site summary for LLM/AI-answer-engine crawlers ([llmstxt.org](https://llmstxt.org) standard) |

## AI indexing rules (GEO setup)

This site is written for two readers at once: a human watching the animation, and an AI crawler or answer engine (ChatGPT, Claude, Perplexity, Google AI Overviews) that will never execute the JavaScript and needs to cite the page correctly anyway. The rules below are what's implemented, and what must stay in sync when the page content changes.

### 1. AI crawlers are explicitly allowed — `robots.txt`

| User-agent | Owner | Purpose |
|---|---|---|
| `GPTBot` | OpenAI | Crawling for ChatGPT |
| `OAI-SearchBot` | OpenAI | ChatGPT search results |
| `ChatGPT-User` | OpenAI | Real-time fetch triggered by a ChatGPT user |
| `ClaudeBot` | Anthropic | Crawling for Claude |
| `Claude-User` | Anthropic | Real-time fetch triggered by a Claude user |
| `Claude-SearchBot` | Anthropic | Claude search features |
| `PerplexityBot` | Perplexity | Search indexing |
| `Perplexity-User` | Perplexity | Real-time fetch triggered by a Perplexity user |
| `Google-Extended` | Google | Gemini / AI Overviews grounding & training |
| `YandexBot` | Yandex | Search indexing (`.ru` domain) |
| `Bytespider` | ByteDance | TikTok/Douyin AI |
| `anthropic-ai` | Anthropic | Model training |
| `cohere-ai` | Cohere | Model training |
| `CCBot` | Common Crawl | Open dataset used by most AI labs |

Adding a new AI crawler worth targeting: add `User-agent: X` / `Allow: /` to `robots.txt`, and add a row here.

### 2. `llms.txt` — the canonical AI summary

Follows the llms.txt convention: H1 title, one-line blockquote summary, `## About`, the attack-chain steps, `## Pages`, and the domain-for-sale/contact block.

Keep in sync with `index.html`'s `<meta name="description">` and with the animation's step list — if the six attack-chain captions change, update the numbered list in `llms.txt` too.

### 3. Structured data — JSON-LD in `index.html`

A single `@graph` with:
- `WebPage` (page identity, `dateModified`, language)
- `WebSite`
- `DefinedTerm` — "Agent hijacking" with alternate names (`Indirect prompt injection`, `Prompt injection`, `AI agent hijacking`) and a full plain-text definition, so AI answer engines can lift a self-contained definition directly
- `Product` + `Offer` — the domain itself as the thing for sale, with seller name and contact email

`dateModified` on the `WebPage` node and `lastmod` in `sitemap.xml` should always move together.

### 4. No-JS fallback text inside `<canvas>`

AI crawlers don't execute JavaScript, and the entire diagram is a `<canvas>` element — without fallback text there is nothing for them to read. `index.html` puts the full attack-chain explanation as plain `<p>` text (English + Russian) inside `<canvas>`, which is what non-JS clients and crawlers actually see.

This fallback text is the source of truth for the attack-chain explanation. If the on-page caption timeline (the `phases` array in the animation script) changes, update this text too — it's easy for the two to drift since one is JS-driven and the other is static markup.

### 5. Meta tags

`robots` meta allows unlimited snippet/image/video preview length (`max-snippet:-1`, `max-image-preview:large`, `max-video-preview:-1`) so AI and search engines can quote generously. Canonical URL is set. OpenGraph + Twitter card are populated. `og:locale` + `og:locale:alternate` declare the en/ru bilingual content.

### 6. Sitemap

One URL, `lastmod` tracked manually — update it whenever `index.html` changes meaningfully.

## Maintenance checklist

When editing `index.html`'s content:

- [ ] Keep `<meta name="description">`, `og:description`, and `twitter:description` identical
- [ ] Bump JSON-LD `dateModified` and `sitemap.xml` `lastmod` together
- [ ] Update `llms.txt` if the page's purpose, attack-chain steps, or contact info changes
- [ ] Update the `<canvas>` fallback `<p>` text (EN + RU) if the animated caption timeline changes
- [ ] Update `robots.txt` (and the table above) if adding or removing an allowed AI crawler

## Domain for sale

`agentjacking.ru` — contact: **mss777@mail.ru**

Declared machine-readably in three places: the `Product`/`Offer` JSON-LD in `index.html`, the visible "for sale" badge on the page, and `llms.txt`.
