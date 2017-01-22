// export const API_URL = 'http://localhost:5000/api/v1';
export const API_URL = 'https://cageur-staging.herokuapp.com/api/v1';
export const API_HEADERS = {
  'Content-Type': 'application/json'
}

console.log('ENV: ', process.env.CAGEUR_API_URL);
