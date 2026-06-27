---
title: "Remix: Web Socket connection Tutorial under 5 minutes, and beyond"
date: 2022-01-18
tags:
  - remix
  - react
---

To setup Socket.io with Remix we need to do the following

- Setup Remix App with Express
- Add Web socket dependencies
- Tweak package.json to run dev server concurrently
- Update Remix route with Socket.io connection

Source code: https://github.com/ch4nd4n/practice/tree/master/remix/socket-ex


[Video](https://www.youtube.com/watch?v=Hx_j1-SEYpg)


Create a remix app with express server, I am using the name `socket-ex`
but this could be anything of your choice.

```bash
npx create-remix@latestsock
```

Will use express

```log
R E M I X

💿 Welcome to Remix! Let's get you set up with a new project.

? Where would you like to create your app? socket-ex
? Where do you want to deploy? Choose Remix if you're unsure, it's easy to change deployment targets. Express Server
? TypeScript or JavaScript? TypeScript
? Do you want me to run `npm install`? Yes
```

Change to `socket-ex` folder to start the development

```bash
cd socket-ex
```

Install socket.io dependency

```bash
npm install socket.io socket.io-client
```

At the point of writing this post, I figured that one is better off
by updating package.json with `concurrently` dependency that allows
development easier

```bash
npm install -D concurrently
```

Update `package.json`

```bash
"dev": "concurrently \"remix watch\" \"cross-env NODE_ENV=development node server/index.js\"",
```

Validate that server starts up by running `npm run dev`

To configure socket.io on server side update `server/index.js` with following

```JS
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Get rid of app.listen and update it with following

server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
```

Update `index.tsx`

```tsx:title=index.tsx

export default function Index() {
  useEffect(() => {
    io();
  }, []);
  return (
    <div>
      <h1>Remix Socket Example</h1>
    </div>
  );
}
```

Extending this a little further, what we can do is that whenever a user
connects we broadcast it to everyone on the server side
and then update client side to pick up this broadcast and update the UI

```tsx
socket.broadcast.emit("serverMsg", `user: ${socket.id}`);
```

Update Index route

```tsx:title=index.tsx
const [messages, setMessages] = useState();

//

const socket = io();
    socket.on("serverMsg", function (msg) {
      setMessages(msg);
    });

```

### Links

1. https://socket.io/
2. Express Adapter https://remix.run/docs/en/v1/other-api/adapter
