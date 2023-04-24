
const jsonschema = require("jsonschema");
const User = require('../models/user')
const { createToken } = require("../helpers/tokens");
const { RequirePrivilegeLevel } = require("../middleware/RequirePrivilegeLevel");
const { ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError } = require('../ExpressError')

const newUserSchema = require('../schemas/newUserSchema.json')
const userLogInSchema = require('../schemas/userLogInSchema.json')

const express = require("express");
const router = new express.Router();



router.get('/test', RequirePrivilegeLevel.Level('basic'), (req, res, next) => {
  console.log('xxx')
  return res.send('test2')
})



router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const newUser = await User.register({ ...req.body, privilegeLevel: 'basic' });
    console.log(newUser)
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});


router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userLogInSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;