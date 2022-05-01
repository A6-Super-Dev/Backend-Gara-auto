import express from 'express';
import wrapper from '../../../common/helpers/wrapperController';
import ClientController from '../controller/ClientController';

const router = express.Router();

router.post('/car/rating', wrapper(ClientController.ratingCar));
router.get('/car/get-one/:name', wrapper(ClientController.getCar));
router.get('/car/get-all', wrapper(ClientController.getAllCars));

export default router;
