/*:-----------------------------------------------------------------------------------
 * NUUN_StateIconSideBySide.js
 * 
 * Copyright (C) 2021 NUUN
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * -------------------------------------------------------------------------------------
 */ 
/*:
 * @target MZ
 * @plugindesc  state side-by-side display
 * @author NUUN
 * @version 1.3.0
 * 
 * @help
* Display the states displayed during battle side by side.
* Since this plugin has a function to display the remaining turns, it is different from the state and buff remaining turn display plugin.
* Cannot be used together.
* Since the plug-in name and plug-in parameters have changed from Ver.1.0.3 or earlier, please set again.
*
* Display turn mode
* The default correction value when'remaining'is specified is 1.
* When'elapsed'is specified, set the turn number correction to -1.
* The state elapsed turn count plugin is required to display the elapsed turns.
*
* When used in combination with a plug-in that enlarges the image of an enemy character, the image may be distorted.
* If you are worried about it, please use it together with the enemy state display expansion.
*
* terms of service
* This plugin is distributed under the MIT license.
*
* Change log
 * 2022/4/9 Ver.1.3.0
* Added the function to specify the line of the display icon.
* Lighter processing.
 * 2022/3/31 Ver.1.2.3
* Fixed an issue where the actor's state was not displayed when used in combination with pseudo 3D battles.
 * 2022/3/30 Ver.1.2.2
* Fixed an issue where the image would be distorted when more states were added than could be displayed.
 * 2022/3/28 Ver.1.2.1
* Fixed the problem that an image like a line is displayed in the icon display part with a specific plug-in.
 * 2022/1/21 Ver.1.2.0
* Added elapsed turns to the display of state turns. (Turn count after state required)
 * 2021/9/23 Ver.1.1.0
* Significant change in processing due to state display switching reflection.
* Added a function that can be displayed side by side even for enemies.
 * 2021/1/24 Ver.1.0.3
* Corrected the processing when using the battle style expansion together.
 * 2021/1/17 Ver.1.0.2
* Fixed the problem that the coordinates are not reflected when the coordinate permission of the state is set to ture when the battle style extension plug-in is introduced.
* Supports Battle Style Expansion Plugin 2.0.0 or later.
 * 2021/1/3 Ver.1.0.1
* Changed so that the width to be displayed can be specified.
 * 2021/1/2 Ver.1.0.0
* First edition
 * 
 * @param Setting
 * @text common settings
 * @default ------------------------------
 * 
 * @param StateIconWidth
 * @desc Specifies the width to display the state icon. 0 is the width of the number of icon columns.
 * @text banner
 * @type number
 * @default 0
 * @min 0
 * @parent Setting
 * 
 * @param ActorStateIcon
 * @text ally state icon
 * @default ------------------------------
 * 
 * @param ActorStateIconShowVal
 * @desc The number of ally state columns.
 * @text Number of friendly state columns
 * @type number
 * @default 5
 * @min 1
 * @parent ActorStateIcon
 * 
 * @param ActorStateIconRows
 * @desc Number of ally state lines.
 * @text Number of friendly state lines
 * @type number
 * @default 1
 * @min 1
 * @parent ActorStateIcon
 * 
 * @param ActorStateIconAlign
 * @desc Display alignment of ally icons
 * @text Friend icon display alignment
 * @type select
 * @option Left alignment
 * @value 'left'
 * @option Centered
 * @value 'center'
 * @option Right Alignment
 * @value 'right'
 * @default 'right'
 * @parent ActorStateIcon
 * 
 * @param EnemyStateIcon
 * @text Enemy state icon
 * @default ------------------------------
 * 
 * @param EnemyStateIconShowVal
 * @desc The number of enemy state columns.
 * @text Number of enemy state columns
 * @type number
 * @default 5
 * @min 1
 * @parent EnemyStateIcon
 * 
 * @param EnemyStateIconRows
 * @desc The number of enemy state lines.
 * @text Number of enemy state lines
 * @type number
 * @default 1
 * @min 1
 * @parent EnemyStateIcon
 * 
 * @param EnemyStateIconAlign
 * @desc Alignment of enemy icon
 * @text Enemy icon display alignment
 * @type select
 * @option Left Alignment
 * @value 'left'
 * @option Centered
 * @value 'center'
 * @option Right alignment
 * @value 'right'
 * @default 'center'
 * @parent EnemyStateIcon
 * 
 * @param StateTurn
 * @text Turn display setting
 * @default ------------------------------
 * 
 * @param TurnMode
 * @desc Specifies the turn mode to display.
 * @text display turn mode
 * @type select
 * @option Remaining turns
 * @value 'remaining'
 * @option Elapsed turn (required state elapsed turn count)
 * @value 'elapsed'
 * @default 'remaining'
 * @parent StateTurn
 * 
 * @param ActorStateIconVisible
 * @desc Shows the remaining turns in the ally's state.
 * @text Ally state remaining turn display
 * @type boolean
 * @default false
 * @parent StateTurn
 * 
 * @param EnemyStateIconVisible
 * @desc Shows the remaining turns in the enemy state.
 * @text Enemy state remaining turn display
 * @type boolean
 * @default false
 * @parent StateTurn
 * 
 * @param TurnX
 * @desc Turn coordinates X (relative)
 * @text Turn coordinates X (relative)
 * @type number
 * @default 0
 * @min -9999
 * @parent StateTurn
 * 
 * @param TurnY
 * @desc Turn coordinates Y (relative)
 * @text Turn coordinates Y (relative)
 * @type number
 * @default -4
 * @min -9999
 * @parent StateTurn
 * 
 * @param TurnFontSize
 * @desc Turn font size. (From the main font)
 * @text Turn font size
 * @type number
 * @default -4
 * @min -9999
 * @parent StateTurn
 * 
 * @param TurnCorrection
 * @text Turn number correction
 * @desc Updates the display of the number of turns.
 * @default 1
 * @type number
 * @min -9999
 * @max 9999
 * @parent StateTurn
 * 
 */

