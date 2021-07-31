const express = require('express');
const connectDB = require("./config/db");

const app = express();
//CONNECT THE DATABASE====(I'VE WRITTEN THIS FOR LIKE 1000 times in the past four months)
connectDB();

//Middleware
app.use(express.json({extended : false}));
// app.use(express.json({extended : false}));
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API Running'));

//DEFINE ROUTES====SAME WITH THIS(998 times)
app.use('/api/users', require("./routes/api/users"));
app.use('/api/auth', require("./routes/api/auth"));
app.use('/api/profile', require("./routes/api/profile"));
app.use('/api/posts', require("./routes/api/posts"));

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});