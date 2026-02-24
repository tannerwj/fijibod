// Beta environment configuration
const isBeta = window.location.hostname.includes('beta');
const API_URL = isBeta 
    ? 'https://fijibod-beta-api.twj.workers.dev' 
    : 'https://fijibod-api.twj.workers.dev';

if (isBeta) {
    console.log('%c🧪 BETA MODE ACTIVE 🧪', 'font-size: 20px; color: #ff6b35;');
    console.log('%cUsing beta API: ' + API_URL, 'font-size: 12px; color: #888;');
}
