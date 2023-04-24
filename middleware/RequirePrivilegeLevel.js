
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../ExpressError");


// insomnia takes:
  // authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMSIsInByaXZpbGVnZUxldmVsIjowLCJpYXQiOjE2NzY2NjgzOTR9.iJO99XVdm_nh8OvW7cShwrIUjI8LzfxuWh5_56_RpVA


class RequirePrivilegeLevel {
  static Level(type) {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers && req.headers.authorization;
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        const verifiedToken = jwt.verify(token, SECRET_KEY)
        if (verifiedToken.privilegeLevel == type) {
          return next()
        } else {
          const e = new UnauthorizedError()
          return next(e)
        }
      } catch (error) {
        return next(error)
      }
    }
  }
} 




module.exports = { RequirePrivilegeLevel }