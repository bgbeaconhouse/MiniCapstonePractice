const router = require("express").Router();


router.use("/departments", require("./departments"));
router.use("/professors", require("./professors"));

module.exports = router;