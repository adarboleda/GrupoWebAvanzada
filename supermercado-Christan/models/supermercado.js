import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

//crear una clase
class Supermercado extends Model {

    //metodo calcular el descuento según el número al azar
    calcularDescuento() {
        const numero = this.numeroAzar;
        const monto = this.montoCompra;
        let porcentajeDescuento = 0;
        
        //Aplicar lógica del problema
        if (numero < 74) {
            porcentajeDescuento = 15;
        } else {
            porcentajeDescuento = 20;
        }

        const descuento = (monto * porcentajeDescuento) / 100;
        const totalAPagar = monto - descuento;
        
        return {
            montoCompra: monto,
            numeroAzar: numero,
            porcentajeDescuento,
            descuento,
            totalAPagar
        };
    }
}

//definir el modelo 
Supermercado.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombreCliente: { type: DataTypes.STRING(80), allowNull: false },
        montoCompra: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        numeroAzar: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
        sequelize, 
        modelName: "Supermercado",
        timestamps: true 
    }
)

//exportar el modelo
export default Supermercado;
