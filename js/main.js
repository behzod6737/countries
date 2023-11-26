// utils

const getElement = (element, parentElement = document) => parentElement.querySelector(element)
const createNewElement = (element) => document.createElement(element)

// Variables
const CONFIG = 'https://restcountries.com/v3.1/'
const countryWrapper = getElement('.countries__wrapper')
const elTemplate = getElement('.template').content
const darkModeBtn = getElement('.header__button')

const elForm = getElement('.search__form')
const elFormSearch= getElement('.search__input-country')
const elFormSelect = getElement('.search__select')
const elFormSelectBtn = getElement('.search__btn')

// fetching data  with reusable  function

function makeRequest(url,successFn, emptyFn) {
	countryWrapper.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'
	fetch(url)
	.then(response => response.json())
	.then(data => {
		if (data.length > 0 )  successFn(data)
		else emptyFn()
	})
}

function emptyFn() {
	countryWrapper.innerHTML = '<p style="text-align: center; font-size: 20px; font-weight: bold; color: red;">country not found :( </p>'
}

;(function getAllCountries() {
	makeRequest(CONFIG + 'all',renderCountry,emptyFn)
})()

;(function getAllRegions() {
	makeRequest(CONFIG + 'all/',renderSelect,emptyFn)
})()

// ! render the country card

function renderCountry(countries){
	countryWrapper.innerHTML = null
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

	countryWrapper.append(newFragment)
}

// ! render the select region

function renderSelect(countries) {
 elFormSelect.innerHTML = null
 elFormSelect.innerHTML =  '<option value="All">All</option>'
 const selectFragment = document.createDocumentFragment()
let newRegions = []

for (const country of countries) {
	if(newRegions.includes(country.region)){
		continue
	}
	else newRegions.push(country.region)
}
	
 newRegions.forEach(region => {
	const option = createNewElement('option')
	option.textContent = region 
	option.className = 'select__option'
	option.value = region
	selectFragment.append(option)
 })

 elFormSelect.append(selectFragment)
}


// ! dom events

if (elFormSearch) {
	elFormSearch.addEventListener('input', () =>{
		if (elFormSearch.value.trim()) {
			makeRequest(CONFIG + 'name/' + elFormSearch.value.toLowerCase() , renderCountry , emptyFn)
		}else makeRequest(CONFIG + 'all',renderCountry,emptyFn)
	})
}

elForm.addEventListener('submit', (e) => {
	e.preventDefault()

	if(elFormSelect.value == 'All') return makeRequest(CONFIG + 'all',renderCountry,emptyFn)
	else  makeRequest(CONFIG + 'region/' + elFormSelect.value.toLowerCase(),renderCountry,emptyFn)
	
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