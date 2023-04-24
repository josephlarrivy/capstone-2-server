
const jsonschema = require("jsonschema");
const Trip = require('../models/Trip')
const { ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError } = require('../ExpressError')

const tripNameSchema = require('../schemas/tripNameSchema.json')
const tripItemSchema = require('../schemas/tripItemSchema.json')


const express = require("express");
const router = new express.Router();

router.post('/addTripName', async function (req, res, next) {
  console.log(req.body)
  try {
    const validator = jsonschema.validate(req.body, tripNameSchema)
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const tripName = await Trip.addTripName({...req.body})
    // console.log(tripName)
    return res.status(201).json({'status' : 'created'})
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});

router.get('/getTrips', async function (req, res, next) {
  let username = req.query.username
  try {
    const trips = await Trip.getUserTrips(username);
    console.log('tripRoutes:', trips);
    return res.status(200).json({ 'data' : trips })
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});


router.post('/deleteTrip', async function (req, res, next) {
  let tripname = req.query.tripname
  try {
    const trip = await Trip.deleteTrip(tripname);
    return res.status(202).json({ 'data': trip })
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});

router.post('/addTripItem', async function (req, res, next) {
  // console.log('tripRoutes (req.body):', {...req.body})
  try {
    const validator = jsonschema.validate(req.body, tripItemSchema)
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const tripItem = await Trip.addTripItemToTrip({ ...req.body })
    console.log(tripItem)
    return res.status(201).json({ 'status': 'added' })
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});


router.get('/getTripItems', async function (req, res, next) {
  let id = req.query.id
  try {
    const items = await Trip.getTripItems(id);
    console.log('tripRoutes:', items);
    return res.status(200).json({ 'data': items })
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});


router.post('/deleteItem', async function (req, res, next) {
  let itemid = req.query.itemid
  try {
    const item = await Trip.deleteItem(itemid);
    return res.status(202).json({ 'data': item })
  } catch (err) {
    if (err instanceof BadRequestError) {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
});

module.exports = router;