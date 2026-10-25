# KolNovel × Paperback 0.8

A community experiment to integrate [KolNovel](https://kolnovel.com/) (Arabic text novels) with Paperback **v0.8.11-r1**.

## Status

🚧 **Prototype / not installable yet.** This repository currently has no compiled Paperback extension or valid source repository index.

Paperback primarily renders comics/manga pages as images, whereas KolNovel serves text chapters. A working source needs to retrieve novel metadata and chapters, render Arabic text into readable image pages (or use a supported text-reading interface), and then produce a Paperback 0.8-compatible extension + repository manifest. Do not add the GitHub repository URL as a Paperback source yet.

## Development checklist

- [ ] Confirm KolNovel public URLs and permitted access requirements
- [ ] Inspect the current novel index, search, chapters and chapter HTML
- [ ] Implement resilient selectors and Arabic right-to-left text processing
- [ ] Check if Paperback 0.8 can render long-form text; otherwise render chapters to image pages
- [ ] Compile against the Paperback 0.8 source API and test on-device
- [ ] Generate repository index and deploy with GitHub Pages
- [ ] Document a verified `Repository Base URL`

## User setup

Once a release is built and verified, the repository base URL will be listed here. Until then, **no installation steps are available**.

This is an independent project and is not affiliated with KolNovel or Paperback. Access only works you are entitled to read, and respect site usage rules.
