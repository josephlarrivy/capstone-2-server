
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require('../db')

const { ExpressError,NotFoundError,UnauthorizedError,BadRequestError,ForbiddenError } = require('../ExpressError')




class User {

  static async register(
    { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username],
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users
           (username, password, firstname, lastname, email, privilegeLevel)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, firstname AS "firstName", lastname AS "lastName", email, privilegelevel AS "privilegeLevel"`,
      [ username, hashedPassword, firstName, lastName, email, 'basic' ],
    );
    const user = result.rows[0];
    return user;
  }


  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, firstname AS "firstName", lastname AS "lastName", email, privilegelevel AS "privilegeLevel"
           FROM users
           WHERE username = $1`,
      [username],
    );
    const user = result.rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        return user;
      }
    } else {
      throw new UnauthorizedError("Invalid username or password");
    }
  }
}

module.exports = User;