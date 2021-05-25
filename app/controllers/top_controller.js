const Controller = require('./controller');
const models = require('../models');

class TopController extends Controller {
  // GET /
  async index(req, res) {
    req.setLocale(req.query.lang || 'ja');
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
      return res.render('index', { user, tasks, members });
    }
    return res.render('index');
  }

}

module.exports = TopController;