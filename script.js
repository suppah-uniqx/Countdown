// 1. Configuration & State
const TARGET_YEAR = 2026;
let currentLang = 'en';
let selectedTimezone = 'local';
let musicIndex = 0;

// Placeholder for user music files (Add files to assets folder!)
const playlist = [
    'assets/music-1.mp3',
    'assets/music-2.mp3'
];

// 2. Translations
const translations = {
    en: { title: "Countdown to 2026", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", music: "🎵 Play Music" },
    es: { title: "Cuenta regresiva para 2026", days: "Días", hours: "Horas", minutes: "Minutos", seconds: "Segundos", music: "🎵 Reproducir Música" },
    fr: { title: "Compte à rebours 2026", days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes", music: "🎵 Jouer la musique" },
    jp: { title: "2026年へのカウントダウン", days: "日", hours: "時間", minutes: "分", seconds: "秒", music: "🎵 音楽を再生" },
    lk: { title: "2026 නව වසරට තව", days: "දින", hours: "පැය", minutes: "මිනිත්තු", seconds: "තත්පර", music: "🎵 සංගීතය" }
};

// 3. Countdown Logic
function updateCountdown() {
    const now = new Date();
    let targetDate;

    if (selectedTimezone === 'local') {
        targetDate = new Date(`January 1, ${TARGET_YEAR} 00:00:00`);
    } else {
        // Create a date object for the target timezone
        const nowInTz = new Date(now.toLocaleString("en-US", { timeZone: selectedTimezone }));
        const diff = nowInTz.getTime() - now.getTime();
        targetDate = new Date(Date.UTC(TARGET_YEAR, 0, 1, 0, 0, 0) - diff);
    }
    
    const diff = targetDate - now;

    if (diff <= 0) {
        // NEW YEAR REACHED!
        document.getElementById("title").innerText = "🎉 HAPPY NEW YEAR 2026! 🎉";
        document.getElementById("days").parentElement.style.display = "none"; 
        launchConfetti(); // Trigger the "Great Animation"
        return;
    }

    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const s = Math.floor(diff / 1000) % 60;

    document.getElementById("days").innerText = d < 10 ? '0' + d : d;
    document.getElementById("hours").innerText = h < 10 ? '0' + h : h;
    document.getElementById("minutes").innerText = m < 10 ? '0' + m : m;
    document.getElementById("seconds").innerText = s < 10 ? '0' + s : s;
}

// 4. Timezone & Language Handlers
function updateTimezone() {
    selectedTimezone = document.getElementById("timezone-select").value;
}

function changeLanguage() {
    currentLang = document.getElementById("language-select").value;
    const t = translations[currentLang];
    
    document.getElementById("title").innerText = t.title;
    document.getElementById("label-days").innerText = t.days;
    document.getElementById("label-hours").innerText = t.hours;
    document.getElementById("label-minutes").innerText = t.minutes;
    document.getElementById("label-seconds").innerText = t.seconds;
    document.getElementById("music-label").innerText = t.music;
}

// 5. Theme Switcher
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
}

// 6. Music Player Logic
const audioPlayer = document.getElementById("bg-music");

function playMusic() {
    if(!audioPlayer.src) audioPlayer.src = playlist[0];
    audioPlayer.play();
}

function pauseMusic() {
    audioPlayer.pause();
}

function nextTrack() {
    musicIndex = (musicIndex + 1) % playlist.length;
    audioPlayer.src = playlist[musicIndex];
    audioPlayer.play();
}

// 7. Confetti Animation (The "Great Animation")
function launchConfetti() {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Run countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call
