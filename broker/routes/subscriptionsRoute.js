const Router = require('express')
const  router = new Router()
const subscriptionsController = require('../controllers/subscriptionsController')

router.get('/', subscriptionsController.getAllSubscriptions );
router.post('/', subscriptionsController.createSubscription);

router.get('/:id', subscriptionsController.getSubscription );
router.delete('/:id', subscriptionsController.deleteSubscription);
router.patch('/:id', subscriptionsController.updateSubscription);

module.exports = router
