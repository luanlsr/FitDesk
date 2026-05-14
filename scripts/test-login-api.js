async function run() {
  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  const cookie = csrfRes.headers.get("set-cookie");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if(cookie) headers.append("Cookie", cookie);

  const body = JSON.stringify({
    email: "michel@emailteste.com",
    password: "123456",
    redirect: false,
    callbackUrl: "/",
    csrfToken: csrfData.csrfToken
  });

  const res = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers,
    body
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response JSON length:", text.length);
  console.log("Response snippet:", text.substring(0, 500));
}
run();
