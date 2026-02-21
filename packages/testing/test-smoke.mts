import { runTest } from "./src/index.js";

const result = await runTest({ url: "https://example.com" });
console.log(JSON.stringify(result, null, 2));
