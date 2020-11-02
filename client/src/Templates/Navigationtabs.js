import React, { Fragment, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from 'axios';


import "bootstrap/dist/css/bootstrap.min.css";

// setting the navigation link of page
const Navigationtabs = () => {

  let [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    async function fetchData() {
      try {
        await axios.get(`/api/auth/check_login`);
        // console.log(`user logged in`);
        setIsLoggedIn(true)
      } catch (err) {
        console.error(err);
        // console.log(`user NOT logged in`);
      }
    };
    fetchData();
  }, []);
  const authLink = (
    <Fragment>
            <ul class = "nav navbar-nav">
            <li>
             <Link to="/profile">
               My Profile
            </Link>
        </li>
        <li>
          <NavLink to="/logout" >
            Log out
        </NavLink>
        </li>
        <li>
          <NavLink to="/ranking/">
            Rankings
        </NavLink>
        </li>
        <li>
          <NavLink to="/requests/">
            Requests
        </NavLink>
        </li>
      </ul>
    
      
    </Fragment>
  )

  const notAuthLink = (
            <ul class = "nav navbar-nav">
             <li>
                <Link to="/">
                     Home
                </Link>
             </li>
      <li>
        <NavLink to="/login" >
          Login
      </NavLink>
      </li>
      <li>
        <NavLink to="/register">
          Registration
      </NavLink>
      </li>
      <li>
        <NavLink to="/ranking/">
          Rankings
      </NavLink>
      </li>
      <li>
        <NavLink to="/requests/">
          Requests
      </NavLink>
      </li>
    </ul>   
  )
  return (
    <Fragment>
      {isLoggedIn ? authLink : notAuthLink}
    </Fragment>
  );
};

export default Navigationtabs;
