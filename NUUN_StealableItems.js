/*:-----------------------------------------------------------------------------------
 * NUUN_StealableItems.js
 * 
 * Copyright (C) 2020 NUUN
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * -------------------------------------------------------------------------------------
 */ 
/*:
 * @target MZ
 * @plugindesc stealing skills
 * @author NUUN
 * @version 1.4.0
 * @base NUUN_Base
 * @orderAfter NUUN_Base
 * 
 * @help
* Skills to steal items and money from enemies, or skills to steal items and money from enemies
* You can make it.
*
* To create a skill to steal an item, write the following in the memo field of the skill and item.
* This tag can be used by both actors and enemies.
 * <stealSkill:[rate]>
* [rate]: Success rate
 * Example <stealSkill:80>
* Set the stealing skill.
*
* To create a skill that steals money from enemies, write the following in the memo field of the skill and item.
* This tag is for actors only.
 * <goldStealSkill:[rate]>
* [rate]: Success rate
 * <goldStealSkill:50>
*
* To create a skill that can steal money from the enemy, write the following in the memo field of the skill and item.
* The following tags are for enemies only.
 * <goldStealSkill:[rate],[gold]>
* [rate]: Success rate [gold]: Amount that can be stolen
 * <goldStealSkillRate:[gold],[goldRate]>
* [rate]: Success rate [goldRate]: Percentage of stolen amount
 * 
* example
 * <goldStealSkill:100, 400>
* There is a 100% chance that 400G will be stolen.
 * <goldStealSkillRate:70, 30>
* There is a 70% chance that 30% of your money will be stolen.
*
*
* To set items that can be stolen from the enemy, write the following in the memo field of the enemy.
 * <steal [itemType]:[id], [rate], [condTag], [condMode]>
* [itemType]: Item Type I Item W Weapon A Armor M Amount
* [id]: Item, weapon, armor ID
* [rate]: Probability
* The following settings require a conditional base plugin. It can be omitted if no condition is specified.
* [condTag]: Conditional tag * Optional A conditional base is required.
* [condMode]: Conditional mode * Optional A conditional base is required. 0: Partial match 1: All match
*
* <steal I: Item ID, Probability>
* Set items that can be stolen.
* <steal W: Weapon ID, Probability>
* Set a stealable weapon.
* <steal A: Armor ID, Probability>
* Set armor that can be stolen.
* <steal M: amount, probability>
* Set the amount that can be stolen.
*
* Conditionally stealable items
* <Steal [condTag]: [id], [id], [id] ...> Stealing skill can be stolen when the conditions of the specified ID are met.
* <TargetSteal [condTag]: [id], [id], [id] ...> Can be stolen when all the conditions of the specified ID are met.
* <PartySteal [condTag]: [id], [id], [id] ...> Can be stolen when all the conditions of the ID specified by the party member are met.
* <TroopSteal [condTag]: [id], [id], [id] ...> Steal when all the conditions of the specified ID of the enemy group are met.
* [mode]: Condition mode 0: Partially match 1: All match
* [id]: Condition list ID
 * <StealCond1:1,14,15> 
 * 
* To set the item stolen from the enemy, set it from the plug-in parameter "Item setting stolen from the enemy".
*
* Actor, profession, weapon, armor, state, enemy memo field
* <steal_sr: [± additional probability]> Addition increase / decrease
* <steal_sr_Percent: [% additional probability]> Percentage increase / decrease
* Change the success rate of stealing to the featured memo field.
* <stealResist: [% probability]>
* Set the resistivity of theft in the memo field with the feature.
* <stealResist: 50> The chance of being stolen is reduced by 50%.
*
* The following variables and functions are prepared so that you can refer to the number of times you stole.
* The number of times the item was stolen.
 * $gameSystem._stealCount
 * $gameSystem.getBattleSteal()
* Total amount of money stolen.
 * $gameSystem._stealGoldSum
 * $gameSystem.getBattleStealGold()
* The number of times the item was stolen.
 * $gameSystem._stolenCount
* $ gameSystem.getBattleStolen ()
* Total amount of money stolen.
* $gameSystem._stolenGoldSum
 * $gameSystem.getBattleStolenGold()
 * 
* Probability calculation when stealing
* Skill, item success probability * Success rate correction% + Success rate correction +
* When displaying on the status screen with the probability of correcting the success rate correction% and success rate correction +, depending on the skill and item success probability
* The probability is different from the calculated and displayed probabilities.
*
* terms of service
* This plugin is distributed under the MIT license.
*
*
* Change log
 * 2022/6/14 Ver 1.4.0
* Supports pop-ups. (Requires NUUN_popUp)
* Removed unused plugin parameters.
 * 2022/1/25 Ver 1.3.2
* Corrected the processing of probability and resistivity.
 * 2021/11/13 Ver 1.3.1
* Conditionally supported.
 * 2021/10/24 Ver 1.3.0
* Changed message format.
* Added the ability to steal the same item over and over again.
* Added the function to steal by lottery from all stealable items.
 * 2021/6/18 Ver 1.2.0
* Fixed an issue where boost calculations were not working properly.
* Added the ability to display a message if you don't have an item or money.
* Added the function to sound SE when stealing is successful.
 * 2021/2/20 Ver 1.1.1
* Fixed an issue where the rate increase / decrease in the stealing success rate could not be obtained normally.
 * 2021/2/5 Ver 1.1.0
* Stealing resistance mounting.
 * 2021/1/24 Ver 1.0.1
* Fixed an issue where parameters such as the number of times an item was stolen could not be obtained properly.
 * 2020/11/21 Ver 1.0.0
* First edition
 * 
 * @param StealMode
 * @text Steal mode
 * @desc Do not reacquire stolen items.
 * @type boolean
 * @default true
 * 
 * @param StealProcess
 * @text Processing when stealing
 * @desc Specifies the stealing process.
 * @type select
 * @option First matched item
 * @value 0
 * @option Lottery from all stealable items and money
 * @value 1
 * @default 0
 * 
 * @param NotStealName
 * @text Message when not stolen
 * @desc A message when an item could not be stolen from an enemy. %1 User %2 Target
 * @default I couldn't steal anything from %2
 * 
 * @param NonStealName
 * @text Message when there are no items to steal
 * @desc A message when there are no items to steal. %1 User %2 Target
 * @default %2 has nothing!
 * 
 * @param NonStealGoldName
 * @text Message when there is no money to steal
 * @desc A message when there was no money to steal.　%1 User %2 Target
 * @default %2 has nothing!
 * 
 * @param GetStealName
 * @text Message when an item is stolen from an enemy
 * @desc A message when an item is stolen from an enemy. %1 User %2 Target %3 Stolen item or amount
 * @default %1 stole %3 from %2
 * 
 * @param StolenName
 * @text Message when an item is stolen by an enemy
 * @desc A message when an item is stolen by an enemy. %1 User %2 Target %3 Stolen item or amount
 * @default %1 stole %3 from %2
 * 
 * @param StolenItemDrop
 * @text Recovery of stolen items
 * @desc Will enemy drop stolen items if defeated?
 * @type boolean
 * @default false
 * 
 * @param StolenGoldDrop
 * @text Recovery of stolen money
 * @desc Will enemy drop stolen gold if defeated?
 * @type boolean
 * @default false
 * 
 * @param stolenItems
 * @text Item settings stolen from enemies
 * @desc This is the setting of items that are stolen from the enemy.
 * @default []
 * @type struct<stolenItems>[]
 * 
 * @param SuccessSE
 * @text Item stealing SE settings
 * @default ------------------------------
 * 
 * @param StealSuccessSE
 * @text SE when stealing is successful
 * @desc SE when stealing is successful
 * @type file
 * @dir audio/se/
 * @parent SuccessSE
 * 
 * @param volume
 * @text volume
 * @desc volume
 * @type number
 * @default 90
 * @parent SuccessSE
 * 
 * @param pitch
 * @text pitch
 * @desc pitch
 * @type number
 * @default 100
 * @parent SuccessSE
 * 
 * @param pan
 * @text pan
 * @desc pan
 * @type number
 * @default 50
 * @parent SuccessSE
 * 
 * @param GoldSuccessSE
 * @text SE setting when money stealing is successful
 * @default ------------------------------
 * 
 * @param StealGoldSuccessSE
 * @text SE when money stealing is successful
 * @desc SE when money stealing is successful
 * @type file
 * @dir audio/se/
 * @parent GoldSuccessSE
 * 
 * @param G_volume
 * @text volume
 * @desc volume
 * @type number
 * @default 90
 * @parent GoldSuccessSE
 * 
 * @param G_pitch
 * @text pitch
 * @desc pitch
 * @type number
 * @default 100
 * @parent GoldSuccessSE
 * 
 * @param G_pan
 * @text pan
 * @desc pan
 * @type number
 * @default 50
 * @parent GoldSuccessSE
 * 
 * 
 */ 
