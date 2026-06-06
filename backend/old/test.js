const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


app.use((req, res, next) => {
    console.log('Middleware global 1');
    next();
});
app.use((req, res, next) => {
    console.log('Middleware global 2');
    next();
});
app.get('/test', (req, res) => {
    console.log('Route /test');
    res.send('Done');
});
app.use((req, res, next) => {
    console.log('Middleware global 3');
    next();
});