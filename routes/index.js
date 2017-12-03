var router		= require('express').Router();
var auth			= require('./auth');
var user			= require('./user');
var classes 	= require('./class');
var events 		= require('./events');
var posts			= require('./post');

router.get('/', (req,res) => {
	res.send({ message: 'Connected!'});
});

router.post('/signup', auth.signup);
router.post('/login', auth.login);

//
//	Protected Routes
//


router.use(auth.authenticate);

router.get('/getuser', user.getuser);

router.get('/getevents', events.getevents);

router.post('/createevent', events.createevent);

router.post('/followevent', events.followevent);

router.post('/deleteevent', events.deleteevent);
//
//	ADMIN
//
router.use(auth.isadmin);



module.exports = router;
