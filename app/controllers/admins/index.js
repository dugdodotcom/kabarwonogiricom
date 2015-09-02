'use strict';

exports.render = function(req, res) {
    res.render('layouts/admin', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};