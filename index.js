

const searchBar = document.querySelector("#search-bar")
const movieCardList = document.getElementById("movie-card-list")
const prevPageBtn = document.getElementById("prev-page-btn")
const nextPageBtn = document.getElementById("next-page-btn")
const lastPageNumber = document.getElementById("Last-page-number")
const htmlPage = document.getElementById("page-number");
let page = document.getElementById("page-number").innerHTML


//처음페이지를 로딩할때 인기영화 20개 받아오는 부분
//출력해야할 요소, 이미지, 제목, 평점, 장르는 쉽게 표현할수 있을 것 같은데 이건 나중에 해보자

//api링크와 api키 선언하는 부분
//출력부분은 비슷하니까 함수로 만들어서 사용해도 될 거 같음
let evenTest = 0;
const printCardList = async function () {
  evenTest++;
  console.log(evenTest)
  let apiUrl = ""
  if (searchBar.value == "") {
    apiUrl = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`;

  } else {
    let searchText = searchBar.value
    apiUrl = `https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=ko-KR&page=${page}`;
  }
  const apiOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRjZTE2M2E2ZjhhNDA0NDdiN2MxN2M4ZmQ2ZTA4YiIsIm5iZiI6MTczNjI5OTg1NS4wNzYsInN1YiI6IjY3N2RkNTRmZjJjNjIxODA3ZGJhZmQxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xK_d6IJ_c0spyohLY_ngyT1Ll3L6bp6nioKFlGfg5n4'
    }
  };
  let cardListHtml = ``;

  //json데이터로 페이지 띄우니까 awiat필요
  await fetch(apiUrl, apiOptions)
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      lastPageNumber.innerHTML = json.total_pages
      const apiDataList = json.results
      apiDataList.forEach(data => {
        //출력해야할 요소, 이미지, 제목, 평점
        const posterPath = `https://www.themoviedb.org/t/p/w1280${data.poster_path}`
        const title = data.title;
        const rating = data.vote_average;
        const makeCard = `
        <div class="movie-card">
        <div class="카드안에서 카드틀 모양을 잡기 위한div">
          <img src="${posterPath}" class="movie-card-image" alt="영화포스터">
          <div class="movie-card-body">
            <h5 class="movie-card-title">${title}</h5>
            <p class="movie-card-rating">평점:${rating}</p>
          </div>
        </div>
      </div>`

        //페이지버튼표시버튼
        cardListHtml += makeCard
        movieCardList.innerHTML = cardListHtml
      });
    })
    .catch(err => console.error(err));
  document.getElementById("page-number").innerHTML = page;
  (page == lastPageNumber.innerHTML) ? nextPageBtn.style.display = "none" : nextPageBtn.style.display = "block";
  (page == 1) ? prevPageBtn.style.display = "none" : prevPageBtn.style.display = "block";
}
printCardList()

//이전페이지버튼
prevPageBtn.addEventListener("click", function () {
  if (Number(page) == 1) return;
  page = Number(page) - 1
  printCardList()
})

//다음페이지버튼
nextPageBtn.addEventListener("click", function () {
  page = Number(page) + 1
  printCardList()
})

//검색창에 입력값 들어오면 
searchBar.addEventListener("input", function () {
  printCardList()
})
