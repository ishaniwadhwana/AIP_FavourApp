import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../handler/ButtonHandler";
import Pagination from "../../handler/PageHandler";
// import "./UserStatsNav.css";

const PeopleOwes = () => {
  const [loadFavorsLent, setFavorsLent] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [favorsPerPage] = useState(10);
  // Getting user data for the favors owed by people
  useEffect(() => {
    async function fetchFavorsLent() {
      try {
        const response = await axios.get(`/api/profile/user/favors`);
        setFavorsLent(response.data.data.favorLentByUser);
      } catch (err) {
        console.error(err);
      }
    }
    fetchFavorsLent();
  }, []);

  // Get current favors
  const lastFavor = currentPage * favorsPerPage;
  const firstFavor = lastFavor - favorsPerPage;
  const currentList = loadFavorsLent.slice(firstFavor, lastFavor);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {loadFavorsLent.length === 0 ? (
        <React.Fragment>
          <h3 className="message-peopleowe">
            It seems thats no one owes you a favor. Why don't you create a new
            favor?
          </h3>
          <p className="new-favor">
            <Button to="/create-favor" className="newbutton">
              + New Favor
            </Button>
          </p>
        </React.Fragment>
      ) : (
          <React.Fragment>
            <table className="stats">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Who Owe Me?</th>
                  <th> What They Owe?</th>
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
                        <Button to={`/favor/people/${item.favorid}`}>
                          See More
                      </Button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
            <div className="profile-pagination">
              <Pagination
                itemsPerPage={favorsPerPage}
                totalItems={loadFavorsLent.length}
                paginate={paginate}
              />
            </div>
          </React.Fragment>
        )}
    </div>
  );
};

export default PeopleOwes;
