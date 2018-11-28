var User = require("../schemas/user");
var Department = require("../schemas/department");

//获取后台管理数据
var getAdminData = function (type) {
    return new Promise(function (resolve, reject) {
        var data = {};
        data.departments = [];
        data.users = [];
        if (type == "depart") {
            Department.find().sort({ 'votes': -1 }).exec(function (err, des) {
                data.departments = des;
                var sum = 0;
                for (var i = 0; i < des.length; i++) {
                    var d = des[i];
                    sum += d.votes;
                }
                data.sum = sum;
                resolve(data);
            });
        } else if (type == "user") {
            User.find(function (err, users) {
                data.users = users;
                resolve(data);
            });
        }
    });
}

//添加选手
var addDepart = function (req, res) {
    var departName = req.body.departName;
    var depart = new Department({
        name: departName
    });
    depart.save(function (err, de) {
        if (!err) {
            res.json({ result: 1, de, });
        }
    });
}

var getList = function (req, res) {
    var dId = req.body.dId;
    Department.findById(dId).populate('userList.userId', 'name phone type').exec(function (err, des) {
        res.json(des);
    });
}

var getAllDepartList = function (req, res) {
    Department.find().populate('userList.userId', 'name phone type').exec(function (err, des) {
        res.json(des);
    });
}

var deleteDepart = function (req, res) {
    var id = req.body.id;
    Department.findByIdAndRemove(id, function (err, result) {
        res.json({ result: 1 });
    });
}

var changeStatus = function (req, res) {
    var id = req.body.id;
    var value = req.body.value;
    Department.findByIdAndUpdate(id, { 'status': value }, function (err, result) {
        res.json({ result: 1 });
    });
}

//初始化选手
var initData = function (req, res) {
    Department.update({}, { '$set': { 'votes': 0, "userList": [] } }, { multi: true }, function (err, result) {
        res.json({ result: 1 });
    });
}

//初始化评委票数
var initRater = function (req, res) {
    User.find({}, function (err, users) {
        var users = users;
        for (var i = 0; i < users.length; i++) {
            (function (i) {
                User.findByIdAndUpdate(users[i]._id, { 'ticket': users[i].type }, function (err, result) { });
            })(i);
        }
        res.json({ result: 1 });
    });
}

module.exports = {
    getAdminData,
    addDepart,
    initData,
    initRater,
    getList,
    deleteDepart,
    changeStatus,
    getAllDepartList,
}