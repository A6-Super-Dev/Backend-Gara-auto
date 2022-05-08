import express from 'express';
import wrapper from '../../../common/helpers/wrapperController';
import customAuthorizer from '../../../middlewares/customAuthorizer';
import validateExpiryToken from '../../../middlewares/validateExpiryToken';
import ClientController from '../controller/ClientController';
import authentication from '../../../middlewares/authentication';

const router = express.Router();
router.get('/brand/get-all', wrapper(ClientController.getAllBrand));
router.get('/brand/:brand', wrapper(ClientController.getBrandInfo));

router.post('/car/rating', wrapper(ClientController.ratingCar));
router.get('/car/get-all', wrapper(ClientController.getAllCars));
router.get('/car/get-one/:name', wrapper(ClientController.getCar));
router.get('/car/:carId', wrapper(ClientController.getCarById));
router.get('/car/brand/:brand', wrapper(ClientController.getCarsByBrand));

router.get('/blog', wrapper(ClientController.getAllBlogs));
router.get('/blog/:title', wrapper(ClientController.getBlogByName));

router.get('/timezones', wrapper(ClientController.getTimeZone));

router.patch(
  '/update-client-info',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.updateClientInfo)
);

router.get(
  '/client-data',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.getClientData)
);

router.post(
  '/process-payment',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.processPayment)
);

export default router;
