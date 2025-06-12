const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userroutes');
const canddaterouts = require('./routes/candidateroute')


const mongoose = require('mongoose')

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// DB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Mongo Db connected succesfully"))
.catch((err) => {
    console.error("Mongo connection failed", err)
    process.exit(1);
});


// Middleware
app.use(bodyParser.json()); // For req.body
app.use(cookieParser());

// Roputes
// app.get('/', (req, res) => {
//   res.send(`Hello World my name is utpal barman ${12+6}` );
// });

app.use('/api/auth', userRoutes);
app.use('/api/candidate', canddaterouts);



// Running port status
app.listen(PORT, () => {
    console.log(`Code is running on port ${PORT}`);
});
