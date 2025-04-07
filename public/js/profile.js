document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Vui lòng đăng nhập!");
      window.location.href = "/login";
      return;
    }
  
    // Lấy hồ sơ khi DOM đã sẵn sàng
    fetch("/api/profile/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(({ user, profile }) => {
        if (!user) {
          alert("Không lấy được thông tin người dùng");
          return;
        }
  
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
        console.error("Lỗi khi fetch hồ sơ:", err);
        alert("Vui lòng đăng nhập lại!");
        window.location.href = "/login";
      });
  
    // Bắt sự kiện submit form cập nhật hồ sơ
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updated)
        });
  
        const result = await res.json();
        if (res.ok) {
          alert("✅ Đã cập nhật hồ sơ!");
        } else {
          alert(result.message || "❌ Cập nhật thất bại!");
        }
      } catch (err) {
        console.error("Lỗi khi gửi cập nhật:", err);
        alert("Lỗi hệ thống!");
      }
    });
  });
  