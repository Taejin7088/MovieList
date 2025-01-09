
const movieCardList = document.querySelector(".movie-card-list")
const searchBar = document.querySelector("#search-bar")
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
    apiUrl = 'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=';
  } else {
    let searchText = searchBar.value
    apiUrl = `https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=ko-KR&page=`;
  }
  const apiOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRjZTE2M2E2ZjhhNDA0NDdiN2MxN2M4ZmQ2ZTA4YiIsIm5iZiI6MTczNjI5OTg1NS4wNzYsInN1YiI6IjY3N2RkNTRmZjJjNjIxODA3ZGJhZmQxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xK_d6IJ_c0spyohLY_ngyT1Ll3L6bp6nioKFlGfg5n4'
    }
  };
  let cardListHtml = ``;

  //원하는 페이지 수..페이지하나당 20개씩 출력
  let pages = 3;
  for (let i = 0; i < pages; i++) {
    apiUrl += i + 1
    console.log(apiUrl)
    await fetch(apiUrl, apiOptions)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
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
          cardListHtml += makeCard
        });
      })
      .catch(err => console.error(err));
    apiUrl = apiUrl.slice(0, -1)
    movieCardList.innerHTML = cardListHtml
  }

}
printCardList()
// searchBtn.addEventListener("click", printCardList())

searchBar.addEventListener("input", function () {

  printCardList()
})



