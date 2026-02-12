import { DataTypes } from "sequelize";
import sequelize from "../server/db.js";

const Stay = sequelize.define(
  "Stay",
  {
    id: {
      type: DataTypes.STRING(255), 
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
    cupo: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
  },
  {
    tableName: "estancia", 
    timestamps: false, 
  }
);

export default Stay;
