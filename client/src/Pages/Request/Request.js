import React, { useState, useEffect, Fragment } from 'react'
import RequestItem from './Requestitem';
import RequestCompletion from './RequestComplete';
import Rewards from '../Reward/Rewards';
import axios from 'axios';
import { useParams, withRouter, useHistory } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';

import Button from '../../handler/ButtonHandler';

const Request = () => {
    const { id } = useParams();
    //below we have used Hooks to declare state variables inside a function component, and also update it (similar to this.setState)--Reference: https://reactjs.org/docs/hooks-state.html 
    const [request, setRequest] = useState('');
    const [displayRewardsForm, toggleRewardsForm] = useState(false);
    const [displayCompletionForm, toggleCompletionForm] = useState(false);
    let [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState('');

    let history = useHistory();

    //Reference: https://codesandbox.io/s/distracted-sky-d8qgn?file=/src/App.js
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/requests/${id}`);
                setRequest(res.data)
            } catch (err) {
                console.error(err);
            }

            try {
                const isUser = await axios.get(`/api/auth/check_login`)
                setIsLoggedIn(true)
                setUserId(isUser.data.data.userid)
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id, isLoggedIn, userId]);

    const deleteRequest = async () => {
        try {
            await axios.delete(`/api/requests/${id}`);
            addNotification('Request deleted', 'The request has been deleted!', 'success');
            // Redirect to the Requests list page
            history.push(`/requests`);


        } catch (err) {
            console.error(err.message)
            addNotification('Request deleted', 'The request cannot be deleted', 'danger')
        }

    }

    return (
        <Fragment>
            <div className='request-container'>
                <Button to='/requests'>Back to all requests</Button>
                <div className='request-delete'>
                    {request.requesterid === userId && <Button onClick={() => deleteRequest()}>Delete request</Button>}
                </div>
                <RequestItem
                    requestid={request.requestid}
                    requester={request.requester}
                    task={request.task}
                    dateCreated={request.datecreated}
                />
                <div className='request-reward-list'>
                    <Rewards displayRewardsForm={displayRewardsForm} />
                    {displayCompletionForm && <RequestCompletion />}
                </div>
                <div>
                    {isLoggedIn &&
                        <Button onClick={() => toggleRewardsForm(!displayRewardsForm)} type="button">
                            Click to add a reward
                        </Button>}
                    <div className="request-complete-btn">
                        {isLoggedIn &&
                            <Button onClick={() => toggleCompletionForm(!displayCompletionForm)} type="button">
                                Complete the request!
                            </Button>}
                    </div>
                </div>
                {/* {displayCompletionForm && <RequestCompletion />} */}
            </div>

        </Fragment>
    )
}

export default withRouter(Request);
