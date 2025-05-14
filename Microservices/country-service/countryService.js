const axios = require('axios');

const fetchCountry = async (countryName) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryName}`);
    const country = response.data[0];

    if (!country) {
      return { error: 'Country not found' };
    }

    const countryData = {
      name: country.name.common,
      currency: country.currencies ? Object.keys(country.currencies).map(curr => ({
        code: curr,
        name: country.currencies[curr].name,
        symbol: country.currencies[curr].symbol
      })) : [],
      capital: country.capital ? country.capital[0] : 'N/A',
      flag: country.flags ? country.flags.svg : ''
    };

    return countryData;
  } catch (error) {
    return { error: 'Failed to fetch country data' };
  }
};

module.exports = { fetchCountry };
