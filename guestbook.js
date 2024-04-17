import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyBGltk7ZUV6861w4lh7x7XhpdDrVu4GD_0",
    authDomain: "test1-bcc6e.firebaseapp.com",
    projectId: "test1-bcc6e",
    storageBucket: "test1-bcc6e.appspot.com",
    messagingSenderId: "59373514993",
    appId: "1:59373514993:web:8a4686602f827d5c3af950",
    measurementId: "G-7SP7Q00TRM"
};

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
const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));

function renderGuestbookList(snapshot) {
    guestbookList.innerHTML = '';
    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        const date = data.timestamp.toDate();
        li.innerHTML = `
            <strong>${data.name}</strong>  <span>${data.message}</span> (${date.toLocaleDateString()} ${date.toLocaleTimeString()})
        `;

        // 삭제 버튼 추가
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = '삭제';
        deleteButton.dataset.id = doc.id;

        li.appendChild(deleteButton);
        guestbookList.appendChild(li);
    });
}

// 삭제 버튼 클릭 이벤트 처리
guestbookList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete')) {
        const docId = event.target.dataset.id;

        const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
        if (isConfirmed) {
            try {
                await deleteDoc(doc(db, 'guestbook', docId));
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    }
});

// 페이지네이션 코드
document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 10;
    let currentPage = 1;

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const guestbookItems = document.querySelectorAll('#guestbook-list li');

        guestbookItems.forEach((item, index) => {
            if (index >= start && index < end) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function createPagination(totalPages) {
        const pagination = document.getElementById('guestbook-pagination');
        
        // 기존 페이지네이션 버튼 삭제
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.classList.add('page-btn');
            btn.textContent = i;
            btn.dataset.page = i;
            pagination.appendChild(btn);
        }

        showPage(currentPage);

        pagination.addEventListener('click', function (e) {
            if (e.target.classList.contains('page-btn')) {
                currentPage = parseInt(e.target.dataset.page);
                updatePagination(totalPages);
            }
        });
    }

    function updatePagination(totalPages) {
        const pageBtns = document.querySelectorAll('.page-btn');
        pageBtns.forEach(btn => {
            if (parseInt(btn.dataset.page) === currentPage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        showPage(currentPage);
    }

    onSnapshot(q, (snapshot) => {
        const totalItems = snapshot.size;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        renderGuestbookList(snapshot);
        createPagination(totalPages);
    });
});