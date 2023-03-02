import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchField.addEventListener(
  'input',
  debounce(searchHandler, DEBOUNCE_DELAY)
);

function searchHandler(e) {
  const searchValue = e.target.value.trim();

  if (!searchValue) {
    clearInfoMarkup();
    clearListMarkup();
    return;
  }

  fetchCountries(searchValue)
    .then(changeMarkup)
    .catch(() => {
      clearInfoMarkup();
      clearListMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderListMarkup(countries) {
  return countries
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="${name.common}" width=50>
        <h3 class="country-list__text">${name.common}</h3>
      </li>`
    )
    .join('');
}

function renderInfoMarkup(countries) {
  return countries
    .map(({ name, capital, population, flags, languages }) => {
      const langs = Object.values(languages).join(', ');

      return `
      <div class="country-info__title">
        <img class="country-info__flag" src="${flags.svg}" alt="${name.common}" width=50/>
        <h2 class="country-info__name">${name.common}</h2>
      </div>

      <ul class="country-info__data">
        <li class="country-info__item"><span>Capital: </span>${capital}</li>
        <li class="country-info__item"><span>Population: </span>${population}</li>
        <li class="country-info__item"><span>Languages: </span>${langs}</li>
      </ul>`;
    })
    .join('');
}

function addListMarkup(countries) {
  refs.countryList.innerHTML = renderListMarkup(countries);
}

function addInfoMarkup(countries) {
  refs.countryInfo.innerHTML = renderInfoMarkup(countries);
}

function clearListMarkup() {
  refs.countryList.innerHTML = '';
}

function clearInfoMarkup() {
  refs.countryInfo.innerHTML = '';
}

function changeMarkup(countries) {
  const quantityOfCountries = countries.length;

  if (quantityOfCountries > 10) {
    clearListMarkup();
    clearInfoMarkup();
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (quantityOfCountries === 1) {
    clearListMarkup();
    addInfoMarkup(countries);
  } else {
    clearInfoMarkup();
    addListMarkup(countries);
  }
}
