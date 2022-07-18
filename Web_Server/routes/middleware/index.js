var middlewareObj = {};


middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

middlewareObj.isAdmin = function (req, res, next){
    if (req.isAuthenticated()) {
        if (req.user.role == "admin")
            return next();
    }
    res.redirect("/");
};

middlewareObj.isCompany = function (req, res, next){
    if (req.isAuthenticated()) {
        if (req.user.role == "company")
            return next();
    }
    res.redirect("/");
};

middlewareObj.isCallCenter = function (req, res, next){
    if (req.isAuthenticated()) {
        if (req.user.role == "callCenter")
            return next();
    }
    res.redirect("/");
};



module.exports = middlewareObj;