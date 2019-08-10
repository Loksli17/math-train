exports.actionLogin = function(req, res){
    res.render('auth/login', {layout: null});
};

exports.actionSignup = function(req, res){
    res.render('auth/singup', {layout: null});
}
