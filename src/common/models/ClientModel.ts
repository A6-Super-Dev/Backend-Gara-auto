import { Model, DataTypes, Optional } from 'sequelize';
import { ClientAttributes } from '../types/common';
import sequelize from '../../config/sequelize';

class ClientModel extends Model<
  ClientAttributes,
  Optional<ClientAttributes, 'id'>
> {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dob: Date;
  addressCountry: string;
  addressProvince: number;
  addressDistrict: number;
  addressWard: number;
  addressDetail: string;
  timezone: string;
  stripeCustomerId: string;
  avatar: string;
}

ClientModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
    },
    lastName: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.STRING(10),
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
    },
    dob: {
      type: DataTypes.DATE,
    },
    addressCountry: {
      type: DataTypes.STRING(30),
    },
    addressProvince: {
      type: DataTypes.INTEGER,
    },
    addressDistrict: {
      type: DataTypes.INTEGER,
    },
    addressWard: {
      type: DataTypes.INTEGER,
    },
    addressDetail: {
      type: DataTypes.STRING(100),
    },
    timezone: {
      type: DataTypes.STRING(30),
    },
    stripeCustomerId: {
      type: DataTypes.STRING(40),
    },
    avatar: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'client_info',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default ClientModel;
