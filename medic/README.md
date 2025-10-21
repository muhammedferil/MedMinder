# MedMinder - A Futuristic Medicine Reminder PWA

## 1. Project Overview 🚀

MedMinder is a modern, single-page web application designed to provide reliable medication reminders. This project serves as a demonstration of modern web technologies, featuring a vibrant, futuristic user interface and leveraging **Service Workers** to deliver push notifications reliably in the background on both desktop and mobile devices.

The application is built entirely with client-side technologies (HTML, CSS, JavaScript) and uses the browser's local storage for data persistence.

---

## 2. Core Features ✨

* **Futuristic UI:** A "glassmorphism" design with a dynamic, animated particle background.
* **Reliable Background Notifications:** Uses a Service Worker to ensure notifications are delivered at the scheduled time, even if the browser tab is closed or the phone is locked.
* **Cross-Platform:** Works seamlessly on modern desktop browsers and Android mobile devices.
* **Persistent Storage:** Reminders are saved in the browser's `localStorage`, so they are not lost after closing the page.
* **Easy to Use:** A clean and simple interface for adding and deleting medication schedules.

---

## 3. Technologies Used 🛠️

* **HTML5**
* **CSS3** (with Google Fonts for a custom look)
* **JavaScript (ES6 - ECMAScript)**
* **Service Workers:** The core technology for enabling background notifications.
* **Particles.js:** A lightweight library for creating the animated background effect.

---

## 4. How to Run the Project

This project must be run from a **local server** because Service Workers require a secure context (HTTPS or localhost) to function.

### ## On a Laptop (Windows)

The easiest way to run this project is with the **Live Server** extension in Visual Studio Code.

1.  **Prerequisites:**
    * [Visual Studio Code](https://code.visualstudio.com/)
    * The "Live Server" extension (install it from the VS Code marketplace).

2.  **Steps:**
    * Open the project folder in Visual Studio Code.
    * Right-click the `auth.html` file in the file explorer.
    * Select **"Open with Live Server"**.
    * Your default browser will open the application (e.g., at `http://127.0.0.1:5500`).
    * Login or Create an account through the login page.
    * Click the **"Enable Notifications"** button and then **"Allow"** the permission when your browser asks.

---

### ## On a Mobile Phone (Android)

To test the background notifications on a mobile device, we will use **Chrome Remote Debugging** to forward your computer's local server to your phone over a USB cable.

1.  **Prerequisites:**
    * An Android phone
    * A USB cable to connect your phone to the computer
    * Google Chrome on both your phone and your computer

2.  **Phone Setup:**
    * Enable **Developer Options**: Go to `Settings` > `About phone` and tap on `Build number` seven times.
    * Enable **USB Debugging**: Go to `Settings` > `System` > `Developer options` and turn on the **USB debugging** toggle.

3.  **Computer and Phone Connection:**
    * First, make sure the project is **running on your laptop** using Live Server.
    * Connect your phone to your computer with the USB cable. A pop-up will appear on your phone asking to "Allow USB debugging." Check the box to always allow and tap **Allow**.
    * On your desktop Chrome, open a new tab and navigate to the address: `chrome://inspect`.
    * Click on the **Port forwarding** button.
    * Set up a rule to forward port `8080` on your device to your computer's server. For example, if Live Server is running on port 5500, the settings should be:
        * **Device port:** `8080`
        * **Local address:** `localhost:5500`
    * Check the **"Enable port forwarding"** box and click **Done**.

4.  **Final Step:**
    * Open the Chrome browser on your **phone**.
    * In the address bar, type **`localhost:8080`** and press Go.
    * The website will load. You can now enable notifications and set a reminder. Lock your phone screen to confirm the background notification works correctly.

---

### ### On a MacBook

The easiest way is with the **Live Server** extension in Visual Studio Code.

1.  **Prerequisites:** Visual Studio Code and the "Live Server" extension.
2.  **Steps:**
    * Open the project folder in VS Code.
    * Right-click `auth.html` and select **"Open with Live Server"**.
    * Login or Create an account through the login page.
    * The app will open in your browser, and notifications will work on the desktop.

---

### ### On an iPhone

Testing on an iPhone requires providing a secure `https://` URL and adding the app to your Home Screen.

1.  **Prerequisites:**
    * The project must be running on your MacBook via Live Server.
    * [ngrok](https://ngrok.com/download) downloaded on your MacBook.

2.  **Steps to Get a Secure URL:**
    * Open the **Terminal** app on your MacBook.
    * Navigate to your ngrok folder and run `./ngrok http 5500` (assuming Live Server is on port 5500).
    * `ngrok` will provide a public URL that starts with `https://`.

3.  **Steps on the iPhone:**
    * Open **Safari** and go to the `https://` URL from ngrok.
    * Tap the **Share icon** > **"Add to Home Screen"**.
    * Close Safari and open the app from the **new icon** on your Home Screen.
    * Click the **"Enable Notifications"** button and tap **"Allow"** on the iOS permission prompt.
    * You can now set reminders and receive background notifications.

## 5. Future Enhancements

* **Edit Functionality:** Add the ability for users to edit an existing reminder's time, name, or dosage.
* **Adherence History:** Create a new page or view to show the user's progress and adherence history over the past week or month.
* **PWA Manifest:** Add a `manifest.json` file to make the app fully installable with a proper icon and splash screen, completing its PWA status.
* **Logout Button:** Implement a logout button in the main app to allow users to sign out of their session.