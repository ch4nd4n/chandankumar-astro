---
title: "Remix Run Tutorial: Mongodb connection with Mongoose"
date: 2021-12-17
tags:
  - reactjs
  - mongodb
---

> Refer to newer post on this at [/blog/remix-mongodb-typescript-tutorial](/blog/remix-mongodb-typescript-tutorial)

This is a short tutorial on integrating remix.run with Mongodb using the mongoose library.
Remix is a full-stack web framework. This is an intermediate level tutorial and one must know about Reactjs and MongoDB at least.


[Video](https://www.youtube.com/watch?v=-tnRacd7Xcw)


### Steps

1. Create remix project
2. Code a Mongoose Model
3. Initialize mongodb driver
4. Fetch and render the data

#### create a Remix project

Source code for this example is at https://github.com/ch4nd4n/practice/tree/remix-run/remix-mongoose

```bash
# Create remix project
npx create-remix@latest
```

Fill out the details, I used Typescript and remix server.

For this tutorial, we don't need routes and styles, so knock it off.

```bash
rm -rf routes
rm -rf styles
```

The next step is to create a Mongoose model to fetch todos collection from MongoDB.

#### Mongoose Model

```tsx:title=/models/Todo.tsx
const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
});
const model = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
export default model;
```

#### Update root.tsx

In `root.tsx` we connect to Mongodb using `mongoose.connect` method and use remix `loader`
to use a mongoose model. The model populates the data before the component gets rendered on the browser.

```tsx:root.tsx

mongoose.connect(
  "mongodb://root:example@localhost:27017/chandan_vercel_dev?authSource=admin",
  (error) => {
    if (!error) return console.info("Mongo connected");
    console.error(error);
  }
);
export let loader: any = async () => {
  return await Todo.find({});
};

const TodoList = (todos: any) => {
  return (
    <ul>
      {todos.map((todo: any) => (
        <li>{todo.title}</li>
      ))}
    </ul>
  );
};
```

## Next up

You can visit [remix.run](http://remix.run) for the official documentation. I intend to explore web socket connection with Remix.

Similar article:

1. [Remix Tutorial: Firebase Authentication](/blog/remix-firebase-authentication-tutorial)
