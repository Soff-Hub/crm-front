import Firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}

if (!Firebase.apps.length) {
  Firebase.initializeApp(firebaseConfig)
}

export default Firebase
