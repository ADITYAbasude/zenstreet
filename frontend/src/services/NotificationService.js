class NotificationService {
  static async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Worker is not supported");
    }

    try {
      // Check if service worker is already registered
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        return existingRegistration;
      }

      // Register new service worker
      const registration = await navigator.serviceWorker.register(
        `${process.env.PUBLIC_URL}/service-worker.js`,
        { scope: '/' }
      );

      // Wait for the service worker to be ready
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              resolve();
            }
          });
        });
      }

      return registration;
    } catch (error) {
      if (error.message.includes('MIME type')) {
        console.error('Service Worker MIME type error. Please ensure the service-worker.js file is being served with the correct MIME type (application/javascript)');
      }
      throw error;
    }
  }

  static async requestPermission() {
    if (!("Notification" in window)) {
      console.error("Notifications are not supported");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await this.registerServiceWorker();
      }
      return permission === "granted";
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }

  static async scheduleNotification(event) {
    if (!event?.start || new Date(event.start) <= new Date()) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const notificationId = setTimeout(async () => {
        await this.showNotification(event, registration);
      }, new Date(event.start).getTime() - Date.now());

      return notificationId;
    } catch (error) {
      console.error("Failed to schedule notification:", error);
      return null;
    }
  }

  static async showNotification(event, registration) {
    if (Notification.permission !== "granted") return;

    const options = {
      body: event.description || "Event is starting now",
      icon: "/calendar-icon.png", // Make sure this icon exists in public folder
      badge: "/badge-icon.png", // Make sure this icon exists in public folder
      tag: event.id,
      requireInteraction: true,
      renotify: true,
      silent: false,
      timestamp: new Date(event.start).getTime(),
      actions: [
        {
          action: 'view',
          title: 'View Event'
        },
        {
          action: 'snooze',
          title: 'Snooze (5min)'
        }
      ],
      data: {
        eventId: event.id,
        url: window.location.origin
      }
    };

    try {
      if (!registration) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(event.title, options);
      } else {
        await registration.showNotification(event.title, options);
      }
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }
}

export default NotificationService;
