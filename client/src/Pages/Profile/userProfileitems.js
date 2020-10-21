import React from "react";
import Card from "../../handler/CardHandler";
import Avatar from "../../handler/profileHandler";
import { Link } from "react-router-dom";

import Button from "../../handler/ButtonHandler";
// import "./UserProfileItem.css";

//setting the user profile data
const UserProfileItem = (props) => {
  return (
    <React.Fragment>
      <li className="user-item">
        <Card className="user-item__content">
          <Link to={`/${props.userid}/profile`}>
            <div className="user-item__image">
              <Avatar image={props.image} alt={props.username} />
            </div>
          </Link>
          <div className="user-item__info">{props.username}</div>
          <div className="user-item__favors">{props.favors}</div>
          <div className="button-items">
            <Button to="/create-favor">+ New Favor</Button>
            <Button to="/create-request">+ New Request</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default UserProfileItem;
