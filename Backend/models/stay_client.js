import sequelize from "../server/db.js";
import { DataTypes } from "sequelize";

const StayClient = sequelize.define(
  "estancia_cliente",
  {
    id_estancia: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    lista_espera: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default StayClient;

