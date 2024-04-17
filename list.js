import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot,doc,deleteDoc,setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// 추천 목록을 저장할 배열
let recommendations = [];

// 음악 추천 정보 입력 폼
const recommendationForm = document.getElementById('recommendation-form');

if (recommendationForm) {
    recommendationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const reason = document.getElementById('reason').value;
        const videoUrl = document.getElementById('videoUrl').value;
        const timestamp = new Date();  // 현재 시간을 가져옵니다.

        // Firebase에 데이터 저장
        await addDoc(collection(db, 'recommendations'), {
            title: title,
            reason: reason,
            videoUrl: videoUrl,
            timestamp  // timestamp 필드 추가
        });

        // 입력 폼 초기화
        recommendationForm.reset();
    });
}
// 추천 목록을 렌더링하는 함수
function renderRecommendations() {
    // 목록을 초기화합니다.
    recommendationsDiv.innerHTML = '';

    // 배열을 순회하며 목록을 추가합니다.
    for (const recommendation of recommendations) {
        const recommendationItem = `
            <div class="recommendation-item">
                <h2>${recommendation.title}</h2>
                <p>추천 이유: ${recommendation.reason}</p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${getYouTubeVideoId(recommendation.videoUrl)}" frameborder="0" allowfullscreen></iframe>
                <button class="delete-btn" data-id="${recommendation.id}">삭제</button>
            </div>
        `;
        recommendationsDiv.innerHTML += recommendationItem;
    }

    // 삭제 버튼에 이벤트 리스너 등록
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (id) {
                //삭제 전 확인 메시지 표시
                const isConfirmed = confirm('삭제하시겠습니까?');

                if(isConfirmed){
                await deleteDoc(doc(db, 'recommendations', id));  // Firestore에서 문서 삭제
            }
        }
        });
    });
}

// 추천 목록 불러오기
const recommendationsDiv = document.getElementById('recommendations');

if (recommendationsDiv) {
    onSnapshot(query(collection(db, 'recommendations'), orderBy('timestamp','asc')), (snapshot) => {
        // 배열 초기화
        recommendations = [];

        snapshot.forEach((doc) => {
            const recommendation = doc.data();
            recommendation.id = doc.id;  // 문서 ID를 추천 데이터에 추가
            recommendations.push(recommendation);
        });

        // 배열을 역순으로 정렬하여 맨 앞에 최신 추천을 위치시킵니다.
        recommendations.reverse();

        // 목록을 다시 렌더링합니다.
        renderRecommendations();
    });
}


function getYouTubeVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : '';
}
