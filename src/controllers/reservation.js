"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
// Reservation Controller:

const Reservation = require("../models/reservation");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "List Reservations"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    const data = await res.getModelList(Reservation, {deletedAt: null});

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation, {deletedAt: null}),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Create Reservation"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Reservation'
                }
            }
        */
 // "Admin/staf değilse" veya "UserId göndermişmemişse" req.user'dan al:
 // "Admin/staf herhangi başkası için reserve edebilir
    if ((!req.body.isAdmin && !req.body.isStaff) || !req.body?.userId) {
      req.body.userId = req.user._id;
    }

    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    const data = await Reservation.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Get Single Reservation"
        */
    // deletedAt alanı null ise rezervasyon var
    const data = await Reservation.findOne({ _id: req.params.id }, {deletedAt: null});
   
    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Update Reservation"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Reservation'
                }
            }
        */
  // Admin değilse rezervasyona ait userId değiştirilemez:
    if (!req.body.isAdmin) {
      delete req.body.userId;
    }
    req.body.updatedId = req.user._id;

    res.status(202).send({
      error: false,
      data,
      new: await Reservation.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "Delete Reservation"
        */

    // const data = await Reservation.deleteOne({ _id: req.params.id });

    // res.status(data.deletedCount ? 204 : 404).send({
    //   error: !data.deletedCount,
    //   data,
    // });

    const data = await Reservation.updateOne({ _id: req.params.id }, { deletedAt: new Date() });
    if(!data){
      return res.status(404).send({error: true, message: "Reservation not found"})
    }
    res.status(204).send({
      error: false,
      data
    });
    //? soft delete işlemi yapıldı.

  },
  listDeleted: async (req, res) => {
    /*
            #swagger.tags = ["Reservations"]
            #swagger.summary = "List Deleted Reservations"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */    
       const data = await res.getModelList(Reservation, {deletedAt: {$ne: null}});
       res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Reservation, {deletedAt: {$ne: null}}),
        data,
      });
  }
};
