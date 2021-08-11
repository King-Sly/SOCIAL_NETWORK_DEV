import './App.css';
import Navbar from './components/layout/Navbar';
import React, { Fragment, useEffect } from "react";
import Landing from "./components/layout/Landing";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import  Register  from './components/auth/Register';
import Login  from './components/auth/Login';
import Dashboard from './components/dashboard/dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
//Redux
import { Provider } from 'react-redux';
import store from "./store";
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {


  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  
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
              <PrivateRoute exact path = "/dashboard" component = {Dashboard}></PrivateRoute>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
