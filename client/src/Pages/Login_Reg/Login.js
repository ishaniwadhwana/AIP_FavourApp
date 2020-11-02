import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withRouter, useHistory, Redirect } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';


import Button from '../../handler/ButtonHandler';


const Login = () => {
    let [isLoggedIn, setIsLoggedIn] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        passwords: '',
    });
    let history = useHistory();

    // Check if user is logged in and Redirect the user if logged in successfull
    useEffect(() => {
        async function fetchData() {
            try {
                await axios.get(`/api/auth/check_login`);
                setIsLoggedIn(true)
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    
    if (isLoggedIn) {
        return <Redirect to='/profile' />;
    }

    const { email, passwords } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
// Reference: https://stackoverflow.com/questions/62493433/post-request-using-fetch-with-async-await-on-submit
    const onSubmit = async e => {
        e.preventDefault();
        try {

            const loginInformation = {
                email,
                passwords
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const body = JSON.stringify(loginInformation);
            await axios.post('/api/auth/login', body, config);
            addNotification("Login completed", "You have been successfully registered!", "success");
            history.go(0);
          

            // throw an error if login details are incorrect
        } catch (err) {
            console.error(err);
            const errorTitle = err.response.data.errors[0].title;
            if (errorTitle === 'Email') {
                addNotification("Login error", "Email not found", "danger")
            } else if (errorTitle === 'Password') {
                addNotification("Login error", "Password does not match the email", "danger")
            } else {
                addNotification("Login error", "Login failed", "Please try again", "danger")
            }
        }
    };

    return (
        <Fragment>
            <div className="register-container">
                <h1>LOGIN</h1>
                <div>
                    <form className='login-form-container' onSubmit={e => onSubmit(e)}>
                        <div className="register-form">
                            <label>Email<span>*</span></label>
                            <input type="email" name="email" value={email} onChange={e => onChange(e)} data-name="Email" required />
                            <label>Password<span>*</span></label>
                            <input type="password" name="passwords" value={passwords} onChange={e => onChange(e)} required />
                            <Button variant="primary" type="submit">Submit</Button>
                        </div>
                    </form>
                    <div>Do not have an account? <Link className='login-to-register-btn' to='/register'>Register</Link></div>
                </div>
            </div>
        </Fragment>
    )
};


export default withRouter(Login);