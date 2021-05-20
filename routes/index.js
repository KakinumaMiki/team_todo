const { Route } = require('../lib/route');
const forceLogin = require('../app/middlewares/force_login');
const forceAdmin = require('../app/middlewares/force_admin');

const route = new Route();

// function style
route.get('/', function (req, res, _next) {
  res.render('index', { title: 'Express', user: req.user });
});

// single style
route.get('/user/edit', forceLogin, 'users_controller@edit');
route.put('/user', forceLogin, 'users_controller@update');

route.get('/teams/create', forceLogin, 'teams_controller@create');
route.post('/teams', forceLogin, 'teams_controller@store');

// resource style
route.resource('examples', 'examples_controller');

// /managerのURL階層の作成
const managerRoute = route.sub('/manager', forceLogin);
managerRoute.resource('teams', { controller: 'manager/teams_controller', only: ['show', 'edit', 'update'] });

// /manager/teams/:teamのURL階層の作成
const managerTeamRoute = route.sub('/manager/teams/:team');
managerTeamRoute.resource('tasks', { controller: 'manager/tasks_controller', only: ['create', 'store', 'edit', 'update'] });
managerTeamRoute.resource('members', { controller: 'manager/members_controller', only: ['index', 'store'] });

// /adminのURL階層の作成。ログインチェック、管理者チェックが有効。
const adminRoute = route.sub('/admin', forceLogin, forceAdmin);
adminRoute.resource('users', 'admin/users_controller');

module.exports = route.router;
