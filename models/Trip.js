
const db = require('../db')
const { ExpressError, NotFoundError, UnauthorizedError, BadRequestError, ForbiddenError } = require('../ExpressError')




class Trip {

  static async generateRandomString(length) {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    return result;
  }

  static async addTripName ({tripname, username}) {
    const key = await this.generateRandomString(20)
    // console.log(key)
    const result = await db.query (
      `INSERT INTO tripnames
        (id, tripname, username) VALUES ($1, $2, $3) RETURNING tripname, username`, [key, tripname, username],
    );
    const giveDataBack = result.rows[0]
    // console.log('Trip Model')
    return giveDataBack
  }

  static async getUserTrips(username) {
    try {
      // console.log('Model (username):', username);
      const result = await db.query(
        `SELECT id, tripname FROM tripnames WHERE username = $1`,
        [username]
      );
      // console.log('Trip model:', result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to get user trips');
    }
  }

  static async deleteTrip(name) {
    try {
      const result = await db.query(
        `DELETE FROM tripnames WHERE tripname = $1`,
        [name]
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to get user trips');
    }
  }


  static async addTripItemToTrip({
    type,
    route,
    name,
    description,
    parkcode,
    latitude,
    longitude,
    id,
  }) {
    const key = await this.generateRandomString(20);
    console.log("Trip (addTripItemToTrip):", type, route);

    function removeHtmlCssFromString(str) {
      return str.replace(/<[^>]*>/g, '');
    }

    const result = await db.query(
      `INSERT INTO tripitems
        (itemid, type, route, name, description, parkcode, latitude, longitude, id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, type, route, name, description, parkcode, latitude, longitude`,
      [key, type, route, name, removeHtmlCssFromString(description), parkcode, latitude, longitude, id]
    );
    const item = result.rows[0];
    return item;
  }

  static async getTripItems(id) {
    try {
      const result = await db.query(
        `SELECT 
        itemid, type, route, name, description, parkcode, latitude, longitude
        FROM tripitems WHERE id = $1`,
        [id]
      );
      // console.log('Trip model:', result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to get user trips');
    }
  }


  static async deleteItem(itemid) {
    try {
      const result = await db.query(
        `DELETE FROM tripitems WHERE itemid = $1`,
        [itemid]
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to get user trips');
    }
  }
}



module.exports = Trip