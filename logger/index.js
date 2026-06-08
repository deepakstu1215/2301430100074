const fetch = require("node-fetch");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkZWVwYWtzdHUxMjE1QGdtYWlsLmNvbSIsImV4cCI6MTc4MDg5Njc4OSwiaWF0IjoxNzgwODk1ODg5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmQxN2ZiYWEtOTE1OS00YTkxLWJkODItZDg4Y2ExZjEzMGQ3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGVlcGFrIHNoYXJtYSIsInN1YiI6IjE3MDBhZDc3LWJhNTMtNDkzZS1hMDMyLTlmY2Y0OGVjMTg5YiJ9LCJlbWFpbCI6ImRlZXBha3N0dTEyMTVAZ21haWwuY29tIiwibmFtZSI6ImRlZXBhayBzaGFybWEiLCJyb2xsTm8iOiIyMzAxNDMwMTAwMDc0IiwiYWNjZXNzQ29kZSI6Im55WFFNdSIsImNsaWVudElEIjoiMTcwMGFkNzctYmE1My00OTNlLWEwMzItOWZjZjQ4ZWMxODliIiwiY2xpZW50U2VjcmV0Ijoid1h0RVlIY2VBZUt3TmRCSCJ9.edOfo2_GAiOWxn6e4_I-eR4SMQswXub4ZLBJqMiK6Tc";


async function Log(stack, level, packageName, message) {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message
        })
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

module.exports = Log;