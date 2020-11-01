import React, { useEffect, useState } from "react";
import axios from "axios";
import UserprofileItem from "./userProfileitems";

import UserOwesStats from "./UserOwes";
import PeopleOwes from "./otherOwes";
import UserRequests from "./UserRequests";
import RequestsAccepted from "./RequestsHandler";
import History from "./History";


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

  // const displayContent = <History />;
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
      {/* <PartyNotice /> */}
      <div>
        <ul className="user-list">
          <UserprofileItem
            userid={loadedUser.userid}
            username={loadedUser.username}
            // image={profileImg}
            favors={loadCompletedFavors + " favors repaid"}
          />
        </ul>
      </div>
      <div>
        <ul className="profile-navigation">
          <li>
            <button onClick={() => displayItem("iowe")}>What I Owe</button>
          </li>
          <li>
            <button onClick={() => displayItem("peopleowe")}>What People Owe Me</button>
          </li>
          <li>
            <button onClick={() => displayItem("myRequests")}>My Requests</button>
          </li>
          <li>
            <button onClick={() => displayItem("requestsAccepted")}>Request Accepted</button>
          </li>
          <li>
            <button onClick={() => displayItem("history")}>Transaction History</button>
          </li>

        </ul>
        <div>{displayContent}</div>
      </div>
    </React.Fragment>
  );
};

export default Users;
