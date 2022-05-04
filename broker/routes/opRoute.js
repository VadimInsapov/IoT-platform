const Router = require('express')
const  router = new Router()
const batchOperationsController = require('../controllers/batchOperationsController')

router.post('/update', batchOperationsController.updateOp);
router.post('/query', batchOperationsController.queryOp);
router.post('/notify', batchOperationsController.notifyOp);

module.exports = router
