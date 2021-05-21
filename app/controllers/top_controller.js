const Controller = require('./controller');
const models = require('../models');

class UsersController extends Controller {

  // GET /
  async index(req, res) {
    const user = req.user;
    console.log('確認(user): ' + JSON.stringify(user));

    if(user) {
      const members = await user.getMembers({ include: ['team'] });
      console.log('確認(members): ' + JSON.stringify(members));

      const tasks = await models.Task.findAll({
        include: ['assignee'],
        where: { assigneeId: user.id }
      });
      console.log('確認(tasks): ' + JSON.stringify(tasks));
      res.render('index', { title: 'Express', user, members, tasks });
    } else {
      res.render('index', { title: 'Express', user: req.user });
    }
  }

}

module.exports = UsersController;