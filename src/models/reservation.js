"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "userId": "65343222b67e9681f937f001",
    "carId": "65352f518a9ea121b1ca5001",
    "startDate": "2023-10-10",
    "endDate": "2023-10-16"
}
{
    "userId": "65343222b67e9681f937f002",
    "carId": "65352f518a9ea121b1ca5002",
    "startDate": "2023-10-14",
    "endDate": "2023-10-20"
}
/* ------------------------------------------------------- */
// Reservation Model:

const ReservationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    carId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    deletedDate:{     //?SOFT DELETE
        type:Date,
        default:null,

    },
    deletedId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

}, {
    collection: 'reservations',
    timestamps: true
})

module.exports= mongoose.model('Reservation', ReservationSchema)