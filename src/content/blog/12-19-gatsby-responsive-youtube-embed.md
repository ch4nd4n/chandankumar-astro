---
title: "Gatsby Tutorial: Embed responsive youtube video"
date: 2021-12-19
tags:
  - reactjs
  - gatsby
---

A short (video) tutorial on how to embed a responsive Youtube video in Gatsby blog using theme-ui.
This blog is based on Lekoarts, which uses theme-ui library for styling (https://theme-ui.com/).
To resolve this I used `Card` Component with fixed max width and embed youtube iframe
inside. It's a quick hack and it's not bad if not the most elegant one.


[Video](https://www.youtube.com/watch?v=gt0Z_yG96Is)


Refer to the code change below.

```tsx
<iframe
  width="50%"
  height="300px"
  src="https://www.youtube.com/embed/-tnRacd7Xcw"
  frameborder="0"
  allow="accelerometer; picture-in-picture"
  allowfullscreen
></iframe>
```

Changed above code to code below.

```tsx

[Video](https://www.youtube.com/watch?v=-tnRacd7Xcw)

```

At some point of time I would like to use `front-matter`
instead of repeating this over and over again in every video.
