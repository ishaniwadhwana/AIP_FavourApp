import React from "react";


import "bootstrap/dist/css/bootstrap.min.css";
const CardHandler = (props) => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default CardHandler;
