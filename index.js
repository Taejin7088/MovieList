const searchBar = document.getElementById("search-bar")
const movieCard = document.querySelector(".movie-card")
const movieCardList = document.getElementById("movie-card-list")
const prevPageBtn = document.getElementById("prev-page-btn")
const nextPageBtn = document.getElementById("next-page-btn")
const lastPageNumber = document.getElementById("Last-page-number")
const PageNumber = document.getElementById("page-number");
const modalContent = {
  title: document.querySelector(".modal-title"),
  overview: document.querySelector(".modal-overview"),
  image: document.querySelector(".modal-image"),
  rating: document.querySelector(".modal-rating"),
  date: document.querySelector(".modal-date"),
  bookmarkBtn: document.getElementById("bookmark-btn"),
}
const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGRjZTE2M2E2ZjhhNDA0NDdiN2MxN2M4ZmQ2ZTA4YiIsIm5iZiI6MTczNjI5OTg1NS4wNzYsInN1YiI6IjY3N2RkNTRmZjJjNjIxODA3ZGJhZmQxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xK_d6IJ_c0spyohLY_ngyT1Ll3L6bp6nioKFlGfg5n4'
  }
};

const setHtmlTitle = (htmlTitle) => {
  document.getElementById('text-description').innerHTML = htmlTitle
}


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
const printMovieList = async function (actionType) {
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
const printMovieCardByid = async function (movieId) {
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




////모달
//모달띄우기
const printModal = (id) => {
  setModalById(id)
  document.querySelector(".modal").classList.remove('hide')
}
//모달닫기
const closeModal = () => {
  document.querySelector(".modal").classList.add('hide')
}
//영화카드 클릭시(onclick) > setModalById(해당영화id값)
const setModalById = (id) => {
  const card = document.getElementById(id)
  modalContent.title.innerHTML = card.querySelector('.movie-card-title').innerHTML
  modalContent.image.src = card.querySelector('.movie-card-image').src
  modalContent.rating.innerHTML = card.querySelector('.movie-card-rating').innerHTML
  modalContent.overview.innerHTML = card.querySelector('.movie-card-overview').innerHTML
  modalContent.date.innerHTML = card.querySelector('.movie-card-date').innerHTML
  setBookmarkBtn(id)
}






////북마크
//북마크: 로컬스토리지에 key값=(영화id) value값=(0고정) 으로저장됨, 북마크 기능 키값만 사용 
//북마크추가
const addBookmark = (id) => {
  localStorage.setItem(id, 0);
  setBookmarkBtn(id)
}
//북마크제거
const removeBookmark = (id) => {
  localStorage.removeItem(id);
  setBookmarkBtn(id)
}
//북마크 표시 로컬스토리지 키값 받아와서 
//로컬스토리지의 길이만큼 반복문 반복
const printBookmarkList = () => {
  setPageNumber(1)
  setPageBtn('deleteAllBtn')
  movieCardList.innerHTML = ''
  for (let i = 0; i < localStorage.length; i++) {
    printMovieCardByid(localStorage.key(i))
  }
  setHtmlTitle("북마크")
}
//모달창에 있는 북마크 추가/제거버튼 전환, 북마크 check표시 전환
const setBookmarkBtn = (id) => {
  if (localStorage.getItem(id) !== null) {
    document.getElementById('bookmark-btn').setAttribute('onclick', `removeBookmark(${id})`)
    document.getElementById('bookmark-btn').innerHTML = '북마크 삭제'
    document.querySelector('.bookmark-check').style.display = "block"
  } else {
    document.getElementById('bookmark-btn').setAttribute('onclick', `addBookmark(${id})`)
    document.getElementById('bookmark-btn').innerHTML = '북마크 저장'
    document.querySelector('.bookmark-check').style.display = "none"
  }
}


//홈버튼
const goHome = () => {
  setPageNumber(1)
  printMovieList("popular")
  document.getElementById('text-description').innerHTML = "추천영화"
}



////페이지기능
//페이지버튼표시
//prevPageBtn.style.display = ("none","block") 이전 페이지버튼 표시 지정
//nextPageBtn.style.display = ("none","block") 다음 페이지버튼 표시 지정
function setPageBtn(settingOption) {
  (PageNumber.innerHTML == lastPageNumber.innerHTML) ? nextPageBtn.style.display = "none" : nextPageBtn.style.display = "block";
  (PageNumber.innerHTML == 1) ? prevPageBtn.style.display = "none" : prevPageBtn.style.display = "block";
  switch (settingOption) {
    case 'deleteAllBtn':
      prevPageBtn.style.display = "none"
      nextPageBtn.style.display = "none"
      break;
  }
}

//이전페이지버튼
prevPageBtn.addEventListener("click", function () {
  setPageNumber("PREV")
  const actionType = searchBar.value == 0 ? "popular" : 'search'
  printMovieList(actionType)
})

//다음페이지버튼
nextPageBtn.addEventListener("click", function () {
  setPageNumber("NEXT")
  const actionType = searchBar.value == 0 ? "popular" : 'search'
  printMovieList(actionType)
})

//페이지의 표시 밑 api요청에 쓰이는 페이지정보(PageNumber.innerHTML)를 조작하는 함수
//매개변수로 숫자값 넘기면 해당 번호로 페이지이동
function setPageNumber(pageDirection) {
  if (typeof pageDirection === "number") {
    PageNumber.innerHTML = pageDirection
  } else {
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
  setPageBtn()
}



//검색창에 입력값 들어오면 
let timeOut = 0
searchBar.addEventListener("input", function () {
  clearTimeout(timeOut)
  timeOut = setTimeout(() => {
    if (searchBar.value == 0) {
      printMovieList('popular')
      setHtmlTitle("추천영화")
    } else {
      printMovieList('search')
      setHtmlTitle("검색결과")
    }
    PageNumber.innerHTML = 1
  }, 300);
})



printMovieList("popular")

