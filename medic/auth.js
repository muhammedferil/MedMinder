// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', () => {

    // --- SUPABASE INITIALIZATION ---
    // Replace these with your actual Supabase URL and Anon Key
    const SUPABASE_URL = 'https://jpihcdmfsdefycfrfokf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaWhjZG1mc2RlZnljZnJmb2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjU3MTEsImV4cCI6MjA3NTgwMTcxMX0.mQEmxzbQlutcWwR5jSHl6r9F1L2sTadBSd6gMz6o9pk';

    // CORRECTED LINE: Use a different variable name to avoid conflict.
    // We are using the global 'supabase' object from the CDN to create our client.
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');

    // --- ELEMENT REFERENCES ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup-link');
    const showLoginLink = document.getElementById('show-login-link');

    // --- FORM SWITCHING LOGIC (No changes here) ---
    showSignupLink.addEventListener('click', (event) => {
        event.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (event) => {
        event.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // --- SIGNUP LOGIC ---
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // CORRECTED: Use our new 'supabaseClient' variable
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error signing up: ' + error.message);
        } else {
            alert('Signup successful! Please check your email to confirm your account.');
            signupForm.querySelector('form').reset();
        }
    });

    // --- LOGIN LOGIC ---
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // CORRECTED: Use our new 'supabaseClient' variable
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error logging in: ' + error.message);
        } else {
            alert('Login successful! Redirecting...');
            window.location.href = 'index.html';
        }
    });

    // Initialize the particle background (same config as before)
    particlesJS("particles-js", {
      "particles": { "number": { "value": 60, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#00ffff" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": true }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true }, "modes": { "grab": { "distance": 140, "line_opacity": 0.3 } } }, "retina_detect": true
    });
});