import React from "react";
import PageHeader from "./PageHeader";
import { Link } from "react-router-dom";

import NavLinks from "./Navigationtabs";
import BodyPart from "./Body";
import "bootstrap/dist/css/bootstrap.min.css";
const MainNavigation = (props) => {

  return (
      <div>
            <div className = "container">
                    <PageHeader>
                    <h1 className="">
                    <Link to="/">I Owe You</Link>
                    </h1>
                    </PageHeader>
            </div>
          <div className="container">
              <nav className = "navbar navbar-inverse navbar-fixed-top">
                  <ul className = "nav navbar-nav">
                  <NavLinks />
                  </ul>
                
              </nav>
            
          </div>
  
    <div className = "container">
    <BodyPart />
    </div>

    
   
        
    </div>
  );
};

export default MainNavigation;
