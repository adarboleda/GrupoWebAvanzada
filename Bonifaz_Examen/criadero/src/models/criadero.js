import mongoose from "mongoose";

const {Schema, model} = mongoose;

const criaderoSchema = new Schema({
    tipoArbol: { type: String, required: true, enum: ['Paltos', 'Limones', 'Chirimoyos']
    },
    precioUnitario: { type: Number,  required: true 
    },
    cantidad: { type: Number, required: true, min: 1
    },
    rebaja: { type: Number, default: 0 
    },
    iva: {  type: Number, default: 0 
    },
    totalPagar: { type: Number, default: 0 
    }
}, { timestamps: true });

export const Criadero = model("Criadero", criaderoSchema);
