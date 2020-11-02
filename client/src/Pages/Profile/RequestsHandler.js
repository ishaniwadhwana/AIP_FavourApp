import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../handler/ButtonHandler";
import PageHandler from '../../handler/PageHandler';
import RewardItemList from '../Reward/RewarditemList';
// import "./UserStatsNav.css";

const RequestsAccepted = () => {
  const [loadAcceptedRequests, setAcceptedRequests] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  //Getting the data for requests accepted by the user
  useEffect(() => {
    async function fetchAccpetedRequests() {
      try {
        const response = await axios.get(`/api/profile/user/myRequests`);
        setAcceptedRequests(response.data.data.requestAccepted);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAccpetedRequests();
  }, []);

  // Get current requests
  const lastRequest = currentPage * requestsPerPage;
  const firstRequest = lastRequest - requestsPerPage;
  const currentList = loadAcceptedRequests.slice(firstRequest, lastRequest);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      {loadAcceptedRequests.length === 0 ? (
        <React.Fragment>
          <h3 className="message-acceptedRequest">No Requests Accepted.</h3>
        </React.Fragment>
      ) : (
          <React.Fragment>
            <table className="stats">
              <thead>
                <tr>
                  <th>Who Asked</th>
                  <th>Description</th>
                  <th>Reward</th>
                </tr>
              </thead>
              {currentList.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{item.username}</td>
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
            <div className="profile-pagination">
              <PageHandler
                itemsPerPage={requestsPerPage}
                totalItems={loadAcceptedRequests.length}
                paginate={paginate} />
            </div>
          </React.Fragment>
        )}
    </div>
  );
};
export default RequestsAccepted;
