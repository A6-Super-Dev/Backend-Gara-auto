import CarCommentModel from '../models/CarCommentModel';
import ClientModel from '../models/ClientModel';
import UserModel from '../models/UserModel';
import { CarCommentCreation } from '../types/common';

class CarCommentRepo {
  createComment(datas: CarCommentCreation) {
    const newCreatedComment = CarCommentModel.create(datas, {});
    return newCreatedComment;
  }
  getAllCommentInCar(id: number) {
    return CarCommentModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'userInfo',
          attributes: ['roles', 'status', 'email'],
          include: {
            model: ClientModel,
            as: 'info',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      ],
      where: {
        carId: id,
      },
    });
  }
}

export default new CarCommentRepo();
