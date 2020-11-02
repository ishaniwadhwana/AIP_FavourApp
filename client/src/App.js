import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainPage from "./Templates/MainPage";
import BodyPart from "./Templates/Body";
import Users from "./Pages/Profile/Users";
import Notification from "react-notifications-component";
import PrivateRouteHandler from "./handler/PrivateRouteHandler";
import Register from './Pages/Login_Reg/Register';
import Ranking from './Pages/ScoreBoard';
import RequestList from './Pages/Request/RequestList';
import Request from './Pages/Request/Request';
import Login from './Pages/Login_Reg/Login';
import PeopleFavorDetails from './Pages/Favors/PeopleFavorDetails';
import UserFavorDetails from './Pages/Favors/UserFavorDetails';
import Logout from './Pages/Login_Reg/Logout';
import CreateFavor from './Pages/Favors/CreateFavor';
import RequestForm from './Pages/Request/RequestForm';

const App = () => (
<Router>
  <Fragment>
    <MainPage />
    <Route exact path = "/" component={BodyPart} />
    <Notification />
    <Switch>
      <PrivateRouteHandler exact path = "/profile" component = {Users} />
        <Route exact path = "/register" component = {Register} />
        <Route exact path = "/Score" component = {Ranking} />
        <Route exact path = "/requests" component = {RequestList} />
        <Route exact path = "/request/:id" component = {Request} />
        <Route exact path = "/login" component = {Login} />
        <PrivateRouteHandler exact path = "/favor/people/:id" component = {PeopleFavorDetails} />
        <PrivateRouteHandler exact path = "/favor/user/:id" component = {UserFavorDetails} />
        <PrivateRouteHandler exact path = "/logout" component = {Logout} />
        <PrivateRouteHandler exact path = "/create-favor" component = {CreateFavor} />
        <PrivateRouteHandler exact path = "/create-request" component = {RequestForm} />
    </Switch>
  </Fragment>
</Router>
);

export default App;
