import {API_URL} from '../common/constant';

export function checkAuth() {
    // Append token to api headers
    let API_HEADERS = {
      'Content-Type': 'application/json',
    }
    API_HEADERS['Authorization'] = (localStorage) ?
                                    (localStorage.getItem('token')) : '';

    // Fetching Disease Group Data
    fetch(API_URL+'/disease_group', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
        return true
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.props.router.push("/login");
    })
}
