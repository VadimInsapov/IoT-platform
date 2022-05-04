class APIError extends Error{
	constructor(status, message) {
			super();
			this.status = status
			this.message = message
	}

	static badRequest (message){
			return new APIError(404, message)
	}
}

module.exports = APIError
