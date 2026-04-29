# Koobiq React + Next.js

A `create-next-app` example for TypeScript App Router projects with Koobiq React on Next.js 16.

## Prerequisites

- You should have **Node.js** installed at a version equal to or above **`v20.9.0`**.

## Usage

Run one of the following commands in the directory where you want to create the app:

```bash
npx create-next-app@latest --example "https://github.com/koobiq/react-components/tree/main/templates/nextjs/template" my-app
```

```bash
pnpm create next-app --example "https://github.com/koobiq/react-components/tree/main/templates/nextjs/template" my-app
```

This will create the folder `my-app` and initialize a new project inside.
The project will be based on [Next.js](https://github.com/vercel/next.js/)
and will use [Koobiq React](https://react.koobiq.io/) component library.

## Development

Run `npm run dev` to start the development build.
The app should automatically open in your browser on [http://localhost:3000](http://localhost:3000).

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

To create a production build of your app, run `npm run build`. Next.js will create an optimized production build of your application
inside the `.next/` folder of your project. It will also provide you with additional details on what to do with them.
