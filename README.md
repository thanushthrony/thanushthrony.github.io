# thanushthrony.github.io

Personal portfolio site. Pure HTML/CSS/JS — no build step, no dependencies to install.

---

## Deploying to GitHub Pages

**1. Unzip this folder.** Everything inside it belongs at the *root* of your
repository — not inside a subfolder.

**2. Clear the old repo.** In `github.com/thanushthrony/thanushthrony.github.io`,
delete the existing files so old pages don't linger at their old URLs.

**3. Upload.** Add file -> Upload files, then drag these in **one single drag**:

```
index.html   404.html   favicon.svg   README.md   .nojekyll
assets/      blog/      projects/
```

Dragging them together preserves the folder structure. Uploading them one at a
time flattens everything and breaks every path on the site.

> `.nojekyll` is a hidden file. If your file manager doesn't show it, enable
> hidden files (macOS: `Cmd+Shift+.` in Finder). If it doesn't upload, the site
> still works — the file just tells GitHub to skip Jekyll processing.

**4. Commit**, then check Settings -> Pages -> Deploy from branch -> `main` -> `/ (root)`.

Live at **https://thanushthrony.github.io/** within a minute or two.

---

## What's here

```
index.html                       Home — hero, work, about, experience, skills, education, contact
404.html                         Styled not-found page
favicon.svg                      Browser tab icon
.nojekyll                        Tells GitHub Pages to serve files as-is

assets/
  style.css                      Shared stylesheet
  nn-diagram.js                  Interactive network diagram (home page)
  photo.jpeg                     Profile photo
  Thanush_Raj_CV.pdf             CV — linked from every page
  Thanush_Raj_Cover_Letter.pdf   Cover letter

blog/
  index.html                     Blog landing
  deep-learning-guide.html       16-chapter interactive guide

projects/
  index.html                     Projects landing
  recommender-demo.html          Live in-browser recommendation demo
  model-data.js                  Exported model weights for the demo
```

---

## Testing locally before you push

From inside this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. This serves the real files at real paths, so
what you see is exactly what GitHub Pages will serve.

---

## Updating later

- **New blog post** — add the HTML file to `blog/`, then add a card in `blog/index.html`.
- **CV or cover letter** — overwrite the PDFs in `assets/`, keeping the same filenames.
- **Demo model** — regenerate `projects/model-data.js` with your export script.

---

## Still to do

- **Create the `movie-recommender` repo.** The demo's "View code" button currently
  points at your GitHub profile because `github.com/thanushthrony/movie-recommender`
  returns 404. Once the repo exists, change that link in
  `projects/recommender-demo.html`. Don't upload `site*.db`, `instance/`, or
  `__pycache__/` — the .db files contain test user accounts.
- **Check the LinkedIn URL.** Every page links to
  `linkedin.com/in/thanush-raj/`. Confirm that's your actual profile slug.
