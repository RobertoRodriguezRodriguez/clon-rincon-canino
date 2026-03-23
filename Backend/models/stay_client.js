import sequelize from "../server/db.js";
import { DataTypes } from "sequelize";

const StayClient = sequelize.define(
  "mascota_estancia",
  {
    id_mascota: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    id_estancia: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
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

