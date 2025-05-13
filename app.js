const express = require('express');
const app = express();
const tasks = require('./routes/tasks')
const authRoute = require('./routes/auth_Route')
const connectDB = require('./db/connect')
require('dotenv').config()
const notFound = require('./middleware/not_found')
const errorHandlerMiddleware = require('./middleware/error_handler')
const cookieParser= require('cookie-parser')
const protectRoute = require('./middleware/protectRoute')


// middleware
app.use(express.static('./public'))
app.use(express.json());
app.use(cookieParser())

// routes
app.use('/api/v1/tasks', protectRoute, tasks)
app.use('/api/v1/auth', authRoute)

app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;

const start = async ()=> {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server is listening on port ${port}..`);
        })
    } catch (error) {
        console.log(error)
    }
}


start()
