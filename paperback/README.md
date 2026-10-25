# Experimental Paperback 0.8 source (UNTESTED)

This source implements Paperback 0.8 interfaces for one known KolNovel series, not the full catalog. It loads public chapter HTML, extracts `#kol_content` and attempts to render Arabic prose as SVG data URI page images.

**Known blockers**: no verified general search endpoint, no on-device confirmation of SVG data URI page loading, no successful toolchain bundle yet, missing validated index metadata/icon, untested runtime networking.

Do **not** add this GitHub repository as a Paperback source: no valid repository index or compiled extension is published.

The top-level JS parser/tests are independent of this TypeScript source.
