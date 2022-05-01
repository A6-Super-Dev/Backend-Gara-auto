import CarAppearanceModel from '../models/CarAppearanceModel';
import { CarAppearanceCreation, CarAppearanceModifying } from '../types/common';

class CarAppearanceRepository {
  async createNewImgsOfOto(datas: CarAppearanceCreation) {
    return CarAppearanceModel.create(datas);
  }
  modifyCarImg = (obj: CarAppearanceModifying, carId: number) => {
    return CarAppearanceModel.update(obj, {
      where: {
        car_id: carId,
      },
    });
  };
}

export default new CarAppearanceRepository();
