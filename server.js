const express = require('express');
const connectDB = require("./config/db");

const app = express();
//CONNECT THE DATABASE====(I'VE WRITTEN THIS FOR LIKE 1000 times in the past four months)
connectDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});