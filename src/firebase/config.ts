// Function to get Firebase config based on environment
function getFirebaseConfig() {
  const commonConfig = {
    "projectId": "studio-9804515494-e1a53",
    "appId": "1:759963794370:web:fb9698d247e0bf5d62345b",
    "messagingSenderId": "759963794370"
  };

  if (process.env.NODE_ENV === 'staging') {
    return {
      ...commonConfig,
      "apiKey": process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STAGING,
      "authDomain": "aptastaging.firebaseapp.com",
      "measurementId": process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_STAGING,
    };
  }

  // Default to production/development config
  return {
    ...commonConfig,
    "apiKey": "AIzaSyAzy52hOXCEcaoSNUwnOObmQbPG1HvvnXs",
    "authDomain": "studio-9804515494-e1a53.firebaseapp.com",
    "measurementId": ""
  };
}

export const firebaseConfig = getFirebaseConfig();
