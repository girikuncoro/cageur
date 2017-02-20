export const API_URL = 'http://localhost:5000/api/v1';
// export const API_URL = 'https://cageur-api-staging.herokuapp.com/api/v1';
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlN1cGVyIFVsdHJhIEFkbWluIiwiZW1haWwiOiJwcmloYW50b3JvLnJ1ZHlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkZ254b0xzLkJpTUZXZVk1RGptOVZMT2NYL20yVzU5NlhrMFVKUGJtRVFKcTc3ZmlTSWw4Mk8iLCJyb2xlIjoic3VwZXJhZG1pbiIsImNsaW5pY19pZCI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMTctMDItMjBUMDI6MTA6NDcuNzI1WiIsInVwZGF0ZWRfYXQiOiIyMDE3LTAyLTIwVDAyOjEwOjQ3LjcyNVoiLCJpYXQiOjE0ODc1NTcyMzQsImV4cCI6MTQ4NzU2NzMxNH0.3SRCvZsJ9SW2fqcA0-QzOMzU4rWBQxy7YzErd4IDCWw"
}
console.log('ENV: ', process.env.CAGEUR_API_URL);
