const jwtToken = require('jsonwebtoken');
const superSecret = 'superSecret';


module.exports = function (req, res, next) {
    try {
        const TokenCookie = req.cookies.jwt;
        if (TokenCookie) {
            // Check that the supplied JWT is:
            // 1. In the correct format
            // 2. Correctly signed with 'secret'
            // 3. Not expired
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