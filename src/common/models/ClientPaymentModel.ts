import { Model, DataTypes, Optional } from 'sequelize';
import { ClientPaymentAttributes } from '../types/common';
import sequelize from '../../config/sequelize';

class ClientPaymentModel extends Model<
  ClientPaymentAttributes,
  Optional<ClientPaymentAttributes, 'id'>
> {
  id: number;
  clientId: number;
  carId: number;
  uuid: string;
  quantity: number;
}

ClientPaymentModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    carId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'client_payment',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default ClientPaymentModel;
