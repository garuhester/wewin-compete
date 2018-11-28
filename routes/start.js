var User = require("../schemas/user");
var xlsx = require("node-xlsx");

//登陆
var doStart = function (req, res) {
    var name = req.body.name;
    var success = { result: 1, name, };
    var fail = { result: 0 };

    User.find({ "name": name }, function (err, user) {
        //已有用户
        if (user.length != 0) {
            var u1 = {
                "id": user[0]._id,
                "name": user[0].name,
                "type": user[0].type,
                "ticket": user[0].ticket
            }
            req.session.user = u1;
            res.json(success);
        } else {
            var result = isType(name);
            console.log(result);
            if (result.type != 0) {
                var u2 = new User({
                    name,
                    type: result.type,
                    ticket: result.ticket
                });
                u2.save(function (err, result) {
                    var u3 = {
                        "id": result._id,
                        "name": result.name,
                        "type": result.type,
                        "ticket": result.ticket
                    }
                    req.session.user = u3;
                    res.json(success);
                });
            } else {
                res.json(fail);
            }
        }
    });
}

function isType(name) {
    var obj = xlsx.parse("./static/data.xlsx");
    var sheet = obj[0].data;
    var data = [];
    var pname = "", ticket = 0, type = 0;
    for (var j = 0; j < sheet.length; j++) {
        var json = {};
        pname = sheet[j][0];
        ticket = sheet[j][1];
        var isEmpty = pname == "" || pname == null || pname == undefined || ticket == "" || ticket == null || ticket == undefined;

        if (!isEmpty) {
            json["pname"] = pname.trim();
            json["ticket"] = ticket;
            data.push(json);
        }
    }
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if (name == d.pname) {
            type = d.ticket;
            ticket = d.ticket;
            break;
        }
    }
    return {
        type,
        ticket,
    };
}

module.exports = {
    doStart,
    isType,
}