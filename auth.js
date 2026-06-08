const fetch = require("node-fetch");

async function auth() {
  const response = await fetch(
    "http://4.224.186.213/evaluation-service/auth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "deepakstu1215@gmail.com",
        name: "deepak sharma",
        rollNo: "2301430100074",
        accessCode: "nyXQMu",
        clientID: "1700ad77-ba53-493e-a032-9fcf48ec189b",
        clientSecret: "wXtEYHceAeKwNdBH"
      })
    }
  );

  const data = await response.json();
  console.log(data);
}

auth();