const Controller = require('./controller');
const models = require('../models');

class TopController extends Controller {

  // GET /
  async index(req, res) {
    const user = req.user;

    if(user) {
      const members = await user.getMembers({ 
        include: ['team'],
        order: [['teamId', 'ASC']]
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