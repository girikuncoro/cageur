import {API_URL} from '../common/constant';

module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    loginRequest(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        if (cb) cb(true)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  onChange() {}
}

function loginRequest(email, pass, cb) {

    const endpoint = '/auth';
    const body = {
      email: email,
      password: pass
    }
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    })
    .then(function(response) {
      if (response.ok) {
        return response.json()
      } else {
        return cb({
          authenticated: false,
        })
      }
    })
    .then((responseData) =>
      cb({
        authenticated: true,
        token: responseData.token
      })
      // // If login was successful, set the token in local storage
      // localStorage.setItem('token', responseData.token);
      //
      // // Redirect to dashboard
      // this.props.router.push("/dashboard");
    )
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      return cb({
        authenticated: false,
      })
    })
}
