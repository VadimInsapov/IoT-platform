const Router = require('express');
const router = new Router();
const entitiesRouter = require('./entitiesRoute')
const typesRouter = require('./typesRoute')
const subscriptionsRouter = require('./subscriptionsRoute')
const registrationsRouter = require('./registrationsRoute')
const opRouter = require('./opRoute')

router.get('/', function (req, res) {
  res.send('entry point get');
});
//router.use("/entities", entitiesRouter);
router.use("/types", typesRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/registrations", registrationsRouter);
router.use("/op", opRouter);

module.exports = router;
