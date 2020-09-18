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
import { information } from './information';
import { allPosts } from './allPosts';
import { productCategory } from './productCategory';
import { cas } from './cas';
import { productName } from './productName';
import { ProductResources } from './ProductResources';
import { casSubclass } from './casSubclass';
import { technicalSupport } from './technicalSupport'
import { subjectpost } from './subjectpost';
import { categoryInstruction } from './categoryinstruction';
import { cart } from './cart';
import { post_test } from './post_test';
import { pointProductDetail } from './pointProductDetail';

export const homeRouter = Router({ mergeParams: true });
homeRouter.get('/', home);
homeRouter.get('/post/:id', post);
homeRouter.get('/category/:current', category);
homeRouter.get('/productcategory/:current', category);
homeRouter.get('/search/:key', search);
homeRouter.get('/search', search);
homeRouter.get('/product/:id', product);
homeRouter.get('/iframe', iframe);
homeRouter.get('/shop', shop);   //转移到nginx中实现，免去在web中维护shop的麻烦
homeRouter.get('/version', version);
homeRouter.get('/law', law);
homeRouter.get('/contact', contact);
homeRouter.get('/information', information);
homeRouter.get('/all-posts', allPosts);
homeRouter.get('/language', language);
homeRouter.get('/webMap', webMap);
homeRouter.get('/test/*', test);
homeRouter.get('/productCategory', productCategory);
homeRouter.get('/cas', cas);
homeRouter.get('/productName', productName);
homeRouter.get('/ProductResources', ProductResources);
homeRouter.get('/casSubclass/:current', casSubclass);
homeRouter.get('/technicalSupport', technicalSupport);
homeRouter.get('/subjectpost/:current', subjectpost);
homeRouter.get('/cart', cart);
homeRouter.get('/post_test/:id', post_test);

homeRouter.get('/partial/categoryinstruction/:current', categoryInstruction);
homeRouter.get('/partial/pointproductdetail/:current', pointProductDetail);