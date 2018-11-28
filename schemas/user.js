var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String, // 姓名
    type: Number, // 类型
    ticket: Number, // 剩余票数
    createTime: { type: Date, default: Date.now } // 创建时间
});

module.exports = mongoose.model("User", UserSchema);