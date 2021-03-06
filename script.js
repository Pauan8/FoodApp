const navBtn = document.getElementById("navBtn")
const searchAccordion = document.getElementById("searchAccordion")
const userInput = document.getElementById("searchInput")
const randomBtn = document.getElementById("randomBtn")
const searchBtn = document.getElementById("searchBtn")
const checkbox = document.querySelectorAll(".checkbox")
const checkboxFilter = document.querySelectorAll(".checkbox-filter")
const sliderBtnL = document.querySelectorAll(".recipe-slider__btn-left")
const sliderBtnR = document.querySelectorAll(".recipe-slider__btn-right")
const recipeSlider = document.getElementById("recipeSlider")
const simpleRecipesSlider = document.getElementById("simpleRecipeSlider")
const fastRecipesSlider = document.getElementById("fastRecipeSlider")
const quickChoiceBtn = document.querySelectorAll(".quick-choice__btn")
const searchOptionBtn = document.querySelectorAll(".search-option__btn")
const filterBtn = document.getElementById("filterBtn")
const filterUserInput = document.getElementById("seachFilterUser")

let query, old, oldUrl="", newUrl


const handleUserInput = (input, type) => {
  let APIurl, insrt;
  console.log(`"${input}"`)
  if (type === "value") {
    if(input === "") {
      query = old
      insrt = false
    } else { 
      query = input 
      old = input
      insrt = true;
    }
    APIurl = `https://api.edamam.com/search?q=${query}&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8`
  } else {
    APIurl = `${APIurl}mealType=${query}`
  }
  filterRecipes(APIurl, insrt)
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
    .catch((error) => alert(error))
}

const generateStartSite = () => {
  const simpleFoodsUrl = `https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&ingr=5&from=${randomNumber("1","100")}`
  const fastFoodUrl = `https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&time=15-30&from=${randomNumber("1","100")}`
  fetchRecipes(simpleFoodsUrl, simpleRecipesSlider)
  fetchRecipes(fastFoodUrl, fastRecipesSlider)
}

//adds specific filter values to the url depending on if the user have selected any
const filterRecipes = (url, state) => {
  state === false && oldUrl !== "" ? url = oldUrl : newUrl = url;
  
  const checked = document.querySelectorAll(".checkbox:checked")
  if (checked.length > 0) {
    checked.forEach((filter) => {
     newUrl += `&health=${filter.value}`
    })
  } else {
      newUrl = url;
    }
    let add = newUrl

  const checkedFilter = document.querySelectorAll(".checkbox-filter:checked")
  if (checkedFilter.length > 0) {
    
    if (filterUserInput.value !== "") {
      add += `&excluded=${filterUserInput.value}`
    }
    checkedFilter.forEach((check) => {
      if (check.value === "eggs") {
        add += `&excluded=${check.value}&excluded=egg`
      } else if (check.value === "shellfish") {
        add += `&excluded=${check.value}&excluded=shrimps&excluded=crab&excluded=lobster&excluded=crayfish&excluded=crawfish&excluded=prawn`
      } else {
        add += `&excluded=${check.value}`
      }
    })
    newUrl = add
  }
  oldUrl = newUrl
  console.log(newUrl)
  fetchRecipes(newUrl, "user")

  const randomize = (url) => {
    return `${url}&from=${randomNumber("1","100")}`
  }

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

  recipes.hits.forEach((item) => {
    const rValue = item.recipe.uri.replaceAll("/", "%2F").replaceAll(":", "%3A").replaceAll("#", "%23");

    container.innerHTML += `
      <div class="${divclass}">
        <a class="recipe-card__link" onclick="openRecipe('${rValue}')" 
        target="_blank"></a>
        <div class="recipe-card__img-container">
          <img src="${item.recipe.image}"/>
        </div>
        <div class="recipe-card__text">
          <div class="recipe-card__text-label">
            ${item.recipe.label}
          </div>
          <div class ="recipe-card__img-container__clock">
            <img src="./assets/clock.svg"/>
          </div>
        <div class="recipe-card__text-time">${convertTime(item.recipe.totalTime)}
        </div>
      </div>
    `
  })

  recipeCard = document.querySelectorAll(`.${divclass}`)

  //fills  the slideshow with innerHTML by adding active class on the amount of recipe cards that will show
  if (width >= 1500) {
    for (let i = 0; 5 > i; i++) {
      i === 2 ? recipeCard[2].classList.add("recipe-card__hero--active") : recipeCard[i].classList.add("active")
    }
  } else if (width >= 700) {
    for (let i = 0; 3 > i; i++)
      i === 1 ? recipeCard[1].classList.add("recipe-card__hero--active") : recipeCard[i].classList.add("active")
  } else {
    recipeCard[0].classList.add("active")
  }

  arrowButtons(index, recipeCard)
}


