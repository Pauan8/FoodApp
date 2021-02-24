const navBtn = document.getElementById("navBtn")
const searchAccordion = document.getElementById("searchAccordion")
const userInput = document.getElementById("searchInput")
const randomBtn = document.getElementById("randomBtn")
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
  const simpleFoodsUrl = `https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&ingr=5&from=${randomNumber("1","100")}`
  const fastFoodUrl = `https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&time=15-30&from=${randomNumber("1","100")}`
  fetchRecipes(simpleFoodsUrl, simpleRecipesSlider)
  fetchRecipes(fastFoodUrl, fastRecipesSlider)
}


const filterRecipes = (url) => {
  let newUrl = url
  let checked = document.querySelectorAll(".checkbox:checked")
  if (checked.length > 0) {
    checked.forEach((filter) => {
      newUrl += `&health=${filter.value}`
    })
  } else {
    newUrl = url
  }
  const randomize = (url) => {
    return `${url}&from=${randomNumber("1","100")}`
  }

  fetchRecipes(newUrl, "user")

  randomBtn.addEventListener("click", (e) => {
    e.preventDefault()
    fetchRecipes(randomize(newUrl))
    clearAll()
  }) 
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
      <div class="recipe-card__img-container">
        <img src="${item.recipe.image}"/>
      </div>
      <div class="recipe-card__text">
        <div class="recipe-card__text-label">
        ${item.recipe.label}</div>
          <div class ="recipe-card__img-container__clock">
            <img src="./assets/clock.svg"/>
          </div>
        <div class="recipe-card__text-time">${convertTime(item.recipe.totalTime)}
        </div>
      </div>
    </div>
  `
  })
recipeCard = document.querySelectorAll(`.${divclass}`)
recipeCard[0].classList.add("active")

  arrowButtons(recipeCard, index)
}


/*Connects the arrowbuttons to the correct innerHTML elements and makes them function 
as right/left button to view slideshow of foods */
const arrowButtons = (card, index) => {
  let i = 0;
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

//Makes minutes to hours, days and weeks on long totalTime recipes
const convertTime = (time) => {
  if (time === 0) {
    return time = "not set";
  } else if (time > 10080) {
    return time = Math.round(time / 10080 * 10) / 10 + " weeks"
  } else if (time > 1440) {
    return time = Math.round(time / 1440 * 10) / 10 + " days"
  } else if (time > 60) {
    return time = Math.round(time / 60 * 10) / 10 + " hours"
  } else {
    return time = time + " mins"
  }
}

const randomNumber = (min, max) => {
min = Math.ceil(1);
max = Math.floor(100);
return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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