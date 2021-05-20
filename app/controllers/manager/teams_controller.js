const Controller = require('../controller');
const models = require('../../models');

class TeamsController extends Controller {
  // GET /:id
  async show(req, res) {
    const team = await this._team(req);
    const tasks = await team.getTasks({ 
      include: ['assignee'],
      order: [['id', 'DESC']]
    });
    res.render('manager/teams/show', { team, tasks });
  }

  // GET /:id/edit
  async edit(req, res) {
    const team = await this._team(req);
    res.render('manager/teams/edit', { team });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = await this._team(req);
    team.set(req.body);
    await team.save();
    await req.flash('info', `[${team.name}]に更新しました`);
    res.redirect(`/manager/teams/${team.id}/edit`);
  }

  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('Team not find');
    }
    return team;
  }
}

module.exports = TeamsController;