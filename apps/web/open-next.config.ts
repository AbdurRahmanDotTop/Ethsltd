import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  edgeExternals: ["sharp", "canvas"],
});
