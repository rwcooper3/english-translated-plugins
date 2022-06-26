//=============================================================================
// RPGツクールMZ - LL_MenuScreenBase.js v1.1.0
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MZ
 * @plugindesc This is a common base plug-in for menu screen standing picture settings.
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-menuscreen/
 *
 * @help LL_MenuScreenBase.js
 *
 * It is a common base plug-in for menu screen standing picture settings.
 * This plugin defines a standing picture list for each actor.
 *
 * You can define multiple standing pictures to be displayed by state, switch, and variable condition as shown below.
 *   ・Switch 1 is ON and a standing picture in a poisonous state
 *   ・Standing picture with variable 1 of 10 or more and poisonous state
 *   ・Standing picture when switch 1 is ON
 *   ・Standing picture of poisonous state
 *   ・Normal standing picture without switch state / variable condition (minimum required)
 *
 * Switch the standing picture with the remaining HP%:
 *   First, create a standing picture list with "Remaining HP%" set to "100".
 *   Copy the above, change "Remaining HP%" to "50", and duplicate the standing picture list.
 *   If the HP is reduced to less than half, the standing picture set to "50" will be called.
 *   It is also possible to define multiple standing pictures for each remaining HP%.
 *
 * Image file display priority:
 *   1. Matches all state IDs, switch IDs, and variable conditions
 *   2. Matches both state ID and switch ID
 *   3. Those that match both the state ID and the variable condition
 *   4. Only the state ID matches
 *   5. Those that match both the switch ID and variable conditions
 *   6. Only the switch ID matches
 *   7. Only variable conditions match
 *   8. No condition (state ID, switch ID, variable condition are not set)
 *   (Of the above, the one with the lowest remaining HP% is displayed with priority)
 *
 * Standing picture plug-in cooperation during battle:
 *   If LL_StandingPictureBattle is installed,
 *   It is also possible to link with the standing picture list in battle as it is.
 *
 * There are no plugin commands.
 *
 * terms of service:
 *   ・No copyright notice is required.
 *   ・There is no need to report before using.
 *   ・It does not matter whether it is commercial or non-commercial.
 *   ・There are no restrictions on the use of R18 works (adult content, i think).
 *   ・There is no problem if you freely modify it according to the game.
 *   ・Redistribution (including after modification) as a plug-in material is prohibited.
 *
 * Author: ルルの教会
 * Created: 2022/3/7
 *
 * @param menuPictures
 * @text Standing picture list
 * @desc Defines the standing picture to be displayed on the menu screen.
 * You can define multiple standing pictures when the switch is ON in a specific state.
 * @default []
 * @type struct<menuPictures>[]
 *
 * @param onSpbPlugin
 * @text In-battle standing picture plug-in cooperation
 * @desc * This item is not used
 *
 * @param onSpbPluginEnable
 * @text Link the standing picture list
 * @desc LL_StandingPictureBattle is linked with the standing picture list.
 * When turned ON, the standing picture list setting of this plug-in will be ignored.
 * @default false
 * @type boolean
 * @parent onSpbPlugin
 */

