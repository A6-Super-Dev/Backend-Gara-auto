import express from 'express';
import { validate } from 'express-validation';
import wrapper from '../../../common/helpers/wrapperController';
import authenticateRegenerate from '../../../middlewares/authenRegenerate';
import authentication from '../../../middlewares/authentication';
import loginEngineDirectly from '../../../middlewares/loginEngineDirectly';
import validateAdmin from '../../../middlewares/validateAdmin';
import validateExpiryToken from '../../../middlewares/validateExpiryToken';
import AuthController from '../controllers/AuthController';
import authRequest from '../request/authRequest';

const router = express.Router();

router.get('/api-check', wrapper(AuthController.apiCheck));

router.post(
  '/user/sign-up',
  validate(authRequest.signUpBody),
  wrapper(AuthController.signUpAccount)
);

router.post(
  '/admin/sign-up',
  [validateExpiryToken, authentication, validateAdmin],
  wrapper(AuthController.generateAdminAccount)
);

router.post(
  '/log-in',
  [validate(authRequest.signInBody)],
  wrapper(AuthController.login)
);

router.post(
  '/log-in-directly-with-email',
  [loginEngineDirectly],
  wrapper(AuthController.loginDirectly)
);

router.post(
  '/gen-new-token',
  [validateExpiryToken, authenticateRegenerate],
  wrapper(AuthController.regenerateAccessToken)
);

export default router;
