import { createTestRun } from "./src/index.js";

const run = createTestRun({
  url: "https://example.com",
  prompt:
    "Test login behavior and report both QA and security findings. Keep it super short and simple. This is just a simple test. Max one step",
});

for await (const event of run.events) {
  console.log(JSON.stringify(event));
}

const result = await run.result;
console.log(JSON.stringify(result, null, 2));
