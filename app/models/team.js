'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.Owner = this.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner'
      });

      this.Tasks = this.hasMany(models.Task, {
        foreignKey: 'teamId',
        as: 'tasks'
      });

      this.Members = this.hasMany(models.Member, {
        foreignKey: 'teamId',
        as: 'members'
      });

      this.MemberUsers = this.belongsToMany(models.User, {
        through: 'Member',
        foreignKey: 'teamId',
        otherKey: 'userId',
        as: 'memberUsers'
      });
    }

    static async createWithOwner(user, body) {
      const team = this.build({
        name: body.name,
        ownerId: user.id
      });
      await team.save();
      await team.createMember({
        teamId: team.id,
        userId: user.id,
        role: 1
      });
      return team;
    }

    async isManager(user) {
      const members = await this.getMembers({
        where: {
          role: 1,
          userId: user.id
        }
      });
      if (members.length > 0){
        return true;
      } else {
        return false;
      }
    }
  }
  Team.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};