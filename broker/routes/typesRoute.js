const Router = require('express');
const typesController = require('../controllers/typesController');
const router = new Router();
const typeController = require('../controllers/typesController')

router.get('/', typesController.getAllTypes);

router.get('/:type', typesController.getType);

module.exports = router;
