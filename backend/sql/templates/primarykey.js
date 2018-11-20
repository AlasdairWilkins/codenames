const PrimaryKey = function() {
    this.keys = new Array(...arguments)
};

PrimaryKey.prototype.save = function() {
    return `PRIMARY KEY (` + this.keys.join(",") + `)`
};

module.exports = PrimaryKey;