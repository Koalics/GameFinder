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

## Setup

```bash
npm install
npm run dev
```

Routes: `/` (catalog), `/game/:id` (game page, numeric RAWG id). Click a card or open e.g. `/game/3328` (The Witcher 3).

Icons: [Iconify](https://iconify.design/) for Vue (`@iconify/vue/offline`) with [MDI](https://pictogrammers.com/library/mdi/) and [Simple Icons](https://simpleicons.org/) (bundled, без запросов к CDN).
