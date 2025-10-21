// Service Worker file: sw.js

// This event listener fires when the service worker is activated.
self.addEventListener('activate', event => {
    console.log('Service Worker activated.');
});

// This is the core of our notification system.
// It listens for 'message' events from the main app (app.js).
self.addEventListener('message', event => {
    console.log('Service Worker received a message:', event.data);

    const medicine = event.data;
    const title = `Time for your medicine: ${medicine.name}`;
    const options = {
        body: `Dosage: ${medicine.dosage}`,
        // This line is changed to point to a local file.
        icon: 'icon.png' 
    };

    // The service worker's registration.showNotification() method displays the notification.
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});