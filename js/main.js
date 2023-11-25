let countries = []

// fetching data 

fetch('https://restcountries.com/v3.1/all')
.then(response => response.json())
.then(data => {
	countries = data.slice(100,116);
	renderCountry(countries,countryWrapper)
	renderSelect(countries,elFormSelect)
})
.catch(error => console.log(error))



// utils

const getElement = (element, parentElement = document) => parentElement.querySelector(element)
const createNewElement = (element) => document.createElement(element)

// Variables
const countryWrapper = getElement('.countries__wrapper')
const elTemplate = getElement('.template').content
const darkModeBtn = getElement('.header__button')

const elForm = getElement('.search__form')
const elFormSearch= getElement('.search__input-country')
const elFormSelect = getElement('.search__select')
const elFormSelectBtn = getElement('.search__btn')


// ! render the country card

function renderCountry(countries,goingEl){
	goingEl.innerHTML = null
	const newFragment = document.createDocumentFragment()
   
	countries.forEach(country => {
		const template = elTemplate.cloneNode(true)
		getElement('.card__img',template).src = country.flags.png;
		getElement('.content__heading',template).textContent = country.name.common
		getElement('.info-population',template).textContent = country.population.toLocaleString('en-US')
		getElement('.info-region',template).textContent = country.region
		getElement('.info-capital',template).textContent = country.capital
		newFragment.append(template)
	})

	goingEl.append(newFragment)
}

// ! render the select region

function renderSelect(countries,goingEl) {
 goingEl.innerHTML = null
 goingEl.innerHTML =  '<option value="All">All</option>'
 const selectFragment = document.createDocumentFragment()
 let filteredRegion = []
	
	for (const country of countries) {
		if(filteredRegion.includes(country.region)){
			continue
		}
		filteredRegion.push(country.region)
	}
	
 filteredRegion.forEach(region => {
	const option = createNewElement('option')
	option.textContent = region
	option.className = 'select__option'
	option.value = region
	selectFragment.append(option)
 })

 goingEl.append(selectFragment)
}


// ! dom events

elFormSearch.addEventListener('input', () =>{
	renderCountry(countries.filter(country => country.name.common.toLowerCase().includes(elFormSearch.value.toLowerCase())),countryWrapper)
})

elForm.addEventListener('submit', (e) => {
	e.preventDefault()

	if(elFormSelect.value == 'All') return renderCountry(countries,countryWrapper)
	renderCountry(countries.filter(country => country.region.includes(elFormSelect.value) ),countryWrapper)
})

// ! dark mode dom event

darkModeBtn.addEventListener('click' , () => {
	document.body.classList.toggle('body-white-mode')
	if (!document.body.matches('.body-white-mode')) {
		darkModeBtn.textContent = 'Light mode'
	}else if(document.body.matches('.body-white-mode')){
		darkModeBtn.textContent = 'dark mode'
	}
})