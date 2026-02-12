import sequelize from "../server/db.js"
import { DataTypes } from "sequelize";

const Class = sequelize.define( "clase",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    cupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No añade las columnas `createdAt` y `updatedAt`
  }
);

export default Class;