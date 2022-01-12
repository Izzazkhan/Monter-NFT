const {validationResult} = require('express-validator');

module.exports = (req, res, next) => {

    console.log("req ==================>")
    console.log(req.body)

    const errors = validationResult(req);

    console.log("errors")
    console.log(errors)

    if (!errors.isEmpty()) {
        let error = {}; errors.array().map((err) => error[err.param] = err.msg);
        return res.status(422).json({error});
    }

    next();
};