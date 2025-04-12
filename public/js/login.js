// ✅ Nếu đã đăng nhập, redirect luôn
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (token && user) {
  if (user.role === "admin") {
    window.location.href = "admin/dashboard";
  } else {
    window.location.href = "welcome";
  }
}

// ✅ Xử lý khi người dùng submit form login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    return alert("Vui lòng nhập đầy đủ email và mật khẩu!");
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (res.status === 200) {
      // ✅ Lưu token và thông tin user
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // ✅ Điều hướng theo vai trò
      if (result.user.role === "admin") {
        window.location.href = "admin/dashboard";
      } else {
        window.location.href = "welcome";
      }
    } else {
      alert(result.message || "Đăng nhập thất bại!");
    }
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập:", err);
    alert("Không thể kết nối đến máy chủ!");
  }
});
