import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../handler/ButtonHandler";
import PageHandler from "../../handler/PageHandler";
// import "./UserStatsNav.css";

const UserOwesStats = () => {
  const [loadFavorsBorrowed, setFavorsBorrowed] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [favorsPerPage] = useState(10);
  // Getting user data for the favors he owe
  useEffect(() => {
    async function fetchFavorsBorrowed() {
      try {
        const response = await axios.get(`/api/profile/user/favors`);
        setFavorsBorrowed(response.data.data.favorBorrowedByUser);
      } catch (err) {
        console.error(err);
      }
    }
    fetchFavorsBorrowed();
  }, []);

  // Get current favors
  const lastFavor = currentPage * favorsPerPage;
  const firstFavor = lastFavor - favorsPerPage;
  const currentList = loadFavorsBorrowed.slice(firstFavor, lastFavor);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {loadFavorsBorrowed.length === 0 ? (
        <React.Fragment>
          <h3 className="message-userowe">You don't owe anyone a favor.</h3>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <table className="stats">
            <thead>
              <tr>
                <th>ID</th>
                <th>Who I Owe?</th>
                <th> What I Owe?</th>
              </tr>
            </thead>
            {currentList.map((item, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <td>{item.favorid}</td>
                    <td>{item.username}</td>
                    <td>
                      {item.quantity} x {item.itemname}
                    </td>
                    <td>
                      <Button to={`/favor/user/${item.favorid}`}>
                        See More
                      </Button>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
          <div className="profile-pagination">
            <PageHandler
              itemsPerPage={favorsPerPage}
              totalItems={loadFavorsBorrowed.length}
              paginate={paginate}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default UserOwesStats;
