const Task = require('../models/task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')

const getAllTasks = asyncWrapper( async (req, res) => {
    const tasks = await Task.find({createdBy: req.user._id})
    res.status(200).json({tasks})
})

const createTask = asyncWrapper( async (req, res) => {
    const task = await Task.create({...req.body,createdBy:req.user._id})
    res.status(201).json({task})
})

const getTask = asyncWrapper( async (req, res, next) => {
    const {id: taskID} = req.params
    const task = await Task.findOne({_id:taskID})
    if (!task){
        return next(createCustomError(`No task with id : ${taskID}`,404))
    }

    if (task.createdBy.toString() !== req.user._id.toString()){
        return res.status(401).json({ success: false, message: "Unauthorized - it's not your task" });
    }
    res.status(200).json({task})
})

const deleteTask = asyncWrapper( async (req, res, next) => {
    const {id: taskID}= req.params
    const task = await Task.findByIdAndDelete({_id: taskID})
    if (!task){
        return next(createCustomError(`No task with id : ${taskID}`,404))
    }
    res.status(200).json({task})
})

const updateTask = asyncWrapper(async (req, res, next) => {
    const {id:taskID} = req.params;

    const task = await Task.findByIdAndUpdate({_id:taskID},req.body,{
        new:true,
        runValidators:true
    })

    if (!task){
        return next(createCustomError(`No task with id : ${taskID}`,404))
    }

    res.status(200).json({task})
})


module.exports= {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}