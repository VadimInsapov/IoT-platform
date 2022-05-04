const Router = require('express')
const  router = new Router()
const registrationsController = require('../controllers/registrationsController')

router.get('/', registrationsController.getAllRegistrations );
router.post('/', registrationsController.createRegistration);

router.get('/:id', registrationsController.getRegistration );
router.delete('/:id', registrationsController.deleteRegistration);
router.patch('/:id', registrationsController.updateRegistration);

module.exports = router
