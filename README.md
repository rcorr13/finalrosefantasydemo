# Final Rose Fantasy - Demo Version

## Motivation
Yes, there are other Bachelor/Bachelorette fantasy leagues that are well established where you can earn or lose points for contestants on your "team" completing actions like getting a rose or going on a horseback riding date or being shirtless on camera. However, most of these leagues will penalize you if your contestant behaves poorly. We at Final Rose Fantasy believe that the drama is often the best part of this guilty-pleasure TV show and have created a new fantasy league that will reward you if your contestant cries (+10) or vomits (+12) or gets a word bleeped out (+7). Contestants on the "most dramatic season ever" deserve to earn points for causing drama, and this fantasy league website allows you to pick your team using our handy "Pick Contestant" tool, and the website (and its dedicated host) will take care of the rest.

##Links


##API Documentation

### Users

Register User:
  URL: https://finalrosefantasydemo.herokuapp.com/register
  Type: POST
  Request Params: JSON Array with user firstname, lasname, email, password, and confirmed password
  
  
Get course by course code
  url: https://unc-schedule-backend.herokuapp.com/courses/{courseCode}
type: GET
Returns: JSON Object of requested course
User API:

Add a user:
url: https://unc-schedule-backend.herokuapp.com//users
type: POST
CURL ex.: curl -X POST -H "Content-Type: application/json" --data
'{"name": "Mac Carlton", "username": "maccarlton", "password": "mac123", "courses_taken": ["110", "410", "411", "426"]}' https://unc-schedule-backend.herokuapp.com/users
Returns: updated list of all users
Update a users information:
url: https://unc-schedule-backend.herokuapp.com/users/{id}
type PUT
CURL ex.: curl -X PUT -H "Content-Type: application/json" --data
'{"courses_taken": {updatedArray}]' https://unc-schedule-backend.herokuapp.com/users
Returns updated JSON for updated user
Get a list of all users:
url: https://unc-schedule-backend.herokuapp.com/users
type GET
Returns: JSON Array of all users
Get a specific user:
url: https://unc-schedule-backend.herokuapp.com/users/{id}
type GET
Returns: JSON Object of user
Delete a user:
url: https://unc-schedule-backend.herokuapp.com/users/delete
type DELETE
body includes user's ID
Returns: Updated array of users



### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
