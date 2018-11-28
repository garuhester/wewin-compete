var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    name: String, // 名称
    votes: { type: Number, default: 0 }, // 票数
    userList: [{
        userId: { type: String, ref: 'User' },
        number: { type: Number, default: 0 }, // 投票次数
        userTime: { type: Date, default: Date.now }
    }],
    status: { type: String, default: "checked" },
    createTime: { type: Date, default: Date.now } // 创建时间
});

module.exports = mongoose.model("Department", DepartmentSchema);