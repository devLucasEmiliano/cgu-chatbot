(async () => {
  const { default: next } = await import("next");
  const { createServer } = await import("node:http");

  const app = next({ dev: process.env.NODE_ENV !== "production" });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();
  } catch (err) {
    console.error("Error preparing Next app:", err);
    process.exit(1);
  }

  const port = process.env.PORT || 3000;

  createServer((req, res) => {
    handle(req, res).catch((err) => {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    });
  }).listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
