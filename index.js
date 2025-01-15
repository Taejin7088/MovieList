const searchBar = document.getElementById("search-bar")
const movieCard = document.querySelector(".movie-card")
const movieCardList = document.getElementById("movie-card-list")
const prevPageBtn = document.getElementById("prev-page-btn")
const nextPageBtn = document.getElementById("next-page-btn")
const lastPageNumber = document.getElementById("Last-page-number")
const PageNumber = document.getElementById("page-number");



let evenTest = 0;
//영화카드 띄우기
const printCardList = async function (test) {
  evenTest++;
  console.log(evenTest)
  let apiUrl = ""
  if (searchBar.value == "") {
    apiUrl = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${PageNumber.innerHTML}`; //추천영화 api링크

  } else {
    let searchText = searchBar.value //검색 api링크
    apiUrl = `https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=ko-KR&page=${PageNumber.innerHTML}`;
  }

  const apiOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRjZTE2M2E2ZjhhNDA0NDdiN2MxN2M4ZmQ2ZTA4YiIsIm5iZiI6MTczNjI5OTg1NS4wNzYsInN1YiI6IjY3N2RkNTRmZjJjNjIxODA3ZGJhZmQxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xK_d6IJ_c0spyohLY_ngyT1Ll3L6bp6nioKFlGfg5n4'
    }
  };

  let cardListHtml = ``;
  try {
    const res = await fetch(apiUrl, apiOptions)
    const json = await res.json()
    const apiDataList = json.results
    printPageBtn()
    lastPageNumber.innerHTML = json.total_pages
    apiDataList.forEach(data => {
      //출력해야할 요소, 이미지, 제목, 평점
      const posterPath = `https://www.themoviedb.org/t/p/w1280${data.poster_path}`
      const title = data.title;
      const rating = data.vote_average;
      const overview = data.overview;
      const date = data.release_date
      const id = data.id
      const makeCard = `
          <div class="movie-card" onclick="printModal(${id})">
          <div class="카드틀div" id ="${id}">
            <img src="${posterPath}" class="movie-card-image" alt="영화포스터">
            <div class="movie-card-body">
              <h5 class="movie-card-title">${title}</h5>
              <p class="movie-card-rating">⭐ ${rating}</p>
              <p class="movie-card-overview cardinfo">${overview}</p>
              <p class="movie-card-date cardinfo">${date}</p>
            </div>
          </div>
        </div>`
      cardListHtml += makeCard
      movieCardList.innerHTML = cardListHtml
    });
  } catch (err) {
    console.log(err)
  }
}
printCardList("테스트테스트")

//북마크 로컬스토리지에 저장 받아오기,
// 키값을 아이디값으로,
// 벨류값을 내용으로 
// 모달창 띄우는거랑 똑같이 값 받아와서 저정하면 될듯요
// 키값은 > 아이디값

const createHtmlById = (id) => {
  //아이디값으로 html을 만들어줌
  //모달창 또는 북마크 만들때 여길호출해서 쓰면될듯
  const card = document.getElementById(id)
  const modalTitle = card.querySelector('.movie-card-title').innerHTML
  const modalImg = card.querySelector('.movie-card-image').src
  const modalLating = card.querySelector('.movie-card-rating').innerHTML
  const modaloverview = card.querySelector('.movie-card-overview').innerHTML
  const modaldate = card.querySelector('.movie-card-date').innerHTML
  const htmlContent = `
    <div class="modal-content">
      <h2 class ="모달제목">${modalTitle}</h2>
      <div class ="modal-overview">${modaloverview}</div>
      <img src="${modalImg}" class="modal-image" alt="영화포스터">
      <p class="modal-rating">평점:${modalLating}</p>
      <p class="modal-date">${modaldate}</p>
      <button onclick="closeModal()">닫기</button>
    </div>
  </div>`
  return htmlContent;
}

//모달창띄우기
const printModal = (id) => {
  const htmlContent = createHtmlById(id)
  document.querySelector(".modal").innerHTML = htmlContent;
  document.querySelector(".modal").classList.remove('hide')
}

//모달창숨기기
const closeModal = () => {
  document.querySelector(".modal").classList.add('hide')
}

//현재페이지 표시
function setPageNumber(pageDirection) {
  switch (pageDirection) {
    case "NEXT":
      PageNumber.innerHTML = Number(PageNumber.innerHTML) + 1
      break;

    case "PREV":
      if (Number(PageNumber.innerHTML) === 1) return;
      PageNumber.innerHTML = Number(PageNumber.innerHTML) - 1
      break;
  }
}

//페이지버튼표시:API데이터의 total_pages를 기준으로 표시됨
function printPageBtn() {
  (PageNumber.innerHTML == lastPageNumber) ? nextPageBtn.style.display = "none" : nextPageBtn.style.display = "block";
  (PageNumber.innerHTML == 1) ? prevPageBtn.style.display = "none" : prevPageBtn.style.display = "block";
}


//이전페이지버튼
prevPageBtn.addEventListener("click", function () {
  setPageNumber("PREV")
  printCardList()
})

//다음페이지버튼
nextPageBtn.addEventListener("click", function () {
  setPageNumber("NEXT")
  printCardList()
})

//검색창에 입력값 들어오면 
let timeOut = 0
searchBar.addEventListener("input", function () {
  clearTimeout(timeOut)
  timeOut = setTimeout(() => {
    printCardList()
    PageNumber.innerHTML = 1
  }, 300);
})

