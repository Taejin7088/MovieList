import { lastPageNumber, PageNumber, setPageBtn } from '../components/pagination.js'
import { goHome, searchBar } from '../index.js'
const movieCardList = document.getElementById("movie-card-list")

const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRjZTE2M2E2ZjhhNDA0NDdiN2MxN2M4ZmQ2ZTA4YiIsIm5iZiI6MTczNjI5OTg1NS4wNzYsInN1YiI6IjY3N2RkNTRmZjJjNjIxODA3ZGJhZmQxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xK_d6IJ_c0spyohLY_ngyT1Ll3L6bp6nioKFlGfg5n4'
  }
};


//actionType에따라 필요한 api url을 만들어 리턴
//id값이 들어올경우 해당 id의 정보를 불러오는 api url리턴
const makeApiUrl = (actionType, movieId) => {
  switch (actionType) {
    case "popular":
      return `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${PageNumber.innerHTML}`
    case 'search':
      return `https://api.themoviedb.org/3/search/movie?query=${searchBar.value}&include_adult=false&language=ko-KR&page=${PageNumber.innerHTML}`;
    case 'id':
      return `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
  }
}


//배열(results : [영화정보,영화정보,])로 들어오는 api영화값 띄우기
//movieCardList.innerHTML에 여러개가 들어감 
//영화카드리스트(movieCardList.innerHTML)부분을 초기화시킨 후 표시됨
export const printMovieList = async function (actionType) {
  const apiUrl = makeApiUrl(actionType)
  try {
    const res = await fetch(apiUrl, apiOptions)
    const json = await res.json()
    const apiDataList = json.results
    if (apiDataList.length === 0) { setHtmlTitle('결과없음'); }
    lastPageNumber.innerHTML = json.total_pages
    setPageBtn()
    movieCardList.innerHTML = ''
    apiDataList.forEach(data => {
      const htmlContent = createCardHtml(data)
      movieCardList.innerHTML += htmlContent
    });
  } catch (err) {
    alert(err)
    goHome()
  }
  window.scrollTo(0, 0);
}
//id값 api로 영화카드 띄우기
//movieCardList.innerHTML에 하나만 들어감
//영화카드리스트(movieCardList.innerHTML)부분을 초기화시키지 않음
export const printMovieCardByid = async function (movieId) {
  const apiUrl = makeApiUrl("id", movieId)
  const res = await fetch(apiUrl, apiOptions)
  const data = await res.json()
  movieCardList.innerHTML += createCardHtml(data)
}



//json객체의 데이터를 html문자열로 만들어줌
const createCardHtml = (data) => {
  //포스터 값이 null로 들어오면 "noImage" 이미지로 설정
  const posterPath = (data.poster_path == null) ? "https://dummyimage.com/300x400/cccccc/ffffff&text=No+Image" : `https://www.themoviedb.org/t/p/w1280${data.poster_path}`
  const title = data.title;
  const rating = data.vote_average;
  const overview = data.overview;
  const date = data.release_date
  const id = data.id
  const htmlContent = `
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
  return htmlContent
}


