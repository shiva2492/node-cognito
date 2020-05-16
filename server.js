const app = require('./app');
const {
    serverPort
} = require('./vars')

const server = app.listen(serverPort, function () {
    console.log("Server is running on port 3000");
});