export default function (nitroApp) {
  nitroApp.hooks.hook('error', async (error, { event }) => {
    console.error("NITRO ERROR CAUGHT:", error);
    if (event) {
      event.node.res.setHeader('Content-Type', 'application/json');
      event.node.res.end(JSON.stringify({
        error: true,
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause ? String(error.cause) : null
      }));
    }
  });
}
