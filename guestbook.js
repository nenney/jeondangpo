import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"; // Firestore 함수들 import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGltk7ZUV6861w4lh7x7XhpdDrVu4GD_0",
    authDomain: "test1-bcc6e.firebaseapp.com",
    projectId: "test1-bcc6e",
    storageBucket: "test1-bcc6e.appspot.com",
    messagingSenderId: "59373514993",
    appId: "1:59373514993:web:8a4686602f827d5c3af950",
    measurementId: "G-7SP7Q00TRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

// 방명록 폼
const guestbookForm = document.getElementById('guestbook-form');
guestbookForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    try {
        // Firestore에 데이터 추가
        await addDoc(collection(db, 'guestbook'), {
            name: name,
            message: message,
            timestamp: new Date()
        });
        guestbookForm.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});

// 방명록 목록
const guestbookList = document.getElementById('guestbook-list');

// Firestore 데이터 가져오기
const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
    guestbookList.innerHTML = '';
    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        const date = data.timestamp.toDate(); // Firebase Timestamp를 JavaScript Date 객체로 변환
        li.innerHTML = `
            <strong>${data.name}</strong>  <span>${data.message}</span> (${date.toLocaleDateString()} ${date.toLocaleTimeString()}): 
        `;
        guestbookList.appendChild(li);
    });
});