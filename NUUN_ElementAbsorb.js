/*:-----------------------------------------------------------------------------------
 * NUUN_ElementAbsorb.js
 * 
 * Copyright (C) 2021 NUUN
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * -------------------------------------------------------------------------------------
 */
/*:
 * @target MZ
 * @plugindesc Element absorption feature
 * @author NUUN
 * @version 1.0.1
 * 
 * @help
* From here on element will be referred to as atribute. You can set the characteristics that absorb the attributes.
* If the target's absorption attribute effectiveness is 200%, it will absorb 200% of the damage.
*
* Addition mode: The ratio of normal attribute validity minus absorption attribute validity.
* When the attribute validity is 150% and the absorption attribute validity is 100%, the final validity is -50%.
*
* Absorption priority mode: If the absorption attribute validity is 0 or higher, the normal attribute validity is ignored.
* In each case, the attribute with the highest absorption attribute effect is reflected.
*
* Characteristic memo field
* <absorbElement: [id], [id], ....> Set the attribute to absorb.
* [id]: Absorption attribute validity list ID of plug-in parameter
*
* terms of service
* This plugin is distributed under the MIT license.
*
* Change log
 * 2021/8/9 Ver.1.0.1
* Fixed the problem that an error occurs when an ID that is not set in the list is specified for the attribute to be absorbed.
 * 2021/8/9 Ver.1.0.0
* First edition
 * 
 * @param AbsorbElement
 * @text Absorption attribute validity list
 * @desc Absorption attribute validity list.
 * @default []
 * @type struct<AbsorbElementList>[]
 * 
 * @param AbsorbSetting
 * @text attribute validity processing settings
 * @desc How to handle attribute validity and absorption attribute
 * @type select
 * @option Absorption priority
 * @value 'Absorb'
 * @option addition
 * @value 'Sum'
 * @default 'Sum'
 * 
 */
/*~struct~AbsorbElementList:
 * 
 * @param Identification
 * @text distinguished name
 * @desc A name to identify which attribute absorption. There is no problem even if you do not set it.
 * @type String
 * @default 
 * 
 * @param ElementId
 * @text property ID
 * @desc property ID
 * @type Number
 * @default 1
 * 
 * @param AbsorbValidity
 * @text Absorption validity
 * @desc Absorption effectiveness
 * @type Number
 * @default 100 
 * 
 */
var Imported = Imported || {};
Imported.NUUN_ElementAbsorb = true;

(() => {
const parameters = PluginManager.parameters('NUUN_ElementAbsorb');
const AbsorbElement = (NUUN_Base_Ver >= 113 ? (DataManager.nuun_structureData(parameters['AbsorbElement'])) : null) || [];
const AbsorbSetting = eval(parameters['AbsorbSetting'] || 'Sum');

const _Game_Action_elementsMaxRate = Game_Action.prototype.elementsMaxRate;
Game_Action.prototype.elementsMaxRate = function(target, elements) {
  target._absorbRate = [];
  let rate = _Game_Action_elementsMaxRate.call(this, target, elements);
  if (target._absorbRate.length > 0) {
    rate = Math.min(...target._absorbRate);
    target._absorbRate = null;
  }
  return rate;
};


const _Game_BattlerBase_elementRate = Game_BattlerBase.prototype.elementRate;
Game_BattlerBase.prototype.elementRate = function(elementId) {
  let absorbRate = this.absorbElementRate(elementId) * -1;
  let rate = _Game_BattlerBase_elementRate.call(this, elementId);
  if (AbsorbSetting === 'Sum') {
    rate += absorbRate;
  } else if (absorbRate < 0) {
    rate = absorbRate;
  }
  if (this._absorbRate && rate < 0) {
    this._absorbRate.push(rate);
  }
  return rate;
};

Game_BattlerBase.prototype.absorbElementRate = function(elementId) {
  let absorb = false;
  const rate = (this.absorbElementsList().reduce((r, listId) => {
    const data = AbsorbElement[listId - 1];
    if (data && data.ElementId === elementId) {
      absorb = true;
      return r * data.AbsorbValidity / 100
    } else {
      return r;
    }
  }, 1) + (AbsorbSetting === 'Sum' ? 1.0 : 0));
  return absorb ? rate : 0;
};

Game_BattlerBase.prototype.absorbElementsList = function() {
  return this.traitObjects().reduce((r, trait) => {
    const list = this.getMultiElement(trait.meta);
    if (list) {
      return r.concat(list);
    } else {
      return r;
    }
  }, []);
};

Game_BattlerBase.prototype.getMultiElement = function(obj) {
  return obj.absorbElement ? obj.absorbElement.split(',').map(Number) : null;
};

})();