const jwtToken = require('jsonwebtoken');
const superSecret = 'superSecret';

// middler to create a cookie token.
module.exports = function (req, res, next) {
    try {
        const TokenCookie = req.cookies.jwt;
        if (TokenCookie) {
            // Check that the supplied JWT is:
            // In the correct format
            // Correctly signed with 'secret'
            // check if Not expired
            let userID = jwtToken.verify(
                req.cookies.jwt,
                superSecret
            );
            // console.log(payload)
            req.userid = userID.id
            next()

        } else {
            console.log("Invalid Token");
            res.status(400).send('You are not logged in');
        }
    } catch (e) {
        res.status(400).send('Your JWT is invalid or expired. Log in again.');
    }

}