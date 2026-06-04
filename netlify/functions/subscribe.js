exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "2");

  let email;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }

  if (!email || !email.includes("@")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid email" }),
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204 || response.status === 400) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to subscribe" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
