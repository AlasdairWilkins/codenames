const dao = require('../dao');

const resume = function(sessionID) {
    dao.query('namespaces', 'get', 'display', sessionID, (result) => {
        if (result) {
            switch (result.display) {

                case 'waiting':
                    // code , name , players , joining
                    console.log("Get waiting resume");
                    break;

                case 'select':
                    // players, blueMax, redMax
                    console.log("Get select resume");
                    break;

                case 'game                                                                                                                                              ':
                    console.log("Get game resume");
                    break;

                default:
                    console.log(result)

            }
        }
    })
};

module.exports = {resume};