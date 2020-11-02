import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../handler/ButtonHandler";
import PageHandler from '../../handler/PageHandler';
import RewardItemList from '../../Pages/Reward/RewarditemList';

import { withRouter } from "react-router-dom";


const UserRequests = () => {
  const [loadMyRequests, setMyRequests] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  // Getting data of the users for the requests created by him
  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get(`/api/profile/user/myRequests`);
        setMyRequests(response.data.data.request);
       
      } catch (err) {
        console.error(err);
      }
    }
    fetchRequests();
  }, []);

  // Get current requests
  const lastRequest = currentPage * requestsPerPage;
  const firstRequest = lastRequest - requestsPerPage;
  const currentList = loadMyRequests.slice(firstRequest, lastRequest);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      {loadMyRequests.length === 0 ? (
        <React.Fragment>
          <h3 className="message-myrequest">
            No available requests. You want to create one?
          </h3>
          <p className="new-favor">
            <Button className="newbutton" to="/create-request">+ New Request</Button>
          </p>
        </React.Fragment>
      ) : (
          <React.Fragment>
            <div>
              <table className="stats">
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Reward</th>
                  </tr>
                </thead>
                {currentList.map((item, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td>{item.task}</td>
                        <td><RewardItemList requestid={item.requestid} /></td>
                        <td>
                          <Button to={`/request/${item.requestid}`}>See More</Button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
              <div className='profile-pagination'>
                <PageHandler
                  itemsPerPage={requestsPerPage}
                  totalItems={loadMyRequests.length}
                  paginate={paginate} />
              </div>
            </div>

          </React.Fragment>
        )}
    </div>
  );
};
export default withRouter(UserRequests);
