# KolNovel – Paperback 0.8 prototype

Experimental project for reading Arabic KolNovel text novels in Paperback **v0.8.11-r1**.

**Current status: development prototype, NOT an installable Paperback repository.** Do not paste this GitHub URL into Paperback's Repository Base URL field. The site was not accessible to the development environment for live HTML validation.

## Added now

- `src/kolnovel-parser.js`: Arabic-safe HTML text extraction, title parsing, tentative chapter-list and chapter-text parsing
- `test/parser.test.js`: synthetic fixtures and regression tests (not tests of the live website)
- `package.json`: run `npm test` with Node 22
- `.github/workflows/tests.yml`: GitHub Actions parser test workflow

## Remaining before it can work on iPhone

1. Inspect representative public KolNovel book and chapter HTML to validate selectors.
2. Adapt a real Paperback 0.8 extension with search, book details, chapter list and reading pages.
3. Resolve Paperback's image-page reader vs KolNovel's text chapters (likely convert text into pages).
4. Compile and test a working extension on Paperback 0.8.11-r1.
5. Publish the built extension and repository manifest via GitHub Pages and verify its installation link.

No credentials, private session tokens, scraped books or copyrighted chapter text should be committed.

Independent experiment; not affiliated with either KolNovel or Paperback.
