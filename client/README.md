# Client

This is a frontend application built using Svelte.

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Get started

Install the dependencies...

```bash
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the app running.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Project structure

Every component should be created under the `components/` directory. Subclasses of certain components should be put inside a folder named after the superclass, then name the component files accordingly.

An example of the folder structure:
```
.
├── node_modules/
├── public/
│   ├── index.html # Webpage entry file
│   ├── global.css # Global CSS file
│   ├── favicon.png
│   └── build/ # Directory containing the bundled files of other components
├── src/ # Source code of the project
│   ├── App.svelte # Entry svelte file
│   ├── main.ts # Component TS file for App.svelte
│   ├── pages/
│   │   ├── Home.svelte
│   │   └── Game.svelte
│   └── components/
│       ├── Card.svelte
│       └── Card/
│           └── SkillCard.svelte
│           └── ActionCard.svelte
└── index.html # can also be an 'index.md' with valid front matter
```
