const { param } = require("../API/partydet");
//it will handler the regular expression for validation of unicode value.
module.exports = function uniCodeVal(string) {
    return /[^\u0000-\u007f]/.test(string);
}