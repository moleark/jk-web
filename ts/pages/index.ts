import { Router } from 'express';
import { home } from './home';
import { post } from './post';
import { category } from './category';

export const homeRouter = Router({mergeParams: true});
homeRouter.get('/', home);
homeRouter.get('/post/:id', post);
homeRouter.get('/category/:current', category);
