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
import { captcha } from './captcha';
import { productPdfFile } from './productPdfFile';
import { productMsdsFile, productMsdsFileByOrigin, productMsdsVersions } from './ProductMSCU/productMsds';
import { productSpecFile, productSpecFileByOrigin } from './ProductMSCU/productSpec';
import { orderPayment } from './orderPayment/orderPayment';
import { wxOrderQuery } from './orderPayment/wxPay';
import { wxNotice } from './orderPayment/notice';
import { privacy } from './privacy';

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

homeRouter.get('/partial/captcha', captcha);
homeRouter.get('/partial/productMsdsVersion/:origin', productMsdsVersions);
homeRouter.get('/partial/productMsdsFileByOrigin/:lang/:origin/:captcha', productMsdsFileByOrigin);
homeRouter.get('/partial/productSpecFileByOrigin/:origin/:captcha', productSpecFileByOrigin);


homeRouter.get('/partial/productMsdsFile/:lang/:productid/:captcha', productMsdsFile);
homeRouter.get('/partial/productSpecFile/:productid/:captcha', productSpecFile);


homeRouter.get('/partial/orderPayment/:payid/:appid/:orderid', orderPayment);
homeRouter.get('/partial/payOrderQuery/:orderid', wxOrderQuery);
homeRouter.get('/partial/wxpay/notice', wxNotice);


//delete
homeRouter.get('/partial/productpdffile/:captcha/:lang/:productid', productPdfFile);  // 保持兼容，暂时保留

homeRouter.get('/privacy', privacy);  // 保持兼容，暂时保留
