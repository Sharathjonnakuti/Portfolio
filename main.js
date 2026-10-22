/**
 * JONNAKUTI SHARATH CHANDRA - PORTFOLIO INTERACTION ENGINE
 * Embedded Systems, Robotics & IoT Showcase
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCircuitCanvas();
  initPhotoToggle();
  initTypewriter();
  initNavbarScroll();
  initMobileMenu();
  initHardwareLabSimulators();
  initProjectFiltering();
  initProjectModal();
  initCopyButtons();
  initContactForm();
  initScrollAnimations();
});

/* ===================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   =================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const newTheme = active === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle-btn i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fas fa-moon';
    icon.setAttribute('title', 'Switch to Dark Mode');
  } else {
    icon.className = 'fas fa-sun';
    icon.setAttribute('title', 'Switch to Light Mode');
  }
}

/* ===================================================================
   2. INTERACTIVE CINEMATIC CRIMSON EMBERS & SPARKS CANVAS
   =================================================================== */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.floor((width * height) / 18000);

  for (let i = 0; i < particleCount; i++) {
    const isRuby = Math.random() > 0.45;
    const isAmber = !isRuby && Math.random() > 0.6;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.6 - 0.15, // ascending like sparks from a forge
      radius: Math.random() * 2.4 + 0.8,
      type: isRuby ? 'crimson' : (isAmber ? 'amber' : 'scarlet'),
      pulse: Math.random() * Math.PI,
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.03;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      let colorBase;
      if (p.type === 'crimson') colorBase = '239, 68, 68, ';
      else if (p.type === 'amber') colorBase = '245, 158, 11, ';
      else colorBase = '220, 38, 38, ';

      const pulseSize = p.radius + Math.sin(p.pulse) * 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.6, pulseSize), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorBase}0.75)`;
      ctx.shadowColor = `rgba(${colorBase}0.9)`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect adjacent sparks with subtle crimson filaments
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const alpha = (1 - dist / 110) * 0.16;
          ctx.strokeStyle = `rgba(${colorBase}${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Mouse interactivity - ignite sparks near cursor
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 140) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        const mouseAlpha = (1 - mdist / 140) * 0.35;
        ctx.strokeStyle = `rgba(239, 68, 68, ${mouseAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ===================================================================
   3. PHOTO VIEW TOGGLE (CLOSE-UP / FULL PORTRAIT)
   =================================================================== */
function initPhotoToggle() {
  const toggleBtn = document.getElementById('hero-photo-toggle');
  const heroImg = document.getElementById('hero-profile-img');
  if (!toggleBtn || !heroImg) return;

  let isFull = false;

  toggleBtn.addEventListener('click', () => {
    isFull = !isFull;
    if (isFull) {
      heroImg.src = 'assets/images/sharath-full.png';
      toggleBtn.innerHTML = '<i class="fas fa-compress-alt"></i> <span>Close-Up</span>';
    } else {
      heroImg.src = 'assets/images/sharath-avatar.png';
      toggleBtn.innerHTML = '<i class="fas fa-expand-alt"></i> <span>Full Portrait</span>';
    }
  });
}

/* ===================================================================
   4. TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter-text');
  if (!element) return;

  const words = [
    'Embedded Systems Engineer',
    'Robotics Trainer & Mentor',
    'IoT & Firmware Developer',
    'RTL Design & Verification Specialist',
    'Hardware Prototyper'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typeSpeed = 1600; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ===================================================================
   4. NAVBAR SCROLL & ACTIVE LINK
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. MOBILE MENU
   =================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    if (navLinks.classList.contains('open')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  // Close when link clicked
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

/* ===================================================================
   6. INTERACTIVE HARDWARE SIMULATION LAB
   =================================================================== */
function initHardwareLabSimulators() {
  // --- Tab switching ---
  const tabButtons = document.querySelectorAll('.lab-tab-btn');
  const simCards = document.querySelectorAll('.lab-simulator-card');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabButtons.forEach((b) => b.classList.remove('active'));
      simCards.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetCard = document.getElementById(target);
      if (targetCard) targetCard.classList.add('active');
    });
  });

  // --- 1. Smart Irrigation Simulator ---
  const moistureSlider = document.getElementById('moisture-slider');
  const moistureVal = document.getElementById('moisture-val-display');
  const pumpBadge = document.getElementById('pump-status-badge');
  const plantElem = document.getElementById('virtual-plant');
  const sprayAnim = document.getElementById('water-spray');
  const irrigationLog = document.getElementById('irrigation-serial-log');

  function updateIrrigation(val) {
    if (!moistureVal) return;
    moistureVal.textContent = `${val}%`;

    const isThirsty = val < 40;
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });

    if (isThirsty) {
      plantElem.classList.add('thirsty');
      sprayAnim.classList.add('pumping');
      pumpBadge.className = 'pump-status-badge on';
      pumpBadge.innerHTML = '<i class="fas fa-power-off"></i> PUMP ACTIVE (RELAY: HIGH)';
      appendLog(irrigationLog, `[${timeStr}] [ADC: ${Math.round(val * 10.23)}] Moisture=${val}% < 40% -> DIGITAL_WRITE(RELAY, HIGH) -> PUMP ON`, 'alert');
    } else {
      plantElem.classList.remove('thirsty');
      sprayAnim.classList.remove('pumping');
      pumpBadge.className = 'pump-status-badge off';
      pumpBadge.innerHTML = '<i class="fas fa-power-off"></i> PUMP IDLE (RELAY: LOW)';
      appendLog(irrigationLog, `[${timeStr}] [ADC: ${Math.round(val * 10.23)}] Moisture=${val}% >= 40% -> DIGITAL_WRITE(RELAY, LOW) -> NORMAL`, 'success');
    }
  }

  if (moistureSlider) {
    moistureSlider.addEventListener('input', (e) => {
      updateIrrigation(e.target.value);
    });
    // initial state
    updateIrrigation(moistureSlider.value);
  }

  // --- 2. Smart Home Switcher ---
  const switchCards = document.querySelectorAll('.switch-card');
  const homePowerDisplay = document.getElementById('home-power-total');
  const homeMqttLog = document.getElementById('home-mqtt-log');

  switchCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      const appliance = card.getAttribute('data-appliance');
      const watts = parseInt(card.getAttribute('data-watts') || '0', 10);
      const isActive = card.classList.contains('active');
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });

      // Calculate total load
      let totalWatts = 0;
      switchCards.forEach((c) => {
        if (c.classList.contains('active')) {
          totalWatts += parseInt(c.getAttribute('data-watts') || '0', 10);
        }
      });
      if (homePowerDisplay) {
        homePowerDisplay.textContent = `${totalWatts} W`;
      }

      appendLog(
        homeMqttLog,
        `[${timeStr}] MQTT PUB: "home/relays/${appliance}" -> {"state": "${isActive ? 'ON' : 'OFF'}", "load": "${watts}W"}`,
        isActive ? 'info' : 'alert'
      );
    });
  });

  // --- 3. Pan-Tilt Gimbal Simulator ---
  const panSlider = document.getElementById('pan-slider');
  const tiltSlider = document.getElementById('tilt-slider');
  const panVal = document.getElementById('pan-val-display');
  const tiltVal = document.getElementById('tilt-val-display');
  const cameraEye = document.getElementById('gimbal-camera-eye');
  const gimbalLog = document.getElementById('gimbal-serial-log');

  function updateGimbal() {
    if (!panSlider || !tiltSlider || !cameraEye) return;
    const pan = panSlider.value;
    const tilt = tiltSlider.value;

    panVal.textContent = `${pan}°`;
    tiltVal.textContent = `${tilt}°`;

    // Visual transform: rotate around Y for pan, X for tilt
    const panAngle = (pan - 90) * 0.45; // -40deg to +40deg visual tilt
    const tiltAngle = (tilt - 45) * 0.5;

    cameraEye.style.transform = `rotateY(${panAngle}deg) rotateX(${-tiltAngle}deg)`;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    appendLog(
      gimbalLog,
      `[${timeStr}] SERVO_CMD: PanServo.write(${pan} deg | ${Math.round(1000 + (pan / 180) * 1000)}µs) | TiltServo.write(${tilt} deg)`,
      'info'
    );
  }

  if (panSlider && tiltSlider) {
    panSlider.addEventListener('input', updateGimbal);
    tiltSlider.addEventListener('input', updateGimbal);
  }

  // --- 4. Microcontroller RPS Game ---
  const rpsButtons = document.querySelectorAll('.rps-tactile-btn');
  const rpsLcdLine1 = document.getElementById('rps-lcd-1');
  const rpsLcdLine2 = document.getElementById('rps-lcd-2');
  const rpsScorePlayer = document.getElementById('rps-score-player');
  const rpsScoreMcu = document.getElementById('rps-score-mcu');

  let pScore = 0;
  let mScore = 0;

  const choices = ['ROCK', 'PAPER', 'SCISSORS'];

  rpsButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const playerChoice = btn.getAttribute('data-choice');
      const mcuChoice = choices[Math.floor(Math.random() * choices.length)];

      if (rpsLcdLine1) rpsLcdLine1.textContent = `YOU: ${playerChoice} | MCU: ${mcuChoice}`;

      let resultText = '';
      if (playerChoice === mcuChoice) {
        resultText = 'RESULT: DRAW! [RETRY]';
      } else if (
        (playerChoice === 'ROCK' && mcuChoice === 'SCISSORS') ||
        (playerChoice === 'PAPER' && mcuChoice === 'ROCK') ||
        (playerChoice === 'SCISSORS' && mcuChoice === 'PAPER')
      ) {
        resultText = 'RESULT: PLAYER WINS! *';
        pScore++;
      } else {
        resultText = 'RESULT: MCU WINS! #';
        mScore++;
      }

      if (rpsLcdLine2) rpsLcdLine2.textContent = resultText;
      if (rpsScorePlayer) rpsScorePlayer.textContent = pScore;
      if (rpsScoreMcu) rpsScoreMcu.textContent = mScore;
    });
  });

  // --- 5. AI Sensor Recognition Candy Machine ---
  const sensorChips = document.querySelectorAll('.sensor-chip-btn');
  const candyStatusLed = document.getElementById('candy-status-led');
  const candyLcd = document.getElementById('candy-lcd-status');
  const candyPayload = document.getElementById('candy-payload');
  const candyLog = document.getElementById('candy-serial-log');

  const TARGET_SENSOR = 'Ultrasonic HC-SR04';

  sensorChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const chosenSensor = chip.getAttribute('data-sensor');
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });

      if (chosenSensor === TARGET_SENSOR) {
        // MATCH!
        if (candyStatusLed) {
          candyStatusLed.className = 'status-led-pill green';
          candyStatusLed.innerHTML = '<i class="fas fa-check-circle"></i> SENSOR VERIFIED';
        }
        if (candyLcd) candyLcd.textContent = `STATUS: MATCH VERIFIED!\nDispensing Reward...`;
        if (candyPayload) {
          candyPayload.classList.remove('dropped');
          void candyPayload.offsetWidth; // retrigger reflow
          candyPayload.classList.add('dropped');
        }
        appendLog(candyLog, `[${timeStr}] AI_CONFIDENCE: 98.6% MATCH for "${chosenSensor}" -> GREEN_LED=HIGH -> SERVO_DISPENSE()`, 'success');
      } else {
        // MISMATCH
        if (candyStatusLed) {
          candyStatusLed.className = 'status-led-pill red';
          candyStatusLed.innerHTML = '<i class="fas fa-times-circle"></i> SENSOR MISMATCH';
        }
        if (candyLcd) candyLcd.textContent = `ERROR: "${chosenSensor}"\nTarget: Ultrasonic HC-SR04`;
        if (candyPayload) candyPayload.classList.remove('dropped');
        appendLog(candyLog, `[${timeStr}] AI_RECOGNITION: Sensor "${chosenSensor}" != Target -> RED_LED=BLINK -> BUZZER_BEEP() -> LOCKED`, 'alert');
      }
    });
  });
}

function appendLog(logElem, message, type = 'info') {
  if (!logElem) return;
  const line = document.createElement('div');
  line.className = `serial-line ${type}`;
  line.textContent = message;
  logElem.appendChild(line);
  logElem.scrollTop = logElem.scrollHeight;

  // Keep last 15 lines max
  while (logElem.children.length > 15) {
    logElem.removeChild(logElem.firstChild);
  }
}

/* ===================================================================
   7. PROJECT FILTERING
   =================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || categories.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   8. PROJECT ARCHITECTURE MODAL SYSTEM
   =================================================================== */
const projectDetailsData = {
  'plant-watering': {
    title: 'Moisture Sensing Automatic Plant Watering System',
    category: 'Automated Irrigation & Sensors',
    overview:
      'An intelligent closed-loop automated irrigation system developed using an Arduino microcontroller, capacitive/resistive soil moisture probe, 5V optocoupled relay module, and a 5V submersible water pump. The system automates plant hydration precisely when moisture drops below calibrated thresholds, eliminating human error and preventing catastrophic overwatering.',
    components: [
      'Arduino Uno / Nano (ATmega328P)',
      'Analog Soil Moisture Sensor Module',
      '1-Channel 5V Relay Module (Optoisolated)',
      'Mini 5V DC Submersible Water Pump',
      '1N4007 Flyback Diode & Status Indicators',
      'External 9V/12V DC Regulated Power Supply'
    ],
    architecture: `
[Soil Moisture Sensor] 
      │ (Analog ADC 0-1023)
      ▼
[Arduino Microcontroller] ── Threshold Check (Moisture < 40%) 
      │
      ├─► [Status LEDs (Green / Red)]
      └─► [Relay Module Driver Pin] ──► [5V Submersible Pump] ──► [Plant Hydration]
    `,
    codeSnippet: `// Soil Moisture Automatic Irrigation Core Loop
const int SENSOR_PIN = A0;
const int RELAY_PIN  = 7;
const int THRESHOLD  = 450; // Calibrated ADC threshold

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Active-LOW relay initialized OFF
  Serial.begin(9600);
}

