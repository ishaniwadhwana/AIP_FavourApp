import axios from 'axios';

// Function to check if the user is logged in or not

export const AuthHandler = () => {
    let isLoggedIn = false
    try {
        axios.get(`/api/auth/check_login`).then((res) => {
            isLoggedIn = true
            console.log('Auth: ', isLoggedIn)
            return isLoggedIn
        }
        );
    } catch (err) {
        console.error(err);
    // sending a log for the user not logged in
    }

    return isLoggedIn

}


