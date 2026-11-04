// Stage Metadata Configurations
const STAGES = [
  {
    name: "Checked In & Initial Diagnostics Queue",
    badge: "Intake Complete",
    desc: "Device received at the front bench. Physical condition cataloged and initial power-draw tested.",
    eta: "Tomorrow, 11:00 AM"
  },
  {
    name: "Diagnostic Bench Testing",
    badge: "In Diagnostics",
    desc: "Multimeter diagnostics active. Locating short circuits and probing power-management rails.",
    eta: "Today, 6:00 PM"
  },
  {
    name: "Motherboard Rework & Component Replacement",
    badge: "In Progress",
    desc: "Our lead tech is conducting micro-soldering on the primary charging rail and thermal repasting.",
    eta: "Today, 4:30 PM"
  },
  {
    name: "QA Stress Testing & Sensor Validation",
    badge: "Testing & QA",
    desc: "Hardware burn-in test running. Verifying display thermals, Wi-Fi stability, and battery cycle drain.",
    eta: "Today, 5:15 PM"
  },
  {
    name: "Repairs Complete - Ready for Collection",
    badge: "Ready for Pickup",
    desc: "Work finished and passed all QA benchmarks. Sealed in protective anti-static wrap awaiting handoff.",
    eta: "Ready Now"
  }
];

let basePrice = 85.00;
let batteryApproved = false;

// DOM Elements
const stageSelector = document.getElementById('stage-selector');
const stageTitle = document.getElementById('stage-title');
const stageDesc = document.getElementById('stage-desc');
const statusBadge = document.getElementById('status-badge');
const etaTime = document.getElementById('eta-time');
const stepper = document.getElementById('stepper');

// Update UI when Stage Changes
function updateStage(index) {
  const stage = STAGES[index];
  stageTitle.textContent = stage.name;
  stageDesc.textContent = stage.desc;
  statusBadge.textContent = stage.badge;
  etaTime.textContent = stage.eta;

  const steps = stepper.querySelectorAll('.step');
  const lines = stepper.querySelectorAll('.line');

  steps.forEach((step, idx) => {
    step.classList.remove('completed', 'active');
    const circle = step.querySelector('.circle');
    if (idx < index) {
      step.classList.add('completed');
      circle.textContent = '✓';
    } else if (idx === index) {
      step.classList.add('active');
      circle.textContent = (idx + 1).toString();
    } else {
      circle.textContent = (idx + 1).toString();
    }
  });

  lines.forEach((line, idx) => {
    line.classList.remove('completed', 'active');
    if (idx < index) {
      line.classList.add('completed');
    } else if (idx === index) {
      line.classList.add('active');
    }
  });
}

// Technician Stage Selector Event
stageSelector.addEventListener('change', (e) => {
  updateStage(parseInt(e.target.value, 10));
});

// Quote Approval Actions
const btnApprove = document.getElementById('btn-approve');
const btnDecline = document.getElementById('btn-decline');
const addonRow = document.getElementById('addon-row');
const totalPrice = document.getElementById('total-price');

btnApprove.addEventListener('click', () => {
  batteryApproved = true;
  addonRow.style.display = 'flex';
  totalPrice.textContent = `£${(basePrice + 45).toFixed(2)}`;
  btnApprove.textContent = "Approved ✓";
  btnApprove.disabled = true;
  btnDecline.style.display = 'none';
});

btnDecline.addEventListener('click', () => {
  btnDecline.textContent = "Declined";
  btnDecline.disabled = true;
  btnApprove.style.display = 'none';
});

// Curbside Ping Event
const btnCurbside = document.getElementById('btn-curbside');
const pickupMsg = document.getElementById('pickup-msg');
btnCurbside.addEventListener('click', () => {
  btnCurbside.textContent = "✓ Notified Front Desk";
  btnCurbside.classList.add('btn-primary');
  pickupMsg.innerHTML = "<strong style='color:#10b981;'>Technician notified! Someone will step outside shortly.</strong>";
});

// Direct Chat Messaging
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // Append Customer Message
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg';
  msgDiv.innerHTML = `<span class="sender" style="color:#60a5fa;">You:</span> <p>${text}</p>`;
  chatMessages.appendChild(msgDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Auto-reply simulation from bench
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'msg tech';
    reply.innerHTML = `<span class="sender">Rob (Technician):</span> <p>Got it! Will verify that on the oscilloscope before sealing up.</p>`;
    chatMessages.appendChild(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1200);
});

// Initial Render
updateStage(2);
