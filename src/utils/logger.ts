export function logError(error: Error) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error); // still logs in dev
  }

  // Send error to your API or Sentry
  // fetch("/api/log", { method: "POST", body: JSON.stringify({ error }) });
}
