const next = require("next");
const http = require("http");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const port = process.env.PORT || 3000;

  http
    .createServer((req, res) => {
      handle(req, res).catch((err) => {
        console.error("Error handling request:", err);
        res.status(500).send("Internal Server Error");
      });
    })
    .listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
});
