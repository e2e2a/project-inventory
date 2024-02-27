var mongoose = require("mongoose");

var schema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    fullname: {
        type: String
    },
    purpose: {
        type: String,
    },
    dateCreated: {
        type: String,
    },
    // this is date
    adminApproved: {
        type: String,
    },
    supplyApproved: {
        type: String,
    },
    remark: {
        type: String,
    },
    status: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true
}
);

module.exports = mongoose.model("Requests", schema, "Requests");