/*~struct~stolenItems:
 * 
 * @param stolenItemId
 * @text Item ID to be stolen
 * @desc Item ID stolen from the enemy.
 * @type item
 * 
 * @param weight
 * @text weight
 * @desc Specifies the frequency of stolen items. The higher the number, the easier it is to be stolen.
 * @type number
 * @default 5
 * 
 * @param stolenSwitch
 * @text switch
 * @desc Specifies the switch number of the item condition to be stolen.
 * @type switch
 * @default 0
 * 
 */
var Imported = Imported || {};
Imported.NUUN_StealableItems = true;

(() => {
'use strict';
const parameters = PluginManager.parameters('NUUN_StealableItems');
const StealMode = eval(parameters['StealMode'] || 'true');
const StealProcess = Number(parameters['StealProcess'] || 0);
const StolenItemDrop = eval(parameters['StolenItemDrop'] || 'false');
const StolenGoldDrop = eval(parameters['StolenGoldDrop'] || 'false');
const NotStealName = String(parameters['NotStealName'] || '%1 couldn't steal anything from %2!');
const NonStealName = String(parameters['NonStealName'] || '%2は何も持っていない！');
const NonStealGoldName = String(parameters['NonStealGoldName'] || '%2 has nothing!');
const GetStealName = String(parameters['GetStealName'] || '%3 was stolen from %2!');
const StolenName = String(parameters['StolenName'] || '%3 was stolen from %2!');
const stolenItems = (NUUN_Base_Ver >= 113 ? (DataManager.nuun_structureData(parameters['stolenItems'])) : null) || [];
const StealSuccessSE = String(parameters['StealSuccessSE'] || '');
const volume = Number(parameters['volume'] || 90);
const pitch = Number(parameters['pitch'] || 100);
const pan = Number(parameters['pan'] || 50);
const StealGoldSuccessSE = String(parameters['StealGoldSuccessSE'] || '');
const G_volume = Number(parameters['G_volume'] || 90);
const G_pitch = Number(parameters['G_pitch'] || 100);
const G_pan = Number(parameters['G_pan'] || 50);

function getStolenItemList(target, rate) {
	let weightSum = 0;
	let getItem = null;
	if(target.getStolenRate(rate) && stolenItems){
		let stolenItemList = stolenItems.reduce(function(r, item) {
			if($gameParty._items[item.stolenItemId] > 0 && $gameSystem.stolenSwitch(item)) {
				weightSum += item.weight;
				return r.concat(item);
			} else {
				return r
			}
		},[]);
		const value = Math.random() * weightSum;
		const stolenLength = stolenItemList.length;
		let probability = 0.0;
		let i = 0;
		if (stolenLength > 0){
			while(stolenLength > i){
				probability += stolenItemList[i].weight / weightSum * weightSum;
				if(probability > value){
					getItem = $dataItems[stolenItemList[i].stolenItemId];
					$gameSystem.onBattleStolen();
					break;
				}
				i++;
			}
		}
	}
	return getItem;
};

function randomRate(id, stealId) {
	return StealProcess === 1 ? id === stealId : true;
}

function stealMode(type) {
	switch (type) {
		case 'notSteal':
			return NotStealName;
		case 'nonSteal':
			return NonStealName;
		case 'nonStealGold':
			return NonStealGoldName
		case 'getSteal':
			return GetStealName;
		case 'getGold':
		return GetStealName;
		case 'stolenName':
			return StolenName;
		case 'stolenGold':
			return StolenName;
	}
}

const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_Game_System_initialize .call(this);
	this._stealCount = 0;
	this._stealGoldSum = 0;
	this._stolenCount = 0;
	this._stolenGoldSum = 0;
};

Game_System.prototype.onBattleSteal = function() {
	this._stealCount = this._stealCount || 0
	this._stealCount++;
};

Game_System.prototype.getBattleSteal = function() {
	return this._stealCount || 0;
};

Game_System.prototype.onBattleStealGold = function(gold) {
	this._stealGoldSum = this._stealGoldSum || 0;
	this._stealGoldSum++;
};

Game_System.prototype.getBattleStealGold = function() {
	return this._stealGoldSum || 0;
};

Game_System.prototype.onBattleStolen = function() {
	this._stolenCount = this._stolenCount || 0;
	this._stolenCount++;
};

Game_System.prototype.getBattleStolen = function() {
	return this._stolenCount || 0;
};

Game_System.prototype.onBattleStolenGold = function(gold) {
	this._stolenGoldSum = this._stolenGoldSum || 0;
	this._stolenGoldSum += gold;
};

Game_System.prototype.getBattleStolenGold = function() {
	return this._stolenGoldSum || 0;
};

Game_System.prototype.stolenSwitch = function(item){
	return (item.stolenSwitch > 0 ? $gameSwitches.value(item.stolenSwitch) : true);
};


const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function(target) {
	this.getSteal(target);
	_Game_Action_applyItemUserEffect.call(this, target);
};

Game_Action.prototype.getSteal = function(target){
	if (target.result().isHit()) {
		if (target.isEnemy()) {
			if(this.item().meta.stealSkill){
				this.stealItems(target);
			}
			if(this.item().meta.goldStealSkill){
				this.stealGold(target);
			}
		} else {
			if(this.item().meta.stealSkill){
				this.stolenItem(target);
			}
			if(this.item().meta.goldStealSkill || this.item().meta.goldStealSkillRate){
				this.stolenGold(target);
			}
		}
	}
};

Game_Action.prototype.stealItems = function(target){
	const stealItem = target.makeStealItems(this.stealRate(target));
	if (stealItem) {
		this.getStealItems(target, stealItem);
	} else {
		if (!target.isStealItems()) {
			this.subject().result().pushSteal(null, 'nonSteal');
		} else {
			this.subject().result().pushSteal(null, 'notSteal');
		}
	}
	this.makeSuccess(target);
};

Game_Action.prototype.stealGold = function(target){
	const stealItem = target.makeStealGold(this.stealGoldRate(target));
	if (stealItem) {
		this.getStealGold(target, stealItem);
	} else {
		if (!target.isStealGold()) {
			this.subject().result().pushGoldSteal(null, 'nonStealGold');
		} else {
			this.subject().result().pushGoldSteal(null, 'notSteal');
		}
	}
	this.makeSuccess(target);
};

Game_Action.prototype.getStealItems = function(target, stealItem){
	$gameParty.gainItem(stealItem, 1);
	if(StealSuccessSE) {
		AudioManager.playSe({"name":StealSuccessSE,"volume":volume,"pitch":pitch,"pan":pan});
	}
	this.subject().result().pushSteal(stealItem, 'getSteal');
};

Game_Action.prototype.getStealGold = function(target, stealItem){
	$gameParty.gainGold(stealItem);
	const itemName = stealItem + TextManager.currencyUnit;
	if(StealGoldSuccessSE) {
		AudioManager.playSe({"name":StealGoldSuccessSE,"volume":G_volume,"pitch":G_pitch,"pan":G_pan});
	}
	this.subject().result().pushGoldSteal(itemName, 'getGold');
};

Game_Action.prototype.stolenItem = function(target){
	const item = getStolenItemList(target, this.stealRate(target));
	this.subject().keepStolenItem(item);
	if (item) {
		this.lostItem(target, item);
	} else {
		this.subject().result().pushSteal(null, 'notSteal');
	}
	this.makeSuccess(target);
};

Game_Action.prototype.stolenGold = function(target){
		const stolenGold = this.lostStolenGoldMode();
		const rate = this.subject().getStealBoostRate(Number(stolenGold[0]));
		const gold = this.lostStolenGold(target, rate, stolenGold);
		this.subject().keepStolenGold(gold);
	if (gold) {
		this.lostGold(target, gold);
	} else {
		this.subject().result().pushGoldSteal(null, 'notSteal');
	}
	this.makeSuccess(target);
};

Game_Action.prototype.lostStolenGold = function(target, rate, stolenGold){
	let gold = 0;
	if(target.getStolenRate(rate)){
		if(stolenGold[2] === 1){
			gold = Math.floor($gameParty._gold * Number(Math.min(stolenGold[1], 100) / 100));
		} else {
			gold = Number(stolenGold[1]);
		}
		$gameSystem.onBattleStolenGold(gold);
	}
	return gold;
};

Game_Action.prototype.lostItem = function(target, item){
	$gameParty.loseItem(item, 1)
	if(StealSuccessSE) {
		AudioManager.playSe({"name":StealSuccessSE,"volume":volume,"pitch":pitch,"pan":pan});
	}
	this.subject().result().pushSteal(item, 'stolenName');
};

Game_Action.prototype.lostGold = function(target, gold){
	$gameParty.loseGold(gold);
	const itemName = gold + TextManager.currencyUnit;
	if(StealGoldSuccessSE) {
		AudioManager.playSe({"name":StealGoldSuccessSE,"volume":G_volume,"pitch":G_pitch,"pan":G_pan});
	}
	this.subject().result().pushGoldSteal(itemName, 'stolenGold');
};

Game_Action.prototype.lostStolenGoldMode = function(){
	const mode = this.item().meta.goldStealSkillRate;
	let stolenGold = [];
	if (mode){
		stolenGold = this.item().meta.goldStealSkillRate.split(',');
		stolenGold[2] = 1;
	} else {
		stolenGold = this.item().meta.goldStealSkill.split(',');
		stolenGold[2] = 0;
	}
	return stolenGold;
};

Game_Action.prototype.stealRate = function(){
	const rate = Number(this.item().meta.stealSkill);
	return this.subject().getStealBoostRate(rate);
};

Game_Action.prototype.stealGoldRate = function(){
	const rate = Number(this.item().meta.goldStealSkill);
	return this.subject().getStealBoostRate(rate);
};


const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);
    this.stealResult = [];
};

