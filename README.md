# READ ME  
## Starting App  
node index.js  
(debug: nodemon index.js)  
Access http://localhost:7700  

## Library List  
npm install nodemon  
npm install epxress  
npm install pg  
npm install jsonwebtoken  
npm install cors  
npm install dotenv  
npm install jest
npm install supertest

## debbug  
node --inspect-brk index.js  

## execute test code  
(Before you execute test code, you need to add {"test": "jest"} 
and 
"jest": {  
    "testEnvironment": "node",  
    "coveragePathIgnorePatterns": [  
      "/node_modules/"  
    ]  
}  
in package.json.  
yarn test  
or  
npm test  

## config  
token keeps 5 minutes  
log file complesses as .gz extention and deletes after 5days later.
