import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    version: browser.runtime.getManifest().version,
  },
});

export default app;
