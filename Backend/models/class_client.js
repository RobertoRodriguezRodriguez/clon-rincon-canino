import sequelize from "../server/db.js"
import { DataTypes } from "sequelize";

const ClassClient = sequelize.define( "mascota_clase",
  {
    id_mascota: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    id_clase: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No añade las columnas `createdAt` y `updatedAt`
  }
);

export default ClassClient;