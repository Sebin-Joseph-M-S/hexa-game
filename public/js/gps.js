let wakeLock = null;

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock active');
      
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock released');
      });
    }
  } catch (err) {
    console.error('Wake Lock error:', err);
  }
}

document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
});

let watchId = null;
let currentPosition = null;

function startTracking(onPositionUpdate) {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  requestWakeLock();

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      onPositionUpdate(currentPosition);
    },
    (error) => {
      console.error('GPS error:', error);
      const statusEl = document.getElementById('locationText');
      if (statusEl) {
        statusEl.textContent = 'GPS Error: ' + error.message;
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  );
}

function stopTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

window.addEventListener('beforeunload', stopTracking);
