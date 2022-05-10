const checkSubscriptions = require('../subs/checkSubs.js')

class AgentController {
	async GetChangesFromAgent(req, res) {
		try {
			checkSubscriptions(req.body)
		}
		catch(e){
			res.send(`agent ${req.method} error`);
		}
	}
}

module.exports = new AgentController
