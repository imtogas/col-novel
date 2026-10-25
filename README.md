# KolNovel for Paperback 0.8 — development project

**Status: parser and chapter-client prototype; NOT installable in Paperback.**

This public code is being developed for the user's Paperback `0.8.11-r1` on iOS. It currently runs as standalone JavaScript modules, *not* as a Paperback source package.

## Verified from an uploaded chapter 406 source snapshot

- Arabic and right-to-left document
- Chapter text inside `#kol_content`
- Previous/next chapter links are labeled `السابق` and `التالي`
- `الفصول` leads back to the `/series/` URL

The test HTML deliberately uses invented placeholder paragraphs instead of redistributing the book's actual text.

## Working development components

- `src/kolnovel-parser.js`: title, generic chapter anchors, text extraction
- `src/kolnovel-navigation.js`: previous/next and chapter-list links
- `src/kolnovel-client.js`: HTTP fetch wrapper to return chapter title, body and navigation or errors
- `test/`: unit tests and a copyright-safe HTML structural fixture
- `npm test`: run locally with Node 22 (also configured for GitHub Actions)

Tests are mock/fixture tests; none establishes that the live website permits fetching from Paperback, and GitHub Actions results require verification.

## Remaining before installation

1. Verify series and search page HTML and finalize selectors for all novels
2. Create and compile a **Paperback 0.8** source with the extension SDK, not merely the standalone client
3. Solve the **text novel vs manga image-page reader** rendering mismatch
4. Confirm compatible network requests and reading behavior **on iPhone**
5. Only then publish GitHub Pages manifest and verify the Repository Base URL in-app

**Do not paste `https://github.com/imtogas/col-novel` into Paperback's repository field: it is not an installable source.**

Independent experimental integration, unaffiliated with Paperback or KolNovel. Respect the website's content rights and access controls.
