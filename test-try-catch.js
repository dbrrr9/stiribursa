const proxy = new Proxy({}, {
  get() { throw new Error("Sync throw from proxy get!"); }
});

async function test() {
  try {
    const { data } = await proxy.from('news_items');
    console.log("Success");
  } catch (e) {
    console.log("CAUGHT IT:", e.message);
  }
}
test();
