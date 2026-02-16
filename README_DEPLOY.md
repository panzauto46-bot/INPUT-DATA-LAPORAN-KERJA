# Deployment Instructions

This project is configured for deployment on Vercel using PHP CodeIgniter 4 and the `vercel-php` runtime.

## Prerequisites

1. A GitHub account.
2. A Vercel account.

## Steps to Deploy

1. **Push to GitHub**:
   - Initialize a git repository if not already done:
     ```bash
     git init
     git add .
     git commit -m "Initial commit for Vercel deployment"
     ```
   - Create a new repository on GitHub.
   - Link and push:
     ```bash
     git remote add origin <your-github-repo-url>
     git branch -M main
     git push -u origin main
     ```

2. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click "Add New..." -> "Project".
   - Import the GitHub repository you just created.
   - **Framework Preset**: Select "Other".
   - **Build Command**: Leave empty (or default).
   - **Output Directory**: Leave empty (default `public` is handled by `vercel.json` routing usually, but for `vercel-php` the root is fine).
   - Click "Deploy".

## Notes

- **Database**: This demo uses LocalStorage (browser) for data persistence because Vercel Serverless Functions are stateless and do not support a persistent SQLite database nicely without external storage.
- **PHP Version**: Configured to use PHP 8.2 compatible runtime.
- **Writable Path**: The application is configured to use the temporary directory `/tmp` for writable paths (logs, cache) when running on Vercel, as the filesystem is read-only.
- **Environment**: logic in `app/Config/Paths.php` automatically detects the Vercel environment.
