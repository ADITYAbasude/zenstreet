this.addEventListener('install', (event) => {
  this.skipWaiting();
  console.log('Service Worker installing.');
});

this.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

this.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    actions: data.actions,
    tag: data.tag,
    requireInteraction: data.requireInteraction,
    renotify: data.renotify,
  };
  event.waitUntil(
    this.registration.showNotification(data.title, options)
  );
});

this.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { eventId, url } = event.notification.data;

  switch (event.action) {
    case 'view':
      // Open the app and focus on the event
      event.waitUntil(
        this.clients.openWindow(`${url}/event/${eventId}`)
      );
      break;
    
    case 'snooze':
      // Snooze the notification for 5 minutes
      event.waitUntil(
        new Promise(resolve => {
          setTimeout(() => {
            this.registration.showNotification(event.notification.title, {
              ...event.notification.options,
              renotify: true,
              tag: `${event.notification.tag}-snoozed`
            });
            resolve();
          }, 5 * 60 * 1000); // 5 minutes
        })
      );
      break;
    
    default:
      // If no action clicked, just open the app
      event.waitUntil(
        this.clients.matchAll({ type: 'window' }).then(clientList => {
          if (clientList.length > 0) {
            clientList[0].focus();
          } else {
            this.clients.openWindow(url);
          }
        })
      );
  }
});

this.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed', event.notification);
});
