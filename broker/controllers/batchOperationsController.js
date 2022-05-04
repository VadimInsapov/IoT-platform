

class BatchOperationsController{
	async updateOp(req, res) {
		res.send(`op update ${req.method}`);
	}

	async queryOp(req, res) {
		res.send(`op query ${req.method}`);
	}

	async notifyOp(req, res) {
		res.send(`op notify ${req.method}`);
	}
}

module.exports = new BatchOperationsController
