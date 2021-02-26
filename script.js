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


//adds specific filter values to the url depending on if the user have selected any
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
  const reciperContainer = document.querySelectorAll(".recipe-slider__container")
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

  switch (container) {
    case simpleRecipesSlider:
      index = 1;
      reciperContainer[index].classList.add("recipe-slider__container--active")
      divclass = "recipe-card__simpleFood"
      break;
    case fastRecipesSlider:
      index = 2;
      divclass = "recipe-card__fastFood"
      reciperContainer[index].classList.add("recipe-slider__container--active")
      break;
    default:
      index = 0;
      divclass = "recipe-card__userSearch"
      reciperContainer[index].classList.add("recipe-slider__container--active")
  }

  container.innerHTML += `    
    <div class="${divclass}">
      <div class="placeholder">
        <h1>Click the right arrow to see more recipes</h1>
      </div>
    </div>
  `
  recipes.hits.forEach((item) => {
    const ingrd = []
    const imgSrc = item.recipe.image
    const recipeName = item.recipe.label
    const url = item.recipe.shareAs

    item.recipe.ingredients.forEach(ing => ingrd.push(ing.text))

    container.innerHTML += `
      <div class="${divclass}">
        <a class="recipe-card__link" onclick="openRecipe('${ingrd}', '${imgSrc}', '${recipeName}', '${url}')" 
        target="_blank"></a>
        <div class="recipe-card__img-container">
          <img src="${imgSrc}"/>
        </div>
        <div class="recipe-card__text">
          <div class="recipe-card__text-label">
            ${recipeName}
          </div>
          <div class ="recipe-card__img-container__clock">
            <img src="./assets/clock.svg"/>
          </div>
        <div class="recipe-card__text-time">${convertTime(item.recipe.totalTime)}
        </div>
      </div>
    `
  })

  container.innerHTML += `
    <div class="${divclass}">
      <div class="placeholder">
        <h1>Ops! No more recipes.</h1>
        <h3>Click left to go back</h3>
      </div>
    </div>
  `
  recipeCard = document.querySelectorAll(`.${divclass}`)

  width >= 700 ? (
    recipeCard[0].classList.add("active"),
    recipeCard[1].classList.add("recipe-card__hero--active"),
    recipeCard[2].classList.add("active")
  ) : (
    recipeCard[1].classList.add("active")
  )
  arrowButtons(recipeCard, index)

}

/*Connects the arrowbuttons to the correct innerHTML elements and makes them function as 
right/left button to view slideshow of foods. For desktop several elements will get an active 
class to show more than one recipe at one time in the slideshow. */
const arrowButtons = (card, index) => {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  let i = 1;
  let j = 0;

  sliderBtnL[index].addEventListener("click", () => {
    if (width >= 700) {
      if (i > 0) {
        card.forEach((item) => item.classList.remove("active", "recipe-card__hero--active"))
        i--
        card[i].classList.add("active")
        card[i + 1].classList.add("recipe-card__hero--active")
        card[i + 2].classList.add("active")
      } else {
        i = 1
      }
    } else {
      card.forEach((item) => item.classList.remove("active"))
      j > 1 ? j-- : j = card.length - 2
      card[j].classList.add("active")
    }
  })

  sliderBtnR[index].addEventListener("click", () => {
    if (width >= 700) {
      if (i === card.length - 3) {
        i = card.length - 4
      } else {
        card.forEach((item) => item.classList.remove("active", "recipe-card__hero--active"))
        i++
        card[i].classList.add("active")
        card[i + 1].classList.add("recipe-card__hero--active")
        card[i + 2].classList.add("active")
      }
    } else {
      card[j].classList.remove("active")
      j === card.length - 2 ? j = 1 : j++
      card[j].classList.add("active")
    }
  })
}

const openRecipe = (ingrd, img, label, url) => {
  const ingredients = ingrd.split(",")
  const myPopup = window.open("./recipe.html", "_blank");

  myPopup.onload = function () {
    let recipeImage = myPopup.document.getElementById("recipeImage")
    let recipeIngredients = myPopup.document.getElementById("recipeIngredients")

    recipeImage.innerHTML = `
    <div class="recipe-image__container"> 
      <img src="${img}"/>
    </div>
    <h1> ${label}</h1>
    <a href="${url}" target="_blank"> Full recipe </a>`

    ingredients.forEach((ing) => {
      console.log(ing)
      recipeIngredients.innerHTML += `
        <div class="recipe-description__ingrd-list">
        <li>${ing}</li>
        </div>
      `
    })
  }
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

//Generates a random number between 2 values. Used to add more variation in recipes displayed on the site.
const randomNumber = (min, max) => {
  min = Math.ceil(1);
  max = Math.floor(100);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
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


generateStartSite()