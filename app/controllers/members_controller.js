const Controller = require('./controller');
const models = require('../models');

class ExamplesController extends Controller {

  // GET /
  async index(req, res) {
    const member = models.Member.build({});
    const users = await models.User.findAll();
    const team = await this._team(req);
    res.render('members/index', { member, users, team });
  }

  // GET /create
  async create(req, res) {
    const member = models.Member.build({});
    const team = await this._team(req);
    res.render(`members/create`, { member, team });
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

  // GET /:id
  async show(req, res) {
    const team = await this._team(req);
    const tasks = await models.Task.findAll({
      include: 'team',
      where: { teamId: team.id },
      order: [['id', 'DESC']]
    });
    res.render('members/show', { team, tasks });
  }


  // GET /:id/edit
  async edit(req, res) {
    const task = await this._task(req);
    res.render('tasks/edit', { task });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const task = await this._task(req);
    task.set(req.body);
    await task.save();
    await req.flash('info', `[${task.title}]を更新しました`);

    res.redirect(`/teams/${task.teamId}`);
  }


  // DELETE /:id
  async destroy(req, res) {
    await req.flash('info', '削除しました（未実装）');
    res.redirect('/teams/');
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