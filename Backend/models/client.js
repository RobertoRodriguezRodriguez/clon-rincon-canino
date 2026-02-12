import sequelize from "../server/db.js"
import { DataTypes } from "sequelize";

const Client = sequelize.define( "cliente",
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
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No añade las columnas `createdAt` y `updatedAt`
  }
);

export default Client;
