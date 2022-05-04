

class SubscriptionsController {
	async getAllSubscriptions(req, res) {
		res.send(`subscriptions ${req.method}`);
	}

	async createSubscription (req, res) {
		res.send(`subscriptions ${req.method}`);
	}

	async getSubscription(req, res) {
		res.send(`subscriptions id=${req.params.id} ${req.method}`);
	}

	async deleteSubscription(req, res) {
		res.send(`subscriptions id=${req.params.id} ${req.method}`);
	}

	async updateSubscription(req, res) {
		res.send(`subscriptions id=${req.params.id} ${req.method}`);
	}
}

module.exports = new SubscriptionsController
