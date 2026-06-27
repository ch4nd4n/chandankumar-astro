---
title: "Adding comments to a Gatsby Blog"
date: 2021-11-30
tags:
  - gatsby
---
One key feature of a blog is to allow readers to leave comments. One of the easiest way to do this
in Gatsby is to use [Disqus](https://disqus.com/). While one might be tempted to rollout a custom comments
system, it's not very straight forward to just drop it in Gatsby. Requires time, effort and may be capital.

Before you dive into the detail below, remember that you need Disqus account to roll this out.

#### 1. Add `gatsby-plugin-disqus`

```bash
npm install --save gatsby-plugin-disqus
```

#### 2. Update `gatsby-config.json`

```json:title=gatsby-config.js
{
  resolve: `gatsby-plugin-disqus`,
  options: {
    shortname: `your appname`,
  },
},
```

#### 3. Update the blog template to pull disqus comment widget

Official disqus documentation suggests using additional attributes, but it wasn't working. Following worked for me.

```jsx:title=post.tsx
  <Disqus config={{ identifier: post.slug, title: post.title }} />
```

Remember that the Disqus widget should be embedded in the page which renders that "blog" post. For me it was post.tsx
but in your case it might be different.

Refer to the Git diff that worked for me.

[Git diff](https://github.com/ch4nd4n/chandankumar.com/commit/2cda31ab71b66d73391565d8a6da233057bacff8?diff=unified) for ease of reading

```diff
diff --git a/gatsby-config.js b/gatsby-config.js
index b2f94be..776af59 100644
--- a/gatsby-config.js
+++ b/gatsby-config.js
@@ -73,6 +73,12 @@ module.exports = {
     },
     `gatsby-plugin-offline`,
     `gatsby-plugin-netlify`,
+    {
+      resolve: `gatsby-plugin-disqus`,
+      options: {
+        shortname: `chandankumar`,
+      },
+    },
     // `gatsby-plugin-webpack-bundle-analyser-v2`,
   ],
 };
diff --git a/package.json b/package.json
index 265066a..31cf494 100644
--- a/package.json
+++ b/package.json
@@ -18,6 +18,7 @@
   "dependencies": {
     "@lekoarts/gatsby-theme-minimal-blog": "^2.2.2",
     "gatsby": "^2.13.3",
+    "gatsby-plugin-disqus": "^1.2.3",
     "gatsby-plugin-google-analytics": "^2.1.4",
     "gatsby-plugin-manifest": "^2.2.3",
     "gatsby-plugin-netlify": "^2.1.3",
diff --git a/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx b/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx
index 1f63e43..f2f57c2 100755
--- a/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx
+++ b/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx
@@ -5,6 +5,7 @@ import React from "react";
+import { Disqus } from "gatsby-plugin-disqus";^M

 type PostProps = {
   data: {
@@ -71,6 +72,7 @@ const Post = ({ data: { post } }: PostProps) => (
     >
       <MDXRenderer>{post.body}</MDXRenderer>
     </section>
+    <Disqus />^M
   </Layout>
 );
```
