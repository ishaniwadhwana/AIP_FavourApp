import React, { Fragment } from 'react'
import Moment from 'react-moment';
import RewardItemList from '../Reward/RewarditemList';
import Button from '../../handler/ButtonHandler';

const RequestListItem = ({ requestid, username, task, dateCreated }) => {
    return (
        <Fragment key={requestid}>
            <tr>
                <td>
                    <Moment format='YYYY/MM/DD'>{dateCreated}</Moment>
                </td>
                <td>{username}</td>
                <td>{task}</td>
                <td>
                    <RewardItemList
                        requestid={requestid} />
                </td>
                <td>
                    <Button to={`/request/${requestid}`}>See more</Button>
                </td>
            </tr>

        </Fragment>
    );
}
export default RequestListItem
