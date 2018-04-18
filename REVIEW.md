# Midterm Review
## .gitignore
Although your `.env` and `node_modules` are in the `.gitignore` it looks like
they were added to the repo earlier and they're committed and present.

## .env Documentation
Thank you for providing a sample `.env` file.

```js
let env = '.env';
if (!fs.existsSync(env)) {
  console.log('.env does not exist! Creating it.');
  fs.writeFileSync('.env', fs.readFileSync('.env.tmp'));
};
```

Cool work creating the `.env` file if it doesn't exist. I imagine this is
motivated because it's not uploaded to Travis. This is a nice feature if
you're using it to make non-secure defaults so people can run the app easily
locally. It's a poor feature if you were ever to create the default `.env`
in a production environment because the app secret would default to something
public.

If you're doing this because you want to set environment variables on Travis
there's a way to do this in the Travis web UI in settings somewhere.

## README
Your README is sparse.

## Heartbeat
Great job using `setInterval` to set up the heartbeat infrastructure. It may
not be obvious, but this is very easy to do in Node and much harder to do 
in other frameworks!

# Overall
Nice work. This server seems very to the point.