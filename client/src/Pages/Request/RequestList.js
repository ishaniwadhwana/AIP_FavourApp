import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import pageHandler from "../../handler/PageHandler";
import Requests from './Requests';
import "bootstrap/dist/css/bootstrap.min.css";

const RequestList = () => {

    const [requests, setRequests] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [requestsPerPage] = useState(10);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get('/api/requests'); 
                setRequests(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const lastRequest = currentPage * requestsPerPage;
    const firstRequest = lastRequest - requestsPerPage;
    const currentList = requests.slice(firstRequest, lastRequest);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const onChange = e => {
        setSearchTerm(e.target.value)
        // console.log(searchTerm)
    };

    return (
        <Fragment>
            <div className="container p-3 my-3 bg-dark text-white">
                <h3>Current Requests</h3>
                <div className="request-search">
                    <input type="text" placeholder="Search by task" value={searchTerm} onChange={onChange} />
                </div>
                <table className="request-table">
                    <thead>
                        <tr>
                            <th>Date Created</th>
                            <th>Requester</th>
                            <th>Task</th>
                            <th>Rewards</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Requests requests={currentList} searchTerm={searchTerm} />
                    </tbody>
                </table>
                <pageHandler
                    itemsPerPage={requestsPerPage}
                    totalItems={requests.length}
                    paginate={paginate} />

            </div>
        </Fragment>
    )
}

export default RequestList


