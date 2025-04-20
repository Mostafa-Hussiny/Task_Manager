const express = require('express')
const router = express.Router()

// importing controllers
const {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/tasks')


// routes
router.get('/', getAllTasks)

router.post('/', createTask)

router.get('/:id', getTask)

router.patch('/:id', updateTask)

router.delete('/:id', deleteTask)

module.exports = router