void loop() {
  int sensorVal = analogRead(SENSOR_PIN);
  float moisturePercent = map(sensorVal, 1023, 300, 0, 100);
  
  if (moisturePercent < 35.0) {
    digitalWrite(RELAY_PIN, LOW); // Trigger pump
    Serial.println(F("CRITICAL: Moisture LOW. Pump ACTIVATED."));
  } else {
    digitalWrite(RELAY_PIN, HIGH); // Stop pump
    Serial.println(F("Moisture OPTIMAL. Pump IDLE."));
  }
  delay(1500);
}`
  },

  'smart-home': {
    title: 'IoT-Based Smart Home Automation',
    category: 'IoT, Cloud & Embedded Systems',
    overview:
      'A scalable multi-channel smart home control node engineered with ESP8266 & ESP32 WiFi microcontrollers. Interfaces with 4-channel high-current relay switches, DHT11/DHT22 temperature & humidity telemetry sensors, and an interactive local/cloud MQTT dashboard, enabling remote appliance automation and real-time environment analytics.',
    components: [
      'ESP32 / ESP8266 WiFi SoC Module',
      '4-Channel 5V/10A Mechanical Relay Board',
      'DHT22 High-Precision Temp & Humidity Sensor',
      '0.96" I2C Monochrome OLED Display',
      'Blynk / MQTT Broker / Web Dashboard',
      'Hi-Link AC-to-DC 5V Buck Converter'
    ],
    architecture: `
