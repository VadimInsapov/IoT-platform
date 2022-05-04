

class RegistrationsController {
	async getAllRegistrations(req, res) {
		res.send(`registrations ${req.method}`);
	}
	
	async createRegistration(req, res) {
		res.send(`registrations ${req.method}`);
	}

	async getRegistration(req, res) {
		res.send(`registrations id=${req.params.id} ${req.method}`);
	}

	async deleteRegistration(req, res) {
		res.send(`registrations id=${req.params.id} ${req.method}`);
	}

	async updateRegistration(req, res) {
		res.send(`registrations id=${req.params.id} ${req.method}`);
	}
}

module.exports = new RegistrationsController
