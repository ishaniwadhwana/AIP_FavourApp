import React from "react";
import { Link, BrowserRouter as Router, Redirect, Route, Switch, NavLink } from "react-router-dom";
//import "./ProfileNavLinks.css";

// setting the navigation link of user profile page
const ProfileNavLinks = (props) => {
  const userid = props.item;

  return (
    <ul className="profile-navigation">
      <li>
        <NavLink to={`/${userid}/iowe/`}>What I Owe</NavLink>
      </li>
      <li>
        <NavLink to={`/${userid}/peopleowe/`}>What People Owe Me</NavLink>
      </li>
      <li>
        <NavLink to={`/${userid}/myRequests/`}>My Requests</NavLink>
      </li>
      <li>
        <NavLink to={`/${userid}/requestsAccepted/`}>Request Accepted</NavLink>
      </li>
      <li>
        <NavLink to={`/${userid}/history/`}>Transaction History</NavLink>
      </li>
    </ul>
  );
};
export default ProfileNavLinks;
