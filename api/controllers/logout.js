'use strict';

module.exports = function (req, res) {
    var response = {};

    req.session.destroy(function (err) {
        if (err) {
            response = {
                status: 500,
                message: 'Session Error'
            }
            res.status(response.status);
            return res.json(response);
        } else {
            response = {
                status: 200,
                message: 'You have logout'
            }
            res.status(response.status);
            return res.json(response);
        }
    })
}