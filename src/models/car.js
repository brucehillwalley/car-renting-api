"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CAR RENTING API
------------------------------------------------------- */
const { mongoose } = require('../configs/dbConnection')
/* ------------------------------------------------------- *
{
    "plateNumber": "34ABC123",
    "brand": "Ford",
    "model": "Focus",
    "year": 2020,
    "isAutomatic": true,
    "pricePerDay": 249.99
}
{
    "plateNumber": "34ABC234",
    "brand": "Renault",
    "model": "Megane",
    "year": 2022,
    "isAutomatic": false,
    "pricePerDay": 199.99
}
{
    "plateNumber": "34ABC345",
    "brand": "Opel",
    "model": "Astra",
    "year": 2021,
    "isAutomatic": false,
    "pricePerDay": 189.99,
    "isPublish": false
}
/* ------------------------------------------------------- */
// Car Schema:

const CarSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    brand: {
        type: String,
        trim: true,
        required: true
    },
    model:{
        type: String,
        trim: true,
        required: true
    },
    year:{
        type: Number,
        min: 1950,
        max: new Date().getFullYear(),
        required: true
    },
    isAutomatic:{
        type: Boolean,
        default: false
    },
    pricePerDay:{
        type: Number,
        required: true
    },
    // images:[],
    images:{
        type:Array,
        default:[]
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    color:{
        type:String,
        trim:true
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

    
}, {    collection: 'cars'
     ,timestamps: true })
/* ------------------------------------------------------- */
// Index
CarSchema.index({ brand: 1, model: 1 });
// index yaparak aramayı hızlandırabiliriz
/* ------------------------------------------------------- */
module.exports = mongoose.model('Car', CarSchema)