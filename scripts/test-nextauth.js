async function run() {
  const formData = new URLSearchParams();
  formData.append("email", "michel@emailteste.com");
  formData.append("password", "123456");
  formData.append("redirect", "false");
  formData.append("callbackUrl", "/");

  const csrfRes = await fetch("http://localhost:3000/api/auth/csrf");
  const csrfData = await csrfRes.json();
  formData.append("csrfToken", csrfData.csrfToken);
  
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  const cookie = csrfRes.headers.get("set-cookie");
  if(cookie) headers.append("Cookie", cookie);

  console.log("Sending credentials...");
  const res = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers,
    body: formData.toString()
  });

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}
run();