var Imported = Imported || {};
Imported.NUUN_StateIconSideBySide = true;

(() => {
const parameters = PluginManager.parameters('NUUN_StateIconSideBySide');
let StateIconWidth = Number(parameters['StateIconWidth'] || 0);
const ActorStateIconShowVal = Number(parameters['ActorStateIconShowVal'] || 5);
const ActorStateIconRows = Number(parameters['ActorStateIconRows'] || 1);
const EnemyStateIconShowVal = Number(parameters['EnemyStateIconShowVal'] || 1);
const EnemyStateIconRows = Number(parameters['EnemyStateIconRows'] || 1);
const ActorStateIconAlign = eval(parameters['ActorStateIconAlign'] || 'right');
const EnemyStateIconAlign = eval(parameters['EnemyStateIconAlign'] || 'center');
const ActorStateIconVisible = eval(parameters['ActorStateIconVisible'] || 'true');
const EnemyStateIconVisible = eval(parameters['EnemyStateIconVisible'] || 'true');
const TurnMode = eval(parameters['TurnMode'] || 'remaining');
const TurnFontSize = Number(parameters['TurnFontSize'] || -4);
const TurnX = Number(parameters['TurnX'] || 0);
const TurnY = Number(parameters['TurnY'] || -4);
const TurnCorrection = Number(parameters['TurnCorrection'] || 1);
let isEnemyMode = false;

const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
Sprite_Enemy.prototype.initMembers = function() {
  isEnemyMode = true;
  _Sprite_Enemy_initMembers.call(this);
};


const _Sprite_StateIcon_initialize = Sprite_StateIcon.prototype.initialize;
Sprite_StateIcon.prototype.initialize = function() {
  _Sprite_StateIcon_initialize.call(this);
};

const _Sprite_StateIcon_initMembers = Sprite_StateIcon.prototype.initMembers;
Sprite_StateIcon.prototype.initMembers = function() {
  _Sprite_StateIcon_initMembers.call(this);
};

Sprite_StateIcon.prototype.bitmapWidth = function() {
  return Math.min(ImageManager.iconWidth * this.getStateIconShowVal(), StateIconWidth);
};

Sprite_StateIcon.prototype.bitmapHeight = function() {
  return ImageManager.iconHeight * this.getMaxStateIconRows();
};

Sprite_StateIcon.prototype.loadBitmap = function() {// Redefined
  this._iconSprite = [];
  this.createSprite();
};

Sprite_StateIcon.prototype.createSprite = function() {
  for (let i = 0; i < this.getMaxStateIconShowVal() * this.getMaxStateIconRows(); i++) {
    const sprite = new Sprite();
    this.addChild(sprite);
    this._iconSprite.push(sprite);
    this.setInitIcon(sprite, i);
    this.textTurn(sprite);
  }
  isEnemyMode = false;
};

Sprite_StateIcon.prototype.textTurn = function(sprite) {
  const textSprite = new Sprite();
  sprite.addChild(textSprite);
  sprite.turnSprite = textSprite;
  textSprite.x = TurnX;
  textSprite.y = TurnY;
  textSprite.bitmap = new Bitmap(ImageManager.iconWidth, ImageManager.iconHeight);
};

Sprite_StateIcon.prototype.setInitIcon = function(sprite, i) {
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  this._animationCount = 0;
  this._animationIndex = 0;
  sprite.bitmap = ImageManager.loadSystem("IconSet");
  sprite.setFrame(0, 0, 0, 0);
};

Sprite_StateIcon.prototype.stateIconWidth = function(iconlength) {
  return ImageManager.iconWidth * (iconlength- 1);
};

Sprite_StateIcon.prototype.stateIconDisplay = function(iconlength) {
  if (this._battler && this._battler.isActor()) {
    return this.stateIconDisplayAlign(iconlength, ActorStateIconAlign);
  } else {
    return this.stateIconDisplayAlign(iconlength, EnemyStateIconAlign);
  }
};

Sprite_StateIcon.prototype.stateIconDisplayAlign = function(iconlength, align) {
  if (align === 'center') {
    return Math.floor(this.stateIconWidth(iconlength) / 2) * -1;
  } else if (align === 'right') {
    return this.stateIconWidth(iconlength) * -1;
  }
  return 0;
};

Sprite_StateIcon.prototype.createStateIcons = function(icons, turns) {
  let displayIcons = [];
  let displayTurn = [];
  displayIcons = icons.slice(this._animationIndex, this._animationIndex + this.getStateIconShowVal() * this.getStateIconRows());
  displayTurn = turns.slice(this._animationIndex, this._animationIndex + this.getStateIconShowVal() * this.getStateIconRows());
    this._iconSprite.forEach((sprite, r) => {
    if (displayIcons[r]) {
      sprite._iconIndex = displayIcons[r];
      sprite._stateTurn = displayTurn[r];
      sprite.visible = true;
    } else {
      sprite._iconIndex = 0;
      sprite._stateTurn = 0;
      sprite.visible = false;
    }
  });
  this.displayIconsLength = displayIcons.length;
};

Sprite_StateIcon.prototype.updateIcon = function() {// Redefined
  const icons = [];
  let turns = [];
  if (this.shouldDisplay()) {
    icons.push(...this._battler.allIcons());
    if (this._battler.isActor() && ActorStateIconVisible) {
      turns = this._battler.allStateTurns();
    } else if (this._battler.isEnemy() && EnemyStateIconVisible) {
      turns = this._battler.allStateTurns();
    }
  }
  this.createStateIcons(icons, turns);
  if (icons.length > 0) {
      this._animationIndex += this.getStateIconShowVal() * this.getStateIconRows();
      if (this._animationIndex >= icons.length) {
          this._animationIndex = 0;
      }
      this._iconIndex = icons.length;
      this.visible = true;
  } else {
      this._animationIndex = 0;
      this._iconIndex = 0;
      this.visible = false;
  }
};

Sprite_StateIcon.prototype.updateFrame = function() {// Redefined
  const iconsLength = this.displayIconsLength;
  const showLength = Math.min(iconsLength, this.getStateIconShowVal());
  this._iconSprite.forEach((sprite, r) => {
    sprite.x = Math.floor(r % this.getStateIconShowVal()) * this.iconX(showLength) + this.stateIconDisplay(showLength);
    sprite.y = Math.floor(r / this.getStateIconShowVal()) * ImageManager.iconHeight;
    if (sprite.visible) {
      this.setFrameIcon(sprite);
      this.setTurn(sprite);
    }
  });
};

Sprite_StateIcon.prototype.setFrameIcon = function(sprite) {
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (sprite._iconIndex % 16) * pw;
  const sy = Math.floor(sprite._iconIndex / 16) * ph;
  sprite.setFrame(sx, sy, pw, ph);
};

Sprite_StateIcon.prototype.setTurn = function(sprite) {
  sprite.turnSprite.bitmap.clear();
  if (sprite._stateTurn > 0) {
    const textSprite = sprite.turnSprite;
    this.setupFont(textSprite);
    textSprite.bitmap.drawText(sprite._stateTurn, 0, 0, ImageManager.iconWidth, ImageManager.iconHeight);
  }
};

Sprite_StateIcon.prototype.iconX = function(iconsLength) {
	if (StateIconWidth > 0 && ImageManager.iconWidth * iconsLength > StateIconWidth) {
		return Math.floor(StateIconWidth / iconsLength);
	}
	return ImageManager.iconWidth;
};

Sprite_StateIcon.prototype.getStateIconShowVal = function() {
  return this._battler && this._battler.isActor() ? ActorStateIconShowVal : EnemyStateIconShowVal;
};

Sprite_StateIcon.prototype.getMaxStateIconShowVal = function() {
  if (this._battler) {
    return this.getStateIconShowVal();
  } else {
    return isEnemyMode ? EnemyStateIconShowVal : ActorStateIconShowVal;
  }
};

Sprite_StateIcon.prototype.getStateIconRows = function() {
  return this._battler && this._battler.isActor() ? ActorStateIconRows : EnemyStateIconRows;
};

Sprite_StateIcon.prototype.getMaxStateIconRows = function() {
  if (this._battler) {
    return this.getStateIconRows();
  } else {
    return isEnemyMode ? EnemyStateIconRows : ActorStateIconRows;
  }
};

Sprite_StateIcon.prototype.setupFont = function(sprite) {
  sprite.bitmap.fontSize = this.nuun_fontSize() + TurnFontSize;
  sprite.bitmap.textColor = this.nuun_textColor();
  sprite.bitmap.outlineColor = this.nuun_outlineColor();
  sprite.bitmap.outlineWidth = this.nuun_outlineWidth();
};

Sprite_StateIcon.prototype.nuun_textColor = function() {
  return ColorManager.normalColor();
};

Sprite_StateIcon.prototype.nuun_outlineColor = function() {
  return ColorManager.outlineColor();
};

Sprite_StateIcon.prototype.nuun_outlineWidth = function() {
  return 3;
};

Sprite_StateIcon.prototype.nuun_fontSize = function() {
  return $gameSystem.mainFontSize();
};


const _Window_BattleStatus_stateIconX = Window_BattleStatus.prototype.stateIconX;
Window_BattleStatus.prototype.stateIconX = function(rect) {
  if (ActorStateIconAlign === 'center') {
    return rect.x + rect.width / 2;
  } else if (ActorStateIconAlign === 'left') {
    return rect.x + ImageManager.iconWidth / 2 - 4;
  } else {
    return _Window_BattleStatus_stateIconX.call(this, rect);
  }
};

Game_BattlerBase.prototype.allStateTurns = function() {
  const turns = this.nuun_stateTurns();
  Array.prototype.push.apply(turns, this.allBuffTurns());
  return turns;
};

Game_BattlerBase.prototype.allBuffTurns = function() {
  return this.nuun_buffTurns();
};

Game_BattlerBase.prototype.nuun_stateTurns = function() {
  return this.states().reduce((r, state) => {
    if (state.iconIndex > 0) {
      const turn = [this.nuun_isNonRemoval(state) ? 0 : this.nuun_getStateTurn(state.id)];
      Array.prototype.push.apply(r, turn);
    } 
    return r;
  }, []);
};

Game_BattlerBase.prototype.nuun_buffTurns = function() {
  return this._buffs.reduce((r, buff, i) => {
    if (buff !== 0) {
      const turn = [this.nuun_getBuffTurn(i)];
      Array.prototype.push.apply(r, turn);
    }
      return r;
  }, []);
};

Game_BattlerBase.prototype.nuun_isNonRemoval = function(state) {
  return state.autoRemovalTiming === 0;
};

Game_BattlerBase.prototype.nuun_getStateTurn = function(id) {
  return (Imported.NUUN_StateTurnCount && TurnMode === 'elapsed' ? this.getStateNowTurn(id) : this._stateTurns[id]) + TurnCorrection;
};

Game_BattlerBase.prototype.nuun_getBuffTurn = function(id) {
  return (Imported.NUUN_StateTurnCount && TurnMode === 'elapsed' ? this.getBuffNowTurn(id) : this._buffTurns[id]) + TurnCorrection;
};

})();