export function checkSession() {
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");

  if (!token || !expiresAt) {
    window.location.href = "/";
    return;
  }

  if (Date.now() > Number(expiresAt)) {
    localStorage.clear();
    alert("Session expired.");

    window.location.href = "/";
  }
}