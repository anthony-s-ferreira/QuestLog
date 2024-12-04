const express = require('express');
const path = require('path')

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}`);
})

app.use(express.static(path.join(__dirname, '../frontend/public')));