Game_ActionResult.prototype.pushSteal = function(item, type) {
    const result = {};
	if (item) {
		result.name = item.name;
		result.id = item.id;
		result.iconIndex = item.iconIndex;
		if (Imported.NUUN_popUp) {
			result.popupText = this.stealPopupText(type);//ポップアッププラグイン
		}
	} else {
		result.name = null;
		result.id = 0;
		result.iconIndex = 0;
	}
	result.text = stealMode(type);
	this.stealResult.push(result);
};

Game_ActionResult.prototype.pushGoldSteal = function(gold, type) {
    const result = {};
	if (gold) {
		result.name = gold;
		result.iconIndex = 0;
		if (Imported.NUUN_popUp) {
			result.popupText = this.stealPopupText(type);//ポップアッププラグイン
		}
	} else {
		result.name = gold;
		result.iconIndex = 0;
	}
	result.id = 0;
	result.text = stealMode(type);
	this.stealResult.push(result);
};


Game_BattlerBase.prototype.stealBoost = function(){
	return this.traitObjects().reduce((r, trait) => {
		return r + (trait.meta.steal_sr ? Number(trait.meta.steal_sr) / 100 : 0);
	}, 1.0);
};

Game_BattlerBase.prototype.stealPercentBoost = function(){
	return this.traitObjects().reduce((r, trait) => {
		return r * (trait.meta.steal_sr_Percent ? Number(trait.meta.steal_sr_Percent) / 100 : 1.0);
	}, 1.0);
};

