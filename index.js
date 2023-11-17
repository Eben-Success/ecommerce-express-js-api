const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {notFound, errorHandler} = require('./middlewares/errorHandler');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv').config();
const authRoute = require('./routes/authRoute');
const cors = require('cors');
const morgan = require('morgan'); // for logging
const app = express();


dbConnect();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/v1/user', authRoute);

app.use(notFound);
app.use(errorHandler);

app.use('/profile', express.static('upload/profile_pics'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

