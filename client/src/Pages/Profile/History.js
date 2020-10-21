import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
//import Button from "../../shared/components/UIElements/Button";
import PageHandler from "../../handler/PageHandler";
// import "./UserStatsNav.css";

const History = () => {
  const [loadPeoplePaidHistory, setPeoplePaidHistory] = useState([]);
  const [loadUserPaidHistory, setUserPaidHistory] = useState([]);

  const [currentPageOfPeople, setCurrentPageOfPeople] = useState(1);
  const [currentPageOfUser, setCurrentPageOfUser] = useState(1);
  const [itemsPerPage] = useState(5);

  // Getting the transaction history of the user
  useEffect(() => {
    async function fetchHistoryData() {
      try {
        const response = await axios.get(`/api/profile/user/history`);
        setPeoplePaidHistory(response.data.data.peoplePaid);
        setUserPaidHistory(response.data.data.userPaid);
      } catch (err) {
        console.error(err);
      }
    }
    fetchHistoryData();
  }, []);

  // Get history of favors people owe to user
  const lastPeopleHistory = currentPageOfPeople * itemsPerPage;
  const firstPeopleHistory = lastPeopleHistory - itemsPerPage;
  const currentListOfPeople = loadPeoplePaidHistory.slice(
    firstPeopleHistory,
    lastPeopleHistory
  );

  // Get history of favors user owes to people
  const lastUserHistory = currentPageOfUser * itemsPerPage;
  const firstUserHistory = lastUserHistory - itemsPerPage;
  const currentListOfUser = loadUserPaidHistory.slice(
    firstUserHistory,
    lastUserHistory
  );
  // Change page
  const paginationOfPeople = (pageNumber) => setCurrentPageOfPeople(pageNumber);
  const paginationOfUser = (pageNumber) => setCurrentPageOfUser(pageNumber);

  return (
    <div>
      <h3 className="message-history">People Paid You</h3>
      {loadPeoplePaidHistory.length === 0 ? (
        <h4 className="message-history">No History Available</h4>
      ) : (
        <Fragment>
          <div>
            <table className="stats">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Reward</th>
                </tr>
              </thead>
              {currentListOfPeople.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{item.favorid}</td>
                      <td>{item.username}</td>
                      <td>
                        {item.quantity} x {item.itemname}
                      </td>
                      {/* <td>
                        <Button to={`/history/${item.favorid}`}>
                          See More
                        </Button>
                      </td> */}
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <div className="profile-pagination">
              <PageHandler
                itemsPerPage={itemsPerPage}
                totalItems={loadPeoplePaidHistory.length}
                paginate={paginationOfPeople}
              />
            </div>
          </div>
        </Fragment>
      )}

      <h3 className="message-history">You Paid</h3>
      {loadUserPaidHistory.length === 0 ? (
        <h4 className="message-history">No History Available</h4>
      ) : (
        <Fragment>
          <div>
            <table className="stats">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Reward</th>
                </tr>
              </thead>
              {currentListOfUser.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>{item.favorid}</td>
                      <td>{item.username}</td>
                      <td>
                        {item.quantity} x {item.itemname}
                      </td>
                      {/* <td>
                        <Button to={`/history/${item.favorid}`}>
                          See More
                        </Button>
                      </td> */}
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <div className="profile-pagination">
              <PageHandler
                itemsPerPage={itemsPerPage}
                totalItems={loadUserPaidHistory.length}
                paginate={paginationOfUser}
              />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};
export default History;
