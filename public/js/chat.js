const chatbot = document.getElementById("chatbot");
const openBtn = document.getElementById("openChatBtn");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

chatbot.style.display = "none";

function toggleChatbot() {
  chatbot.style.display = chatbot.style.display === "none" ? "block" : "none";
  openBtn.style.display = chatbot.style.display === "block" ? "none" : "block";

  if (chatbot.style.display === "block") {
    appendMessage(
      "🤖 MediBot",
      "Hello! I'm MediBot, your medical assistant. Please describe your symptoms to begin the appointment booking process."
    );
  }
}

let chatState = {
  step: "symptom",
  symptom: "",
  specialization: null,
  hospital: null,
  doctor: null,
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("👤 You", message);
  input.value = "";
  handleUserInput(message);
});

async function handleUserInput(message) {
  try {
    if (chatState.step === "symptom") {
      chatState.symptom = message;

      const namesRes = await fetch("/api/chatbot/specialization-names");
      const specializations = await namesRes.json();
      const aiRes = await fetch("/api/chatbot/ai-specialization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: message,
          specializations,
        }),
      });

      const aiData = await aiRes.json();
      if (!aiData.specializationName)
        return appendMessage(
          "🤖 MediBot",
          "❌ I could not find a suitable department for your symptoms."
        );

      const specRes = await fetch(
        `/api/chatbot/specializations?name=${encodeURIComponent(
          aiData.specializationName
        )}`
      );
      const specialization = await specRes.json();

      chatState.specialization = specialization;
      chatState.step = "choose_hospital";

      const hosRes = await fetch(
        `/api/chatbot/hospitals?specializationId=${specialization._id}`
      );
      const hospitals = await hosRes.json();

      appendMessage(
        "🤖 MediBot",
        `🩺 You should visit the ${specialization.name} department. Please choose a hospital:`
      );
      showOptions(hospitals, "hospital");
    } else if (chatState.step === "choose_doctor") {
      const docRes = await fetch(
        `/api/chatbot/doctors?hospitalId=${chatState.hospital._id}&specializationId=${chatState.specialization._id}`
      );
      const doctors = await docRes.json();

      if (!doctors.length)
        return appendMessage(
          "🤖 MediBot",
          "❌ No doctors found for this department in the selected hospital."
        );

      chatState.step = "confirm";
      chatState.doctors = doctors;

      appendMessage("🤖 MediBot", "🧑‍⚕️ Please choose a doctor:");
      showOptions(doctors, "doctor");
    } else if (chatState.step === "confirm") {
      const parts = message.trim().split(" ");
      if (parts.length < 2)
        return appendMessage(
          "❗ Please provide both date and time. Example: 2024-07-20 09:00"
        );

      const [date, time] = parts;
      const appointment = {
        doctorId: chatState.doctor._id,
        reason: chatState.symptom,
        date,
        time,
        status: "pending",
      };

      const saveRes = await fetch("/api/chatbot/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });

      if (saveRes.ok) {
        appendMessage(
          "🤖 MediBot",
          "✅ Your appointment has been booked successfully!"
        );
        chatState = {
          step: "symptom",
          symptom: "",
          specialization: null,
          hospital: null,
          doctor: null,
        };
      } else {
        appendMessage("🤖 MediBot", "❌ Failed to save the appointment.");
      }
    }
  } catch (err) {
    appendMessage("🤖 MediBot", "❌ System error. Please try again.");
    console.error(err);
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showOptions(list, type) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("my-2");

  list.forEach((item) => {
    const btn = document.createElement("button");
    btn.className =
      "px-3 py-1 m-1 bg-blue-500 text-white rounded hover:bg-blue-600";
    btn.textContent = item.name || item.fullName;
    btn.onclick = () => {
      appendMessage("👤 You", btn.textContent);

      if (type === "hospital") {
        chatState.hospital = item;
        chatState.step = "choose_doctor";
        handleUserInput(btn.textContent);
      } else if (type === "doctor") {
        chatState.doctor = item;
        chatState.step = "confirm";
        appendMessage(
          "🤖 MediBot",
          "📅 Please enter the appointment date and time (e.g. 2024-08-01 09:00)"
        );
      }
    };
    wrapper.appendChild(btn);
  });

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
