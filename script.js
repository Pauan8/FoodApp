const navBtn = document.getElementById("navBtn")
const searchAccordion = document.getElementById("searchAccordion");
const userInput = document.getElementById("searchInput")

searchAccordion.addEventListener("click", () => {
  searchAccordion.classList.toggle("search-accordion--active")
})

navBtn.addEventListener("click", () => {
    navBtn.classList.toggle("change")
    navBtn.classList.toggle("nav--active")
})

