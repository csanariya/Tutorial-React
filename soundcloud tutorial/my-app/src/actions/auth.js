/*
export function login() {
    return (dispatch) => {
    // We use this to update the store state of `isLoggingIn`          
    // which can be used to display an activity indicator on the login
    // view.
    dispatch(loginRequest())

    const hash = 'Y3NhbmFyaXlhOjkzQjA4REFDLTNBMUUtNEYyNC1CQjYwLUU0MTg2NDBBRkU0MHwx'
    return fetch('https://emazz.mainvan.us/v4/actiontypes', {
      headers: {
        'Authorization': `Basic ${hash}`
      }
    })
    .then(response => response.json().then(json => ({ json, response })))
    .then(({json, response}) => {
      if (response.ok === false) {
        return Promise.reject(json)
      }
      return json
    })
    .then(
      data => {
        // data = { authenticated: true, user: 'admin' }
        // We pass the `authentication hash` down to the reducer so that it
        // can be used in subsequent API requests.

        dispatch(loginSuccess(hash, data.user))
      },
      (data) => dispatch(loginFailure(data.error || 'Log in failed'))
    )
    }
}
*/

export function auth() {
    fetchMe();
};

function fetchMe() {
    const hash = 'Y3NhbmFyaXlhOjkzQjA4REFDLTNBMUUtNEYyNC1CQjYwLUU0MTg2NDBBRkU0MHwx'

    fetch('https://emazz.v/v4/actiontypes', {
      headers: {
        'Authorization': `Basic ${hash}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    })
    .then((response) => response.json())
    .then((data) => {
            console.log(data);
        });
}