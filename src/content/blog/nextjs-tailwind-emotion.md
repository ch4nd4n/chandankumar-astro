---
title: "Styling React/Next.js using tailwind"
date: 2021-11-24
tags:
  - nodejs
  - nextjs
---

Quickest way to setup Next.js with Tailwinds CSS is to use the official nextjs example.

> 2021 is nearing end and my preferred way to build react app is Next.js with Tailwind.css

```sh
yarn create next-app --example with-tailwindcss-emotion my-app
cd my-app
yarn dev
```

That's it. The dev server should be accessible at http://localhost:3000

As of Nov 2021, you may get following error(in the past above three lines would set you up).

```log
error - ./pages/_app.js
TypeError: Cannot read property 'theme' of undefined
```

To solve this issue I had to make couple of changes.

1. Downgrade tailwindcss to 2.1.4 in `package.json`
2. comment out `mode jit` in tailwinds.config.js

With above changes done, I had to

1. delete `node_modules` and `.next`
2. install dependency

After making above two changes

```sh
rm -rf node_modules
rm -rf .next
yarn
yarn dev
```

The issue is described at https://github.com/vercel/next.js/issues/26337 kind of solved as well.

Refer to the patch below

```diff
diff --git a/package.json b/package.json
index 0c9a988..5f6f08f 100644
--- a/package.json
+++ b/package.json
@@ -18,7 +18,7 @@
     "autoprefixer": "^10.2.6",
     "next": "latest",
     "postcss": "^8.3.5",
-    "tailwindcss": "^2.2.4",
+    "tailwindcss": "2.1.4",
     "xwind": "0.8.0"
   }
 }
diff --git a/tailwind.config.js b/tailwind.config.js
index d088de6..816a535 100644
--- a/tailwind.config.js
+++ b/tailwind.config.js
@@ -1,7 +1,7 @@
 const colors = require('tailwindcss/colors')

 module.exports = {
-  mode: 'jit',
+  // mode: 'jit',
   purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
   darkMode: 'class',
   theme: {
```
