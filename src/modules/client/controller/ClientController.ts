import { Request, Response } from 'express';
import { TIMEZONES } from '../../../common/constants';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { logger } from '../../../common/helpers/logger';
import BlogRepo from '../../../common/repositories/BlogRepo';
import BrandRepo from '../../../common/repositories/BrandRepo';
import CarCommentRepo from '../../../common/repositories/CarCommentRepo';
import ProductRepo from '../../../common/repositories/ProductRepo';
import UserCommentReactionRepo from '../../../common/repositories/UserCommentReactionRepo';
import {
  CarCommentCreation,
  ProcessPaymentBodyRequest,
  UpdateClientInfoAttributes,
} from '../../../common/types/common';
import ClientService from '../services/ClientService';

class ClientController extends ClientService {
  ratingCar = async (req: Request, res: Response) => {
    const msg = await this.rateManyCars(req.body);
    res.json({ status: 'success', msg });
  };

  getAllCars = async (_req: Request, res: Response) => {
    try {
      const result = await ProductRepo.getAllCars();
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getAllCars()' });
      throw new InternalServerError();
    }
  };

  getCar = async (_req: Request, res: Response) => {
    const name: string = _req.params.name;
    const id: number = +_req.params.id;
    try {
      const [carInfo, comments, commentReactions] = await Promise.all([
        ProductRepo.getCarByName(name),
        CarCommentRepo.getAllCommentInCar(id),
        UserCommentReactionRepo.getAllReactionsInCar(id),
      ]);
      res.json({ status: 'success', carInfo, comments, commentReactions });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCar()' });
      throw new InternalServerError();
    }
  };

  getCarById = async (_req: Request, res: Response) => {
    const id: string = _req.params.carId;
    try {
      const [carInfo, comments] = await Promise.all([
        ProductRepo.getCarById(id),
        CarCommentRepo.getAllCommentInCar(+id),
      ]);
      res.json({ status: 'success', carInfo, comments });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarById()' });
      throw new InternalServerError();
    }
  };

  getTimeZone = async (_req: Request, res: Response) => {
    try {
      res.json(TIMEZONES);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getTimeZone()' });
      throw new InternalServerError();
    }
  };

  updateClientInfo = async (req: Request, res: Response) => {
    const body: UpdateClientInfoAttributes = req.body;
    const { id } = req.user;
    try {
      const message = await this.updateClientInfoService(body, id);
      const status = message.includes('Success') ? 200 : 400;
      res.status(status).send(message);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateClientInfo()' });
      throw new InternalServerError();
    }
  };

  getCarsByBrand = async (req: Request, res: Response) => {
    let brand: string = req.params.brand;
    if (brand === 'rolls-royce') brand = 'rolls royce';
    try {
      const { id } = await BrandRepo.getBrandByName(brand);
      if (id) {
        const cars = await ProductRepo.getCarsByBrandId(id);
        res.json({ status: 'success', cars });
      } else {
        res.json({ status: 'success', msg: 'Brand name is invalid' });
      }
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarsByBrand()' });
      throw new InternalServerError();
    }
  };
  getBrandInfo = async (req: Request, res: Response) => {
    const brand: string = req.params.brand;
    try {
      const brandInfo = await this.getBrandInfoService(brand);
      res.json({ status: 'success', brandInfo });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBrandInfo()' });
      throw new InternalServerError();
    }
  };

  getAllBrand = async (_req: Request, res: Response) => {
    try {
      const allBrand = await BrandRepo.getAllBrandRepo();
      res.json({ status: 'success', allBrand });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBrandInfo()' });
      throw new InternalServerError();
    }
  };

  getClientData = async (req: Request, res: Response) => {
    const { id } = req.user;
    try {
      const result = await this.getClientDataService(id);
      res.json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getClientData()' });
      throw new InternalServerError('Get client data failed');
    }
  };

  getAllBlogs = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const tempPage = parseInt(page as string);
    const tempLimit = parseInt(limit as string);
    try {
      const result = await BlogRepo.getAllBlogs(tempPage, tempLimit);
      res.json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getAllBlogs()' });
      throw new InternalServerError('Get client data failed');
    }
  };

  getBlogById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await BlogRepo.getBlogById(+id);
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBlogByName()' });
      throw new InternalServerError(`Get blog by name failed with title ${id}`);
    }
  };

  getBlogByOffset = async (req: Request, res: Response) => {
    const { offset } = req.params;
    try {
      const result = await BlogRepo.getBlogByOffset(+offset);
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBlogByName()' });
      throw new InternalServerError(
        `Get blog offset failed with title ${offset}`
      );
    }
  };

  createComment = async (req: Request, res: Response) => {
    const comment: CarCommentCreation = req.body;
    try {
      const result = await CarCommentRepo.createComment(comment);
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at createComment()' });
      throw new InternalServerError(
        `creating comment failed at createComment()`
      );
    }
  };

  getCarComments = async (req: Request, res: Response) => {
    const { carId } = req.params;
    try {
      const [result, carComments] = await Promise.all([
        CarCommentRepo.getAllCommentInCar(+carId),
        UserCommentReactionRepo.getAllReactionsInCar(+carId),
      ]);
      res.json({ status: 'success', result, carComments });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarComments()' });
      throw new InternalServerError(
        `creating comment failed at getCarComments()`
      );
    }
  };

  createNewReaction = async (req: Request, res: Response) => {
    const { userId, commentId, carId, like = 0, dislike = 0 } = req.body;
    try {
      const result = await UserCommentReactionRepo.createReaction({
        userId,
        commentId,
        carId,
        like,
        dislike,
      });
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at createNewReaction()' });
      throw new InternalServerError(
        `creating comment failed at createNewReaction()`
      );
    }
  };

  updateReaction = async (req: Request, res: Response) => {
    const { userId, commentId, carId, like = 0, dislike = 0 } = req.body;
    try {
      const result = await UserCommentReactionRepo.updateReaction(
        {
          userId,
          commentId,
          carId,
          like,
          dislike,
        },
        userId,
        commentId
      );
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateReaction()' });
      throw new InternalServerError(
        `creating comment failed at updateReaction()`
      );
    }
  };

  processPayment = async (
    req: Request<unknown, unknown, ProcessPaymentBodyRequest>,
    res: Response
  ) => {
    const data = req.body;
    const { id, email } = req.user;
    try {
      const result = await this.processPaymentService(data, id, email);
      const statusNum = result.includes('Success') ? 200 : 400;
      res.status(statusNum).json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at processPayment()' });
      throw new InternalServerError('Process payment fail');
    }
  };

  getPayment = async (req: Request, res: Response) => {
    const { id } = req.user;
    try {
      const result = await this.getPaymentService(id);
      res.json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getPayment()' });
      throw new InternalServerError('Get payment fail');
    }
  };
}

export default new ClientController();
