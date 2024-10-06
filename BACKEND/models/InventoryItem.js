const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    supName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    quantityAvailable: {
        type: Number,
        required: true,
    },
    supplyDate: {
        type: Date,
        required: true,
        get: (v) => v ? v.toISOString().split('T')[0] : null,
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
    mfdDate: {
        type: Date,
        required: true,
        get: (v) => v ? v.toISOString().split('T')[0] : null,
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
    expireDate: {
        type: Date,
        required: true,
       
        get: (v) => v ? v.toISOString().split('T')[0] : null,
        set: (v) => new Date(v.toISOString().split('T')[0]),
    },
}, { toJSON: { getters: true }, toObject: { getters: true } });

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);

module.exports = InventoryItem;
