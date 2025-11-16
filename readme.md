# TBJ — Static News Site

Files: index.html, post.html, admin.html, style.css, script.js, posts.json

1. Create a GitHub repo (public) and enable GitHub Pages from the branch `gh-pages` or `main`.
2. Put these files in the repo root and push. Open the Pages URL.
3. Edit `posts.json` directly in the repo (or use Admin -> Download posts.json and upload) so that all visitors see the same news.
4. Admin page stores changes in the browser by default. To commit automatically, create a GitHub Personal Access Token with `repo` scope and add it to Admin -> GitHub token (be careful with secrets).

Security notes: This project is intentionally simple and static. For production, use a proper backend (Firebase, Supabase, or a server) to store images/files and comments.