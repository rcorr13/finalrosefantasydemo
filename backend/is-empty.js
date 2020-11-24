// from https://www.designmycodes.com/react/reactjs-redux-nodejs-mongodb-jwt-authentication-tutorial.html
// used to check if a field is empty (undefined, null, or object or string with length 0)
const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}
module.exports = isEmpty;