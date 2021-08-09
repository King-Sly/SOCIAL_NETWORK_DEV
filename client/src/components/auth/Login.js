import React, {Fragment, useState} from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email : '',
    password : ''
  });

  const onChange = e => setFormData({...formData, [e.target.name] : e.target.value});


  const {email, password} = formData;
   const onSubmit = e => {
     e.preventDefault();
    //  if(password !== password2 ) {
    //    console.log("Passwords do not match");
    //  }
    //  else {
       console.log(formData);
    //  }
   }
    return (
        <Fragment>
          <h1 className="large text-primary">Sign In</h1>
          <p className="lead"><i className="fas fa-user"></i>Login Into Your Account</p>
          <form className="form" onSubmit = {e => onSubmit(e)}>
            {/* <div className="form-group">
            <input 
              type="text" 
              placeholder="Name" 
              name="name" 
              required 
              onChange={e => onChange(e)}
              value={name} 
            />
            </div> */}
            <div className="form-group">
            <input 
              type="email" 
              placeholder="Email Address"
              name="email" 
              required 
              value = {email}
              onChange={e => onChange(e)}
             />
            {/* <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
            > */}
            </div>
            <div className="form-group">
            <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value = {password}
            onChange={e => onChange(e)}
            />
            </div>
            {/* <div className="form-group">
            <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value = {password2}
            onChange={e => onChange(e)}
            />
            </div> */}
            <input type="submit" className="btn btn-primary" value="Login" />
          </form>
          <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </Fragment>
    )
};

export default Login;