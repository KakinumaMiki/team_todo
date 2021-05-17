const Controller = require('./controller');
const models = require('../models');

class ExamplesController extends Controller {

  // GET /
  async index(req, res) {
    const users = await models.User.findAll();
    const team = await this._team(req);
    const members = await models.Member.findAll({
      include: 'user',
      where: { teamId: team.id }
    });
    res.render('members/index', { members, users, team });
  }

  // POST /
  async store(req, res) {
    const user = await this._user(req);
    const team = await this._team(req);
    const member = models.Member.build({
      teamId: team.id,
      userId: user.id
    });
    await member.save();
    await req.flash('info', `メンバー[${user.displayName}]を追加しました`);
    res.redirect(`/teams/${team.id}/members`);
  }

  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('Team not find');
    }
    return team;
  }

  async _user(req) {
    const user = await models.User.findOne({ where : { displayName: req.body.displayName } });
    if (!user) {
      throw new Error('User not find');
    }
    return user;
  }

}



module.exports = ExamplesController;