const Controller = require('./controller');
const models = require('../models');

class TopController extends Controller {
  // GET /
  async index(req, res) {
    const user = req.user;
    if (req.isAuthenticated()) {
      const members = await models.Member.findAll({
        include: ['team'],
        order: [['teamId', 'ASC']],
        where: { userId: user.id }
      });

      const tasks = await models.Task.findAll({
        include: ['assignee', 'team'],
        order: [['teamId', 'ASC']],
        where: { assigneeId: user.id }
      });
      console.log('membersの中身: ' + JSON.stringify(members));
      return res.render('index', { title: 'Express', user, tasks, members });
    }
    console.log('ログインしていない場合');
    return res.render('index', { title: 'Express', user });
  }

}

module.exports = TopController;