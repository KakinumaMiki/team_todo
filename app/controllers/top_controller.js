const Controller = require('./controller');
const models = require('../models');

class TopController extends Controller {
  // GET /
  async index(req, res) {
    const user = req.user;
    if(req.isAuthenticated()) {
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
      res.render('index', { title: 'Express', user, members, tasks });
    } else {
      res.render('index', { title: 'Express', user });
    }
  }

}

module.exports = TopController;