[Cloud / Mobile MQTT App] <─── WiFi ───> [ESP32 / ESP8266 MCU]
                                                │
         ┌──────────────────────────────────────┼─────────────────────────┐
         ▼                                      ▼                         ▼
 [4-Ch Relay Board]                     [DHT22 Sensor]            [I2C OLED Display]
         │                                (Telemetry)             (Live Diagnostics)
 [AC Appliances: Lights / Fans]
    `,
    codeSnippet: `// ESP32 WiFi Home Automation Relay Control
#include <WiFi.h>
#include <PubSubClient.h>

const int RELAY_1 = 26;
const int RELAY_2 = 27;

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\\0';
  String msg = String((char*)payload);
  
  if (String(topic) == "home/relay1") {
    digitalWrite(RELAY_1, (msg == "ON") ? LOW : HIGH);
  }
}`
  },

  'pantilt-car': {
    title: 'Pan & Tilt Wireless Surveillance Camera Car',
    category: 'Robotics, Motor Drivers & Actuation',
    overview:
      'A versatile 4-wheel drive mobile robotics platform integrated with an elevated 2-DOF Pan & Tilt camera turret. Employs dual SG90 micro-servo motors for 180° horizontal and 90° vertical field-of-view tracking, paired with an L298N H-bridge dual motor driver for responsive skid-steering and obstacle negotiation.',
    components: [
      'Arduino Microcontroller Platform',
      'L298N Dual H-Bridge Motor Driver Module',
      '4x 3-6V Geared DC Motors with Rubber Grip Wheels',
      '2x SG90 / MG90S Metal-Gear Micro Servo Motors',
      '2-Axis Pan & Tilt Gimbal Bracket',
      'Wireless RF / Bluetooth Control Transceiver'
    ],
    architecture: `
