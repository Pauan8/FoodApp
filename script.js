const navBtn = document.getElementById("navBtn")
const searchAccordion = document.getElementById("searchAccordion")
const userInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const checkbox = document.querySelectorAll(".checkbox")
const sliderBtnL = document.querySelectorAll(".recipe-slider__btn-left")
const sliderBtnR = document.querySelectorAll(".recipe-slider__btn-right")
const recipeSlider = document.getElementById("recipeSlider")
const topRecipesSlider = document.getElementById("topRecipeSlider")
const fastRecipesSlider = document.getElementById("fastRecipeSlider")


const handleUserInput = (input) => {
  const query = input;
  const APIurl = `https://api.edamam.com/search?q=${query}&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8`
  filterRecipes(APIurl)
}

const fetchRecipes = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((recipeData) => {
      displayRecipes(recipeData)
      generateStartSite(recipeData)
    })
}

const generateStartSite = (recipeData) => {

  const displayFastRecipes = (recipes) => {
    recipes.hits.forEach((item) => {
      fastRecipesSlider.innerHTML += `
      <div class="recipe-card__fastFood">
        <div class="img-container">
          <img src="${item.recipe.image}"/>
        </div>
        <span class="img-text">
          ${item.recipe.label}
        </span>
      </div>
    `
    })
    recipeCard = document.querySelectorAll(".recipe-card__fastFood")
    recipeCard[0].classList.add("active")
    arrowButtons(recipeCard, "2")
   
  }

  const displayTopRecipes = (recipes) => {
    recipes.hits.forEach((item) => {
      topRecipesSlider.innerHTML += `
      <div class="recipe-card__topFood">
        <div class="img-container">
          <img src="${item.recipe.image}"/>
        </div>
        <span class="img-text">
          ${item.recipe.label}
        </span>
      </div>
    `
    })
    recipeCard = document.querySelectorAll(".recipe-card__topFood")
    recipeCard[0].classList.add("active")
    arrowButtons(recipeCard, "1")
   
  }
  displayFastRecipes(recipeData)
  displayTopRecipes(recipeData)
}

const filterRecipes = (url) => {
  let filteredUrl = url
  let checked = document.querySelectorAll(".checkbox:checked")
  if (checked.length > 0) {
    checked.forEach((filter) => {
      filteredUrl += `&health=${filter.value}`
    })
    fetchRecipes(filteredUrl)
  } else {
    fetchRecipes(url)
  }
}

const displayRecipes = (recipes) => {
  let i = 0;
  recipes.hits.forEach((item) => {
    recipeSlider.innerHTML += `
      <div class="recipe-card__userSearch">
        <div class="img-container">
          <img src="${item.recipe.image}"/>
        </div>
        <span class="img-text">
          ${item.recipe.label}
        </span>
      </div>
    `
  })

  recipeCard = document.querySelectorAll(".recipe-card__userSearch")
  recipeCard[i].classList.add("active")
  arrowButtons(recipeCard, "0")
}


const arrowButtons = (card, number) => {
  i = 0
  sliderBtnL[number].addEventListener("click", () => {
    card[i].classList.remove("active")
    i > 0 ? i-- : i = 9
    card[i].classList.add("active")
  })
  sliderBtnR[number].addEventListener("click", () => {
    card[i].classList.remove("active")
    i === 9 ? i = 0 : i++
    card[i].classList.add("active")
  })
}

const clearAll = () => {
  userInput.value = ""
  checkbox.forEach(item => item.checked = false);
  recipeSlider.innerHTML = ""
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