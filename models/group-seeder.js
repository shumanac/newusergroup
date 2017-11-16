var GroupModel = require('./groups.js').model('Group');

exports.seedGroup = function seedGroup() {
    GroupModel.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            GroupModel.create({ groupTitle: 'Human Resource' });
            GroupModel.create({ groupTitle: 'Marketing' });
        }
    });
}