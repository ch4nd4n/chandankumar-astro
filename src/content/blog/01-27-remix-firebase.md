---
title: "Remix Firebase authentication on server side"
date: 2022-01-27
tags:
  - reactjs
  - firebase
  - remix
---

Tutorial on using Firebase to authorize server side access in a Remix app.

Remix has a good support for server side rendering. In this part
I will be using Firebase to authenticate user on server side instead
of client side authentication that I did in the previous one.


[Video](https://www.youtube.com/watch?v=ii8WR9Hm3tg)


> You need to know how to setup firebase admin sdk
> I missed out that part while recording but you need to download `service-account.json`

We need a `Login` form where user can enter username and password.
Once we have that we need to validate it using firebase authenticaton.

We do that using `signInWithEmailAndPassword`. This method returns
idtoken which we pass to `Remix` to create Cookie.

```tsx:title=app/routes/login/Login.tsx
// snipped imports and boilerplate
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export default function LoginIndex() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function login() {
    signInWithEmailAndPassword(auth, username, password)
      .then((user: UserCredential) => {
        user.user
          .getIdToken()
          .then((idToken) => {
            return fetch("/session", {
              method: "POST",
              body: JSON.stringify({ idToken }),
            });
          })
          .then(() => {
            // @ts-ignore
            window.location = "/dashboard";
          });
      })
      .catch((err) => console.error({ err }));
  }

  return (
    <Layout>
      <h1 className="font-bold text-3xl">Login Form</h1>
      <div className="pb-5">
        <input
          placeholder="email"
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
      </div>
      <div className="pb-5">
        <input
          placeholder="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>
      <button onClick={login}>Login</button>
    </Layout>
  );
}

```

Next up we have a utility file which we need on Server side
to

1. Validate idToken recieved from the browser
2. Validate any subsequent request with cookie

```ts:title=app/utils/session.server.ts
const expiresIn = 60 * 60 * 24 * 5 * 1000;

export async function createUserSession(idToken: string, cb: Function) {
  return admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then((sessionCookie) => {
      return cb(sessionCookie);
    });
}

export async function getUserSession(request: Request) {
  return request.headers.get("Cookie");
}

export async function requireUserId(request: Request) {
  const sessionCookie = (await getUserSession(request)) || "";
  return admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      return decodedClaims;
    })
    .catch((err) => {
      throw redirect("/");
    });
}

```

Session.tsx this Remix Action function takes care of
setting Cookie in the response header. This gets invoked
once the user is logged in using Firebase Auth.

```ts:title=app/routes/session.tsx
export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const payload = await request.json();
    const { idToken } = payload;
    return createUserSession(idToken, (cookie: string) => {
      return json(
        { idToken },
        {
          headers: {
            "Set-Cookie": cookie,
          },
        }
      );
    });
  }
  return json({ message: "Method not allowed" }, 405);
};
```

Dashboard: Accessible only if session cookie is present
Create a Remix Loader function that checks if request
scope has session token and then renders the component
else it redirects to login screen.

```tsx

export const loader: LoaderFunction = async ({ request }) => {
  const decodedClaims = await requireUserId(request);
  return { decodedClaims };
};

export default function DashboardIndex() {
  const actionData = useLoaderData();
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl">PersonalDashboard</h1>
      <p>
        Logged in as{" "}
        <span className="bg-red-200 italic ml-2">
          {actionData.decodedClaims.email}
        </span>
      </p>
      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </div>
  );
}
```