Game_BattlerBase.prototype.stealItemRate = function() {
	return this.traitObjects().reduce((r, trait) => {
		return r * (trait.meta.stealResist ? Number(trait.meta.stealResist) / 100 : 1.0);
	}, 1.0);
};

Game_BattlerBase.prototype.getStealBoostRate = function(rate) {
	return rate * this.stealPercentBoost() + this.stealBoost();
};

Game_Actor.prototype.getStolenRate = function(rate) {
	return Math.floor(Math.random() * 100) < (rate * this.stealItemRate());
};

Game_BattlerBase.prototype.getStealRatePercent = function() {
	return this.getStealBoostRate(100);
};

const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
Game_Enemy.prototype.initMembers = function() {
	_Game_Enemy_initMembers.call(this);
	this._stealItems = [];
	this._keepStolenItem = [];
	this._keepStolenGold = 0;
};

Game_Enemy.prototype.stealRandomId = function() {
	let i = 0;
	this._stealItems.forEach(di => {
		if (di.kind > 0 && di.kind < 4) {
			di.id = i;
			i++;
		}
	});
	return Math.randomInt(i);
};

Game_Enemy.prototype.stealGoldRandomId = function() {
	let i = 0;
	this._stealItems.forEach(di => {
		if (di.kind === 4) {
			di.id = i;
			i++;
		}
	});
	return Math.randomInt(i);
};

