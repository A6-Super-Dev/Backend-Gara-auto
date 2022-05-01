import express from 'express';
import wrapper from '../../../common/helpers/wrapperController';
import customAuthorizer from '../../../middlewares/customAuthorizer';
import validateExpiryToken from '../../../middlewares/validateExpiryToken';
import ClientController from '../controller/ClientController';
import authentication from '../../../middlewares/authentication';

const router = express.Router();

router.post('/car/rating', wrapper(ClientController.ratingCar));

router.get('/car/get-one/:name', wrapper(ClientController.getCar));

router.get('/car/get-all', wrapper(ClientController.getAllCars));

router.get('/timezones', wrapper(ClientController.getTimeZone));

router.patch(
  '/update-client-info',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.updateClientInfo)
);

export default router;
