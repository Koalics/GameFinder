# GameFinder

GameFinder is a web application for searching and filtering video games using an external API.
The project was developed as part of a course and diploma project focused on modern web application development.

## Project Description

The application allows users to:

* search for video games by title;
* view detailed information about games;
* filter games by genres and platforms;
* sort search results;
* view ratings, release dates, and descriptions;
* navigate to game purchase pages.

The project uses the [RAWG API](https://rawg.io/apidocs) as the main data source.

## GitHub Pages

Live site (after the first successful deploy): [https://koalics.github.io/GameFinder/](https://koalics.github.io/GameFinder/)

1. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).
2. Push `main` (or run the workflow manually: **Actions → Deploy to GitHub Pages → Run workflow**).

The Vite `base` path is set to `/GameFinder/` for production builds so assets load correctly under `github.io/GameFinder/`.
