---
title: "Gatsby blog comments using firebase tutorial - part 1"
date: 2021-12-15
tags:
  - gatsby
  - firebase
---

Tutorial on integrating firebase on client side, particularly Firestore.

1. This is part 1 that covers the following
   - install firebase in existing Gatsby project
   - configure firestore connection
2. Use local firebase emulator


[Video](https://www.youtube.com/watch?v=OSGj1hB6cCc)

To watch this on youtube: https://youtu.be/OSGj1hB6cCc

I hope to follow up with

1. Firebase auth
2. Allow users to actually comment.

> This post is not a complete solution on firestore backed commenting system.

Following steps are required to get this working

### Install Firebase to the project

```
yarn add firebase
```

### Add a new comment component

Add `comment.tsx` react component that fetches data from firestore.
For react component to interact with firestore we need to initialize firebase and setup firestore
configuration.

```tsx
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

For local development instead of talking to production firestore we run local emulator. which is accessible at 8080

```tsx
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
```

### Start local firebase emulator

Using firebase emulator makes development process faster in a long run. To use firebase emulator make sure that you have firebase cli
installed.

```bash
firebase emulators:start
```

Once done open http://localhost:4000/ add collection blogPosts

### Update comment component to fetch data from firestore

Update comments.tsx to fetch data from firestore

```tsx:title=comments.tsx
const commentsCol = query(
  collection(db, "blogPosts"),
  where("slug", "==", slug)
);
const commentSnapshot = await getDocs(commentsCol);
const commentList = commentSnapshot.docs.map((doc) => doc.data()) as Comment[];
```

Once you have comments from firestore we set it in state and render it.

```tsx
setComments(commentList);
```

To render it

```tsx
<ul>
  {comments.map((comment) => (
    <li key={comment.comment}>{comment.comment}</li>
  ))}
</ul>
```

The entire change set would be something like below

```diff
diff --git a/package.json b/package.json
index 29f4857..6b19348 100644
--- a/package.json
+++ b/package.json
@@ -17,6 +17,7 @@
   },
   "dependencies": {
     "@lekoarts/gatsby-theme-minimal-blog": "^2.2.2",
+    "firebase": "^9.6.1",
     "gatsby": "^2.13.3",
     "gatsby-plugin-disqus": "^1.2.3",
     "gatsby-plugin-google-analytics": "^2.1.4",
diff --git a/src/@lekoarts/gatsby-theme-minimal-blog/components/comments.tsx b/src/@lekoarts/gatsby-theme-minimal-blog/components/comments.tsx
index e69de29..0b775f9 100644
--- a/src/@lekoarts/gatsby-theme-minimal-blog/components/comments.tsx
+++ b/src/@lekoarts/gatsby-theme-minimal-blog/components/comments.tsx
@@ -0,0 +1,66 @@
+import React from "react";
+
+import { initializeApp } from "firebase/app";
+import {
+  collection,
+  connectFirestoreEmulator,
+  getDocs,
+  getFirestore,
+  query,
+  where,
+} from "firebase/firestore/lite";
+
+import { useEffect } from "react";
+import { useState } from "react";
+const firebaseConfig = {
+  projectId: "chandankumar-com",
+};
+
+type CommentProp = {
+  slug: string;
+};
+
+type Comment = {
+  slug: string;
+  comment: string;
+};
+
+const Comment = (prop: CommentProp) => {
+  const { slug } = prop;
+  const [comments, setComments] = useState<Comment[]>(null);
+
+  async function getComments() {
+    const app = initializeApp(firebaseConfig);
+    const db = getFirestore(app);
+    if (process.env.NODE_ENV === "development") {
+      connectFirestoreEmulator(db, "localhost", 8080);
+    }
+    const commentsCol = query(
+      collection(db, "blogPosts"),
+      where("slug", "==", slug)
+    );
+    const commentSnapshot = await getDocs(commentsCol);
+    const commentList = commentSnapshot.docs.map((doc) =>
+      doc.data()
+    ) as Comment[];
+    setComments(commentList);
+  }
+
+  useEffect(() => {
+    getComments();
+  }, []);
+  return (
+    <div>
+      <h3>Comments</h3>
+      {comments && (
+        <ul>
+          {comments.map((comment) => (
+            <li key={comment.comment}>{comment.comment}</li>
+          ))}
+        </ul>
+      )}
+    </div>
+  );
+};
+
+export default Comment;
diff --git a/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx b/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx
index b4efeee..7bc706e 100755
--- a/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx
+++ b/src/@lekoarts/gatsby-theme-minimal-blog/components/post.tsx
@@ -5,7 +5,7 @@ import React from "react";
+import Comment from "./comments";

 type PostProps = {
   data: {
@@ -71,6 +71,7 @@ const Post = ({ data: { post } }: PostProps) => (
       }}
     >
       <MDXRenderer>{post.body}</MDXRenderer>
+      <Comment slug={post.slug} />
     </section>
     {/* <Disqus config={{ identifier: post.slug, title: post.title }} /> */}
   </Layout>

```
