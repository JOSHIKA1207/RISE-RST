const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function generateHandover(shiftStart, shiftEnd) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      shift_start: shiftStart,
      shift_end: shiftEnd
    })
  });

  if (!response.ok) {
    let message = "Failed to generate handover";

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend unavailable");
  }

  return response.json();
}

export async function getDatabaseHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/database-health`
  );

  if (!response.ok) {
    throw new Error("Database unavailable");
  }

  return response.json();
}

export function getPdfUrl() {
  return `${API_BASE_URL}/api/export`;
}