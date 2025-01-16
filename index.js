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





const makeApiUrl = (actionType, Movieid) => {
  actionType = searchBar.value == 0 ? "popular" : 'search'
  switch (actionType) {
    case "popular":
      return `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${PageNumber.innerHTML}`
    case 'search':
      return `https://api.themoviedb.org/3/search/movie?query=${searchBar.value}&include_adult=false&language=ko-KR&page=${PageNumber.innerHTML}`;
    case 'id':
      return `https://api.themoviedb.org/3/search/movie?query=${Movieid}`

  }

}


//영화카드 띄우기
const printMovieList = async function (actionType) {
  console.log(PageNumber.innerHTML)
  const apiUrl = makeApiUrl(actionType)
  try {
    const res = await fetch(apiUrl, apiOptions)
    const json = await res.json()
    const apiDataList = json.results
    console.log(apiDataList)
    console.log("test: ", json.total_pages)
    lastPageNumber.innerHTML = json.total_pages
    setPageBtn()
    movieCardList.innerHTML = ''
    apiDataList.forEach(data => {
      const htmlContent = createCardHtml(data)
      movieCardList.innerHTML += htmlContent
    });
  } catch (err) {
    console.log(err)
  }
}

//json객체의 데이터를 html문자열로 만들어줌
const createCardHtml = (data) => {
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


//북마크 로컬스토리지에 저장 받아오기,
// 키값을 아이디값으로,
// 벨류값을 내용으로 
// 모달창 띄우는거랑 똑같이 값 받아와서 저정하면 될듯요
// 키값은 > 아이디값





//모달띄우기
//id는 영화카드생성시 자신의 id를 전달하는 onclick매서드를 통해 전달받음
const printModal = (id) => {
  setModalById(id)
  document.querySelector(".modal").classList.remove('hide')
}

const closeModal = () => {
  document.querySelector(".modal").classList.add('hide')
}



const setModalById = (id) => {
  const card = document.getElementById(id)
  modalContent.title.innerHTML = card.querySelector('.movie-card-title').innerHTML
  modalContent.image.src = card.querySelector('.movie-card-image').src
  modalContent.rating.innerHTML = card.querySelector('.movie-card-rating').innerHTML
  modalContent.overview.innerHTML = card.querySelector('.movie-card-overview').innerHTML
  modalContent.date.innerHTML = card.querySelector('.movie-card-date').innerHTML
  setBookmarkBtn(id)
}


const addBookmark = (id) => {
  localStorage.setItem(id, 0);
  setBookmarkBtn(id)
}

const removeBookmark = (id) => {
  localStorage.removeItem(id);
  setBookmarkBtn(id)
}

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



//페이지버튼표시:API데이터의 total_pages를 기준으로 표시됨
function setPageBtn() {
  (PageNumber.innerHTML == lastPageNumber.innerHTML) ? nextPageBtn.style.display = "none" : nextPageBtn.style.display = "block";
  (PageNumber.innerHTML == 1) ? prevPageBtn.style.display = "none" : prevPageBtn.style.display = "block";
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


function setPageNumber(pageDirection) {
  setPageBtn()
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

//검색창에 입력값 들어오면 
let timeOut = 0
searchBar.addEventListener("input", function () {
  clearTimeout(timeOut)
  timeOut = setTimeout(() => {
    printMovieList('search')
    PageNumber.innerHTML = 1
  }, 300);
})


printMovieList("popular")

