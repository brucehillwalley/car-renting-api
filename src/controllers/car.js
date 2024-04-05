"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
// Car Controller:

const Car = require("../models/car");
const Reservation = require("../models/reservation");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "List Cars"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

    //? daha sonra aşağıdaki yorum satırlarını ekleyebilirsin.........
    /* QUERY'DEN ALINAN TARİH ARALIĞINA GÖRE GÖRE LİSTELEME */
    // if (req.query.startDate && req.query.endDate) {
    //   customFilter = { ...customFilter, ...{ date: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) } } }
    // }

    /* QUERY'DEN ALINAN FİYAT ARALIĞINA GÖRE GÖRE LİSTELEME */
    // if (req.query.minPrice && req.query.maxPrice) {
    //   customFilter = { ...customFilter, ...{ price: { $gte: req.query.minPrice, $lte: req.query.maxPrice } } }
    //}

    /* QUERY'DEN ALINAN MODEL ARALIĞINA GÖRE GÖRE LİSTELEME */
    // if (req.query.model) {
    //   customFilter = { ...customFilter, ...{ model: { $regex: req.query.model, $options: "i" } } }
    // }

    // müsait olmayan araçları listelememek için / (yani isAvailable: false olanlar)
    let customFilter = { isAvailable: true, deletedAt: null };

    /* QUERY'DEN ALINAN TARİH ARALIĞINA GÖRE GÖRE LİSTELEME */
    // List by dateFilter:
    // URL?startDate=2024-01-01&endDate=2024-01-10

    //? destructuring  yaparak  req.query objesini kendi oluşturdugumuz değişkenlere atadık
    const { startDate: getStartDate, endDate: getEndDate } = req.query;

    if (getStartDate && getEndDate) {
      //* talep edilen startDate var olan rezervasyonların endDate' inden büyük olmalı veya
      //* endDate var olan rezervasyonların startDate' inden küçük olmalı
      //* rezerve olmayan kayıt olmadığı için yani sadece rezervasyon kaydı tutuluyor

      const reservedCars = await Reservation.find(
        {
          $nor: [
            //? aşağıdaki ifadeler or ile yapılsa idi talep edilen tarih aralığının dışındakileri verecekti.
            //? nor => not or ile talep edilen tarih aralığındaki rezerve edilmiş olan arabaları getirdi

            { startDate: { $gt: getEndDate } },
            { endDate: { $lt: getStartDate } },
          ],
        },
        { _id: 0, carId: 1 }
      ).distinct("carId");
      // console.log(reservedCars);

      //?distinct kullanmadan reservedCars obje içerisinde id tutuyordu bunu filtrelemede kullanamayız, distinct kullanarak tekrarları almadan sadece idleri tutan bir array oluşturduk
         // Gelen Data:
            // [
            //     { carId: new ObjectId("660d9d2932ba8b3174a05721") },
            //     { carId: new ObjectId("660d9d2932ba8b3174a05721") }
            // ]
            // convert to Filtre Data (distinct);
            // [
            //    new ObjectId("660d9d2932ba8b3174a05721"),
            //    new ObjectId("660d9d2932ba8b3174a05721")
            // ]


      //? Filter objesine NotIN (nin) ekle:
      if (reservedCars.length) {
        customFilter._id = { $nin: reservedCars };
      }
      // console.log(customFilter);
    } else {
      req.errorStatusCode = 400;
      throw new Error("Bad Request: startDate and endDate are required.");
    }

    const data = await res.getModelList(Car, customFilter, [
      { path: "createdId", select: "username" },
      { path: "updatedId", select: "username" },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Car, customFilter),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Create Car"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Car'
                }
            }
        */
    //user zaten login oldugu icin createdId ve updatedId' yi body'den almaya gerek yok
    // createdId ve updatedId verisini req.user'dan al:
    req.body.createdId = req.user._id;
    req.body.updatedId = req.user._id;

    const data = await Car.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Get Single Car"
        */
    const data = await Car.findOne(
      { _id: req.params.id },
      { deletedAt: null },
      [
        { path: "createdId", select: "username" },
        { path: "updatedId", select: "username" },
      ]
    );

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Update Car"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    $ref: '#/definitions/Car'
                }
            }
        */
    // user zaten login oldugu icin updatedId' yi body'den almaya gerek yok
    // sadece staff veya admin güncelleyeblir permission var
    req.body.updatedId = req.user._id;

    const data = await Car.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    //! aşağıdaki mi doğru yoksa yukarıdaki mi?
    // const data = await Car.updateOne(customFilter, req.body, { runValidators: true })

    res.status(202).send({
      error: false,
      data,
      new: await Car.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Delete Car"
        */

    // const data = await Car.deleteOne({ _id: req.params.id });

    // res.status(data.deletedCount ? 204 : 404).send({
    //   error: !data.deletedCount,
    //   data,
    const data = await Car.updateOne(
      { _id: req.params.id },
      { deletedAt: new Date() }
    );
    if (!data) {
      return res.status(404).send({ error: true, message: "Car not found" });
    }
    res.status(204).send({
      error: false,
      data,
    });
    //? soft delete işlemi yapıldı.
  },
  listDeleted: async (req, res) => {
    /*
          #swagger.tags = ["Cars"]
            #swagger.summary = "List Deleted Cars"
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
    const data = await res.getModelList(Car, { deletedAt: { $ne: null } });
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Car, { deletedAt: { $ne: null } }),
      data,
    });
  },
};
