import { printMovieList } from './api/apiPrint.js'
import { setPageNumber, PageNumber } from './components/pagination.js'

//onclclick 버튼들 임폴트해와서 여기서 window.func = func 해줘야함 튜터님한테질문
import { printModal, closeModal } from './components/modal.js'
import { addBookmark, removeBookmark, printBookmarkList } from './components/bookmark.js'
window.printModal = printModal
window.closeModal = closeModal
window.addBookmark = addBookmark
window.removeBookmark = removeBookmark
window.printBookmarkList = printBookmarkList

export const searchBar = document.getElementById("search-bar")


//홈버튼
export const goHome = () => {
  setPageNumber(1)
  printMovieList("popular")
  document.getElementById('text-description').innerHTML = "추천영화"
}
window.goHome = goHome

//nav title 요소설정
export const setHtmlTitle = (htmlTitle) => {
  document.getElementById('text-description').innerHTML = htmlTitle
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


