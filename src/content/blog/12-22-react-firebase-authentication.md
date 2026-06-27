---
title: "React Tutorial: Adding comments to Gatsbyjs blog firebase authentication"
date: 2021-12-22
tags:
  - react
  - gatsby
  - firebase
---

Tutorial on integrating firebase on client side, particularly Firestore.
I built a comment system for Gatsby Blog powered by
Firebase/Firestore. I am using for Gatsby, although it can be tweaked
for any other React application like nextjs or Remix.

Walkthrough video of final implementation


[Video](https://www.youtube.com/watch?v=8zM9zvQ28c4)


Firebase Comment is integrated with this blog and if you would like
to see it in action, before reading through, check out the [comments](#comments)

Down below you can find previous video on hands-on coding.

Source Code: https://github.com/ch4nd4n/chandankumar.com/tree/master/src/components/comment

#### Quick recap

- Use Firebase authentication to authenticate and authorize the users to comment on the blog
- Use Firestore to persist blog comments
- Use Firebase Emulator to have end to end development setup locally
  - so that we don't have to invoke production firebase.
  - This makes development a tick faster as it cuts down external network requests.
  - Not worried about messing up the production data.
  - Firebase emulator makes it easier to develop and test out the implementation.

Grunt of the work to interact with Firebase is done in `firebase-helper.ts`
It has a method to add comment, fetch comments, login user using google
authentication, delete a comment and update user profile.

ACL is taken care by Firestore rules. A logged in user can comment and
view everyone's comment but can't edit other person's comment or delete it.
A quick example is something like

`allow delete: if resource.data.authorId == request.auth.uid;`

Logic to add comment is quite straight forward

```ts:title=firebase-helper.ts
export function addComment(slug, user, comment) {
  const newComment = doc(collection(db, "blogComments"));
  return setDoc(
    newComment,
    {
      slug,
      comment,
      authorId: user.uid,
      timestamp: serverTimestamp(),
    },
    { merge: false }
  );
}

// ACL is taken care by Firebase Rules
export function deleteComment(commentId) {
  return deleteDoc(doc(db, "blogComments", commentId));
}
```

To get comments(`getComments`) from firestore, we query the collection for specific
slug and then we populate author detail. I have kept the model very simple
and haven't nested it.

Logic to update logged in user profile(`updateProfile`) is straight forward as well.
Use `setDoc` to update `userProfiles` for given userid, `uid` is what firebase
authentication gives.

`setDoc(doc(db, "userProfiles", uid), { uid, photoURL, displayName })`

```ts:title=firebase-helper.ts
export async function getComments(slug) {
  const commentsCol = query(
    collection(db, "blogComments"),
    where("slug", "==", slug),
    orderBy("timestamp")
  );
  const commentsSnap = await getDocs(commentsCol);
  if (commentsSnap.empty) {
    return [];
  }
  const commentList = commentsSnap.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  }) as CommentType[];
  if (!commentList.length) return [];
  const profileIds = commentList.map((comment) => comment.authorId);
  const userMap = await getUserProfiles(profileIds);
  commentList.forEach((value) => {
    value.authorName = userMap[value.authorId]
      ? userMap[value.authorId].displayName
      : "UNKNOWN";
    value.authorPhoto = userMap[value.authorId]
      ? userMap[value.authorId].photoURL
      : null;
  });

  return commentList;
}

async function getUserProfiles(ids: string[]) {
  const userProfiles = collection(db, "userProfiles");
  const q = query(userProfiles, where("uid", "in", ids));
  const reducer = (prev, cur) => {
    prev[cur.uid] = cur;
    return prev;
  };
  const userList = (await getDocs(q)).docs.map((user) => user.data());
  return userList.reduce(reducer, {});
}

export async function updateProfile(user, displayName) {
  const { uid, photoURL } = user;
  const docSnap = await getDoc(doc(db, "userProfiles", uid));
  if (docSnap.exists()) {
    await setDoc(doc(db, "userProfiles", uid), { uid, photoURL, displayName });
  }
}
```

Refer to `firestore.rules` that I am using for local development

```firestore.rules
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /blogComments/{multiSegment=**} {
        allow read;
        allow create: if request.auth != null;
        allow delete: if resource.data.authorId == request.auth.uid;
    }
    match /userProfiles/{multiSegment=**} {
        allow read;
        allow create: if request.auth != null;
        allow update: if request.auth.uid == resource.data.uid;
    }
  }
}
```

#### Local Emulator Setup

Setup Emulator: Firebase emulator makes development easy. It's one time effort setting it up.

```
npm install -g firebase-tools
```

Choose a folder where you would want to initialize firebase emulator.
This process would create emulator related files, so be wary of where
you init the emulator. When you initialize the emulator, do remember to
enable firestore and authentication.

```
firebase init emulators
```

start the emulator

If you don't care about persisting emualtor data between restart

```bash
firebase emulators:start
```

or if you want to persist the data use the below

```bash
firebase emulators:start --import=./.emulator-data --export-on-exit
```

## Earlier post

1. React Firestore(Firebase) integration
2. React Firebase Authentication integration
3. Gatsby blog comments as an end product.


[Video](https://www.youtube.com/watch?v=aJXzv9n5JI0)


## Getting started

There are solutions like Disqus, which I have written about in the past,
but I did not realize at the time that it comes with its issues of
targetted ads, user tracking et al.

I am wrapping comments functionality in a React component
`CommentSection` which has 3 sub-components. Oh, and before I forget
I highly recommend using Firebase Emulator instead of using
production Firebase.

1. Comments: List of comments
2. Login/Authentication (and logout)
3. Add comment

A grunt of the logic is in `CommentSection`, and the rest of the
components are more or less pure components.

So we begin with getting a reference to Firestore and initialize firebase with the necessary configuration.

```tsx
db = getFirestore(app);
app = initializeApp(firebaseConfig);
```

### Listing comments

The next step is to write a function that fetches comments, so
if comments are in a collection called `blogPosts` (I know, not
the best collection name to store comments), We query it like

```tsx
const commentsCol = query(
  collection(db, "blogPosts"),
  where("slug", "==", slug)
);
```

Iterate over this Firestore collection and convert it list of comments like below.

> Remember to update Firestore rule to allow read and write

### Configure Firestore rule

Firestore rules are required to prevent unauthorized access or abuse

```
match /blogPosts/{multiSegment=**} {
    allow read;
    allow write: if request.auth != null;
}
```

Why firestore rules?

> With Cloud Firestore Security Rules, you can focus on building
> a great user experience without having to manage infrastructure
> or write server-side authentication and authorization code.
> https://firebase.google.com/docs/firestore/security/get-started

```tsx
const commentSnapshot = await getDocs(commentsCol);
const commentList = commentSnapshot.docs.map((doc) => {
  return { ...doc.data(), id: doc.id };
});
```

We add a component to render comments which is

```tsx
const Comment = (prop) => {
  const { getComments, comments } = prop;

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
        ))}
      </ul>
    </div>
  );
};
```

and the parent component will pass the comments reference

```tsx
```

### Firebase Authentication

For authentication, I am using a rudimentary form that lets a user enter
username and password

We get firebase auth reference in the parent component and pass it to
the child component

```tsx:title=comment-section.tsx
const auth = getAuth();
```

When the user clicks the "login" button we use `signInWithEmailAndPassword` from firebase
to authenticate the user. There are a lot of things to be cleaned up like

- to handle errors and exceptions
- cleaning up the UI.

```tsx:title=login.tsx
const doFirebaseLogin = (event: React.FormEvent) => {
  event.preventDefault();
  signInWithEmailAndPassword(auth, email, password);
};
```

### Add Comment

In the parent component add a function that writes to Firestore and
pass on the function to `AddComment` component.

```tsx:title=comment-section.tsx
async function addComment(comment) {
  const newComment = doc(collection(db, "/blogPosts"));
  setDoc(newComment, { slug, comment }, { merge: false });
}
```

and pass on the reference to AddComment

```tsx:title=comment-section.tsx
```