/*~struct~menuPictures:
 *
 * @param actorId
 * @text Actor ID
 * @desc Actor ID. Select the actor that defines the standing picture.
 * @type actor
 *
 * @param stateId
 * @text State ID
 * @desc Used when you want to change the standing picture in a specific state.
 * Please set a blank (none) for the normal standing picture.
 * @type state
 *
 * @param switchId
 * @text switch ID
 * @desc Used when you want to change the standing picture by turning on the switch.
 * Please set a blank (none) for the normal standing picture.
 * @type switch
 *
 * @param variableCase
 * @text Variable condition
 * @desc Used when you want to change the standing picture with variable conditions.
 * @default
 * @type struct<variableCase>
 *
 * @param hpPercentage
 * @text Remaining HP%
 * @desc Used when you want to change the standing picture with the remaining HP%.
 * Please set 100% for the normal standing picture.
 * @default 100
 * @min 0
 * @max 100
 * @type number
 *
 * @param imageName
 * @text image file name
 * @desc Select the image file to be displayed as a standing picture.
 * @dir img/pictures
 * @type file
 * @require 1
 *
 * @param x
 * @text X coordinates
 * @desc This is the adjustment value for the display position (X) of the standing picture.
 * Use "+" to adjust to the right and "-" to adjust to the left. (Initial value: 0)
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param y
 * @text Y coordinates
 * @desc This is the adjustment value for the display position (Y) of the standing picture.
 * Use "+" to adjust to the right and "-" to adjust to the left. (Initial value: 0)
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 *
 * @param scaleX
 * @text X magnification
 * @desc This is the enlargement ratio (X) of the standing picture.
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 *
 * @param scaleY
 * @text Y expansion rate
 * @desc It is the enlargement ratio (Y) of the standing picture.
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 */

/*~struct~variableCase:
 *
 * @param id
 * @text Variable ID
 * @desc The variable ID used for the condition.
 * @type variable
 *
 * @param type
 * @text Variable condition
 * @desc Comparison condition with variable ID.
 * @default equal
 * @type select
 * @option Match
 * @value equal
 * @option and above
 * @value higher
 * @option and below
 * @value lower
 *
 * @param value
 * @text Variable comparison number
 * @desc A number to compare with the variable ID.
 * @default 0
 * @min -99999999
 * @max 99999999
 * @type number
 */

