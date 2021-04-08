import { login } from './login';
import { clientLogin } from './login';

/**
 * 和epec的对接说明：
 * 1. 用户自动登录：
 *      1.1 epec需要事先系统外提供用户清单（用户名等信息）；
 *      1.2 我方进行批量注册（在中心服务器注册），同时要在jointplatform中创建表保存epec的用户名与该用户在我方注册后id之间的映射关系；
 *      1.3 在epec用户调用我方提供的登录地址（/epec/login?account=&onlyCode=）时，我方需
 *          从上述映射表中查询到该用户对应的我方的id进行验证（也要回调epec接口验证该访问是否来自epec）；
 *      1.4 验证通过的，301到指定的url界面（jk-cart中界面），并实现自动登录；
 *          自动登录的具体过程是：
 *          1.4.1 验证通过，将此次登录请求记录在loginlog中，并形成唯一的token;
 *          1.4.2 301到指定的url界面时，带上此次的token参数；
 *          1.4.3 在NavView的userPassword，使用此token再次验证“登录请求”，验证通过的返回{ user: '', password: ''}，实现自动登录;
 * 2. 下单：epec用户在我方下单后，需要：1.将订单信息回传给对方；2.跳回epec网站指定界面（同时实现自动登录）,实现方式：
 *      2.1 epec用户下单，首先按照正常下单流程将订单保存在我方db中；
 *      2.2 然后从客户端调用joint中的接口，将订单信息回传给epec；
 *      2.3 回传成功的，给客户端返回epec指定的界面，从客户端跳转到其指定界面; 
 * 3. 订单取消：
 * 4. 发货：
 * 5. 发票:
 */

export { login as epecLogin, clientLogin as epecClientLogin };