Game_Enemy.prototype.stealConditions = function(di){
	if (Imported.NUUN_ConditionsBase && di.cond) {
		const action = $gameTemp.getActionData();
		const condTag = 'Steal' + String(di.cond).trim();
		const mode = di.mode || 0;
		return action.subject.getTriggerConditions(this.enemy(), this, condTag, 'Target' + condTag, 'Party' + condTag, 'Troop' + condTag, action.action, action.damage, mode);
	} else {
		return true;
	}
};

Game_Enemy.prototype.makeStealItems = function(rate) {
	$gameSystem._stealIndex = 0;
	let i = 0;
	const stealId = StealProcess === 1 ? this.stealRandomId() : 0;
	for (const di of this._stealItems) {
		if (di.kind > 0 && di.kind < 4 && this.stealConditions(di) && randomRate(di.id, stealId) && this.getStealRate(rate, di)) {
			let r = this.stealObject(di.kind, di.dataId);
			if (StealMode) {
				this._stealItems[i] = {dataId: 1, denominator: 1, kind: 0};
			}
			$gameSystem._stealIndex = i;
			$gameSystem.onBattleSteal();
			return r;
		}
		i++;
	}
};

Game_Enemy.prototype.makeStealGold = function(rate) {
	$gameSystem._stealIndex = 0;
	let i = 0;
	const stealId = StealProcess === 1 ? this.stealGoldRandomId() : 0;
	for (const di of this._stealItems) {
		if (di.kind === 4 && this.stealConditions(di) && randomRate(di.id, stealId) && this.getStealRate(rate, di)) {
			let r = this.stealObject(di.kind, di.dataId);
			if (StealMode) {
				this._stealItems[i] = {dataId: 1, denominator: 1, kind: 0};
			}
			$gameSystem.onBattleStealGold();
			return r;
		}
		i++;
	}
};

