# Getting Started with Science Portal React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
See notes below about Available npm scripts for local development. 

Science Portal is distributed as a war file.



## Dependencies
Node.js
npm
react developer tools in chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi/related?hl=en
host file entry (see Environment Files)

### Environment files
.env file needs to be set up in the root of your local copy of the code, with contents similar to:

PORT=443
HOST=hj-www.canfar.net
HTTPS=true

#### Host File Entry

NOTE: the HOST entry can be whatever you wish, as long as it also appears in your local
/etc/hosts file associated with the LOCALHOST ip, ie:

127.0.0.1 hj-www.canfar.net

Depending on where the skaha service sits and any CORS issues that might arise, it's suggested
that the domain name match where skaha is served from (ie rc-uv.canfar.net, wher 'canfar.net' 
matches what's been put in your local host file.)


### Getting Going
Clone the repo
install project dependencies using npm
set /etc/hosts entry 
set up .env file to match /etc/hosts entry
use 'npm start' to start up the local instance

(Q: does npm install the dependencies here, based on the package.json file?)

### Quick working process:
1) edit code in either /public/dev/js or /react directories
2) use 'npm start' to test function locally
3) use standard deployment to test vm for further testing:
- run './gradlew clean build', then rsync build/libs/science-portal<version>.war to 
the vm into /usr/local/cadc/webapps/science-portal.war


## Detailed Development Environment Notes

There's 2 environments to consider:
1) a dev environment that allows work on your local machine
2) a vm/rc/production environment that allows work in the war file environment

(Could be that containerizing Science Portal would alleviate this difference, but that
work hasn't been done yet.) 

### App Structure
Science Portal has a React core with an HTML + javascript framework.

#### Configuration

There are 2 types of config:
- one that only changes when the code may need to change (ie support for session types) This
is included in sessiontype_map_en.json. The location of this file is slightly different 
for dev and dist (the latter being controlled by the copy done in build.gradle.) The location 
of the file is fed into the app using the contentBase variable, found in either
/public/test_config/sp_test_config.js  or /src/main/webapp/dist_config/sp_dist_config.js

- one that changes during run time (ie banner text, or registry location.) This is found 
in org.opencadc.science-portal.properties as deployed on the server (rc, a dev vm or production)


### Dev v rc, test vm and prod environments 

3 differences:
1) How config it applied
2) How app is built & served
3) How authentication works

The advantage of working on your local machine is it's far easier to step through the React App 
files in web Browser tools, as the files are treated separately, and are visible as they are
 written rather than how they are generated into the single react-app.js file. In the war file
 environment, there are browser plugins available to help debug React apps.

#### Dev (local machine)
1) Granularity of service access can be controlled in dev. This is  done using 
public/test_config/sp_test_config.js using an object that lists service URLS Science Portal
will use. Use this in /public/index.html in the call to instantiate the app, using 'URLOverrides'. 

2) Main page of the app is /public/index.html. All file includes here point to /public folder
locations. npm uses this file to serve the app via websockets to localhost.

3) Until there's the ability to have a local version /access service running, authentication can't
be handled correctly running on localhost. The isDev flag (found in /public/index.html where
the app is initialized,) will allow the page to move forward without having this service in place.

#### rc, test vms and prod
1) Registry location (and through that service location) is provided in the *.properties
file deployed on the tomcat server

2) Main page of the app is /src/main/webapp/index.jsp. Deployed as a war file to tomcat

3) Authentication requires a local copy of /access to be present so that cookie
augmentation can happen properly



### Where to Work
Work in the /public directory, check as much function as you can locally before deploying
to a vm to test authentication.

WARNING: Files in /src/main/webapp/dist are DELETED during the build phase. 
Make sure any changes you make go into /public/dev/js/* !!!



### where files are to work on them
src/main/react for react files
public/dev/js for javascript files
public/dev/json for JSON config files




## Build process
science-portal<version>.war will be built and assembled into a WAR file, 

./gradlew clean build

build/libs/science-portal<version>).war

ssh to deployment location as science-portal.war

### Build Process
./gradlew build performs the following steps:

1) Build React App
2) Copy react-app.js into dist directory 
3) Copy public/dev content into dist directory (javascript and json config files)
4) Assemble WAR 

#### where files get copied to
public/js goes to src/main/webapps/dist/js
react app goes to src/main/webapps/dist/react-app.js


### Dependencies:
canfar-root.war files this is still dependent on:
    <!-- Found in canfar-root: tomcat(-canfar)/webapps/ROOT unless an absolue URL -->
    <script type="text/javascript" src="/cadcJS/javascript/cadc.registry-client.js"></script>
    <script type="text/javascript" src='/cadcJS/javascript/org.opencadc.js'></script>
    <script type="text/javascript" src='/cadcJS/javascript/cadc.uri.js'></script>
    <script type="text/javascript" src="/cadcJS/javascript/cadc.user.js"></script>
    <script type="text/javascript" src="/canfar/javascript/cadc.redirect.util.js"></script>

    <!-- Adding gdpr cookie banner -->
    <script type="text/javascript" src="/cadcJS/javascript/cadc.gdpr.cookie.js"></script>
    <link  type="text/css" href="/canfar/css/cadc.gdpr.cookie.css" rel="stylesheet" media="screen">
    




## Available npm Scripts (for local work)
... this documentation came from a react app tutorial.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

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
