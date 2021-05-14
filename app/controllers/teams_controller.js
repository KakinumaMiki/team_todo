const Controller = require('./controller');
const models = require('../models');

// let index = 1;
// const teams = [
//   { id: index++, title: 'テスト1', body: 'テスト1' },
//   { id: index++, title: 'テスト2', body: 'テスト2' },
// ];

class TeamsController extends Controller {
  // GET /
  // async index(req, res) {
  //   // res.render('teams/index', { teams: teams });
  //   res.render('teams/index', { team: req.body });
  // }

  // GET /create
  async create(req, res) {
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
    await req.flash('info', `新規チーム[${team.name}]を作成しました`);
    res.redirect(`/teams/${team.id}`);
  }

  // GET /:id
  async show(req, res) {
    const team = await this._team(req);
    res.render('teams/show', { team });
  }

  // GET /:id/edit
  async edit(req, res) {
    const team = await this._team(req);
    res.render('teams/edit', { team });
  }

  // PUT or PATCH /:id
  async update(req, res) {
    const team = await this._team(req);
    team.set(req.body);
    await team.save();
    await req.flash('info', `[${team.name}]に更新しました`);
    res.redirect(`/teams/${team.id}/edit`);
  }

  // DELETE /:id
  // async destroy(req, res) {
  //   await req.flash('info', '削除しました（未実装）');
  //   res.redirect('/teams/');
  // }

  async _team(req) {
    const team = await models.Team.findByPk(req.params.team);
    if (!team) {
      throw new Error('Team not find');
    }
    return team;
  }
}

module.exports = TeamsController;