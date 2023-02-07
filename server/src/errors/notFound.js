const CustomApiError = require('./custom_api')

class NotFoundError extends CustomApiError{
    constructor(message) {
        super(message)
        this.status = 404
    }
}

module.exports = NotFoundError