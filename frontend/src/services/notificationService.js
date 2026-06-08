const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkZWVwYWtzdHUxMjE1QGdtYWlsLmNvbSIsImV4cCI6MTc4MDkwNDYxNCwiaWF0IjoxNzgwOTAzNzE0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjYxYjFiOTgtYzc2YS00YmJjLThiNjYtMmYxNjczMDNhM2I1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGVlcGFrIHNoYXJtYSIsInN1YiI6IjE3MDBhZDc3LWJhNTMtNDkzZS1hMDMyLTlmY2Y0OGVjMTg5YiJ9LCJlbWFpbCI6ImRlZXBha3N0dTEyMTVAZ21haWwuY29tIiwibmFtZSI6ImRlZXBhayBzaGFybWEiLCJyb2xsTm8iOiIyMzAxNDMwMTAwMDc0IiwiYWNjZXNzQ29kZSI6Im55WFFNdSIsImNsaWVudElEIjoiMTcwMGFkNzctYmE1My00OTNlLWEwMzItOWZjZjQ4ZWMxODliIiwiY2xpZW50U2VjcmV0Ijoid1h0RVlIY2VBZUt3TmRCSCJ9.pQb47lKduc76x2U0tDsY0fpG_0oXV_Vbyci0T3IdBMs";

export async function getNotifications(page = 1, limit = 10, type = "") {
  let url = `/evaluation-service/notifications?page=${page}&limit=${limit}`;

  if (type) {
    url += `&notification_type=${type}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("getNotifications error:", error);
    return { notifications: [], error: error.message };
  }
}
