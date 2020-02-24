import { Router } from 'express';
import { home } from './home';
import { post } from './post';
import { category } from './category';
import { search } from './search';
import { product } from './product';
import { iframe } from './iframe';

import { test } from './test';
import { shop } from './shop';
import { version } from './version';
import { morepost } from './morepost';
import { allPosts } from './allPosts';

export const homeRouter = Router({ mergeParams: true });
homeRouter.get('/', home);
homeRouter.get('/post/:id', post);
homeRouter.get('/category/:current', category);
homeRouter.get('/search/:key', search);
homeRouter.get('/search', search);
homeRouter.get('/product/:id', product);
homeRouter.get('/iframe', iframe);
homeRouter.get('/shop', shop);
homeRouter.get('/version', version);
homeRouter.get('/morepost', morepost);
homeRouter.get('/all-posts', allPosts);

homeRouter.get('/test/*', test);
