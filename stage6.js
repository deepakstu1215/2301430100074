const fetch = require("node-fetch");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkZWVwYWtzdHUxMjE1QGdtYWlsLmNvbSIsImV4cCI6MTc4MDkwNDYxNCwiaWF0IjoxNzgwOTAzNzE0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjYxYjFiOTgtYzc2YS00YmJjLThiNjYtMmYxNjczMDNhM2I1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGVlcGFrIHNoYXJtYSIsInN1YiI6IjE3MDBhZDc3LWJhNTMtNDkzZS1hMDMyLTlmY2Y0OGVjMTg5YiJ9LCJlbWFpbCI6ImRlZXBha3N0dTEyMTVAZ21haWwuY29tIiwibmFtZSI6ImRlZXBhayBzaGFybWEiLCJyb2xsTm8iOiIyMzAxNDMwMTAwMDc0IiwiYWNjZXNzQ29kZSI6Im55WFFNdSIsImNsaWVudElEIjoiMTcwMGFkNzctYmE1My00OTNlLWEwMzItOWZjZjQ4ZWMxODliIiwiY2xpZW50U2VjcmV0Ijoid1h0RVlIY2VBZUt3TmRCSCJ9.pQb47lKduc76x2U0tDsY0fpG_0oXV_Vbyci0T3IdBMs";

const WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getPriorityNotifications(topN = 10) {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    console.log("HTTP Status:", response.status);

    const data = await response.json();

    console.log("\nRaw API Response:\n");
    console.log(JSON.stringify(data, null, 2));

    if (!data.notifications || !Array.isArray(data.notifications)) {
      console.log("\nNo notifications found.");
      return;
    }

    const notifications = data.notifications;

    const ranked = notifications.map((n) => {
      const weight = WEIGHTS[n.Type] || 0;
      const timestamp = new Date(n.Timestamp).getTime();

      return {
        ...n,
        score: weight * 1000000000000 + timestamp
      };
    });

    ranked.sort((a, b) => b.score - a.score);

    const topNotifications = ranked.slice(0, topN);

    console.log("\n==============================");
    console.log(`TOP ${topN} PRIORITY NOTIFICATIONS`);
    console.log("==============================\n");

    topNotifications.forEach((n, index) => {
      console.log(`${index + 1}. ${n.Type}`);
      console.log(`   Message   : ${n.Message}`);
      console.log(`   Timestamp : ${n.Timestamp}`);
      console.log(`   ID        : ${n.ID}`);
      console.log("");
    });

  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

getPriorityNotifications(10);
