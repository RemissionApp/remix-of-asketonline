// Firebase конфигурация для push-уведомлений
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", 
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  vapidKey: "YOUR_VAPID_KEY" // Для web push
};

// Инициализация Firebase (будет заменено на реальные значения)
export const initializeFirebase = () => {
  // Firebase будет инициализирован после получения конфигурации
  console.log('Firebase конфигурация готова к инициализации');
};