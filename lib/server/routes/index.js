'use strict';
import { Router as routerFactory } from 'express';
import { appCntrls, taskCtrl , userCntrl} from '../controllers';

let router = routerFactory();

router.route('/api/user-signup')
  .post(userCntrl.signup);

router.route('/api/user-signin')
  .post(userCntrl.signin);

router.route('/api/user-signout')
  .delete(userCntrl.signout);

router.route('/api/view-task')
  .get(taskCtrl.viewTask);

router.route('/api/create-task')
  .post(taskCtrl.createTask);

router.route('/api/update-task')
  .put(taskCtrl.updateTask);

router.route('/api/delete-task')
  .put(taskCtrl.deleteTask);

router.route('/api/restore-task')
  .put(taskCtrl.restoreTask);

router.route('/api/is-alive')
  .get(appCntrls.isAlive);

router.route('/api/*')
  .get(appCntrls.notFound);

export default function attachRoutes (app) {
  app.use(router);
}
