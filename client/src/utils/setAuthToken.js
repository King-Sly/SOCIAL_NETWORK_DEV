import axios from 'axios';
import auth from '../reducers/auth';

//Add the global header
const setAuthToken = token => {
    if(token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}
export default setAuthToken;