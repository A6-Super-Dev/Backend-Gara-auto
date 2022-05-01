import { Request, Response } from 'express';
import { TIMEZONES } from '../../../common/constants';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { logger } from '../../../common/helpers/logger';
import ProductRepo from '../../../common/repositories/ProductRepo';
import { UpdateClientInfoAttributes } from '../../../common/types/common';
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
      logger.error(error, { reason: 'EXCEPTION at getCar()' });
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
}

export default new ClientController();
