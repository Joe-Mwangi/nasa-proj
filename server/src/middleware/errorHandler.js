function errorHandlerMiddleware(err, req, res, next) {
    let customError = {
        msg: err.message || 'Something went wrong please try again later',
        statusCode: err.status || 500
    }

    //Todo: conditions for different types of errors

    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandlerMiddleware