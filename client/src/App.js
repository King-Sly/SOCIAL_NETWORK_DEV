import './App.css';
import Navbar from './components/layout/Navbar';
import React, { Fragment } from "react";
import Landing from "./components/layout/Landing";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import  Register  from './components/auth/Register';
import Login  from './components/auth/Login';
//Redux
import { Provider } from 'react-redux';
import store from "./store";
import Alert from './components/layout/Alert';

const App = () => {
  return (
    <Provider store = {store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path = "/" component = {Landing}></Route>
          <section className = "container">
            <Alert/>
            <Switch>
              <Route exact path = "/register" component={Register}></Route>
              <Route exact path = "/login" component = {Login}></Route>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
