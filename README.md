# Thanush Raj — portfolio site

Minimal editorial portfolio (Medium-style), built for GitHub Pages. Pure HTML/CSS/JS, no build step.

## Fix your current GitHub setup (do this once)

Your repo is currently named `thanush-raj.github.io` under the account `thanushthrony`,
which is why the URL came out as `thanushthrony.github.io/thanush-raj.github.io/`.

1. **Rename the repo:** repo → Settings → General → Repository name →
   change to exactly `thanushthrony.github.io` → Rename.
   The site then lives at the clean URL **https://thanushthrony.github.io/**
2. **Delete the stray files** from the earlier flat upload: in the repo,
   open each of `recommender-demo.html` and (old) `index.html`, `README.md`,
   `CODE_REVIEW.md` → trash icon → commit. (Or delete all and start clean.)
3. **Upload this folder's contents** keeping the structure: drag the five
   folders (`assets`, `blog`, `projects`, `notes`, `opensource`) together with
   `index.html` and `README.md` into GitHub's upload area in ONE drag —
   folders upload with their structure intact.
4. Settings → Pages → Deploy from branch → `main` → `/ (root)` (should already be set).

## Site structure

```
├── index.html                      Home
├── assets/                         style.css + CV + cover letter PDFs
├── blog/                           Blog landing + posts
├── projects/                       Projects landing + live demo + model-data.js
├── notes/                          Paper reading notes
├── opensource/                     Open source journey log
├── code-repo-starter/              ← NOT part of the site: files for your CODE repo (see below)
├── export_model_for_web.py         Script that generated model-data.js
└── CODE_REVIEW.md                  Review of the thesis codebase (optional to publish)
```

## Publish your project code (so "View code" links work)

The site links to **https://github.com/thanushthrony/movie-recommender** — create it:

1. New repository → name it exactly `movie-recommender` → Public.
2. From your local thesis folder (`fresh_flask copy`), upload: `app.py`,
   `recsysNN_utils.py`, `extras.py`, `models.py`, `templates/`, `static/`,
   `Data/`, `new_model.h5`.
3. Add the three files from `code-repo-starter/` (README.md, requirements.txt, .gitignore),
   plus `export_model_for_web.py` from this folder.
4. **Do NOT upload:** `site.db`, `site1.db`, `site2.db`, `site3.db`, `instance/`,
   `__pycache__/`, `.DS_Store` — the .db files contain user accounts from your testing.

If you'd rather name the repo something else, tell me and I'll update the site links.

## Updating content

- **New blog post:** copy a post file into `blog/`, edit, add a `.post-row` card in `blog/index.html`.
- **New paper note:** duplicate a `.note-card` block in `notes/index.html`.
- **Open source log entry:** duplicate a `.log-item` in `opensource/index.html` (class `done` when finished).
- **CV / cover letter:** overwrite the PDFs in `assets/` keeping the same filenames.
- **Demo model:** re-run `export_model_for_web.py` to regenerate `projects/model-data.js`.
