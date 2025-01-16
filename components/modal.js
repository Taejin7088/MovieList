import { setBookmarkBtn } from './bookmark.js'

const modalContent = {
  title: document.querySelector(".modal-title"),
  overview: document.querySelector(".modal-overview"),
  image: document.querySelector(".modal-image"),
  rating: document.querySelector(".modal-rating"),
  date: document.querySelector(".modal-date"),
  bookmarkBtn: document.getElementById("bookmark-btn"),
}

////모달
//모달띄우기
export const printModal = (id) => {
  setModalById(id)
  document.querySelector(".modal").classList.remove('hide')
}


//모달닫기
export const closeModal = () => {
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




