import { Router } from 'express';
import { home } from './home';
import { wayneLigshTest } from './wayne-ligsh-test';
import { post } from './post';

export const homeRouter = Router({mergeParams: true});
homeRouter.get('/', home);
homeRouter.get('/post/:id', post);
homeRouter.get('/wayne-ligsh-test', wayneLigshTest);
