const Validator = require('better-validator');

function validateTitle(req, res, next) {
    const validator = new Validator();

    // On vérifie que req.body.title existe et fait entre 3 et 20 caractères
    validator(req.body.title)
        .required()
        .isString()
        .isMatch(/^.{3,20}$/);

    const failures = validator.run();
    if (failures.length > 0) {
        return res.status(400).json({ failures });
    }

    next();
}

module.exports = validateTitle;
