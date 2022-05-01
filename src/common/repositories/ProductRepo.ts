import CarAppearanceModel from '../models/CarAppearanceModel';
import CarModel from '../models/CarModel';
import { CarCreation } from '../types/common';

class ProductRepository {
  async createNewOto(attributes: CarCreation) {
    return CarModel.create(attributes);
  }

  getAllCars = async () => {
    return CarModel.findAll({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
    });
  };

  getCar = async (id: string) => {
    return CarModel.findOne({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      where: {
        id: id,
      },
    });
  };
  getCarByName = async (name: string) => {
    return CarModel.findOne({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      where: {
        name: name,
      },
    });
  };
  getCarsByBrandId = async (id: number) => {
    return CarModel.findAll({
      include: {
        model: CarAppearanceModel,
        as: 'carAppearance',
      },
      where: {
        brandId: id,
      },
    });
  };
}

export default new ProductRepository();
