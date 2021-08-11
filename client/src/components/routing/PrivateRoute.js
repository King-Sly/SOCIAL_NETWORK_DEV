import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({component : Component, auth : {isAuthenticated, loading}, ...rest}) => (
    <Route {...rest} render={props => !isAuthenticated && !loading ? <Redirect to="/login"/> : <Component {...props}></Component> }/>
)

PrivateRoute.propTypes = {
    auth : PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth : state.auth
})
export default connect(mapStateToProps)(PrivateRoute)