const arrowButtons = (index, card) => {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  let i = 0;

  sliderBtnL[index].addEventListener("click", () => {
    slideShow("left")
  })

  sliderBtnR[index].addEventListener("click", () => {
    slideShow("right")

  })

  //makes the recipe cards act in a slideshow with adding and removind active classes
  //desktop >1500px shows 5 recipes at a time, while mobile only shows one at one time.
  const slideShow = (btn) => {
    card.forEach((item) => item.classList.remove("active", "recipe-card__hero--active"))

    if (btn === "right") {
      i < card.length - 1 ? i++ : i = 0
    } else {
      i > 0 ? i-- : i = card.length - 1
    }
    if (width >= 1500) {
      card[i].classList.add("recipe-card__hero--active")
      card[i].nextElementSibling.classList.add("active")
      card[i].nextElementSibling.nextElementSibling.classList.add("active")
      card[i].previousElementSibling.classList.add("active")
      card[i].previousElementSibling.previousElementSibling.classList.add("active")

    } else if (width >= 700) {
      card[i].classList.add("recipe-card__hero--active")
      card[i].nextElementSibling.classList.add("active")
      card[i].previousElementSibling.classList.add("active")
    } else {
      card[i].classList.add("active")
    }
  }
}

//fetches the specific recipe clicke on and displays a recipe popup with more info (ingridients etc.)
const openRecipe = (rValue) => {
  const recipeApiUrl = `https://api.edamam.com/search?r=${rValue}&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8`

  fetch(recipeApiUrl)
    .then((response) => response.json())
    .then((recipeData) => {

      const myPopup = window.open("./recipe.html", "_blank");

      myPopup.onload = function () {
        const recipeImage = myPopup.document.getElementById("recipeImage")
        const recipeIngredients = myPopup.document.getElementById("recipeIngredients")
        const recipeFactsMain = myPopup.document.getElementById("factTable")
        const recipeFactsAll = myPopup.document.getElementById("factTable2")

        recipeImage.innerHTML = `
          <div class="recipe-image__container"> 
            <img src="${recipeData[0].image}"/>
          </div>
          <h1> ${recipeData[0].label}</h1>
          <a href="${recipeData[0].shareAs}" target="_blank"> Full recipe </a>
        `
        recipeData[0].ingredients.forEach((ing) => {
          recipeIngredients.innerHTML += `
            <div class="recipe-description__ingrd-list">
              <li>${ing.text}</li>
            </div>
          `
        })

        recipeFactsMain.innerHTML += `
        <tr>
          <td>Calories</td>
          <td>${Math.round(recipeData[0].calories)} kcal</td>
          <td></td>
      </tr>`

        //filters nutritional info to what should be displayed at the desktop recipe.html site
        const filteredData = recipeData[0].digest.filter((n) =>
          (n.label !== "Folat (food)" && n.label !== "Sugar alcohols" && n.label !== "Water"))

        filteredData.forEach((item) => {
          if (item.label === "Fat" || item.label === "Carbs" || item.label === "Protein" || item.label === "Cholesterol") {
            recipeFactsMain.innerHTML += `
          <tr>
            <td>${item.label}</td>
            <td>${Math.round(item.total)} g</td>
            <td>${Math.round(item.daily)} %</td>
        </tr>`
          } else {
            recipeFactsAll.innerHTML += `
          <tr>
            <td>${item.label}</td>
            <td>${Math.round(item.total)} g</td>
            <td>${Math.round(item.daily)} %</td>
        </tr>`

          }
        })

      }
    })
    .catch((error) => console.log(error))
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
  filterUserInput.value = ""
  checkbox.forEach(item => item.checked = false);
  checkboxFilter.forEach(item => item.checked = false);
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
  handleUserInput(userInput.value, "value")
  clearAll()
})

filterBtn.addEventListener("click", (event) => {
  event.preventDefault()
  handleUserInput(userInput.value, "value")
  clearAll()
})

for (let i = 0; i < quickChoiceBtn.length; i++) {
  quickChoiceBtn[i].addEventListener("click", (event) => {
    event.preventDefault()
    i === 3 ?
      fetchRecipes(`https://api.edamam.com/search?q=&app_id=38a129f8&app_key=ad250481ec39e7ffc0c0904ddbc693f8&health=${quickChoiceBtn[i].value}`) :
      handleUserInput(quickChoiceBtn[i].value, "value")
  })
  clearAll()
}

for (let i = 0; i < searchOptionBtn.length; i++) {
  searchOptionBtn[i].addEventListener("click", () => {
    handleUserInput(searchOptionBtn[i].value, "mealType")
  })
  clearAll()
}

generateStartSite()