[Wireless Remote Controller] ─── RF/WiFi ───► [Arduino Microcontroller]
                                                     │
               ┌─────────────────────────────────────┴────────────────────────────────┐
               ▼                                                                      ▼
     [L298N Dual H-Bridge]                                                  [2-DOF Gimbal Bracket]
               │                                                                      │
     [4x DC Geared Motors]                                                  [Pan & Tilt Servos]
    `,
    codeSnippet: `// Pan & Tilt Servo Gimbal Movement Routine
#include <Servo.h>
Servo panServo;
Servo tiltServo;

void setupGimbal() {
  panServo.attach(9);
  tiltServo.attach(10);
  panServo.write(90);  // Center Pan (0-180)
  tiltServo.write(45); // Neutral Horizon Tilt (0-90)
}

void orientCamera(int panAngle, int tiltAngle) {
  panAngle = constrain(panAngle, 0, 180);
  tiltAngle = constrain(tiltAngle, 0, 90);
  panServo.write(panAngle);
  tiltServo.write(tiltAngle);
}`
  },

  'buddy-band': {
    title: 'Buddy Band – Smart Safety & Assistance Wearable',
    category: 'Wearables & Human-Machine Interfacing',
    overview:
      'An emergency alert wearable engineered to support vulnerable individuals and workers in distress without relying on power-hungry, indoor-blind GPS satellites. Features tactile SOS triggers, haptic coin vibration motor feedback, crisp 0.96" OLED user interaction, and a DFPlayer Mini voice synthesis chip that enunciates predefined location alerts.',
    components: [
      'Microcontroller Board with Low-Power Sleep States',
      '0.96" SSD1306 I2C OLED Display Module',
      'DFPlayer Mini Audio Processor + MicroSD Storage',
      '3V Mini Coin Haptic Vibration Motor + Transistor Switch',
      'Debounced Tactile Emergency & Zone Selection Buttons',
      'Compact Li-Po Rechargeable Battery with TP4056 BMS'
    ],
    architecture: `
