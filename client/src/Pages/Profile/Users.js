import React, { useEffect, useState } from "react";
import axios from "axios";
import UserprofileItem from "./userProfileitems";

import UserOwesStats from "./UserOwes";
import PeopleOwes from "./otherOwes";
import UserRequests from "./UserRequests";
import RequestsAccepted from "./RequestsHandler";
import History from "./History";
import "bootstrap/dist/css/bootstrap.min.css";


const Users = () => {
  const [loadedUser, setLoadedUser] = useState("");
  const [loadCompletedFavors, setCompletedFavors] = useState([]);
  const [displayContent, setDisplayContent] = useState(<UserOwesStats />);

  // getting user details using userid
  useEffect(() => {
    async function fetchUser() {
      try {
        let count = 0;
        const userResponse = await axios.get(`/api/profile/user`);
        setLoadedUser(userResponse.data.data.user);
        const favorResponse = await axios.get(`/api/profile/user/favors`);
        const completedFavors = favorResponse.data.data.favorBorrow;
        completedFavors.map((item) => {
          if (item.datecompleted !== null) {
            count++;
          }
          return count;
        });
        setCompletedFavors(count);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

 
  const displayItem = (type) => {
    switch (type) {
      case "iowe":
        setDisplayContent(<UserOwesStats />);
        break;
      case 'peopleowe':
        setDisplayContent(<PeopleOwes />)
        break;
      case 'myRequests':
        setDisplayContent(<UserRequests />)
        break;
      case 'requestsAccepted':
        setDisplayContent(<RequestsAccepted />)
        break;
      case 'history':
        setDisplayContent(<History />)
        break;
      default:
        setDisplayContent(<UserOwesStats />);
    }
  }

  return (
    <React.Fragment>
      <PartyNotice />

<div className= "container">
<div className="row">
  <div className="col-sm-4">
  <UserprofileItem
            userid={loadedUser.userid}
            username={loadedUser.username}
            image={profileImg}
            favors={loadCompletedFavors + " favors repaid"}
    />
  </div>
  <div className="col-sm-4">
    <div className="card">
    <div className="card-body ">
        <h5 className="card-title"></h5>
        <ul className="list-group list-group-flush">
        <li className = "list-group-item">
            <button className = "btn btn-info" onClick={() => displayItem("iowe")}>I Owe</button>
          </li>
          <li className = "list-group-item"> 
            <button className = "btn btn-info" onClick={() => displayItem("peopleowe")}>People Owe Me</button>
          </li>
          <li className = "list-group-item">
            <button  className = "btn btn-info" onClick={() => displayItem("myRequests")}>My Requests</button>
          </li>
          <li className = "list-group-item">
            <button className = "btn btn-info" onClick={() => displayItem("requestsAccepted")}>Request Accepted</button>
          </li>
          <li className = "list-group-item">
            <button className = "btn btn-info" onClick={() => displayItem("history")}>History</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</div>
      
      <div className = "container">
        
      {displayContent}
      </div>
      
    </React.Fragment>
  );
};

export default Users;
