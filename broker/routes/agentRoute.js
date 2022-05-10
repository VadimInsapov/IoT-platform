const Router = require('express')
const router = new Router()
const agentController = require('../controllers/agentController')

router.post('/', agentController.GetChangesFromAgent)

module.exports = router
