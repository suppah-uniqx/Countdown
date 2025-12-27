// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialization
    const app = document.getElementById('app-container');
    const welcome = document.getElementById('welcome-screen');
    const enterBtn = document.getElementById('enter-btn');
    const audio = document.getElementById('bg-audio');
    
    // Load config from localStorage (Admin overrides) or default config.js
    const storedConfig = JSON.parse(localStorage.getItem('countdown_config')) || {};
    const settings = { ...CONFIG, ...storedConfig }; // Merge

    // 2. Set Initial Theme & Background
    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        document.body.style.backgroundImage = `url('${theme === 'dark' ? settings.ui.bgImageDark : settings.ui.bgImageLight}')`;
        const icon = document.getElementById('theme-toggle').querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };
    setTheme(settings.defaultTheme);

    // 3. Audio Setup
    audio.src = settings.music.url;
    audio.volume = settings.music.volume;

    // 4. Enter Experience (The Interaction)
    enterBtn.addEventListener('click', () => {
        welcome.style.opacity = '0';
        setTimeout(() => welcome.remove(), 500);
        app.classList.add('visible');
        
        // Try to play audio
        audio.play().catch(e => console.log("Audio play blocked:", e));
    });

    // 5. Translations
    const translations = {
        en: { title: "Countdown to 2026", sub: "The future awaits.", days: "DAYS", hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS" },
        lk: { title: "2026 නව වසරට තව...", sub: "අනාගතය බලා සිටී.", days: "දින", hours: "පැය", minutes: "මිනිත්තු", seconds: "තත්පර" },
        es: { title: "Cuenta regresiva 2026", sub: "El futuro espera.", days: "DÍAS", hours: "HORAS", minutes: "MINUTOS", seconds: "SEGUNDOS" },
        fr: { title: "Compte à rebours 2026", sub: "L'avenir attend.", days: "JOURS", hours: "HEURES", minutes: "MINUTES", seconds: "SECONDES" },
        jp: { title: "2026年へのカウントダウン", sub: "未来が待っている。", days: "日", hours: "時間", minutes: "分", seconds: "秒" }
    };

    // 6. Language Logic
    const langSelect = document.getElementById('language-select');
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        const t = translations[lang];
        
        document.body.className = `lang-${lang}`; // Triggers Sinhala font if needed
        document.getElementById('main-title').innerText = t.title;
        document.getElementById('sub-title').innerText = t.sub;
        document.getElementById('label-days').innerText = t.days;
        document.getElementById('label-hours').innerText = t.hours;
        document.getElementById('label-minutes').innerText = t.minutes;
        document.getElementById('label-seconds').innerText = t.seconds;
    });

    // 7. Toggle Logic
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    const musicBtn = document.getElementById('music-toggle');
    musicBtn.addEventListener('click', () => {
        if(audio.paused) {
            audio.play();
            musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });

    // 8. The Countdown Engine
    function updateTime() {
        const now = new Date();
        const target = new Date(settings.targetDate);
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('main-title').innerText = settings.messages.finished;
            document.querySelector('.countdown-grid').style.display = 'none';
            if(settings.ui.showConfetti && Math.random() < 0.05) launchConfetti();
            return;
        }

        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor(diff / 1000 / 60 / 60) % 24;
        const m = Math.floor(diff / 1000 / 60) % 60;
        const s = Math.floor(diff / 1000) % 60;

        document.getElementById('days').innerText = d < 10 ? '0'+d : d;
        document.getElementById('hours').innerText = h < 10 ? '0'+h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0'+m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0'+s : s;

        // Display Timezone
        document.getElementById('current-timezone').innerText = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Confetti Helper
    function launchConfetti() {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
});
