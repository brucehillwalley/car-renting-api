"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/car:

const car = require('../controllers/car')

const permissions = require('../middlewares/permissions')

// URL: /cars

router.route('/')
    .get(car.list)
    .post(permissions.isStaffOrisAdmin, car.create)

router.get('/listDeleted', permissions.isStaffOrisAdmin ,car.listDeleted)

router.route('/:id')
    .get(car.read)
    .put( permissions.isStaffOrisAdmin,car.update)
    .patch(permissions.isStaffOrisAdmin,car.update)
    .delete(permissions.isStaffOrisAdmin,car.delete)

/* ------------------------------------------------------- */
module.exports = router