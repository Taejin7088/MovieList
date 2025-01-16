import { setPageNumber, setPageBtn } from "./pagination.js";
import { printMovieCardByid } from "../api/apiPrint.js"
import { setHtmlTitle } from "../index.js"

//북마크 : 로컬스토리지에 key값=(영화id) value값=(0고정) 으로저장됨, 북마크 기능 키값만 사용 
//북마크추가
export const addBookmark = (id) => {
  localStorage.setItem(id, 0);
  setBookmarkBtn(id)
}

//북마크제거
export const removeBookmark = (id) => {
  localStorage.removeItem(id);
  setBookmarkBtn(id)
}

//북마크 표시 로컬스토리지 키값 받아와서 
//로컬스토리지의 길이만큼 반복문 반복
export const printBookmarkList = () => {
  setPageNumber(1)
  setPageBtn('deleteAllBtn')
  document.getElementById("movie-card-list").innerHTML = ''
  for (let i = 0; i < localStorage.length; i++) {
    printMovieCardByid(localStorage.key(i))
  }
  setHtmlTitle("북마크")
}

//모달창에 있는 북마크 추가/제거버튼 전환, 북마크 check표시 전환
export const setBookmarkBtn = (id) => {
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