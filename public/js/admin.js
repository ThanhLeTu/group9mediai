const token = localStorage.getItem("token");

fetch("/api/admin/dashboard", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => res.text()) // hoặc .json() tùy API
  .then(data => {
    document.getElementById("dashboard").innerHTML = data; // hiển thị lên
  })
  .catch(err => {
    console.error("Lỗi khi fetch:", err);
    alert("Không có quyền truy cập");
    window.location.href = "/login"; // nếu không có token hoặc hết hạn
  });
