import React, { Fragment } from 'react';
import RequestList from '../Pages/Request/RequestList';

import "bootstrap/dist/css/bootstrap.min.css";

const BodyPage = () => {
    return (
        <Fragment>
<div className="row">
  <div className="col-sm-6">
    <div className="card">
      <div className="card-body ">
        <h5 className="card-title">Special title treatment</h5>
        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Cras justo odio</li>
            <li className="list-group-item">Dapibus ac facilisis in</li>
            <li className="list-group-item">Vestibulum at eros</li> 
            <li className = "list-group-item"> <a href="#" class="btn btn-primary">Go somewhere</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col-sm-6">
    <div className="card">
    <div className="card-body ">
        <h5 className="card-title">Special title treatment</h5>
        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Cras justo odio</li>
            <li className="list-group-item">Dapibus ac facilisis in</li>
            <li className="list-group-item">Vestibulum at eros</li>
        </ul>
      </div>
    </div>
  </div>
</div>

            <RequestList />
        </Fragment>
    );
}

export default BodyPage;
