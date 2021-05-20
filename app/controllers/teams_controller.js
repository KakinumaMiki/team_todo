const Controller = require('./controller');
const models = require('../models');

class TeamsController extends Controller {
  // GET /create
  async create(_req, res) {
    const team = models.Team.build({});
    res.render('teams/create', { team });
  }

  // POST /
  async store(req, res) {
    const team = models.Team.build({
      name: req.body.name,
      ownerId: req.user.id
    });
    await team.save();
    const member = models.Member.build({
      teamId: team.id,
      userId: req.user.id,
      role: 1
    });
    await member.save();
    await req.flash('info', `新規チーム[${team.name}]を作成しました`);
    res.redirect(`/manager/teams/${team.id}`);
  }
}

module.exports = TeamsController;