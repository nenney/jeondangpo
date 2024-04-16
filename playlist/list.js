import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBGltk7ZUV6861w4lh7x7XhpdDrVu4GD_0",
    authDomain: "test1-bcc6e.firebaseapp.com",
    projectId: "test1-bcc6e",
    storageBucket: "test1-bcc6e.appspot.com",
    messagingSenderId: "59373514993",
    appId: "1:59373514993:web:8a4686602f827d5c3af950",
    measurementId: "G-7SP7Q00TRM"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

// 음악 추천 정보 입력 폼
const recommendationForm = document.getElementById('recommendation-form');

if (recommendationForm) {
    recommendationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const reason = document.getElementById('reason').value;
        const videoUrl = document.getElementById('videoUrl').value;

        // Firebase에 데이터 저장
        await addDoc(collection(db, 'recommendations'), {
            title: title,
            reason: reason,
            videoUrl: videoUrl
        });

        // 입력 폼 초기화
        recommendationForm.reset();
    });
}

// 추천 목록 불러오기
const recommendationsDiv = document.getElementById('recommendations');

if (recommendationsDiv) {
    onSnapshot(query(collection(db, 'recommendations'), orderBy('title')), (snapshot) => {
        recommendationsDiv.innerHTML = ''; // 추천 목록 초기화

        snapshot.forEach((doc) => {
            const recommendation = doc.data();
            const recommendationItem = `
                <div class="recommendation-item">
                    <h2>${recommendation.title}</h2>
                    <p>추천 이유: ${recommendation.reason}</p>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${getYouTubeVideoId(recommendation.videoUrl)}" frameborder="0" allowfullscreen></iframe>
                </div>
            `;
            recommendationsDiv.innerHTML += recommendationItem;
        });
    });
}

function getYouTubeVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
}