Game_Enemy.prototype.isStealItems = function() {
	return this._stealItems.some(item => item.kind > 0 && item.kind <= 3);
};

Game_Enemy.prototype.isStealGold = function() {
	return this._stealItems.some(item => item.kind === 4);
};

Game_Enemy.prototype.getStealRate = function(rate, di) {
	return Math.floor(Math.random() * 100) < rate * (di.denominator * this.stealItemRate() / 100);
};

Game_Enemy.prototype.keepStolenItem = function(item) {
	if (StolenItemDrop && item){
		this._keepStolenItem.push({dataId: item.id, denominator: 100, kind: 1});
	}
};

Game_Enemy.prototype.keepStolenGold = function(gold) {
	if (StolenGoldDrop && gold > 0){
		this._keepStolenGold += gold;
	}
};

const _Game_Enemy_gold = Game_Enemy.prototype.gold;
Game_Enemy.prototype.gold = function() {
	return _Game_Enemy_gold.call(this) + this._keepStolenGold;
};

const _Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
	_Game_Enemy_setup.call(this,enemyId, x, y);
	this.stealSetup();
};

Game_Enemy.prototype.stealSetup = function() {
	//const re =/<(?:steal)\s*([IWAM]):\s*(\d+(?:\s*,\s*\d+)*)>/g;
	const re =/<(?:steal)\s*([IWAM]):\s*(.*)>/g;
	while(true) {
		let match = re.exec(this.enemy().note);
		if (match) {
			let data = match[2].split(',');
			switch (match[1]) {
				case 'I':
					this._stealItems.push({dataId: parseInt(data[0]), denominator: parseInt(data[1]), kind:1, cond: data[2], mode: parseInt(data[3])});
					break;
				case 'W':
					this._stealItems.push({dataId: parseInt(data[0]), denominator: parseInt(data[1]), kind:2, cond: data[2], mode: parseInt(data[3])});
					break;
				case 'A':
					this._stealItems.push({dataId: parseInt(data[0]), denominator: parseInt(data[1]), kind:3, cond: data[2], mode: parseInt(data[3])});
					break;
				case 'M':
					this._stealItems.push({dataId: parseInt(data[0]), denominator: parseInt(data[1]), kind:4, cond: data[2], mode: parseInt(data[3])});
					break;
			}
		} else {
			return this;
		}
	}
};

const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
Game_Enemy.prototype.makeDropItems = function() {
	let dropItems = _Game_Enemy_makeDropItems.call(this);
	if(this._keepStolenItem.length > 0){
  	this._keepStolenItem.forEach(di => {
			dropItems.push(this.itemObject(di.kind, di.dataId));
 		});
	}
	return dropItems;
};

Game_Enemy.prototype.stealObject = function(kind, dataId) {
  if (kind === 1) {
    return $dataItems[dataId];
  } else if (kind === 2) {
    return $dataWeapons[dataId];
  } else if (kind === 3) {
    return $dataArmors[dataId];
  } else if (kind === 4) {
		return dataId;
	} else {
    return null;
  }
};


const _Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
	_Window_BattleLog_displayActionResults.call(this, subject, target);
	if (target.result().used) {
		this.push("pushBaseLine");
		this.displaySteal(subject, target);
	}
};

Window_BattleLog.prototype.displaySteal = function(subject, target) {
	const result = subject.result();
	result.stealResult.forEach(steal => {
		this.push("addText", steal.text.format(subject.name(), target.name(), steal.name));
		if (Imported.NUUN_popUp && steal.name) {
			this.stealPopup(target, steal);
		}
		this.push("pushBaseLine");
	});
};

})();
