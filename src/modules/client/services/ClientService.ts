import dayjs from 'dayjs';
import { TIMEZONES } from '../../../common/constants';
import {
  convertIntToFloat,
  convertToUSD,
  getRandomBetween,
} from '../../../common/helpers';
import CarModel from '../../../common/models/CarModel';
import ClientModel from '../../../common/models/ClientModel';
import ClientPaymentModel from '../../../common/models/ClientPaymentModel';
import BrandRepo from '../../../common/repositories/BrandRepo';
import UserCarRatingRepo from '../../../common/repositories/UserCarRatingRepo';
import UserRepo from '../../../common/repositories/UserRepo';
import {
  ProcessPaymentBodyRequest,
  UpdateClientInfoAttributes,
  UserCarRatingCreation,
} from '../../../common/types/common';
import uuid from 'uuid-v4';
import sendGridMail from '../../../common/axios/sendGridMail';

class ClientService {
  async rateManyCars(ratingInfos: Array<UserCarRatingCreation>) {
    let carRatings = ratingInfos;

    if (carRatings.length === 0) {
      for (let i = 0; i < 200; i++) {
        const customCarRating = {} as UserCarRatingCreation;
        customCarRating.carId = getRandomBetween(1, 110);
        customCarRating.userId = getRandomBetween(30, 61);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        customCarRating.ratingPoint = convertIntToFloat(
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

  protected async getBrandInfoService(brand: string) {
    const numberOfCharacter = brand.split('-');
    if (numberOfCharacter.length >= 2) {
      const brandName = numberOfCharacter.join(' ');
      return BrandRepo.getBrandByName(brandName);
    }
    return BrandRepo.getBrandByName(brand);
  }

  protected async getClientDataService(userId: number) {
    const user = await UserRepo.getCurrentDetailUserById(userId);
    user.createdAt = dayjs(user.createdAt).format('DD-MM-YYYY HH:mm:ss');
    if (user.lastLoginTime !== null) {
      user.lastLoginTime = dayjs(user.lastLoginTime).format(
        'DD-MM-YYYY HH:mm:ss'
      );
    }

    const wishlist = user.info.wishlist;

    if (wishlist.length !== 0) {
      user.info.wishlist = wishlist.map((item) => {
        const currentPrice = item.cars.price;
        const imgArray = JSON.parse(item.cars.carAppearance.imgs);
        item.cars.price = convertToUSD(currentPrice);
        item.cars.carAppearance.imgs = imgArray[0];
        return item;
      });
    }
    return user;
  }

  protected async processPaymentService(
    body: ProcessPaymentBodyRequest,
    userId: number,
    email: string
  ) {
    const { carId, quantity } = body;
    const [info, car] = await Promise.all([
      ClientModel.findOne({
        where: {
          userId,
        },
      }),
      CarModel.findOne({
        where: {
          id: carId,
        },
      }),
    ]);

    if (info === null) {
      return 'You need to update your information to proceed';
    }

    if (car === null) {
      return "This car doesn't exist in our database";
    }

    if (quantity === 0) {
      return 'You need to provide quantity';
    }

    const payment = await ClientPaymentModel.create({
      carId,
      clientId: info.id,
      quantity,
      uuid: uuid(),
    });

    await sendGridMail.paymentTemplate(email, car.name, payment.uuid);

    return 'Success';
  }
}

export default ClientService;
