import axios from 'axios';
import { withRouter, useHistory } from 'react-router-dom';

// import "./Register.css";


//Logs out the current user

// Reference: https://serverless-stack.com/chapters/redirect-on-login-and-logout.html
const Logout = async () => {
    let history = useHistory();
    try {
        await axios.get(`/api/auth/logout`)
        history.go(0);
    } catch (err) {
        console.error(err.message)
    }
}

export default withRouter(Logout)
