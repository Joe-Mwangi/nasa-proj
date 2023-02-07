const CustomApiError = require('./custom_api')

class BadRequestError extends CustomApiError{
    constructor(message) {
        super(message)
        this.status = 400
    }
}

module.exports = BadRequestError