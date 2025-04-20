const express = require('express');
const app = express();
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
require('dotenv').config()
const notFound = require('./middleware/not_found')


// middleware
app.use(express.static('./public'))
app.use(express.json());

// routes
app.use('/api/v1/tasks', tasks)

app.use(notFound)

const start = async ()=> {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, () => {
            console.log('server is listening on port 3000');
        })
    } catch (error) {
        console.log(error)
    }
}


start()
