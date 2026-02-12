import sequelize from "../server/db.js"
import { DataTypes } from "sequelize";

const Photos = sequelize.define( "fotos",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
    },
    contenido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_pet: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No añade las columnas `createdAt` y `updatedAt`
  }
);

export default Photos;