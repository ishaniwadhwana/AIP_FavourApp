import React, { useState, Fragment } from 'react'
import axios from 'axios';
import { withRouter, useHistory } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';

// import './RequestForm.css';
import '../../handler/ButtonHandler';
// import '../../../node_modules/react-notifications-component/dist/theme.css'

const RequestForm = () => {
    const [formData, setFormData] = useState({
        task: '',
    });

    let history = useHistory();

    const { task } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        const newRequest = {
            task
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(newRequest);

            const newPost = await axios.post(`/api/requests`, body, config)

            const newPostId = newPost.data.data.user.requestid

            // Redirect to the Request detail page
            history.push(`/request/${newPostId}`);

        } catch (err) {
            console.error(err.message);
            addNotification('Submission failed', 'Task should be less than 250 characters in English', 'danger');
        }
    };

    return (
        <Fragment>
            <div className="request-container">
                <h1>Post a request</h1>
                <div>
                    <div>Describe the task<span>*</span></div>
                    <form onSubmit={e => onSubmit(e)}>
                        <textarea className="request-textarea" type="text" name="task" value={task} onChange={e => onChange(e)} required="required" />
                        <div className='request-warning'>Task should be less than 250 characters</div>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </Fragment>

    )
}


export default withRouter(RequestForm)
