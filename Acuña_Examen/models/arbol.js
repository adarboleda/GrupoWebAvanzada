import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Arbol extends Model {
}

Arbol.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipoArbol: { type: DataTypes.STRING(30), allowNull: false }, // e.g. "palto","limon","chirimoya"
    precioUnitario: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rebaja: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, // monto total de rebaja aplicado
    iva: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, // monto de IVA aplicado
    totalPagar: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 } // total final
}, {
    sequelize,
    modelName: "Arbol",
    timestamps: true
});

export default Arbol;