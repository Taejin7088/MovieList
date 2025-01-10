const searchBar = document.getElementById("search-bar")
const movieCard = document.querySelector(".movie-card")
const movieCardList = document.getElementById("movie-card-list")
const prevPageBtn = document.getElementById("prev-page-btn")
const nextPageBtn = document.getElementById("next-page-btn")
const lastPageNumber = document.getElementById("Last-page-number")
const PageNumber = document.getElementById("page-number");


//출력해야할 요소, 이미지, 제목, 평점, 장르는 쉽게 표현할수 있을 것 같은데 이건 나중에 해보자
let evenTest = 0;
const printCardList = function () {
  evenTest++;
  console.log(evenTest)
  let apiUrl = ""
  if (searchBar.value == "") {
    apiUrl = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${PageNumber.innerHTML}`;

  } else {
    let searchText = searchBar.value
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


  fetch(apiUrl, apiOptions)
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      printTotalPageAndPageBtn(json.total_pages)
      const apiDataList = json.results
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
            <p class="movie-card-rating">평점:${rating}</p>
            <p class="movie-card-overview cardinfo">${overview}</p>
            <p class="movie-card-date cardinfo">${date}</p>
          </div>
        </div>
      </div>`
        //페이지버튼표시버튼
        cardListHtml += makeCard
      });
      movieCardList.innerHTML = cardListHtml
    })
    .catch(err => console.error(err));
}
printCardList()

//모달창띄우기
const printModal = (id) => {
  document.querySelector(".modal").classList.remove('hide')
  const card = document.getElementById(id)
  const modalTitle = card.querySelector('.movie-card-title').innerHTML
  const modalImg = card.querySelector('.movie-card-image').src
  const modalLating = card.querySelector('.movie-card-rating').innerHTML
  const modaloverview = card.querySelector('.movie-card-overview').innerHTML
  const modaldate = card.querySelector('.movie-card-date').innerHTML
  const makeModal = `
    <div class="modal-content">
      <h2 class ="모달제목">${modalTitle}</h2>
      <div class ="모달영화내용">${modaloverview}</div>
      <img src="${modalImg}" class="modal-image" alt="영화포스터">
      <p class="modal-rating">평점:${modalLating}</p>
      <p class="modal-date">${modaldate}</p>
      <button onclick="closeModal()">닫기</button>
    </div>
  </div>`
  document.querySelector(".modal").innerHTML = makeModal
}


const closeModal = () => {
  document.querySelector(".modal").classList.add('hide')
}



//페이지 기능관련 함수들
function printTotalPageAndPageBtn(total_pages) {
  lastPageNumber.innerHTML = total_pages;
  (PageNumber.innerHTML == total_pages) ? nextPageBtn.style.display = "none" : nextPageBtn.style.display = "block";
  (PageNumber.innerHTML == 1) ? prevPageBtn.style.display = "none" : prevPageBtn.style.display = "block";
}
//이전페이지버튼
prevPageBtn.addEventListener("click", function () {
  if (Number(PageNumber.innerHTML) == 1) return;
  PageNumber.innerHTML = Number(PageNumber.innerHTML) - 1
  printCardList()
})
//다음페이지버튼
nextPageBtn.addEventListener("click", function () {
  PageNumber.innerHTML = Number(PageNumber.innerHTML) + 1
  printCardList()
})

//검색창에 입력값 들어오면 
searchBar.addEventListener("input", function () {
  PageNumber.innerHTML = 1
  printCardList()
})
