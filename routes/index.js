var start = require("./start");
var home = require("./home");
var admin = require("./admin");

module.exports = function (app) {

    //进入页
    app.get("/start", function (req, res) {
        res.render("start");
    });

    //首页
    app.get("/", function (req, res) {
        if (req.session.user) {
            home.getHomeData(req.session.user).then(function (data) {
                res.render("index", {
                    title: "首页",
                    data,
                });
            });
        } else {
            res.redirect("/start");
        }
    });

    //排名
    app.get("/rank", function (req, res) {
        if (req.session.user) {
            home.getRankData().then(function (data) {
                res.render("rank", {
                    title: "排名",
                    data,
                });
            });
        } else {
            res.redirect("/start");
        }
    });

    //后台管理
    app.get("/admin/:type", function (req, res) {
        var type = req.params.type;
        admin.getAdminData(type).then(function (data) {
            res.render("admin", {
                type,
                data,
            });
        });
    });

    app.get("/screen", function (req, res) {
        res.render("screen");
    });

    app.post("/intoVoting", start.doStart);

    app.post("/addDepart", admin.addDepart);

    app.post("/vote", home.vote);

    app.post("/initData", admin.initData);

    app.post("/initRater", admin.initRater);

    app.post("/getList", admin.getList);

    app.post("/getAllDepartList", admin.getAllDepartList);

    app.post("/getChartData", home.getChartData);

    app.post("/deleteDepart", admin.deleteDepart);

    app.post("/changeStatus", admin.changeStatus);

}