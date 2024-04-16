// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// Firebase 구성 (시현)
const firebaseConfig = {
    apiKey: "AIzaSyDfoGCUcSyKm0zm-UTsw5C9327kyvJalT8",
    authDomain: "sparta-d2304.firebaseapp.com",
    projectId: "sparta-d2304",
    storageBucket: "sparta-d2304.appspot.com",
    messagingSenderId: "847019838879",
    appId: "1:847019838879:web:8c5ae3752d4f56fd3681aa",
    measurementId: "G-BP1253G888"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 해당 이미지 클릭 시 해당 정보 가지는 모달창 열림
document.getElementById('imageContainer').addEventListener('click', async function(event) {
    if (event.target.tagName === 'IMG') {
        const dataKey = event.target.getAttribute('data-key');
        await openModal(dataKey);
    }
});




// 모달 열기 함수
async function openModal(dataKey) {
    const introModal = document.getElementById('introModal');

    try {
        // Firebase에서 데이터 가져오기
        const docSnap = await getDoc(doc(db, 'images', dataKey));

        if (docSnap.exists()) {
            const data = docSnap.data();

            // 모달에 데이터 표시(우리 팀 내용에 따라 수정 필요)
            document.getElementById('modalTitle').innerText = data.title;
            document.getElementById('modalContent').innerText = data.content;

            // 모달 띄우기
            $(introModal).modal('show');
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log("Error getting document:", error);
    }
}
