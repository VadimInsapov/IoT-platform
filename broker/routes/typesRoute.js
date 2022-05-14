const Router = require('express');
const typesController = require('../controllers/typesController');
const router = new Router();

router.get('/', typesController.getAllTypes);

module.exports = router;
