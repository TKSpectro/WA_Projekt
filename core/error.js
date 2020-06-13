/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ApiError;