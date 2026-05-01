import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '49fkyv',
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
