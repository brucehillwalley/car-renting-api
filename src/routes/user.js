"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/user:

const user = require('../controllers/user')
const permissions = require('../middlewares/permissions')

// URL: /users

router.route('/')
    .get(permissions.isStaffOrisAdmin, user.list)
    .post(user.create)

router.get('/listdeleted', permissions.isStaffOrisAdmin ,user.listDeleted)

router.route('/:id')
    .get(permissions.isLogin, user.read)
    .put(permissions.isLogin, user.update)
    .patch(permissions.isLogin,user.update)
    .delete(permissions.isAdmin, user.delete)

/* ------------------------------------------------------- */
module.exports = router