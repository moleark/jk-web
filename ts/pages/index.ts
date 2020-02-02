import { Router } from 'express';
import { home } from './home';
import { wayneLigshTest } from './wayne-ligsh-test';

export const homeRouter = Router();
homeRouter.get('/', home);
homeRouter.get('/wayne-ligsh-test', wayneLigshTest);
