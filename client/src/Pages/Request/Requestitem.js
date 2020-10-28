import React, { Fragment } from 'react'
import Moment from 'react-moment';

const RequestItem = ({ requestid, requester, task, dateCreated }) => {
    return (
        <Fragment>
            <div className='requestItem-container'>
                <h1>Request: #{requestid}</h1>
                <div>Requester: {requester}</div>
                <div>Date Created: <Moment format='YYYY/MM/DD'>{dateCreated}</Moment></div>
                <hr />
                <h3>Task: {task}</h3>
            </div>
        </Fragment>
    );

}
RequestItem.propTypes = {

}

export default RequestItem
