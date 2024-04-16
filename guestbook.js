import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js' // Firestore 함수들 import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//일단 테스트를 위해서 내 파이어베이스에 작업 후 full할 때는 외부 파이어베이스로 교체
const firebaseConfig = {
  apiKey: 'AIzaSyBA9ngdQNhSZSdO3P-QomWTTZV5WDkrjZE',
  authDomain: 'spare-3a004.firebaseapp.com',
  projectId: 'spare-3a004',
  storageBucket: 'spare-3a004.appspot.com',
  messagingSenderId: '517067543010',
  appId: '1:517067543010:web:db90ef5043ec9b157529bb',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore()

// Firebase 데이터베이스 참조
var database = firebase.database()

document
  .getElementById('guestbook-form')
  .addEventListener('submit', function (event) {
    event.preventDefault() // 기본 동작 중지

    // 사용자 입력 가져오기
    var name = document.getElementById('name').value
    var message = document.getElementById('message').value

    // 데이터베이스에 데이터 추가
    database.ref('guestbook').push({
      name: name,
      message: message,
    })

    // 입력 필드 초기화
    document.getElementById('name').value = ''
    document.getElementById('message').value = ''

    console.log('데이터가 Firebase에 성공적으로 저장되었습니다.')
  })

// 데이터베이스에서 데이터 가져오기
database.ref('guestbook').on('child_added', function (snapshot) {
  var data = snapshot.val()
  var postDiv = document.createElement('div')
  postDiv.classList.add('post')

  var titleDiv = document.createElement('div')
  titleDiv.classList.add('post-title')
  titleDiv.textContent = data.name

  var contentDiv = document.createElement('div')
  contentDiv.classList.add('post-content')
  contentDiv.textContent = data.message

  postDiv.appendChild(titleDiv)
  postDiv.appendChild(contentDiv)

  var noticeBoard = document.querySelector('.notice_board')
  noticeBoard.appendChild(postDiv)

  console.log('데이터를 Firebase에서 성공적으로 가져왔습니다.')
})
