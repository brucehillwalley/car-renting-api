"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/reservation:

const reservation = require('../controllers/reservation')

const permissions = require('../middlewares/permissions')

// URL: /reservations
// listDeleted: deletedAt' e tarih girilerek soft delete yapılanları listeler
router.get('/listdeleted', permissions.isStaffOrisAdmin ,reservation.listDeleted)

router.route('/')
    .get(permissions.isLogin,reservation.list)
    .post(permissions.isLogin, reservation.create)



router.route('/:id')
    .get(permissions.isLogin, reservation.read)
    .put(permissions.isStaffOrisAdmin,reservation.update)
    .patch(permissions.isStaffOrisAdmin,reservation.update)
    .delete(permissions.isAdmin,reservation.delete)

/* ------------------------------------------------------- */
module.exports = router