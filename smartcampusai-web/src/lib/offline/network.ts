export type NetworkStatus = "ONLINE" | "OFFLINE";

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getNetworkStatus(): NetworkStatus {
  if (!isBrowser()) {
    return "ONLINE";
  }

  return navigator.onLine ? "ONLINE" : "OFFLINE";
}

export function subscribeToNetworkStatus(
  callback: (status: NetworkStatus) => void,
): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleOnline = () => callback("ONLINE");
  const handleOffline = () => callback("OFFLINE");

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  callback(
    navigator.onLine ? "ONLINE" : "OFFLINE",
  );

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
