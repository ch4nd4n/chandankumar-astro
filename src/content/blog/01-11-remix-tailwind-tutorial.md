---
title: "Remix: Tailwind CSS integration tutorial"
date: 2022-01-07
tags:
  - remix
  - react
---

Almost all the steps here are from official documentation on Remix Tailwind doc: https://remix.run/docs/en/v1/guides/styling#tailwind


[Video](https://www.youtube.com/watch?v=fLjRyNu7ab8)


To configure tailwind css we need to install the dependency and configure the layout
to include it. Using it within Remix app is dead easy. Note that this is not a
css-in-js solution and AFAIK, it does not matter much. There are pros and cons.

Briefly we need to do the following to get it working.

1. Install tailwind
2. Create tailwind config
3. Update package.json scripts
4. Create or update css file to use Tailwind CSS

## Steps

Install tailwind and relevant dependency

```
npm add -D concurrently tailwindcss postcss
```

Create and update tailwind config file

```sh
touch tailwind.config.js
```

```
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
```

Update `package.json` with necessary scripts to build CSS and start the dev server

```
    "build": "npm run build:css && remix build",
    "build:css": "tailwindcss -i ./styles/tailwind.css -o ./app/tailwind.css --minify",
    "dev": "concurrently \"npm run dev:css\" \"remix dev\"",
    "dev:css": "tailwindcss -i ./styles/tailwind.css -o ./app/tailwind.css --watch",
```

Create CSS file and update reference to tailwind

```
mkdir styles
touch styles/tailwind.css
```

Update CSS (adding components is optional)

```CSS:title=styles/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply bg-slate-50;
  }
}
```

Update `root.tsx` to include tailwind.css

```tsx:title=root.tsx
// ...

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
```

Refresh the page at this point to view Tailwind kick in

Style

```tsx:title=index.tsx
  <header className="bg-cyan-100">
    <div className="flex justify-between container mx-auto pt-5 pb-5">
      <h1 className="text-3xl">Firebase Authentication</h1>
      <nav className="">
        <FirebaseLogin />
      </nav>
    </div>
  </header>
```

Consider additing `app/tailwind.css` into `.gitignore` it's a generated file

Here on you can do your thing with Tailwind as you would with Tailwind
in general.
