// Your PocketBase server URL, e.g. "https://ginge.pockethost.io" (no trailing slash needed).
// This is safe to be public: the security rules live in pb_migrations/ on the server.
window.KMB_CONFIG = {
  POCKETBASE_URL: "https://ginge.pockethost.io",
  BIRTHDAY: "",              // his birthday as "MM-DD", e.g. "11-21" (blank hides the countdown)
  TIMEZONE: "Europe/London", // countdown hits zero at midnight in this timezone
  DISCORD_INVITE: ""         // e.g. "https://discord.gg/xxxxxxx" (leave blank to hide the button)
};
