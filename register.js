const fetch = require("node-fetch");

async function register() {
  const response = await fetch(
    "http://4.224.186.213/evaluation-service/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "a2023cse9306@imsec.ac.in",
        name: "Deepak Sharma",
        mobileNo: "8929339868",
        githubUsername: "deepakstu1215",
        rollNo: "2301430100074",
        accessCode: "nyXQMu"
      })
    }
  );

  const data = await response.json();
  console.log(data);
}

register();