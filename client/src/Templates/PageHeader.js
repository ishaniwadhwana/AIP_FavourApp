import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PageHeader = (props) => {
    return <header className = "jumbotron " >
        {props.children}
    </header>
}

export default PageHeader;