import { Router } from 'express';
import { home } from './home';
import { post } from './post';
import { category } from './category';
import { search } from './search';
import { product } from './product';
import { iframe } from './iframe';
import { language } from './language'
import { test } from './test';
import { shop } from './shop';
import { version } from './version';
import { law } from './law';
import { contact } from './contact';
import { webMap } from './webMap'
import { morepost } from './morepost';
import { allPosts } from './allPosts';
import { productCategory } from './productCategory';
import { cas } from './cas';
import { productName } from './productName';
import { casSubclass } from './casSubclass';
import { technicalSupport } from './technicalSupport'

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
homeRouter.get('/law', law);
homeRouter.get('/contact', contact);
homeRouter.get('/morepost', morepost);
homeRouter.get('/all-posts', allPosts);
homeRouter.get('/language', language);
homeRouter.get('/webMap', webMap);
homeRouter.get('/test/*', test);
homeRouter.get('/productCategory', productCategory);
homeRouter.get('/cas', cas);
homeRouter.get('/productName', productName);
homeRouter.get('/casSubclass/:current', casSubclass);
homeRouter.get('/technicalSupport', technicalSupport);