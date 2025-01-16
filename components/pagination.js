import { searchBar } from '../index.js'
import { printMovieList } from '../api/apiPrint.js';
export const lastPageNumber = document.getElementById("Last-page-number")
export const PageNumber = document.getElementById("page-number");
const prevPageBtn = document.getElementById("prev-page-btn")
const nextPageBtn = document.getElementById("next-page-btn")


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

////페이지기능
//페이지버튼표시
//prevPageBtn.style.display = ("none","block") 이전 페이지버튼 표시 지정
//nextPageBtn.style.display = ("none","block") 다음 페이지버튼 표시 지정
export function setPageBtn(settingOption) {
  (PageNumber.innerHTML == lastPageNumber.innerHTML) ? nextPageBtn.style.display = "none" : nextPageBtn.style.display = "block";
  (PageNumber.innerHTML == 1) ? prevPageBtn.style.display = "none" : prevPageBtn.style.display = "block";
  switch (settingOption) {
    case 'deleteAllBtn':
      prevPageBtn.style.display = "none"
      nextPageBtn.style.display = "none"
      break;
  }
}

//페이지의 표시 밑 api요청에 쓰이는 페이지정보(PageNumber.innerHTML)를 조작하는 함수
//매개변수로 숫자값 넘기면 해당 번호로 페이지이동
export function setPageNumber(pageDirection) {
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