/*:-----------------------------------------------------------------------------------
 * NUUN_LevelUnlimited.js
 * 
 * Copyright (C) 2020 NUUN
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * -------------------------------------------------------------------------------------
 * 
 */ 
/*:
 * @target MZ
 * @plugindesc Increase max level beyond 99
 * @author NUUN
 * @version 1.1.0
 * 
 * @help
 * The maximum level can be set to 100 or more.
 * Enter <Max Level: [Max Level]> in the memo field of the actor.
 * <MaxLevel: 200> The maximum level of actors is 200.
 * <StartLevel: 120> Set the initial level. In the setting example, the initial level is 120.
 *
 * If you want to acquire skills at level 100 or higher, in the memo column of occupation acquisition skills
 * Fill in <LearnSkill: [learning level]>. The default learning level is
 * Ignored.
 * <LearnSkill: 105> You will acquire skills when you level up to level 105.
 *
 * terms of service
 * This plugin is distributed under the MIT license.
 *
 * Change log
 * 2021/6/27 Ver 1.1.0
 * Added the function to set the initial level to level 100 or higher.
 * 2020/12/12 Ver 1.0.1
 * Fixed incorrect calculation of stats above level 100.
 * 2020/12/12 Ver 1.0.0
 * First edition
 * 
 * 
 */
var Imported = Imported || {};
Imported.NUUN_LevelUnlimited = true;

(() => {
const parameters = PluginManager.parameters('NUUN_LevelUnlimited');

const _Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  _Game_Actor_setup.call(this, actorId);
  const actor = $dataActors[actorId];
  if (actor.meta.StartLevel) {
    this._level = Number(actor.meta.StartLevel) || actor.initialLevel;
    this.initImages();
    this.initExp();
    this.initSkills();
    this.initEquips(actor.equips);
    this.clearParamPlus();
    this.recoverAll();
  }
};

const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
Game_Actor.prototype.paramBase = function(paramId) {
  if (this._level >= 100) {
    const u_levelParam = this.currentClass().params[paramId][99];
    const d_levelParam = this.currentClass().params[paramId][94];
    return this.overLevelParam(u_levelParam, d_levelParam);
  } else {
    return _Game_Actor_paramBase.call(this, paramId);
  }
};

Game_Actor.prototype.overLevelParam = function(Param1, Param2) {
  return (this._level - 99) * ((Param1 - Param2) / 5) + Param1;
};

const _Game_Actor_maxLevel = Game_Actor.prototype.maxLevel;
Game_Actor.prototype.maxLevel = function() {
  return this.actor().meta.MaxLevel ? this.actor().meta.MaxLevel : _Game_Actor_maxLevel.call(this);
};

Game_Actor.prototype.initSkills = function() {
  this._skills = [];
  for (const learning of this.currentClass().learnings) {
    let learnLv = this.learnSkillNote(learning);
    learnLv = learnLv > 0 ? learnLv : learning.level;
    if (learnLv <= this._level) {
      this.learnSkill(learning.skillId);
    }
  }
};

Game_Actor.prototype.levelUp = function() {
  this._level++;
  for (const learning of this.currentClass().learnings) {
    let learnLv = this.learnSkillNote(learning);
    learnLv = learnLv > 0 ? learnLv : learning.level;
    if (learnLv === this._level) {
      this.learnSkill(learning.skillId);
    }
  }
};

Game_Actor.prototype.learnSkillNote = function(learn) {
  const re = /<(?:LearnSkill):\s*(\d+)>/g;
  let val = null;
  while(true) {
    let match = re.exec(learn.note);
    if (match) {
      val = Number(match[1]);
      break;
    } else {
      break;
    }
  }
  return val;
};
})();
