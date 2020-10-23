const { param } = require("../API/partydet");
module.exports = function uniCodeVal(string) {
    return /[^\u0000-\u007f]/.test(string);
}