import { Request, Response } from 'express';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { logger } from '../../../common/helpers/logger';
import ProductRepo from '../../../common/repositories/ProductRepo';
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
    try {
      const result = await ProductRepo.getCarByName(name.replaceAll('-', ' '));
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getAllCars()' });
      throw new InternalServerError();
    }
  };
}

export default new ClientController();
