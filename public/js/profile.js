document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    // Lấy dữ liệu hồ sơ
    const res = await fetch("/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (res.ok) {
      const profile = await res.json();
      document.getElementById("gender").value = profile.gender || "";
      document.getElementById("birthDate").value = profile.birthDate?.split("T")[0] || "";
      document.getElementById("phone").value = profile.phone || "";
      document.getElementById("address").value = profile.address || "";
      document.getElementById("identityNumber").value = profile.identityNumber || "";
    }
  
    // Gửi cập nhật hồ sơ
    document.getElementById("profileForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const updated = {
        gender: document.getElementById("gender").value,
        birthDate: document.getElementById("birthDate").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        identityNumber: document.getElementById("identityNumber").value,
      };
  
      const updateRes = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
  
      const result = await updateRes.json();
      alert("Đã cập nhật hồ sơ!");
    });
  });
  