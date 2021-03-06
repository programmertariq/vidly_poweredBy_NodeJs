const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = require("express").Router();
const { User } = require("../models/user");
const auth = require('../middleWares/auth')

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(50).required(),
  });

  return schema.validate(user);
}

module.exports = router;
