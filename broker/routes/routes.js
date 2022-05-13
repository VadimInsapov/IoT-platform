const Router = require('express');
const router = new Router();
const entitiesRouter = require('./entitiesRoute')
const typesRouter = require('./typesRoute')
const subscriptionsRouter = require('./subscriptionsRoute')
const registrationsRouter = require('./registrationsRoute')
const opRouter = require('./opRoute')
const agentRouter = require('./agentRoute')

router.get('/', function (req, res) {
  res.send('entry point get');
});
router.post('/', function(req, res) {
  alert(JSON.stringify( req.body))
})

router.use("/entities", entitiesRouter);
router.use("/types", typesRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/agent", agentRouter)
//router.use("/registrations", registrationsRouter);
//router.use("/op", opRouter);

module.exports = router;
