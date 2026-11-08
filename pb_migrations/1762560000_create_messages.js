/// <reference path="../pb_data/types.d.ts" />
// KMB birthday wall schema. PocketBase applies this automatically on start
// (on PocketHost: upload this folder to your instance's pb_migrations via FTP or the dashboard).

migrate((app) => {
  const messages = new Collection({
    type: "base",
    name: "messages",
    // Anyone with the page can read the wall and post a message.
    listRule: "",
    viewRule: "",
    createRule: "",
    // No edits or deletes from the page. You moderate in the PocketBase dashboard.
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true, min: 1, max: 30, pattern: "\\S" },
      { name: "message", type: "text", required: true, min: 1, max: 5000, pattern: "\\S" },
      { name: "vibe", type: "select", required: true, maxSelect: 1, values: ["Hype", "Roast", "Vibes"] },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
    indexes: ["CREATE INDEX idx_messages_created ON messages (created)"],
  });
  app.save(messages);

  // Server-side slow mode: each IP can post 2 messages per 60 seconds.
  const settings = app.settings();
  settings.rateLimits.enabled = true;
  settings.rateLimits.rules.push({ label: "messages:create", audience: "", duration: 60, maxRequests: 2 });
  app.save(settings);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("messages"));
});
