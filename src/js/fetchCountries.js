const filter = new URLSearchParams({
  fields: encodeURI('name,capital,population,flags,languages'),
});

export const fetchCountries = request => {
  return fetch(`https://restcountries.com/v3.1/name/${request}?${filter}`).then(
    response => {
      if (response.status === 404) {
        throw new Error();
      }

      return response.json();
    }
  );
};
