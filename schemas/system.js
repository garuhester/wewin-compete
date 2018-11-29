var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SystemSchema = new Schema({
    type: { type: Number, default: 0 }, // 0:关 1:开
    createTime: { type: Date, default: Date.now } // 创建时间
});

module.exports = mongoose.model("System", SystemSchema);