import sequelize from "../server/db.js";
import { DataTypes } from "sequelize";

const Pet = sequelize.define(
  "mascota",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    castrado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    vacunas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    condicion_especial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sociable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, 
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No añade las columnas `createdAt` y `updatedAt`
  }
);

export default Pet;
