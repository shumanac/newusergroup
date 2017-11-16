var GroupModel = require('./groups.js').model('Group');
var UserModel = require('./user.js').model('User');

exports.seedUsers = function seedUsers() {

    UserModel.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            seedUser('Human Resource', 'Juana');
            seedUser('Human Resource', 'Rehana');
            seedUser('Marketing', 'Div');
            seedUser('Marketing', 'Rollex');
        }
    });
}