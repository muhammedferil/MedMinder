// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', () => {

    // --- SUPABASE INITIALIZATION ---
    const SUPABASE_URL = 'https://jpihcdmfsdefycfrfokf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaWhjZG1mc2RlZnljZnJmb2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjU3MTEsImV4cCI6MjA3NTgwMTcxMX0.mQEmxzbQlutcWwR5jSHl6r9F1L2sTadBSd6gMz6o9pk';
    
    // CORRECTED: Use a different variable name ('supabaseClient') to avoid the naming conflict.
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- ELEMENT REFERENCES ---
    const permissionCard = document.getElementById('permission-card');
    const enableNotificationsBtn = document.getElementById('enable-notifications-btn');
    const appContent = document.getElementById('app-content');
    const listContainer = document.getElementById('list-container');
    const medicineForm = document.getElementById('medicine-form');
    const medicineList = document.getElementById('medicine-list');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // --- DATA MANAGEMENT ---
    let medicines = [];
    let dailyStatus = JSON.parse(localStorage.getItem('dailyStatus')) || {};
    let currentUser = null;

    // --- AUTHENTICATION CHECK ---
    async function checkUserSession() {
        // CORRECTED: Use supabaseClient
        const { data, error } = await supabaseClient.auth.getSession();
        if (data.session) {
            currentUser = data.session.user;
            console.log('User is logged in:', currentUser.email);
            await fetchMedicines();
        } else {
            console.log('No user session found. Redirecting to login.');
            window.location.href = 'auth.html';
        }
    }

    // --- DATABASE FUNCTIONS ---
    async function fetchMedicines() {
        if (!currentUser) return;

        // CORRECTED: Use supabaseClient
        const { data, error } = await supabaseClient
            .from('medicines')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching medicines:', error);
        } else {
            medicines = data;
            if (Notification.permission === 'granted') {
                showApp();
                scheduleAllNotifications();
            }
        }
    }
    
    // --- All other functions (date handling, UI, notifications) have been restored to their full versions ---
    const getTodayDateString = () => new Date().toISOString().split('T')[0];
    function checkAndResetDailyStatus() {
        const today = getTodayDateString();
        if (dailyStatus.date !== today) {
            dailyStatus = { date: today, statuses: {} };
            localStorage.setItem('dailyStatus', JSON.stringify(dailyStatus));
        }
    }
    function updateProgress() {
        const totalReminders = medicines.length;
        if (totalReminders === 0) {
            progressText.textContent = "No reminders set for today.";
            progressBar.style.width = '0%';
            return;
        }
        const takenCount = Object.values(dailyStatus.statuses).filter(status => status === 'taken').length;
        const percentage = totalReminders > 0 ? (takenCount / totalReminders) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${takenCount} of ${totalReminders} doses taken today.`;
    }
    if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); }
    enableNotificationsBtn.addEventListener('click', () => { Notification.requestPermission().then(p => { if (p === 'granted') showApp() }); });
    function showApp() { 
        permissionCard.style.display = 'none';
        appContent.style.display = 'block';
        listContainer.style.display = 'block';
        document.getElementById('progress-tracker').style.display = 'block';
        renderMedicines();
    }
    function scheduleNotification(medicine) {
        if (!navigator.serviceWorker.ready) {
            console.error("Service Worker not ready, can't schedule notification.");
            return;
        }
        const now = new Date();
        const [hours, minutes] = medicine.time.split(':');
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
        if (reminderTime < now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }
        const delay = reminderTime.getTime() - now.getTime();
        
        console.log(`Scheduling notification for ${medicine.name} in ${Math.round(delay/1000)} seconds.`);

        setTimeout(() => {
            navigator.serviceWorker.ready.then(registration => {
                registration.active.postMessage(medicine);
            });
        }, delay);
    }

    // THIS FUNCTION IS NOW FULLY RESTORED
    function scheduleAllNotifications() {
        console.log("Scheduling all notifications...");
        medicines.forEach(scheduleNotification);
    }

    // --- UI RENDERING ---
    function renderMedicines() {
        medicineList.innerHTML = '';
        if (medicines.length === 0) {
            updateProgress();
            return;
        }
        medicines.forEach((medicine) => {
            const medId = `med-${medicine.id}`;
            const status = dailyStatus.statuses[medId] || 'pending';
            const item = document.createElement('div');
            item.className = `item ${status}`;
            item.dataset.id = medicine.id;
            item.dataset.statusId = medId;
            let actionButtons = '';
            if (status === 'pending') {
                actionButtons = `<div class="actions"><button class="action-btn taken-btn">Taken</button><button class="action-btn skipped-btn">Skipped</button></div>`;
            }
            item.innerHTML = `<div style="width: 100%;"><div style="display: flex; justify-content: space-between; align-items: center;"><div class="info"><strong>${medicine.name}</strong><span>${medicine.dosage}</span></div><div class="time">${medicine.time}</div><button class="delete-btn">&times;</button></div>${actionButtons}</div>`;
            medicineList.appendChild(item);
        });
        updateProgress();
    }
    
    // --- EVENT LISTENERS ---
    medicineForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newMedicineData = { name: e.target['medicine-name'].value, dosage: e.target['dosage'].value, time: e.target['time'].value, user_id: currentUser.id };
        // CORRECTED: Use supabaseClient
        const { data, error } = await supabaseClient.from('medicines').insert(newMedicineData).select();
        if (error) {
            console.error('Error adding medicine:', error);
            alert('Failed to add reminder.');
        } else {
            medicines.push(data[0]);
            renderMedicines();
            scheduleNotification(data[0]);
            e.target.reset();
        }
    });

    medicineList.addEventListener('click', async (e) => {
        const item = e.target.closest('.item');
        if (!item) return;
        const medicineId = item.dataset.id;
        const statusId = item.dataset.statusId;
        if (e.target.classList.contains('delete-btn')) {
            // CORRECTED: Use supabaseClient
            const { error } = await supabaseClient.from('medicines').delete().eq('id', medicineId);
            if (error) {
                console.error('Error deleting medicine:', error);
            } else {
                medicines = medicines.filter(med => med.id != medicineId);
                delete dailyStatus.statuses[statusId];
                localStorage.setItem('dailyStatus', JSON.stringify(dailyStatus));
                renderMedicines();
            }
        } else if (e.target.classList.contains('taken-btn')) {
            dailyStatus.statuses[statusId] = 'taken';
            localStorage.setItem('dailyStatus', JSON.stringify(dailyStatus));
            renderMedicines();
        } else if (e.target.classList.contains('skipped-btn')) {
            dailyStatus.statuses[statusId] = 'skipped';
            localStorage.setItem('dailyStatus', JSON.stringify(dailyStatus));
            renderMedicines();
        }
    });

    // --- INITIAL APP LOAD ---
    async function initializeApp() {
        checkAndResetDailyStatus();
        await checkUserSession();
    }
    
    initializeApp();
    
    // --- PARTICLE BACKGROUND ---
    particlesJS("particles-js", {
        "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#00ffff" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": true }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true }, "modes": { "grab": { "distance": 140, "line_opacity": 0.3 } } }, "retina_detect": true
    });
});