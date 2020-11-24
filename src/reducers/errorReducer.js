import { GET_ERRORS } from '../actions/types';

// adapted from https://www.designmycodes.com/react/reactjs-redux-nodejs-mongodb-jwt-authentication-tutorial.html

const initialState = {};

export default function(state = initialState, action ) {
    switch(action.type) {
        case GET_ERRORS:
            return action.payload;
        default:
            return state;
    }
}