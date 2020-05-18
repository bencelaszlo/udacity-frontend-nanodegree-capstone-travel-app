// Configure the server port and cross origin allowance
const PORT = 8080;

// Setup server
const app = require('./app');

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
