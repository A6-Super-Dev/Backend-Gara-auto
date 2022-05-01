import { TIMEZONES } from '../../../common/constants';
import { converIntToFloat, getRandomBetween } from '../../../common/helpers';
import ClientModel from '../../../common/models/ClientModel';
import UserCarRatingRepo from '../../../common/repositories/UserCarRatingRepo';
import UserRepo from '../../../common/repositories/UserRepo';
import {
  UpdateClientInfoAttributes,
  UserCarRatingCreation,
} from '../../../common/types/common';
class ClientService {
  async rateManyCars(ratingInfos: Array<UserCarRatingCreation>) {
    let carRatings = ratingInfos;
    if (carRatings.length === 0) {
      for (let i = 0; i < 200; i++) {
        const customCarRating = {} as UserCarRatingCreation;
        customCarRating.carId = getRandomBetween(1, 110);
        customCarRating.userId = getRandomBetween(30, 61);
        customCarRating.ratingPoint = converIntToFloat(
          getRandomBetween(7, 11),
          1
        ) as any;
        carRatings = [...carRatings, customCarRating];
      }
    }
    await Promise.all(
      carRatings.map((carRating) => {
        return this.rateCar(carRating);
      })
    );
    return 'query has been executed';
  }
  rateCar(carRating: UserCarRatingCreation) {
    return UserCarRatingRepo.carRating(carRating);
  }

  protected async updateClientInfoService(
    data: UpdateClientInfoAttributes,
    userId: number
  ) {
    const user = await UserRepo.findUserById(userId);

    if (user === null) {
      return 'Update user info fail due to invalid user Id';
    }
    const timezone = [];

    for (const [key] of Object.entries(TIMEZONES)) {
      timezone.push(key);
    }

    if (!timezone.includes(data.timezone)) {
      return 'Update user info fail due to invalid timezone';
    }

    await ClientModel.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        dob: new Date(data.dob),
        addressCountry: data.country,
        addressProvince: data.province,
        addressDistrict: data.district,
        addressWard: data.ward,
        addressDetail: data.detail,
        timezone: data.timezone,
      },
      {
        where: {
          userId: user.id,
        },
      }
    );

    return 'Success';
  }
}

export default ClientService;
