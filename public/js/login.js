document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await res.json();

  if (res.status === 200) {
    localStorage.setItem("token", result.token);
    // ✅ Chuyển hướng kèm email lên URL
    window.location.href = `/welcome?email=${encodeURIComponent(result.user.email)}`;
  } else {
    alert(result.message || "Đăng nhập thất bại");
  }
});
