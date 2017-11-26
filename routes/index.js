var router		= require('express').Router();
var auth			= require('./auth');
var user			= require('./user');
router.get('/', (req,res) => {
	res.status(200).json({ message: 'Connected!'});
});

router.post('/signup', auth.signup);
router.post('/login', auth.login);

//
//	Protected Routes
//

router.use(auth.authenticate);

router.get('/getuser', user.getuser);


module.exports = router;