[User Inputs: SOS & Zone Selection Buttons]
                    │ (Hardware Interrupts)
                    ▼
          [Microcontroller Core]
                    │
   ┌────────────────┼──────────────────────────────┐
   ▼                ▼                              ▼
[OLED Display]  [Haptic Vibration Motor]  [DFPlayer Mini Audio]
 (Visual Alert)    (Tactile Confirmation)   (Clear Voice Announcement)
    `,
    codeSnippet: `// Buddy Band Audio Alert Dispatcher
#include <DFRobotDFPlayerMini.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

void triggerEmergencyAlert(int zoneId) {
  // 1. Fire haptic pulse
  digitalWrite(VIBRATOR_PIN, HIGH);
  delay(250);
  digitalWrite(VIBRATOR_PIN, LOW);

  // 2. Display on OLED
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println(F("EMERGENCY SIGNAL!"));
  display.print(F("Zone ID: ")); display.println(zoneId);
  display.display();

  // 3. Play voice prompt via DFPlayer
  dfplayer.play(zoneId); // Plays Track corresponding to zone
}`
  },

  'candy-machine': {
    title: 'Sensor Recognition Candy Machine with Edge AI',
    category: 'Edge AI, Machine Learning & STEM EdTech',
    overview:
      'An interactive STEM educational station combining AI sensor pattern recognition with physical embedded actuation. Students present sensor modules (Ultrasonic, Temperature, Light, etc.) to the unit; if the classification neural model matches the challenge target, a green indicator illuminates and a servo motor rotates the gate to release a candy treat.',
    components: [
      'Microcontroller & AI Camera Vision Module',
      '180° Micro Servo Motor for Dispensing Shutter',
      'Dual High-Brightness Indicator LEDs (Green & Red)',
      '16x2 I2C LCD Display Module',
      'Auditory Piezo Feedback Buzzer',
      'Laser-cut Acrylic & 3D Printed Food-Safe Hopper'
    ],
    architecture: `
[User Sensor Presentation] ──► [AI Recognition Model]
                                       │
                      ┌────────────────┴───────────────┐
             [Valid Recognition]              [Mismatch / Error]
                      │                                │
        ┌─────────────┴────────────┐             ┌─────┴────────────────┐
        ▼                          ▼             ▼                      ▼
 [Green LED On]            [Servo Chute]   [Red LED Alert]        [Buzzer Warning]
                           (Dispense Candy)
    `,
    codeSnippet: `// Interactive Sensor Recognition Dispenser Logic
