import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.getElementById('search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

searchBox.addEventListener('input', debounce(getCountryData, DEBOUNCE_DELAY));

function getCountryData(e) {
  const countryName = e.target.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (!countryName) {
    return;
  }

  fetchCountries(countryName).then(data => {
    if (data.length === 1) {
      markupCountry(data[0]);
    } else if (data.length >= 2 && data.length <= 10) {
      markupCountries(data);
    } else if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
    }
  });
}

function markupCountry(countryData) {
  const { flags, name, capital, population, languages } = countryData;
  return countryInfo.insertAdjacentHTML(
    'beforeend',
    `<div class=blok>
    <div class=country-info>
        <img src=${flags.svg} alt=${name.official} width=40px/>
        <p class=country-name> ${name.official}</p>
    </div>
    <ul>
        <li class=country-item>
            <p><b>Capital:</b></p> ${capital}</li>
        <li class=country-item>
            <p><b>Population:</b></p> ${population}</li>
        <li class=country-item>
            <p><b>Languages:</b></p> ${Object.values(languages)}</li>
    </ul>
    </div>
    `
  );
}

function markupCountries(countryData) {
  countryData.map(country => {
    const { flags, name } = country;
    return countryList.insertAdjacentHTML(
      'beforeend',
      `<li class=country-item>
        <img src=${country.flags.svg} alt=${country.name.official} width=40px/>
        <p>${country.name.official}</p>
    </li>`
    );
  });
}
