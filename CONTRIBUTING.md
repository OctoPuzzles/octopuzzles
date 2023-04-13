# Contributing

Thanks a lot for wanting to contribute to octopuzzles.com.

## Getting started

After having cloned the repo down, you should follow these steps to have a local instance running.

First of all, you should copy the `.env.example` file to a `.env` file. The default values should be fine for getting up and running.

Next install dependencies with

```bash
npm i
```

We use postgres as database. To start a local database, you can use the docker compose. Just run

```bash
docker compose up -d
```

This might take a while to start.

Next to setup the database client run

```bash
npx prisma migrate dev
# and then
npx prisma generate
```

After that is done, you should build the packages with

```bash
npm run build
```

you can now start the website locally by running

```bash
npm run dev
```

This should get everything up and running, and you can view it by going to http://localhost:5173.

## Testing packages in isolation

It can become quite annoying to have to rebuild everything everytime you make a small change to a package, to then just test one thing in the website. Hence we have made `isolate` commands for some of the packages to develop them in isolation.

We have isolate for the sudoku-display, sudoku-game and sudoku-editor packages. To run one of them in isolation, just run `npm run isolate -- --filter=@octopuzzles/sudoku-display`.

## Database workflow

We use [Prisma](https://www.prisma.io) for interacting with the postgres database. If you are new to prisma, we recommend researching it in the website first.

The general flow is this:

To just get it setup, see the getting started step.

If you need to make a migration, you make the necessary changes in the `schema.prisma` file, then run `npm prisma migrate dev` and answer the prompt. This creates a migration file. After this you should run `npx prisma generate`.

However if you are just toying around with ideas in the database, a nicer flow is to use `npx prisma db push` and `npx prisma generate` and when you are finally ready to make a proper migration file, you then run `npx prisma migrate dev`.

## Testing

We use 2 kinds of tests: unit and end-to-end tests.

### Unit tests

We use [vitest](https://vitest.dev/) for unit tests. Unit tests should be defined [in-source](https://vitest.dev/guide/in-source.html). You can see existing examples of this in the utils folder. If the tests become too big, they should be moved out to a separate file. All test files should b follow the naming convention `<filename>.test.ts`.

To run unit tests, run

```bash
npm run test:unit
```

### E2E tests

We use [playwright](https://playwright.dev/) for e2e testing. All the e2e test files should be located in the `tests/` folder in the repo root. You can see the other e2e test files for how to create those. To run e2e tests, run

```bash
npm run test:e2e
```

## General considerations

### Icons

We use [phosphor icons](https://github.com/haruaki07/phosphor-svelte) for icons. Icon packages are quite big, and to mitigate slow dev cycles with building the icon package, we use tree splitting. To use an icon, say the `Alien` icon, you should import it as

```typescript
import Alien from 'phosphor-svelte/lib/Alien/Alien.svelte';
```

and in the `phosphor-svelte.d.ts` file, you should add the line

```typescript
declare module 'phosphor-svelte/lib/Alien/Alien.svelte';
```

if it does not already exist.
