import { Request, Response } from 'express';
import { TIMEZONES } from '../../../common/constants';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { logger } from '../../../common/helpers/logger';
import BrandRepo from '../../../common/repositories/BrandRepo';
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
      const result = await ProductRepo.getCarByName(name);
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCar()' });
      throw new InternalServerError();
    }
  };

  getCarById = async (_req: Request, res: Response) => {
    const id: string = _req.params.carId;
    try {
      const result = await ProductRepo.getCarById(id);
      res.json({ status: 'success', result });
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
  getBrandInfo = async (_req: Request, res: Response) => {
    const brand: string = _req.params.brand;
    try {
      // const brandInfo = await BrandRepo.getBrandByName(brand);
      const brandInfo = await this.getBrandInfoService(brand);
      res.json({ status: 'success', brandInfo });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBrandInfo()' });
      throw new InternalServerError();
    }
  };

  getAllBrand = async (req: Request, res: Response) => {
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
}

export default new ClientController();
