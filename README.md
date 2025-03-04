# CTO site

CTO Site for a LearnDirect assignment.
The task was to create a website for a fictional city called Centrala, specifically the "Centrala Trust for Ornithology" (CTO).

## Features

- [x] Landing page, with a navigation bar linking to
  - [x] A user registration page (invite code required!)
  - [x] A user log-in page
  - [x] A page which displays all user posts, with edit and delete buttons for the logged in author. The "Create post" is a modal in this page.
  - [ ] Pagination (was not required)
- [x] Created a working backend, with database, using Prisma and Postgres.
- [x] Working authentication, using sessions and cookies.
- [x] Evaluated the security of the site, and added some basic security measures.
- [x] File upload, although not to local storage, but to Cloudflare's CDN instead.
- [x] Deletion of posts, with image deletion from CDN for privacy.

## Running dev build

Install the dependencies first using npm:

```bash
npm install
```

Make sure you are running a postgres server on your local machine. I recommend using Docker.
Once you are running a postgres server, run the following command to create the database:

```bash
npx prisma migrate dev
```

Then to finally run the dev build:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your run:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Running production build

Build the app and start the server with

```bash
node build
```

Don't forget to set the `DATABASE_URL` environment variable to the url of your database and run the migrations with `npx prisma migrate deploy` before running the production build.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
