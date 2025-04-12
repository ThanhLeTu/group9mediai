// ✅ BƯỚC 4: Hiển thị lựa chọn dạng button tương tác thay vì văn bản

const chatbot = document.getElementById('chatbot');
const openBtn = document.getElementById('openChatBtn');
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

chatbot.style.display = 'none';

function toggleChatbot() {
  chatbot.style.display = chatbot.style.display === 'none' ? 'block' : 'none';
  openBtn.style.display = chatbot.style.display === 'block' ? 'none' : 'block';

  if (chatbot.style.display === 'block') {
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Xin chào!', system: true })
    })
      .then(res => res.json())
      .then(data => appendMessage('🤖 MediBot', data.reply));
  }
}

let chatState = {
  step: 'symptom',
  symptom: '',
  specialization: null,
  hospital: null,
  doctor: null
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage('👤 Bạn', message);
  input.value = '';

  handleUserInput(message);
});

async function handleUserInput(message) {
  try {
    if (chatState.step === 'symptom') {
      chatState.symptom = message;
    
      const aiRes = await fetch('/api/chatbot/ai-specialization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptom: message,
          specializations: [
            'Otorhinolaryngology',
            'Cardiology',
            'Neurology',
            'Dermatology',
            'Gastroenterology'
          ]
        })
      });
    
      const data = await aiRes.json();
    
      if (!data.specializationName)
        return appendMessage('🤖 MediBot', '❌ Không tìm thấy chuyên khoa phù hợp.');
    
      // Tiếp tục gọi danh sách chuyên khoa từ DB
      const specRes = await fetch(`/api/chatbot/specializations?name=${encodeURIComponent(data.specializationName)}`);
      const specialization = await specRes.json();
    
      chatState.specialization = specialization;
      chatState.step = 'choose_hospital';
    
      const hosRes = await fetch(`/api/chatbot/hospitals?specializationId=${specialization._id}`);
      const hospitals = await hosRes.json();
    
      appendMessage('🤖 MediBot', `🩺 Bạn nên khám chuyên khoa: ${specialization.name}. Mời chọn bệnh viện bên dưới:`);
      showOptions(hospitals, 'hospital');
        
    } else if (chatState.step === 'choose_doctor') {
      const docRes = await fetch(`/api/chatbot/doctors?hospitalId=${chatState.hospital._id}&specializationId=${chatState.specialization._id}`);
      const doctors = await docRes.json();
    
      if (!doctors.length) {
        return appendMessage('🤖 MediBot', '❌ Không có bác sĩ nào trong chuyên khoa này tại bệnh viện bạn chọn.');
      }
    
      // ✅ Lưu danh sách để đối chiếu
      chatState.doctors = doctors;
    
      appendMessage('🤖 MediBot', '🧑‍⚕️ Mời bạn chọn bác sĩ bên dưới:');
      showOptions(doctors, 'doctor'); 
    } else if (chatState.step === 'confirm') {
      const parts = message.split(' ');
      if (parts.length < 2) return appendMessage('🤖 MediBot', '❗ Vui lòng nhập đúng định dạng ngày giờ.');

      const [date, time] = parts;

      const appointment = {
        doctorId: chatState.doctor._id,
        hospitalId: chatState.hospital._id,
        specializationId: chatState.specialization._id,
        reason: chatState.symptom,
        date,
        time
      };

      const saveRes = await fetch('/api/chatbot/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });

      if (saveRes.ok) {
        appendMessage('🤖 MediBot', '📅 Lịch khám đã được đặt thành công! ✅');
        chatState = { step: 'symptom', symptom: '', specialization: null, hospital: null, doctor: null };
      } else {
        appendMessage('🤖 MediBot', '❌ Lỗi khi lưu lịch hẹn.');
      }
    }
  } catch (err) {
    appendMessage('🤖 MediBot', 'Lỗi kết nối tới hệ thống.');
    console.error(err);
  }
}

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showOptions(list, type) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('my-2');

  list.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'px-3 py-1 m-1 bg-blue-500 text-white rounded hover:bg-blue-600';
    btn.textContent = item.name || item.fullName;
    btn.onclick = () => {
      appendMessage('👤 Bạn', btn.textContent);

      if (type === 'hospital') {
        chatState.hospital = item;
        chatState.step = 'choose_doctor';
        handleUserInput(btn.textContent);
      } else if (type === 'doctor') {
        chatState.doctor = item;
        chatState.step = 'confirm';
        handleUserInput(btn.textContent);
      }
    };
    wrapper.appendChild(btn);
  });

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
