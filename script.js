const navBtn = document.getElementById("navBtn")
const searchAccordion = document.getElementById("searchAccordion")
const userInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const checkbox = document.querySelectorAll(".checkbox")
const sliderBtnL = document.querySelectorAll(".recipe-slider__btn-left")
const sliderBtnR = document.querySelectorAll(".recipe-slider__btn-right")
const recipeSlider = document.getElementById("recipeSlider")
const simpleRecipesSlider = document.getElementById("simpleRecipeSlider")
const fastRecipesSlider = document.getElementById("fastRecipeSlider")


const handleUserInput = (input) => {
  const query = input;
  const APIurl = `https://api.edamam.com/search?q=${query}&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8`
  filterRecipes(APIurl)
}

const fetchRecipes = (url, sender) => {
  fetch(url)
    .then((response) => response.json())
    .then((recipeData) => {
      switch (sender) {
        case simpleRecipesSlider:
        displayRecipes(recipeData, simpleRecipesSlider)
        break;
        case fastRecipesSlider:
        displayRecipes(recipeData, fastRecipesSlider)
        break;
        default:
          displayRecipes(recipeData, recipeSlider)
      }
  
    })
    .catch((error) => alert("Error"))
}

const generateStartSite = () => {
  const min = Math.ceil(1);
  const max = Math.floor(100);
  let randomNumber = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  
  const simpleFoodsUrl = `https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&ingr=5&from=${randomNumber}` 
  const fastFoodUrl = `https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&time=15-30&from=${randomNumber}`
  fetchRecipes(simpleFoodsUrl, simpleRecipesSlider)
  fetchRecipes(fastFoodUrl, fastRecipesSlider)
}


const filterRecipes = (url) => {
  let filteredUrl = url
  let checked = document.querySelectorAll(".checkbox:checked")
  if (checked.length > 0) {
    checked.forEach((filter) => {
      filteredUrl += `&health=${filter.value}`
    })
    fetchRecipes(filteredUrl, "user")
  } else {
    fetchRecipes(url, "user")
  }
}

/*Displays recipes in different innerHTML sliders depending on arguments so
several different slideshows can be active at the same time */
const displayRecipes = (recipes, container) => {
let divclass, index;

  switch (container) {
    case simpleRecipesSlider:
      container.classList.add("active")
      index = 1;
      divclass = "recipe-card__simpleFood"
      break;
    case fastRecipesSlider:
      container.classList.add("active")
      index = 2;
      divclass = "recipe-card__fastFood"
      break;
    default:
      container.classList.add("active")
      index = 0;
      divclass = "recipe-card__userSearch"
  }

  recipes.hits.forEach((item) => {
    container.innerHTML += `
    <div class="${divclass}">
      <div class="img-container">
        <img src="${item.recipe.image}"/>
      </div>
      <span class="img-text">
        ${item.recipe.label}
      </span>
    </div>
  `
  })
  recipeCard = document.querySelectorAll(`.${divclass}`)
  recipeCard[0].classList.add("active")

  /*Connects the arrowbuttons to the correct innerHTML elements and makes them function 
  as right/left button to view slideshow of foods */
  const arrowButtons = (card, index) => { 
    let i =0;
    sliderBtnL[index].addEventListener("click", () => {
      card[i].classList.remove("active")
      i > 0 ? i-- : i = 9
      card[i].classList.add("active")
    })
    sliderBtnR[index].addEventListener("click", () => {
      card[i].classList.remove("active")
      i === 9 ? i = 0 : i++
      card[i].classList.add("active")
    })
  }
  
  arrowButtons(recipeCard, index)
}

const clearAll = () => {
  userInput.value = ""
  checkbox.forEach(item => item.checked = false);
  recipeSlider.innerHTML = `<span class="recipe-slider__heading">Your search hits</span>`
}

//eventlisteners
searchAccordion.addEventListener("click", () => {
  searchAccordion.classList.toggle("search-accordion--active")
})

navBtn.addEventListener("click", () => {
  navBtn.classList.toggle("change")
  navBtn.classList.toggle("nav--active")
})

searchBtn.addEventListener("click", (event) => {
  event.preventDefault()
  handleUserInput(userInput.value)
  clearAll()
})

generateStartSite()