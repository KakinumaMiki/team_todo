module.exports = async function managableTeam(req, res, next) {
  const members = await req.user.getMembers({ where : { teamId: req.params.team, role: 1 } });
  if ( members.length > 0 ) {
    return next();
  } else {
    await req.flash('alert', 'アクセスできません');
    res.redirect('/');
  }
};