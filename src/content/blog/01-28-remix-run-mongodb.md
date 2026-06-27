---
title: "Remix Run Tutorial: Mongodb connection with Mongoose and Typegoose"
date: 2022-01-28
tags:
  - reactjs
  - mongodb
---

We will use Typegoose to create MongoDB models instead of using Mongoose directly.

"Typegoose is a "wrapper" for easily writing Mongoose models with TypeScript."

So I had written a previous blog post which was very rudimentary way
of fetching MongoDB data into Remix app. This tutorial is an upgrade
on that. We would use model and service to fetch the data and render
it in the controller(I am referring Remix routes as controller).

### Steps

- Establish mongodb connection on server start
- Create a Typegoose Model
- Render data in a Remix Route.

## Getting started

When remix server starts up we can connect to database. This
allows us to use connection pool for a faster data pull from
MongoDB. This can be used effectively if you are using something
like Remix default server or Express Adapter.

To install Typegoose

```sh
yarn add @typegoose/typegoose # install typegoose itself
yarn add mongoose # install peer-dependency mongoose
```

Establish connection with Mongodb in `entry.server.tsx`

```tsx:title=entry.server.tsx
// Establish MongoDB connection once server boots up
connect(process.env.MONGODB_URL as string)
  .then(() => console.log({ mongoDb: "Connected" }))
  .catch((err) => {
    console.log({ mongoErr: err });
  });
```

For above to work make sure that you have MONGODB_URL set in enviornment.

```env:title=.env
MONGODB_URL=mongodb://SOME_USER:PASSWORD@localhost/menu?authSource=admin
```

To load `.env` values in development mode you would want to load it first.

So to do that I have updated `package.json` with the following entry in
`scripts`

```json:title=package.json
"dev": "node -r dotenv/config node_modules/.bin/remix dev",
```

In this example I am going to list out food menu items collection from
mongodb. So will create a Typegoose model for it.

```ts:title=app/server/models/menu-item.ts

/**
 * Typegoose Model representing MenuItem
 */
export default class MenuItem {
  _id?: mongoose.Types.ObjectId;
  @prop()
  public name!: string;

  // type is optional here
  @prop({ type: Number })
  public price?: number;
}
```

My `menuitems` collection looks something like this

```json
[
  {
    _id: ObjectId("61f389e8999bc8d7b954bb52"),
    name: 'Pizza',
    price: 10000,
    __v: 0
  },
  {
    _id: ObjectId("61f389fd999bc8d7b954bb55"),
    name: 'Bread',
    price: 10000,
    __v: 0
  }
]
```

While we can use MenuItem model directly in the remix route, I prefer
to use a service layer so that my routes are free from logic to fetch
data. Menu Service would look something like below

```ts:title=menu-item-service.ts

const MenuItemModel = getModelForClass(MenuItem);
/**
 * Get Menu Items
 * @returns List of MenuItems
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const items = await MenuItemModel.find();
  return items ? items : [];
}
```

Finally to menu route to can now use this service method to populate
menu items

```tsx:title=routes/menus/index.tsx
export let loader: LoaderFunction = async (): Promise<MenuItem[]> => {
  return await getMenuItems();
};

export default function TodosIndex() {
  let menuItems = useLoaderData();
  return (
    <div>
      <div className="container mx-auto max-w-sm">
        <h1 className="text-xl">Menu Items</h1>
        <table>
          <thead>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
          </thead>
          <tbody>
            {menuItems &&
              menuItems.map((t: MenuItem, index: number) =>
                renderMenuItem(t, index)
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
<tr className="border" key={t._id ? t._id.toString() : index}>
  <td className="p-2">{t.name}</td>
  <td className="p-2">{t.price ? t.price / 100 : "NA"}</td>
</tr>;
```

- Source: https://github.com/ch4nd4n/practice/tree/master/remix/firebase-auth

Similar article:

1. [Remix Tutorial: Firebase Authentication](/blog/remix-firebase-authentication-tutorial)
