---
title: "Tailwind CSS tutorial getting started"
date: 2021-12-13
tags:
  - css
---

Tailwind is a utility-first CSS library. This articile is about using tailwind CSS with just
HTML and CSS file and doesn't cover JavaScript toolkit/library/framework like React, Nextjs
Angular, Vue etc.


[Video](https://www.youtube.com/watch?v=nnAcUn2pbGM)


Above [youtube video](https://youtu.be/nnAcUn2pbGM) is hands on coding in action.

## Getting started

To use Tailwind CSS with HTML we do the following.

1. Install Tailwind CSS
2. Configure HTML
3. Add Tailwind directives to CSS
4. Use tailwind CLI to build
5. Sprinkle Tailwind classes

Source for the steps below is available at - https://github.com/ch4nd4n/practice/tree/tailwind

#### 1. Install and init

This tutorial uses `Node.js`, you will need `Node.js` to run the instructions,
but you don't need in depth understanding about Node.js

Use `npm` to initialize a `Node.js` app and install tailwind as dev dependency.

```bash
npm init -y
npm install -D tailwindcss # Dev dependency
```

Next we initialize tailwindcss and create `tailwind.config.js` using `npx`

```bash
npx tailwindcss init
mkdir src
```

#### 2. Configure tailwind

Open `tailwind.config.js` in editor and update `content`.

```javascript:file=tailwind.config.js
content: ["./src/**/*.{html,js}"]
```

### 3. Create CSS

Create a CSS file to include it in the HTML file

```bash
touch src/input.css
```

Add tailwind directive to the CSS file

```css:title=input.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 4. Start Tailwind CLI build

```bash
mkdir dist
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

#### 5. Consume it

Edit index HTML file to include the

```html:title=index.html
<link href="../dist/output.css" rel="stylesheet">
```

Start using Tailwind CSS classes

```html:title=index.html
<main class="bg-slate-100 pt-5 pb-5">
  <div class="container m-auto">
    <!-- Hero Card-->
    <div class="ui-hero-card border-2 rounded-sm p-4">
      <h2 class="text-3xl">Hero Section</h2>
      <p>This paragraph needs a photo section</p>
    </div>
  </div>
</main>
```

Open index HTML in browser and view your changes.

Happy hacking.
