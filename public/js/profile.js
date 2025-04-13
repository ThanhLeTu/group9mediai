document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");

  // ✅ Không cần kiểm tra localStorage nữa

  // 🔁 Lấy hồ sơ cá nhân
  fetch("/api/profile/me", {
    method: "GET",
    credentials: "include" // ✅ RẤT QUAN TRỌNG để gửi cookie
  })
    .then(res => {
      if (!res.ok) throw new Error("Chưa đăng nhập");
      return res.json();
    })
    .then(({ user, profile }) => {
      document.getElementById("fullName").value = user.fullName || "";
      if (profile) {
        document.getElementById("gender").value = profile.gender || "";
        document.getElementById("birthDate").value = profile.birthDate?.split("T")[0] || "";
        document.getElementById("phone").value = profile.phone || "";
        document.getElementById("address").value = profile.address || "";
        document.getElementById("identityNumber").value = profile.identityNumber || "";
      }
    })
    .catch(err => {
      console.error("❌ Không lấy được hồ sơ:", err);
      alert("Vui lòng đăng nhập lại!");
      window.location.href = "/login";
    });

  // 🔁 Cập nhật hồ sơ
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      gender: document.getElementById("gender").value,
      birthDate: document.getElementById("birthDate").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      identityNumber: document.getElementById("identityNumber").value
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // ✅ Gửi kèm cookie xác thực
        body: JSON.stringify(updated)
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Đã cập nhật hồ sơ!");
      } else {
        alert(result.message || "❌ Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Lỗi hệ thống!");
    }
  });
});
