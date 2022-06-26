﻿/*:-----------------------------------------------------------------------------------
 * NUUN_Base.js
 * 
 * Copyright (C) 2020 NUUN
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 * -------------------------------------------------------------------------------------
 * 
 */ 
/*:
 * @target MZ
 * @plugindesc  Base plugin
 * @author NUUN
 * @version 1.4.5
 * 
 * @help
* A base plugin that performs common processing.
* Place it above the plugin list.
*
* terms of service
* This plugin is distributed under the MIT license.
*
* Change log
 * 2022/6/15 Ver.1.4.5
* Fixed the problem that NaN is displayed when entering a character string.
 * 2022/5/24 Ver.1.4.4
* Added the process to set the filtering window of the sprite.
 * 2022/2/12 Ver.1.4.3
* Fixed an issue where some variable names were incorrect.
 * 2022/1/12 Ver.1.4.2
* Addition of processing to apply enemy MP gauge and enemy TP gauge gauge.
 * 2022/1/9 Ver.1.4.1
* Added the process of rounding the decimal point.
 * 2022/1/8 Ver.1.4.0
* Added color index acquisition process.
 * 2021/12/12 Ver.1.3.2
* Added processing to apply the enemy state display extension.
 * 2021/11/7 Ver.1.3.1
* Added processing for acquiring multiple attributes.
 * 2021/8/22 Ver.1.3.0
* Added processing to Window_ItemList.
 * 2021/7/15 Ver.1.2.0
* Added common processing for gauge and name display related plugins.
 * 2021/5/15 Ver.1.1.4
* Added the process to set the window skin for each window.
 * 2021/5/8 Ver.1.1.3
* Partially modified the process.
 * 2021/5/7 Ver.1.1.2
* Added structure acquisition process.
 * 2021/4/23 Ver.1.1.1
* Added the process of specifying the folder of the image.
 * 2021/3/14 Ver.1.1.0
* Added the process of specifying the folder of the image.
 * 2020/12/31 Ver.1.0.0
* First edition
 * 
 */
var Imported = Imported || {};
Imported.NUUN_Base = true;
const NUUN_Base_Ver = 140;

function NuunManager() {
  throw new Error("This is a static class");
}

(() => {
const parameters = PluginManager.parameters('NUUN_Base');

function structureData(params) {
  return JSON.parse(JSON.stringify(params, function(key, value) {
    try {
        return JSON.parse(value);
    } catch (e) {
        try {
            return eval(value);
        } catch (e) {
            return value;
        }
    }
  }));
}

function nuun_GausePlugins() {
  return Imported.NUUN_ButlerHPGauge || Imported.NUUN_EnemyMPGauge || Imported.NUUN_EnemyTPGauge || Imported.NUUN_ButlerName || Imported.NUUN_EnemyTpbGauge || Imported.NUUN_EnemyStateIconEX;
}

NuunManager.getColorCode = function(color) {
  if (typeof(color) === "string") {
    return color;
  }
  return ColorManager.textColor(color);
};

NuunManager.numPercentage = function(num, digits, mode) {
  if (isNaN(num)) { return num }
  return (mode ? Math.round(num * Math.pow(10, digits + 2)) : Math.floor(num * Math.pow(10, digits + 2))) / Math.pow(10, digits + 2);
}

DataManager.nuun_structureData = function(params){
  return params ? structureData(params) : [];
};

const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
Scene_Boot.prototype.onDatabaseLoaded = function() {
  _Scene_Boot_onDatabaseLoaded.call(this);
  DataManager.nuun_Data();
};

DataManager.nuun_Data = function(){
  DataManager.nuun_DataObject($dataActors, 1);
  DataManager.nuun_DataObject($dataEnemies, 7);
};

DataManager.nuun_DataObject = function(object, code){
  for(let i = 1; i <= object.length; i++){
    if (object[i]) {
      if(code === 1) {
        DataManager.nuun_loadDataActors(object[i]);
      } else if (code === 7) {
        DataManager.nuun_loadDataEnemies(object[i]);
      }
    }
  }
};

DataManager.nuun_loadDataActors = function(deta){
};

DataManager.nuun_loadDataEnemies = function(deta){
};

ImageManager.nuun_backGround = function(filename) {
  return this.loadBitmap("img/nuun_background/", filename);
};

ImageManager.nuun_actorPictures = function(filename) {
  return this.loadBitmap("img/nuun_actorpictures/", filename);
};

ImageManager.nuun_LoadPictures = function(filename) {
  return this.loadBitmap("img/", filename);
};

const _BattleManager_initMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
  _BattleManager_initMembers.call(this);
  this.gaugeBaseSprite = null;
};

const _Window_addInnerChild = Window.prototype.addInnerChild;
Window.prototype.addInnerChild = function(child) {
    child.className = String(this.constructor.name);
    return _Window_addInnerChild.call(this, child);
};


const _Window_Selectable_drawItemBackground = Window_Selectable.prototype.drawItemBackground;
Window_Selectable.prototype.drawItemBackground = function(index) {
  if (!this._contentsBackVisible) {
    _Window_Selectable_drawItemBackground.call(this, index);
  }
};

const _Window_Base_initialize = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function(rect) {
  _Window_Base_initialize.call(this, rect);
  this._userWindowSkin = null;
};


const _Window_Base_loadWindowskin = Window_Base.prototype.loadWindowskin;
Window_Base.prototype.loadWindowskin = function() {
  if (this._userWindowSkin) {
    this.windowskin = ImageManager.loadSystem(this._userWindowSkin);
  } else {
    _Window_Base_loadWindowskin.call(this);
  }
};

const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
Spriteset_Battle.prototype.createLowerLayer = function() {
  _Spriteset_Battle_createLowerLayer.call(this);
  if (nuun_GausePlugins()) {
    this.createGaugeBase();
  }
};

Spriteset_Battle.prototype.createGaugeBase = function() {
  if (!this._butlerGaugeBase) {
    const sprite = new Sprite();
    this.addChild(sprite);
    this._butlerGaugeBase = sprite;
    BattleManager.gaugeBaseSprite = sprite;
  }
};

const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function() {
  _Spriteset_Battle_update.call(this);
  this.updateButlerGauge();
};

Spriteset_Battle.prototype.updateButlerGauge = function() {
  if (this._butlerGaugeBase) {
    for (const sprite of this._butlerGaugeBase.children) {
      const spriteData = this._enemySprites.some(enemy => enemy.spriteId === sprite.enemySpriteId);
      if (!spriteData) {
        this._butlerGaugeBase.removeChild(sprite);
      }
    }
  }
};

const _Window_ItemList_initialize  = Window_ItemList.prototype.initialize;
Window_ItemList.prototype.initialize = function(rect) {
  _Window_ItemList_initialize.call(this, rect);
  this._className = String(this.constructor.name);
};

Window_ItemList.prototype.isConstructor = function() {
  return false;
};

Game_Action.prototype.getAttackElementsList = function() {
  return Imported.NUUN_MultiElement ? this.getAttackElements() : this.subject().attackElements();
};

Game_Action.prototype.getItemElementsList = function() {
  return Imported.NUUN_MultiElement ? this.getItemElements() : [this.item().damage.elementId];
};

})();
