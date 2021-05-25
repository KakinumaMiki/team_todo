const { Route } = require('../lib/route');
const forceLogin = require('../app/middlewares/force_login');
const forceAdmin = require('../app/middlewares/force_admin');
const managableTeam = require('../app/middlewares/managable_team');

const route = new Route();


// single style
route.get('/', 'top_controller@index');
route.get('/tasks/:task', forceLogin, 'tasks_controller@show');

route.get('/user/edit', forceLogin, 'users_controller@edit');
route.put('/user', forceLogin, 'users_controller@update');

route.get('/teams/create', forceLogin, 'teams_controller@create');
route.post('/teams', forceLogin, 'teams_controller@store');

route.post('/tasks/:task/comments', forceLogin, 'comments_controller@store');

// resource style
route.resource('examples', 'examples_controller');

// /managerのURL階層の作成
const managerRoute = route.sub('/manager');
managerRoute.resource('teams', managableTeam, { controller: 'manager/teams_controller', only: ['show', 'edit', 'update'] });

// /manager/teams/:teamのURL階層の作成
const managerTeamRoute = route.sub('/manager/teams/:team', managableTeam);
managerTeamRoute.resource('tasks', { controller: 'manager/tasks_controller', only: ['create', 'store', 'edit', 'update'] });
managerTeamRoute.resource('members', { controller: 'manager/members_controller', only: ['index', 'store'] });

// /adminのURL階層の作成。ログインチェック、管理者チェックが有効。
const adminRoute = route.sub('/admin', forceLogin, forceAdmin);
adminRoute.resource('users', 'admin/users_controller');

module.exports = route.router;
