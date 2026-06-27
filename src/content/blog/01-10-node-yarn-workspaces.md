---
title: "Yarn workspace tutorial, introduction and cheatsheet"
date: 2022-01-06
tags:
  - nodejs
---

> Your dependencies can be linked together, which means that your
> workspaces can depend on one another while always using the most
> up-to-date code available. This is also a better mechanism than
> yarn link since it only affects your workspace tree rather than your whole system.
>
> It allows you to setup multiple packages in such a way that you only need to run yarn
> install once to install all of them in a single pass.
>
> \- [Yarn Workspace documentation](https://classic.yarnpkg.com/en/docs/workspaces/)

I couldn't have phrased it better than the official documentation

Introduction video and hands on example https://youtu.be/C5j7TyzDfgo


[Video](https://www.youtube.com/watch?v=C5j7TyzDfgo)


### Introduction to yarn workspace

Workspace facilitates using monorepo, there by allowing
easy linking of dependency during development time.

I hope this tutorial serves as concise tutorial on yarn workspace as well
as yarn cheatsheet.

### Why do we need yarn workspace?

Let's say you are building an application with a Web service
(REST or something) and Web UI (React etc.). If both Web Service
and Web UI have some common code, like
email, phone validation, validating token etc. then
we can abstract it as a library, but maintaining it across as
a separate project is a development nightmare. Yarn workspace
eases this out but allowing you to manage all the code in a
single code repo. Let's see how.

### How to yarn workspace: Getting started - Step 1

To start off with a simple example, we create a utility
project which has some util function like email validation,
and getting current date. If we want to use this common
utility across frontend as well as backend. We can abstract
it as a separate library.

For this demo, in root `example` folder
we add `myutil`, `web` and `api` as sub-folder

```bash
mkdir -p example/{myutil,api}
cd example
```

Next up initialize nodejs project.

```bash
yarn init -y
```

Update `package.json` with following

```json:title=package.json
"private": true,
"workspaces": ["myutil", "api", "web"]
```

Next up run `yarn init -y` in `myutil` and `api`

this should create `package.json` in both the folders

At this point of time `tree` should look like

```bash
.
├── api
│   └── package.json
├── package.json
├── myutil
│   ├── index.js
│   └── package.json
└── yarn.lock
```

Follow this up by creating a simple function to
validate email in `myutil`, since this is a utility
project that we want to share across multiple app.

```javascript:title=myutil/index.js
const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

function validateEmail(email) {
  return emailRegex.test(email);
}

exports.validateEmail = validateEmail;

```

Since we would use `validateEmail` in `api` let's add
this as a dependency in `api`

```bash
yarn workspace api add myutil@1.0.0 # yarn add myutil@1.0.0
```

This would update `api/package.json` with `myutil` as a dependency

```diff
--- a/api/package.json
+++ b/api/package.json
@@ -2,5 +2,8 @@
   "name": "api",
   "version": "1.0.0",
   "main": "index.js",
-  "license": "MIT"
+  "license": "MIT",
+  "dependencies": {
+    "myutil": "1.0.0"
+  }
 }
```

Now let's add express as a dependency to api

```bash
yarn workspace api add express
```

Add `api/index.js` and build a simple Express app

```js:title=api/index.js
const express = require("express");
const app = express();

const { validateEmail } = require("myutil");

const port = process.env.PORT || 3000;

app.get("/validateEmail", (req, res) => {
  const { email } = req.query;
  res.json({ valid: validateEmail(email) });
});

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
```

Start API server

```bash
yarn workspace api start
```

This finishes basic workspace setup but let's take
it a step further by creating a react front end.

in `packages` folder

```bash
yarn create react-app web
```

```js:title=web/src/App.js


function App() {
  const [valid, setValid] = useState(false);
  return (
    <div className="App">
      <header>
        <h1>Demo App</h1>
      </header>
      <main>
        <hr />
        <h3>Enter Email</h3>
        <input
          placeholder="enter email"
          onChange={(e) => {
            setValid(validateEmail(e.currentTarget.value));
          }}
        />
        {valid && <h3>Email is valid</h3>}
      </main>
    </div>
  );
}

export default App;
```

#### Step 2: Yarn workspace best practice

If possible have projects in a single folder and glob them.
For example use `packages/*`

So have projects in `packages` folder

```bash
mkdir -p example_2/packages/{myutil,api}
```

and configure root `package.json` as below

```json
"workspaces": ["packages/*"],
```

add `api/index.js` and `myutil/index.js`

```bash
mkdir -p packages/mycomponents
cd packages/mycomponents
yarn init -y
yarn workspace mycomponents add -D react typescript @types/react
```

#### Additional links

- Yarn workspace documentation - https://classic.yarnpkg.com/en/docs/cli/workspace
