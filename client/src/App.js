import './App.css';
import Navbar from './components/layout/Navbar';
import React, { Fragment } from "react";
import Landing from "./components/layout/Landing";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import  Register  from './components/auth/Register';
import Login  from './components/auth/Login';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar/>
        <Route exact path = "/" component = {Landing}></Route>
        <section className = "container">
          <Switch>
            <Route exact path = "/register" component={Register}></Route>
            <Route exact path = "/login" component = {Login}></Route>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
