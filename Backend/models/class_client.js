import sequelize from "../server/db.js"
import { DataTypes } from "sequelize";

const ClassClient = sequelize.define( "clase_cliente",
  {
    id_clase: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No añade las columnas `createdAt` y `updatedAt`
  }
);

export default ClassClient;