(() => {
	"use strict";
	const pluginName = "LL_MenuScreenBase";

	const parameters = PluginManager.parameters(pluginName);
	const paramJsonParse = function(key, value) {
		try {
			return JSON.parse(value);
		} catch(e) {
			return value;
		}
	};

	const menuPictures = String(parameters["menuPictures"] || "[]");
	const onSpbPluginEnable = eval(parameters["onSpbPluginEnable"] || "true");
	const menuPictureLists = JSON.parse(JSON.stringify(menuPictures, paramJsonParse));

	//-----------------------------------------------------------------------------
	// Get the standing picture list of the standing picture plug-in during battle
	// On LL_StandingPictureBattle Plugin
	//-----------------------------------------------------------------------------
	const spbPluginName = "LL_StandingPictureBattle";
	const spbParameters = PluginManager.parameters(spbPluginName);
	const spbCommandPictures = String(spbParameters["sbCommandPictures"] || "[]");
	const spbCommandPictureLists = JSON.parse(JSON.stringify(spbCommandPictures, paramJsonParse));

	//-----------------------------------------------------------------------------
	// Ex Menu Screen Base Class
	//
	// Add and define your own class for menu screen standing picture settings.

	class ExMenuScreenBase {

		//-----------------------------------------------------------------------------
		// Get the image file name
		//-----------------------------------------------------------------------------
		static getImageName (actorId) {
			// Get the standing picture list
			let pictureLists = this.getPictureLists();
			if (!pictureLists) return;

			// Get the actor's state information
			let actorStates = [];
			if (actorId) actorStates = $gameActors.actor(actorId)._states;
			let specificPicture = null;

			// Search for standing pictures with matching actor IDs
			pictureLists = pictureLists.filter(function(item) {
				if (Number(item.actorId) == actorId) {
					return true;
				}
			});

			// Is it in the state?
			if (actorStates.length) {
				// Search for a standing picture list with valid state ID, switch ID, and variable ID
				specificPicture = pictureLists.filter(function(item) {
					if (item.variableCase) {
						if (
							actorStates.indexOf(Number(item.stateId)) !== -1 &&
							$gameSwitches.value(Number(item.switchId)) &&
							(
								String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
								String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
								String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
							)
						) {
							return true;
						}
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
				// Search for a standing picture list with valid state ID / switch ID
				specificPicture = pictureLists.filter(function(item) {
					if (actorStates.indexOf(Number(item.stateId)) !== -1 && $gameSwitches.value(Number(item.switchId)) && !item.variableCase) {
						return true;
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
				// Search for a standing picture list with valid state ID / variable ID
				specificPicture = pictureLists.filter(function(item) {
					if (item.variableCase) {
						if (
							actorStates.indexOf(Number(item.stateId)) !== -1 &&
							(Number(item.switchId) === 0 || !item.switchId) &&
							(
								String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
								String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
								String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
							)
						) {
							return true;
						}
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
				// Search for a standing picture list with a valid state ID
				specificPicture = pictureLists.filter(function(item) {
					if (actorStates.indexOf(Number(item.stateId)) !== -1 && (Number(item.switchId) === 0 || !item.switchId) && !item.variableCase) {
						return true;
					}
				});
				if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
			}

			// Search for a standing picture list with valid switch ID / variable ID
			specificPicture = pictureLists.filter(function(item) {
				if (item.variableCase) {
					if (
						(Number(item.stateId) === 0 || !item.stateId) &&
						$gameSwitches.value(Number(item.switchId)) &&
						(
							String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
							String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
							String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
						)
					) {
						return true;
					}
				}
			});
			if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
			// Search for a standing picture list with a valid switch ID
			specificPicture = pictureLists.filter(function(item) {
				if ((Number(item.stateId) === 0 || !item.stateId) && $gameSwitches.value(Number(item.switchId)) && !item.variableCase) {
					return true;
				}
			});
			if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);
			// Search for a standing picture list with a valid variable ID
			specificPicture = pictureLists.filter(function(item) {
				if (item.variableCase) {
					if (
						(Number(item.stateId) === 0 || !item.stateId) &&
						(Number(item.switchId) === 0 || !item.switchId) &&
						(
							String(item.variableCase.type) == "equal" && $gameVariables.value(Number(item.variableCase.id)) == Number(item.variableCase.value) ||
							String(item.variableCase.type) == "higher" && $gameVariables.value(Number(item.variableCase.id)) >= Number(item.variableCase.value) ||
							String(item.variableCase.type) == "lower" && $gameVariables.value(Number(item.variableCase.id)) <= Number(item.variableCase.value)
						)
					) {
						return true;
					}
				}
			});
			if (specificPicture.length) return this.checkHpPercentage(actorId, specificPicture);

			// If not found above, search for a normal standing picture
			let normalPicture = pictureLists.filter(function(item) {
				if ((Number(item.stateId) === 0 || !item.stateId) && (Number(item.switchId) === 0 || !item.switchId) && !item.variableCase) return true;
			});
			if (normalPicture.length) return this.checkHpPercentage(actorId, normalPicture);
		}

		static checkHpPercentage (actorId, pictureLists) {
			// Get the remaining HP% of the actor
			let hpRate = this.getHpRate(actorId);
			// Apply the standing picture with the lowest HP%
			let minHpRate = 100;
			let result = null;
			pictureLists.forEach(function(item) {
				if (hpRate <= Number(item.hpPercentage) && minHpRate >= Number(item.hpPercentage)) {
					result = item;
					minHpRate = Number(item.hpPercentage);
				} else if (!item.hpPercentage && minHpRate >= 100) {
					// If the plugin parameters have not been updated, treat them as 100 for convenience.
					result = item;
					minHpRate = Number(item.hpPercentage);
				}
			});
			return result;
		}

		static getPictureLists () {
			return onSpbPluginEnable ? spbCommandPictureLists : menuPictureLists;
		}

		static onSpbPluginEnable () {
			return onSpbPluginEnable;
		}

		// Get the actor's HP rate
		static getHpRate (actorId) {
			if (!$gameActors.actor(actorId)) return 0;
			return $gameActors.actor(actorId).mhp > 0 ? $gameActors.actor(actorId).hp / $gameActors.actor(actorId).mhp * 100 : 0;
		}
	}

	window.ExMenuScreenBase = ExMenuScreenBase;
})();
