import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter, useHistory, Redirect } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';

// import "./Register.css";
import Button from '../../handler/ButtonHandler'
import '../../../node_modules/react-notifications-component/dist/theme.css'

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        passwords: '',
        passwordConfirm: '',
    });
    let [isLoggedIn, setIsLoggedIn] = useState(false)


    let history = useHistory();

    const { username, email, passwords, passwordConfirm } = formData;
    // Check if user is logged in.
    useEffect(() => {
        async function fetchData() {
            try {
                await axios.get(`/api/auth/check_login`);
                setIsLoggedIn(true)
            } catch (err) {
                console.error(err);
                // console.log(`user NOT logged in`);
            }
        };
        fetchData();
    }, []);

    // Redirect if logged in
    if (isLoggedIn) {
        return <Redirect to='/profile' />;
    }


    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (passwords !== passwordConfirm) {
            console.log('Password do not match')
            addNotification("Registration failed", "Password does not match", "danger")
        } else {
            const newUser = {
                username,
                email,
                passwords
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser);

                await axios.post('/api/users', body, config);

                // Login the new new user
                const userInfo = {
                    'email': email,
                    'passwords': passwords
                }
                const loginInfo = JSON.stringify(userInfo)
                await axios.post('/api/auth/login', loginInfo, config);

                addNotification("Registration complete", "You have been successfully registered!", "success")
                history.go(0);
            } catch (err) {
                console.log(err.message)

                // Display customised error message based on error title or message
                // Need some work to re-structure the code
                const errorMsg = err.response.data.errors[0].msg

                if (errorMsg.includes('email')) {
                    errorMsg.includes('valid') ? addNotification("Email not valid", "Please check the email again", "danger")
                        : addNotification("Email already exists", "Please try another email", "danger")
                } else if (errorMsg.includes('Username')) {
                    errorMsg.includes('English') ? addNotification("Username not valid", "Username should be between 3 and 20 characters in English", "danger")
                        : addNotification("Username already exists", "Please try another username", "danger")
                } else if (errorMsg.includes('password')) {
                    addNotification("Password not valid", "Password should be between 6 and 128 characters", "danger")
                } else {
                    addNotification("Registration failed", "Please try again", "danger")
                }
            }
        }
    };

    return (
        <Fragment>
            <div className="register-container">
                <h1>SIGN UP</h1>
                <div className='register-warning'><span>*</span> indicates required field</div>
                <div>
                    <form className='register-form-container' onSubmit={e => onSubmit(e)}>
                        <div className="register-form">
                            <label>User Name<span>*</span></label>
                            <div className='register-warning'>Username should be between 3 and 20 characters in English</div>
                            <input type="text" name="username" value={username} onChange={e => onChange(e)} required />
                            <label>Email address<span>*</span></label>
                            <input type="email" name="email" value={email} onChange={e => onChange(e)} data-name="Email" required />
                            <label>Password<span>*</span></label>
                            <div className='register-warning'>Password should be between 6 and 128 characters</div>
                            <input type="password" name="passwords" value={passwords} onChange={e => onChange(e)} required />
                            <label>Confirm password<span>*</span></label>
                            <input type="password" name="passwordConfirm" value={passwordConfirm} onChange={e => onChange(e)} required />
                            <Button variant="primary" type="submit">Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
};


export default withRouter(Register);
