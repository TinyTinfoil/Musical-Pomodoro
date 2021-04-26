import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    version: "Beta",
  },
});

export default app;
