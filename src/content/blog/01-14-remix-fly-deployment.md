---
title: "Remix: Fly.io deployment"
date: 2022-01-14
tags:
  - remix
  - react
---

A short tutorial on deploying Remix app on fly.io
Fly.io is one of the platforms that you can use to
run your applications on the internet
I am not going to cover fly.io or docker basics.
Fly uses docker containers to run the applications.
We will take a look at how we can develop and test dockerized remix app locally.


[Video](https://www.youtube.com/watch?v=-gjr8fJNCP4)


## Getting started

```bash
npx create-remix@latest
```

Run the app locally

```
cd remix-fly-ex
npm run dev
```

Next up deploy it to fly.io

```
flyctl deploy
```

visit `https://fly.io/apps/`

if everything goes fine your app will show up

## Remix docker development

Build

```bash
docker build -t ch4nd4n/remix-fly .
```

Run as docker contianer

```
docker run -it --rm -ePORT=8080 -p8080:8080 ch4nd4n/remix-fly
```

Change something in route and validate it
