var router		= require('express').Router();
var auth			= require('./auth');
var user			= require('./user');
var classes 	= require('./class');
var posts			= require('./post');

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

router.get('/getclasses', classes.getclasses);

router.post('/getposts', posts.getposts);

router.post('/createpost', posts.createpost);

//
//	ADMIN
//
router.use(auth.isadmin);

router.post('/createclass', classes.createclass);

module.exports = router;
