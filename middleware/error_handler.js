const {CustomAPIError} = require('../errors/custom_error')

const errorHandlerMiddleware = (err, req, res, next) =>{
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg:err.message})
    }
    console.log(err.message)
    return res.status(500).json({msg:'Something went wrong please try again...', details: err.message})
}

module.exports = errorHandlerMiddleware