void evaluateSensorSubmission(String recognizedSensor, String targetSensor) {
  if (recognizedSensor.equalsIgnoreCase(targetSensor)) {
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_RED, LOW);
    
    // Actuate candy servo dispenser
    dispenseServo.write(120);
    delay(1000);
    dispenseServo.write(0);
    digitalWrite(LED_GREEN, LOW);
  } else {
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER_PIN, 1000, 400);
    delay(500);
    digitalWrite(LED_RED, LOW);
  }
}`
  },

  'rps-game': {
    title: 'Microcontroller Rock Paper Scissors Console',
    category: 'Embedded Systems & Game Logic',
    overview:
      'A standalone embedded gaming gadget running on an 8-bit microcontroller. Features a high-contrast 16x2 HD44780 LCD display, hardware-debounced tactile push buttons for player move selection, algorithmic pseudo-random number generator for CPU choice, and instant scorekeeping engine.',
    components: [
      'Microcontroller Unit (Arduino ATmega platform)',
      '1602 Character LCD Module with I2C Backpack',
      '3x Momentary Tactile Push Buttons with Pull-up Resistors',
      'Dual Bi-Color Status LEDs (Win/Loss/Draw)',
      'Buzzer for Arcade Sound FX',
      'Internal EEPROM for High-Score Persistence'
    ],
    architecture: `
[3 Tactile Buttons: Rock / Paper / Scissors]
                     │ (Digital Input with Debounce)
                     ▼
           [Microcontroller CPU]
                     │ ──► [PRNG Random Engine: CPU Move]
                     │ ──► [Rules Matrix Decision]
                     │
       ┌─────────────┴────────────────┐
       ▼                              ▼
 [1602 LCD Display]          [Piezo FX & LEDs]
(Live Result & Score)        (Sound Cues on Win/Loss)
    `,
    codeSnippet: `// Microcontroller Rock Paper Scissors Decision Engine
enum Move { ROCK = 0, PAPER = 1, SCISSORS = 2 };

void playRound(Move playerMove) {
  Move cpuMove = (Move)random(0, 3);
  displayRound(playerMove, cpuMove);
  
  if (playerMove == cpuMove) {
    handleDraw();
  } else if ((playerMove == ROCK && cpuMove == SCISSORS) ||
             (playerMove == PAPER && cpuMove == ROCK) ||
             (playerMove == SCISSORS && cpuMove == PAPER)) {
    handlePlayerWin();
  } else {
    handleCpuWin();
  }
}`
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-dynamic-body');
  const triggerButtons = document.querySelectorAll('.btn-architecture');

  if (!modal || !closeBtn || !modalBody) return;

  triggerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDetailsData[projectId];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="modal-header-block" style="margin-bottom: 1.5rem;">
          <span class="section-tag" style="margin-bottom: 0.5rem;"><i class="fas fa-microchip"></i> ${data.category}</span>
          <h2 style="font-size: 1.85rem; color: var(--text-heading); margin-top: 0.25rem;">${data.title}</h2>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-cyan); margin-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> Engineering Overview</h4>
          <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted);">${data.overview}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-emerald); margin-bottom: 0.75rem;"><i class="fas fa-cubes"></i> Hardware Bill of Materials</h4>
          <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.5rem;">
            ${data.components.map((c) => `<li style="font-size: 0.88rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-check" style="color: var(--accent-emerald); font-size: 0.75rem;"></i> ${c}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.1rem; color: var(--accent-cyan); margin-bottom: 0.75rem;"><i class="fas fa-project-diagram"></i> System Architecture & Data Flow</h4>
          <pre style="background: #040810; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle); color: #38bdf8; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; line-height: 1.5;">${data.architecture}</pre>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; color: var(--accent-amber); margin-bottom: 0.75rem;"><i class="fas fa-code"></i> Core Firmware Implementation</h4>
          <pre style="background: #040810; padding: 1.1rem; border-radius: 8px; border: 1px solid var(--border-subtle); color: #e2e8f0; font-family: var(--font-mono); font-size: 0.82rem; overflow-x: auto; line-height: 1.55;"><code>${escapeHtml(data.codeSnippet)}</code></pre>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ===================================================================
   9. COPY TO CLIPBOARD BUTTONS WITH TOAST
   =================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`);
      }).catch(() => {
        // Fallback
        showToast(`Copied: ${text}`);
      });
    });
  });
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2800);
}

/* ===================================================================
   10. CONTACT FORM
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value || 'Portfolio Inquiry';
    const message = document.getElementById('form-message').value;

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Prepare mailto link
    const mailtoUrl = `mailto:sharathchandrajonnakuti@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${subject} - From ${name}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.open(mailtoUrl, '_blank');
    showToast('Drafting email in your mail client...');
    form.reset();
  });
}

/* ===================================================================
   11. SCROLL REVEAL ANIMATIONS
   =================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}
