var User = require("../schemas/user");
var Department = require("../schemas/department");
var System = require("../schemas/system");

//获取首页数据
var getHomeData = function (user) {
    return new Promise(function (resolve, reject) {
        var data = {};
        data.id = user.id;
        data.departments = [];
        Department.find({ 'status': "checked" }, function (err, des) {
            data.departments = des;
            User.findById(user.id, function (err, user) {
                data.surplus = user.ticket;
                data.type = user.type;
                //获取用户已经投对应的部门多少票
                Department.find({ 'userList': { '$elemMatch': { 'userId': user._id } } }, function (err, d1) {
                    data.already = d1;
                    resolve(data);
                });
            });
        });
    });
}

var getRankData = function () {
    return new Promise(function (resolve, reject) {
        var data = {};
        data.departments = [];
        Department.find().sort({ 'votes': -1 }).exec(function (err, des) {
            data.departments = des;
            resolve(data);
        });
    });
}

var getChartData = function (req, res) {
    var data = {};
    data.xAxisData = [];
    data.seriesData = [];
    Department.find({ 'status': "checked" }).sort({ 'votes': -1 }).exec(function (err, des) {
        for (var i = 0; i < des.length; i++) {
            var d = des[i];
            data.xAxisData.push(d.name);
            data.seriesData.push(d.votes);
        }
        res.json(data);
    });
}

//投票
var vote = function (req, res) {
    var departId = req.body.departId,
        voteNum = parseInt(req.body.voteNum),
        userId = req.session.user.id;

    System.find({}, function (err, sys) {
        var system = sys[0].type;
        if (system == 1) {
            //剩余票数是否>0
            //投票数是否小于剩余票数
            //选手总票数+1 && 选手增加参与人的投票记录userList
            //参与人剩余票数-1
            //共+1票 | 已投+1票(页面)

            //剩余票数是否>0 && 投票数是否小于剩余票数
            User.findById(userId, function (err, u1) {
                if (u1.ticket != 0 && voteNum <= u1.ticket) {
                    Department.findById(departId, function (err, ddd) {
                        if (ddd.status == "checked") {
                            Department.find({ '_id': departId, 'userList': { '$elemMatch': { 'userId': u1._id } } }, function (err, d1) {
                                //已经投过
                                if (d1.length != 0) {
                                    var cl = d1[0].userList.find((cl) => cl.userId == u1._id);
                                    var newNum = cl.number + voteNum;
                                    //选手总票数+1 && 选手更新参与人的投票记录userList
                                    Department.update({ '_id': departId, 'userList.userId': u1._id }, {
                                        '$set': {
                                            'userList.$.number': newNum
                                        }, '$inc': { 'votes': voteNum }
                                    }, function (err, art2) {
                                        //参与人剩余票数-1
                                        User.findByIdAndUpdate(userId, { '$inc': { 'ticket': voteNum * -1 } }, function (err, u2) {
                                            res.json({ result: 1 });
                                        });
                                    });
                                } else { // 第一次投
                                    var updateStr = {
                                        userId: u1._id,
                                        number: voteNum,
                                    }
                                    //选手总票数+1 && 选手增加参与人的投票记录userList
                                    Department.findByIdAndUpdate(departId, { '$push': { 'userList': updateStr }, '$inc': { 'votes': voteNum } }, function (err, des) {
                                        //参与人剩余票数-1
                                        User.findByIdAndUpdate(userId, { '$inc': { 'ticket': voteNum * -1 } }, function (err, u2) {
                                            res.json({ result: 1 });
                                        });
                                    });
                                }

                            });
                        } else {
                            res.json({ result: -2 });
                        }
                    });

                } else {
                    res.json({ result: 0 });
                }
            });
        } else {
            res.json({ result: -1 });
        }
    });

}

module.exports = {
    getHomeData,
    getRankData,
    getChartData,
    vote,
}