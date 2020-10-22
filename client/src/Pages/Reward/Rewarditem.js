import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios';
import { withRouter, useHistory } from 'react-router-dom';
import { addNotification } from '../../handler/AlertHandler';

// import './RewardItem.css';

const RewardItem = ({ rewardid, item, quantity, user, userid }) => {
    let history = useHistory();
    let [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        async function fetchData() {
            try {
                await axios.get(`/api/auth/check_login`)
                setIsLoggedIn(true)

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [isLoggedIn]);


    const onClick = async () => {
        try {
            await axios.delete(`/api/rewards/${rewardid}`);

            addNotification('Reward deleted', 'The reward is successfully deleted!', 'success')

            history.go(0);
        } catch (err) {
            console.error(err.message)
            addNotification('Reward failed to delete', 'The reward cannot be deleted', 'danger')
        }

    }

    return (
        <Fragment>
            <tr>
                <td className="rewardItem-td">{item}</td>
                <td className="rewardItem-td">{quantity}</td>
                <td className="rewardItem-td">{user}</td>
                {isLoggedIn && <td><button className='request-delete-btn' onClick={() => onClick()}>Delete</button></td>}
            </tr>
        </Fragment>
    );

}

export default withRouter(RewardItem);
