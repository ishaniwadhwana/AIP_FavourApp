import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
const axios = require("axios");

const PrivateRouteHandler = ({ component: Component, ...rest }) => {

    const [isLoggedIn, setLoggedIn] = useState(null);
// Adding a private route to check if the user is logged in or not using async method

    async function checkLogin() {
        try {
            const userResponse = await axios.get('/api/auth/check_login');
            if (userResponse.status === 200) {
                setLoggedIn(true);
                
            }
        } catch {
            setLoggedIn(false);
            console.log("User is not logged in");
        }
    }
    useEffect(() => {
        checkLogin();
    }, []);

    if (isLoggedIn === null) {
        return (
            <div>Loading</div>
        )
    }

    if (isLoggedIn === false) {
        return (<Route {...rest} render={(props) => <Redirect to='/login' />} />)
    }

    if (isLoggedIn === true) {
        return (<Route {...rest} render={(props) => <Component {...props} />} />)
    }
}

export default PrivateRouteHandler;