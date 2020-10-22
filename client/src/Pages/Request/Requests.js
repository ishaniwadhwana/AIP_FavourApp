import React from 'react';
import RequestListItem from './RequestListItem';

const Requests = ({ requests, searchTerm }) => {

    return requests
        .filter(
            request =>
                request.task.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(request => (
            request.fullfillerid === null &&
            <RequestListItem
                key={request.requestid}
                requestid={request.requestid}
                username={request.username}
                task={request.task}
                dateCreated={request.datecreated}
            />
        ))
}
export default Requests;