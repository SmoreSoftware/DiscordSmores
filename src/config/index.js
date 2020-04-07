const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./src/config/config.yml", "utf8");
module.exports = YAML.parse(file);
