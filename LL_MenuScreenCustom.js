//=============================================================================
// RPGツクールMZ - LL_MenuScreenCustom.js v1.4.4
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Customize the menu screen layout.
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-menuscreencustom/
 * @base LL_MenuScreenBase
 * @orderAfter LL_MenuScreenBase
 *
 * @help LL_MenuScreenCustom.js
 *
 * Customize the menu screen layout.
 * You can also display a standing picture instead of the face graphic.
 * Set the standing picture list to be displayed in "LL_MenuScreenBase".
 *
 * If the standing picture does not display well:
 *   If nothing is displayed, try increasing the negative value of the X / Y coordinate start point, or
 *   Try reducing the magnification.
 *   When the face graphic is displayed, the standing picture list cannot be linked.
 *   Please check if the standing picture list is set correctly.
 *
 * Help window:
 *   You can display any information in the upper left and upper right, lower left and lower right of the help window.
 *   Describe the content (value) to be displayed in the script.
 *
 * There are no plugin commands.
 *
 * terms of service:
 *   ・No copyright notice is required.
 *   ・There is no need to report to use it.
 *   ・It does not matter whether it is commercial or non-commercial.
 *   ・There are no restrictions on the use of R18 works (adult content, i think)..
 *   ・There is no problem if you freely modify it according to the game.
 *   ・Redistribution (including after modification) as a plug-in material is prohibited.
 *
 * Author: ルルの教会
 * Created: 2022/6/7
 *
 * @param menuSettings
 * @text Menu screen settings
 * @desc *This item is not used
 *
 * @param leftInputMode
 * @text Place the menu on the left
 * @desc Place the menu on the left and adjust the touch UI placement to the left.
 * The back button is located in the upper left and the page switching button is located in the upper right.
 * @default false
 * @type boolean
 * @parent menuSettings
 *
 * @param numVisibleRows
 * @text Number of actor lines
 * @desc The number of lines on the actor list screen. (Recommended value: 1-2)
 * @default 2
 * @min 1
 * @max 10
 * @type number
 * @parent menuSettings
 *
 * @param maxCols
 * @text Number of actor columns
 * @desc The number of columns on the actor list screen. (Recommended value: 1-2)
 * @default 2
 * @min 1
 * @max 10
 * @type number
 * @parent menuSettings
 *
 * @param currencyWindowPosition
 * @text Display position of Money in possession
 * @desc If you want to display your own items Set to "Display in a separate window under the menu".
 * 
 * @default helpWindowRightBottom
 * @type select
 * @option Do not show
 * @value hidden
 * @option Bottom right of the help window
 * @value helpWindowRightBottom
 * @option Displayed in a separate window below the menu
 * @value menuCommandBottom
 * @parent menuSettings
 *
 * @param backgroundImages
 * @text Background image settings
 * @desc Change the background image of the menu screen.
 * @default []
 * @type struct<backgroundImages>[]
 * @parent menuSettings
 *
 * @param layoutSettings
 * @text Menu Display position settings
 * @desc *This item is not used
 *
 * @param actorNameLH
 * @text Actor name display position
 * @desc Set the line from the top where the actor name is displayed. Set to -1 to hide it. (Initial value: 0)
 * 
 * @default 0
 * @min -1
 * @max 100
 * @type number
 * @parent layoutSettings
 *
 * @param actorNameX
 * @text Actor name display position(X)
 * @desc Adjust the horizontal position of the actor name. A + moves right, and a - moves left. (Initial value: 0)
 * 
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 * @parent layoutSettings
 *
 * @param actorLevelLH
 * @text Level display position
 * @desc Set the line from the top where the level is displayed.
 * Set to -1 to hide it. (Initial value: 1)
 * @default 1
 * @min -1
 * @max 100
 * @type number
 * @parent layoutSettings
 *
 * @param actorLevelX
 * @text Level display position(X)
 * @desc Adjust the horizontal position of the level. A + moves right, and a - moves left. (Initial value: 0) 
 * 
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 * @parent layoutSettings
 *
 * @param actorIconLH
 * @text State display position
 * @desc Set the line for where the state icon is displayed.
 * Set to -1 to hide it. (Initial value: 2)
 * @default 2
 * @min -1
 * @max 100
 * @type number
 * @parent layoutSettings
 *
 * @param actorIconX
 * @text State display position(X)
 * @desc Adjusts the horizontal position of the state icon. A + moves right, and a - moves left. (Initial value: 0)
 * 
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 * @parent layoutSettings
 *
 * @param actorClassLH
 * @text Class name display position
 * @desc Set the line from the top where the occupation name is displayed. Set to -1 to hide it. (Default: 3)
 * 
 * @default 3
 * @min -1
 * @max 100
 * @type number
 * @parent layoutSettings
 *
 * @param actorClassX
 * @text Class name display position(X)
 * @desc Adjust the horizontal position of the class name. A + moves right, and a - moves left. (Initial value: 0)
 * 
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 * @parent layoutSettings
 *
 * @param actorGaugeLH
 * @text Gauge display position
 * @desc Set the line from the top where the HP / MP / TP gauge is displayed. Set to -1 to hide it. (Default: 4)
 * 
 * @default 4
 * @min -1
 * @max 100
 * @type number
 * @parent layoutSettings
 *
 * @param actorGaugeX
 * @text Gauge display position(X)
 * @desc Adjust the horizontal position of the gauge. A + moves right, and a - moves left.(Initial value: 0)
 * 
 * @default 0
 * @min -9999
 * @max 9999
 * @type number
 * @parent layoutSettings
 *
 * @param lvPadding
 * @text Lv margin adjustment value
 * @desc Margin adjustment value in Lv notation. (Initial value: 84)
 * The smaller the number, the narrower the margin. 
 * @default 84
 * @min 0
 * @max 2000
 * @type number
 * @parent layoutSettings
 *
 * @param gaugeWidth
 * @text Gauge width
 * @desc The width (length) of the gauge. (Default: 128)
 * This setting applies only to the top of the menu screen.
 * @default 128
 * @min 0
 * @max 2000
 * @type number
 * @parent layoutSettings
 *
 * @param pictureSettings
 * @text Standing picture display settings
 * @desc *This item is not used
 *
 * @param showStandingPicture
 * @text Show standing picture
 * @desc Displays a standing picture instead of a face graphic.
 * @default true
 * @type boolean
 * @parent pictureSettings
 *
 * @param menuWindowPictureX
 * @text X coordinate start point
 * @desc The display position (X) of the standing picture to be displayed instead of the face graphic.
 * @default 0
 * @min -2000
 * @max 2000
 * @type number
 * @parent pictureSettings
 *
 * @param menuWindowPictureY
 * @text Y coordinate start point
 * @desc The display position (Y) of the standing picture to be displayed instead of the face graphic.
 * @default 0
 * @min -2000
 * @max 2000
 * @type number
 * @parent pictureSettings
 *
 * @param menuWindowPictureScale
 * @text Expansion rate
 * @desc The enlargement ratio of the standing picture. (Default: 100)
 * @default 100
 * @min -2000
 * @max 2000
 * @type number
 * @parent pictureSettings
 *
 * @param menuHelpSettings
 * @text Help window settings
 * @desc *This item is not used
 *
 * @param menuHelpWindowEnable
 * @text Show help window
 * @desc Displays a help window at the top of the menu screen.
 * @default true
 * @type boolean
 * @parent menuHelpSettings
 *
 * @param menuHelpTexts
 * @text Menu description
 * @desc Defines a list of menu descriptions.
 * @default ["{\"symbol\":\"Item\",\"helpText\":\"Use the item you got\"}","{\"symbol\":\"Skill\",\"helpText\":\"Use the aquired skill\"}","{\"symbol\":\"Equipment\",\"helpText\":\"Change Equipment\"}","{\"symbol\":\"Status\",\"helpText\":\"Check the status\"}","{\"symbol\":\"Formation\",\"helpText\":\"Change the order of the party members\"}","{\"symbol\":\"Options\",\"helpText\":\"Opens the options screen\"}","{\"symbol\":\"Save\",\"helpText\":\"Opens the save screen\"}","{\"symbol\":\"Quit Game\",\"helpText\":\"Exit the game\"}"]
 * @type struct<menuHelpTexts>[]
 * @parent menuHelpSettings
 *
 * @param leftBlockLabel
 * @text Item name on the upper left
 * @desc The item name to be displayed in the upper left.
 * Leave it blank to hide it.
 * @default current location:
 * @type string
 * @parent menuHelpSettings
 *
 * @param leftBlockValue
 * @text Upper left value
 * @desc Write the value to be displayed in the upper left with a script.
 * @default $gameMap.displayName()
 * @type combo
 * @option $gameVariables.value(1)   // Value of variable ID: 1
 * @option $gameSwitches.value(1) ? "True" : "False"  // Switch ID: 1 state
 * @option $gameMap.displayName()  // Map name
 * @option $gameParty.size()  // Number of members in party
 * @option $gameParty.steps()  // Current number of steps
 * @option $gameParty.gold()  // Money in possession
 * @option $gameParty.numItems($dataItems[1])  // Get the number of Item ID: 1 in the party inventory 
 * @option $gameParty.numItems($dataWeapons[1])  // Get the number of Weapon ID: 1 in the party inventory
 * @option $gameParty.numItems($dataArmors[1])  // Get the number of Armor ID: 1 in the party inventory
 * @option $gameSystem.playtimeText()   // Play time
 * @option $gameSystem.saveCount()  // Number of saves
 * @option $gameSystem.battleCount()  // Number of battles
 * @parent menuHelpSettings
 *
 * @param leftBlockAlign
 * @text Character alignment on the upper left
 * @desc Select the character arrangement of the value to be displayed in the upper left.
 * @default left
 * @type select
 * @option Left Alignment
 * @value left
 * @option Centered
 * @value center
 * @option Right Alignment
 * @value right
 * @parent menuHelpSettings
 *
 * @param rightBlockLabel
 * @text Item name in the upper right
 * @desc The item name to be displayed in the upper right.
 * Leave it blank to hide it.
 * @default Play time:
 * @type string
 * @parent menuHelpSettings
 *
 * @param rightBlockValue
 * @text Upper right value
 * @desc Write the value to be displayed in the upper right with a script.
 * @default $gameSystem.playtimeText()
 * @type combo
 * @option $gameVariables.value(1)   // Value of variable ID: 1
 * @option $gameSwitches.value(1) ? "True" : "False"  // Switch ID: 1 state
 * @option $gameMap.displayName()  // Map name
 * @option $gameParty.size()  // Number of members in party
 * @option $gameParty.steps()  // Current number of steps
 * @option $gameParty.gold()  // Money in possession
 * @option $gameParty.numItems($dataItems[1])  // Get the number of Item ID: 1 in the party inventory
 * @option $gameParty.numItems($dataWeapons[1])  // Get the number of Weapon ID: 1 in the party inventory
 * @option $gameParty.numItems($dataArmors[1])  // Get the number of Armor ID: 1 in the party inventory
 * @option $gameSystem.playtimeText()   // Play time
 * @option $gameSystem.saveCount()  // Number of saves
 * @option $gameSystem.battleCount()  // Number of battles
 * @parent menuHelpSettings
 *
 * @param rightBlockAlign
 * @text Character alignment on the upper right
 * @desc Select the character arrangement of the value to be displayed in the upper right.
 * @default right
 * @type select
 * @option Left Alignment
 * @value left
 * @option Centered
 * @value center
 * @option Right Alignment
 * @value right
 * @parent menuHelpSettings
 *
 * @param rightBottomBlockLabel
 * @text Item name at the bottom right
 * @desc The item name to be displayed in the lower right.
 * * Invalid when the display position of the possession money is "lower right of the help window"
 * @default
 * @type string
 * @parent menuHelpSettings
 *
 * @param rightBottomBlockValue
 * @text Lower right value
 * @desc Write the value to be displayed in the lower right in the script.
 * * Invalid when the display position of the possession money is "lower right of the help window"
 * @default
 * @type combo
 * @option $gameVariables.value(1)   // Value of variable ID: 1
 * @option $gameSwitches.value(1) ? "True" : "False"  // Switch ID: 1 state
 * @option $gameMap.displayName()  // Map name
 * @option $gameParty.size()  // Number of members in party
 * @option $gameParty.steps()  // Current number of steps
 * @option $gameParty.gold()  // Money in possession
 * @option $gameParty.numItems($dataItems[1])  // Get the number of Item ID: 1 in the party inventory
 * @option $gameParty.numItems($dataWeapons[1])  // Get the number of Weapon ID: 1 in the party inventory
 * @option $gameParty.numItems($dataArmors[1])  // Get the number of Armor ID: 1 in the party inventory
 * @option $gameSystem.playtimeText()   // Play time
 * @option $gameSystem.saveCount()  // Number of saves
 * @option $gameSystem.battleCount()  // Number of battles
 * @parent menuHelpSettings
 *
 * @param rightBottomBlockAlign
 * @text Typographical alignment at the bottom right
 * @desc Select the character arrangement of the value to be displayed in the lower right.
 * * Invalid when the display position of the possession money is "lower right of the help window"
 * @default left
 * @type select
 * @option Left Alignment
 * @value left
 * @option Centered
 * @value center
 * @option Right Alignment
 * @value right
 * @parent menuHelpSettings
 *
 * @param leftBottomBlockLabel
 * @text Item name at the bottom left
 * @desc The item name to be displayed in the lower left.
 * * If set, the menu description will not be displayed.
 * @default
 * @type string
 * @parent menuHelpSettings
 *
 * @param leftBottomBlockValue
 * @text Lower left value
 * @desc Write the value to be displayed in the lower left in the script.
 * * If set, the menu description will not be displayed.
 * @default
 * @type combo
 * @option $gameVariables.value(1)   // Value of variable ID: 1
 * @option $gameSwitches.value(1) ? "True" : "False"  // Switch ID: 1 state
 * @option $gameMap.displayName()  // Map name
 * @option $gameParty.size()  // Number of members in party
 * @option $gameParty.steps()  // Current number of steps
 * @option $gameParty.gold()  // Money in possession
 * @option $gameParty.numItems($dataItems[1])  // Get the number of Item ID: 1 in the party inventory
 * @option $gameParty.numItems($dataWeapons[1])  // Get the number of Weapon ID: 1 in the party
 * @option $gameParty.numItems($dataArmors[1])  // Get the number of Armor ID: 1 in the party inventory
 * @option $gameSystem.playtimeText()   // Play time
 * @option $gameSystem.saveCount()  // Number of saves
 * @option $gameSystem.battleCount()  // Number of battles
 * @parent menuHelpSettings
 *
 * @param leftBottomBlockAlign
 * @text Typographical alignment at the bottom left
 * @desc Select the character arrangement of the value to be displayed in the lower left.
 * @default left
 * @type select
 * @option Left Alignment
 * @value left
 * @option Centered
 * @value center
 * @option Right Alignment
 * @value right
 * @parent menuHelpSettings
 */

/*~struct~menuHelpTexts:
 *
 * @param symbol
 * @text Menu name
 * @desc Enter the menu name.
 * @type string
 *
 * @param helpText
 * @text Menu description
 * @desc Enter a description for the menu.
 * @type string
 */

/*~struct~backgroundImages:
 *
 * @param sceneName
 * @text Scene name
 * @desc The scene name for setting the background image.
 * You can also directly enter the scene name you added.
 * @default Scene_Menu
 * @type combo
 * @option Scene_Menu
 * @option Scene_Item
 * @option Scene_Skill
 * @option Scene_Equip
 * @option Scene_Status
 * @option Scene_Options
 * @option Scene_Save
 * @option Scene_Load
 * @option Scene_GameEnd
 *
 * @param imageName
 * @text background image
 * @desc Select the image to display as the background image.
 * @dir img/system
 * @type file
 * @require 1
 */

(() => {
	"use strict";
	const pluginName = "LL_MenuScreenCustom";

	const parameters = PluginManager.parameters(pluginName);
	const leftInputMode = eval(parameters["leftInputMode"] || "true");
	const numVisibleRows = Number(parameters["numVisibleRows"] || 2);
	const maxCols = Number(parameters["maxCols"] || 2);
	const currencyWindowPosition = String(parameters["currencyWindowPosition"] || "helpWindowRightBottom");
	// Display position setting
	const actorNameLH = Number(parameters["actorNameLH"] || 0);
	const actorLevelLH = Number(parameters["actorLevelLH"] || 1);
	const actorIconLH = Number(parameters["actorIconLH"] || 2);
	const actorClassLH = Number(parameters["actorClassLH"] || 3);
	const actorGaugeLH = Number(parameters["actorGaugeLH"] || 4);
	const lvPadding = Number(parameters["lvPadding"] || 84);
	const gaugeWidth = Number(parameters["gaugeWidth"] || 128);
	// Display position setting(X)
	const actorNameX = Number(parameters["actorNameX"] || 0);
	const actorLevelX = Number(parameters["actorLevelX"] || 0);
	const actorIconX = Number(parameters["actorIconX"] || 0);
	const actorClassX = Number(parameters["actorClassX"] || 0);
	const actorGaugeX = Number(parameters["actorGaugeX"] || 0);
	// Standing picture display settings
	const showStandingPicture = eval(parameters["showStandingPicture"] || "true");
	const menuWindowPictureX = Number(parameters["menuWindowPictureX"] || 0);
	const menuWindowPictureY = Number(parameters["menuWindowPictureY"] || 0);
	const menuWindowPictureScale = Number(parameters["menuWindowPictureScale"] || 100);
	// Help window settings
	const menuHelpWindowEnable = eval(parameters["menuHelpWindowEnable"] || "true");
	const menuHelpTexts = JSON.parse(parameters["menuHelpTexts"] || "null");
	const leftBlockLabel = String(parameters["leftBlockLabel"] || "");
	const leftBlockValue = String(parameters["leftBlockValue"] || "");
	const leftBlockAlign = String(parameters["leftBlockAlign"] || "left");
	const rightBlockLabel = String(parameters["rightBlockLabel"] || "");
	const rightBlockValue = String(parameters["rightBlockValue"] || "");
	const rightBlockAlign = String(parameters["rightBlockAlign"] || "right");
	const rightBottomBlockLabel = String(parameters["rightBottomBlockLabel"] || "");
	const rightBottomBlockValue = String(parameters["rightBottomBlockValue"] || "");
	const rightBottomBlockAlign = String(parameters["rightBottomBlockAlign"] || "left");
	const leftBottomBlockLabel = String(parameters["leftBottomBlockLabel"] || "");
	const leftBottomBlockValue = String(parameters["leftBottomBlockValue"] || "");
	const leftBottomBlockAlign = String(parameters["leftBottomBlockAlign"] || "left");
	// Background image settings
	const backgroundImages = JSON.parse(parameters["backgroundImages"] || "null");

	let menuHelpLists = [];
	if (menuHelpTexts) {
		menuHelpTexts.forEach((elm) => {
			menuHelpLists[String(JSON.parse(elm).symbol)] = String(JSON.parse(elm).helpText);
		});
	}

	let backgroundImageLists = [];
	if (backgroundImages) {
		backgroundImages.forEach((elm) => {
			backgroundImageLists.push(JSON.parse(elm));
		});
	}

	// Standard height of menu screen help window (lineHeight)
	let menuHelpWindowLH = 1.5;

	// Help window font size
	const menuHelpWindowFontSize = 22;

	const _Scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground;
	Scene_MenuBase.prototype.createBackground = function() {
		let sceneName = SceneManager._scene.constructor.name;
		// Search background image
		let originalBackgroundImage = backgroundImageLists.find(function(item) {
			if (String(item.sceneName) == sceneName) return true;
		});
		if (originalBackgroundImage) {
			// Show your own background image
			this._backgroundSprite = new Sprite();
			this._backgroundSprite.bitmap = ImageManager.loadSystem(originalBackgroundImage.imageName);
			this.addChild(this._backgroundSprite);
			return;
		}
		_Scene_MenuBase_createBackground.apply(this, arguments);
	};

	// Define the height of the help window
	Scene_MenuBase.prototype.calcMenuHelpWindowHeight = function() {
		let height = this.calcWindowHeight(menuHelpWindowLH, false);
		if (!leftBlockLabel && !rightBlockLabel) height = this.calcWindowHeight(1, false);
		if (!menuHelpWindowEnable) height = 0;
		return height;
	};

	Scene_Menu.prototype.isRightInputMode = function() {
        return !leftInputMode;
	};

	Scene_MenuBase.prototype.createCancelButton = function() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = leftInputMode ? 4 : Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    };

    Scene_MenuBase.prototype.createPageButtons = function() {
        this._pageupButton = new Sprite_Button("pageup");
        this._pagedownButton = new Sprite_Button("pagedown");
        if (leftInputMode) {
            this._pageupButton.x = Graphics.boxWidth - this._pageupButton.width -  this._pagedownButton.width - 8;
        } else {
            this._pageupButton.x = 4;
        }
        this._pageupButton.y = this.buttonY();
        const pageupRight = this._pageupButton.x + this._pageupButton.width;
        this._pagedownButton.x = pageupRight + 4;
        this._pagedownButton.y = this.buttonY();
        this.addWindow(this._pageupButton);
        this.addWindow(this._pagedownButton);
        this._pageupButton.setClickHandler(this.previousActor.bind(this));
        this._pagedownButton.setClickHandler(this.nextActor.bind(this));
	};

	const _Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
		_Scene_Menu_create.apply(this, arguments);
		this.createMenuHelpWindow();
		if (currencyWindowPosition != "menuCommandBottom") {
			this._goldWindow.visible = false;
		}
	};

	Scene_Menu.prototype.commandWindowRect = function() {
		const ww = this.mainCommandWidth();
		let wh = this.mainAreaHeight() - this.menuHelpWindowRect().height - this.goldWindowRect().height;
		const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
		const wy = this.mainAreaTop() + this.menuHelpWindowRect().height;
		if (currencyWindowPosition != "menuCommandBottom") {
			wh += this.goldWindowRect().height
		}
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Menu.prototype.goldWindowRect = function() {
		const ww = this.mainCommandWidth();
		const wh = this.calcWindowHeight(1, true);
		const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
		const wy = this.mainAreaBottom() - wh;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Menu.prototype.statusWindowRect = function() {
		const ww = Graphics.boxWidth - this.mainCommandWidth();
		const wh = this.mainAreaHeight() - this.menuHelpWindowRect().height;
		const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
		const wy = this.mainAreaTop() + this.menuHelpWindowRect().height;
		return new Rectangle(wx, wy, ww, wh);
	};

	Scene_Menu.prototype.createMenuHelpWindow = function() {
		const rect = this.menuHelpWindowRect();
		this._menuHelpWindow = new Window_MenuHelp(rect);
		this.addWindow(this._menuHelpWindow);
	};

	Scene_Menu.prototype.menuHelpWindowRect = function() {
		const wx = 0;
		const wy = this.mainAreaTop();
		const ww = Graphics.boxWidth;
		const wh = this.calcMenuHelpWindowHeight();
		return new Rectangle(wx, wy, ww, wh);
	};

	const _Scene_Menu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
		_Scene_Menu_update.apply(this, arguments);
		// Information window update
		const helpText = menuHelpLists[this._commandWindow.currentName()] ? menuHelpLists[this._commandWindow.currentName()] : "";
		this._menuHelpWindow.setText(helpText);
	};

	Scene_ItemBase.prototype.actorWindowRect = function() {
		const wx = 0;
		const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
		const ww = Graphics.boxWidth - this.mainCommandWidth();
		const wh = Graphics.boxHeight - this.buttonAreaHeight() - this.calcMenuHelpWindowHeight();
		return new Rectangle(wx, wy, ww, wh);
	};

	// Get Current Name
	Window_Command.prototype.currentName = function() {
		return this.currentData() ? this.currentData().name : null;
	};

	// Draw a standing picture in the window
	Window_StatusBase.prototype.drawStandingPicture = function(
		pictureName, x, y, width, height, sx, sy, scaleX, scaleY
	) {
		width = width || 200;
		height = height || 200;
		sx = sx || 0;
		sy = sy || 0;
		const bitmap = ImageManager.loadPicture(pictureName);
		const pw = width;
		const ph = height;
		let sw = Math.min(width, pw);
		let sh = Math.min(height, ph);
		let dx = Math.floor(x + Math.max(width - pw, 0) / 2);
		let dy = Math.floor(y + Math.max(height - ph, 0) / 2);
		let dw = Math.min(width, pw);
		let dh = Math.min(height, ph);

		// for iOS Safari
		if (sx < 0) {
			dx += sx * -1 * scaleX;
			sw -= sx * -1 * scaleX;
			dw -= sx * -1 * scaleX;
			sx = 0;
		}
		if (sy < 0) {
			dy += sy * -1 * scaleY;
			sh -= sy * -1 * scaleY;
			dh -= sy * -1 * scaleY;
			sy = 0;
		}

		bitmap.addLoadListener(function() {
	        this.contents.blt(bitmap, sx, sy, sw / scaleX, sh / scaleY, dx, dy, dw, dh);
        }.bind(this));
	};

	Window_StatusBase.prototype.exDrawActorSimpleStatus = function(actor, x, y, width) {
		const lineHeight = this.lineHeight();
		if (actorNameLH > -1) this.drawActorName(actor, x + actorNameX, y + lineHeight * actorNameLH, width - actorNameX);
		if (actorLevelLH > -1) this.drawActorLevel(actor, x + actorLevelX, y + lineHeight * actorLevelLH);
		if (actorIconLH > -1) this.drawActorIcons(actor, x + actorIconX, y + lineHeight * actorIconLH, width - actorIconX);
		if (actorClassLH > -1) this.drawActorClass(actor, x + actorClassX, y + lineHeight * actorClassLH, width - actorClassX);
		if (actorGaugeLH > -1) this.placeBasicGauges(actor, x + actorGaugeX, y + lineHeight * actorGaugeLH);
	};

	Window_MenuStatus.prototype.drawItemImage = function(index) {
		const actor = this.actor(index);
		const rect = this.itemRect(index);

		this.changePaintOpacity(actor.isBattleMember());
		// Standing picture or face graphic drawing
		let mPicture = ExMenuScreenBase.getImageName(actor.actorId());
		if (mPicture && showStandingPicture) {
			const width = rect.width - 2;
			const height = rect.height - 2;
			const x = rect.x + 1;
			const y = rect.y + 1;
			const sx = (Number(mPicture.x) + menuWindowPictureX) * -1;
			const sy = (Number(mPicture.y) + menuWindowPictureY) * -1;
			let scaleX = Number(mPicture.scaleX) / 100;
			let scaleY = Number(mPicture.scaleY) / 100;
			// Apply magnification
			scaleX *= menuWindowPictureScale / 100;
			scaleY *= menuWindowPictureScale / 100;
			// Pinch judgment
			if (ExMenuScreenBase.getHpRate(actor.actorId()) > Number(mPicture.pinchPercentage) || !mPicture.pinchImageName) {
				// generally
				this.drawStandingPicture(String(mPicture.imageName), x, y, width, height, sx, sy, scaleX, scaleY);
			} else {
				// pinch
				this.drawStandingPicture(String(mPicture.pinchImageName), x, y, width, height, sx, sy, scaleX, scaleY);
			}
		} else {
			let width = ImageManager.faceWidth;
			// If the width is small, trim to fit the width
			if (rect.width - 2 < width) {
				width = rect.width - 2;
			}
			const height = rect.height - 2;
			const x = rect.x + rect.width - width - 1;
			const y = rect.y + 1;
			this.drawActorFace(actor, x, y, width, height);
		}
		this.changePaintOpacity(true);
	};

	Window_MenuStatus.prototype.drawItemStatus = function(index) {
		const actor = this.actor(index);
		const rect = this.itemRect(index);
		const x = rect.x + 2;
		const y = rect.y + 2;
		const width = rect.width - 4;

		// Image cache judgment
		const mPicture = ExMenuScreenBase.getImageName(actor.actorId());
		if (mPicture && showStandingPicture) {
			let pictureName = null;
			// Pinch judgment (for old Ver. Compatibility)
			if (ExMenuScreenBase.getHpRate(actor.actorId()) > Number(mPicture.pinchPercentage) || !mPicture.pinchImageName) {
				pictureName = String(mPicture.imageName);
			} else {
				pictureName = String(mPicture.pinchImageName);
			}
			const bitmap = ImageManager.loadPicture(pictureName);
			bitmap.addLoadListener(function() {
				this.exDrawActorSimpleStatus(actor, x, y, width);
			}.bind(this));
		} else {
			this.exDrawActorSimpleStatus(actor, x, y, width);
		}
	};

	Window_MenuStatus.prototype.numVisibleRows = function() {
		return numVisibleRows;
	};

	Window_MenuStatus.prototype.maxCols = function() {
		return maxCols;
	};

	Window_MenuStatus.prototype.drawActorLevel = function(actor, x, y) {
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(TextManager.levelA, x, y, 48);
		this.resetTextColor();
		this.drawText(actor.level, x + lvPadding, y, 36, "right");
	};

	Window_MenuStatus.prototype.refreshCursorForAll = function() {
		const maxItems = this.maxItems();
		if (maxItems > 0) {
			const rect = this.itemRect(0);

			// Calculate the maximum number independently
			let maxRectCnt = maxItems;
			if (maxRectCnt > maxCols) {
				maxRectCnt = Math.ceil(maxRectCnt / maxCols) * maxCols;
			}
			rect.enlarge(this.itemRect(maxRectCnt - 1));

			this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
		} else {
			this.setCursorRect(0, 0, 0, 0);
		}
	};


	//-----------------------------------------------------------------------------
	// Window_MenuHelp
	//

	function Window_MenuHelp() {
	    this.initialize(...arguments);
    }

    Window_MenuHelp.prototype = Object.create(Window_Base.prototype);
    Window_MenuHelp.prototype.constructor = Window_MenuHelp;

    Window_MenuHelp.prototype.initialize = function(rect) {
		Window_Base.prototype.initialize.call(this, rect);
		this.refresh();
    };

    Window_MenuHelp.prototype.setText = function(text) {
	    this._text = text;
	    this.refresh();
    };

    Window_MenuHelp.prototype.clear = function() {
	    this.setText("");
    };

    Window_MenuHelp.prototype.refresh = function() {
		this.contents.clear();
		this.contents.fontSize = this.getFontSize();
		// Map name
		this.drawLeftBlock();
		// Play time
		this.drawRightBlock();
		// Money in possession
		this.drawCurrency();
		// Menu help
		this.drawMenuHelp();
		this.contents.fontSize = $gameSystem.mainFontSize();
	};

	Window_MenuHelp.prototype.getFontSize = function() {
	    return !leftBlockLabel && !rightBlockLabel ? $gameSystem.mainFontSize() : menuHelpWindowFontSize;
    };

	Window_MenuHelp.prototype.drawLeftBlock = function() {
		if (!leftBlockLabel) return;
		const y = -6;
		const oneThirdWidth = Math.floor(this.innerWidth / 3);
	    this.changeTextColor(this.systemColor());
		this.drawText(leftBlockLabel, 0, y, this.contents.measureTextWidth(leftBlockLabel), leftBlockAlign);
		this.resetTextColor();
		this.drawText(eval(leftBlockValue), this.contents.measureTextWidth(leftBlockLabel), y, oneThirdWidth * 1.5 - this.contents.measureTextWidth(leftBlockLabel), leftBlockAlign);
	};

	Window_MenuHelp.prototype.drawRightBlock = function() {
		if (!rightBlockLabel) return;
		const y = -6;
		const oneThirdWidth = Math.floor(this.innerWidth / 3);
		this.changeTextColor(this.systemColor());
		this.drawText(rightBlockLabel, oneThirdWidth * 1.5, y, this.contents.measureTextWidth(rightBlockLabel), rightBlockAlign);
		this.resetTextColor();
		this.drawText(eval(rightBlockValue), this.contents.measureTextWidth(rightBlockLabel) + oneThirdWidth * 1.5, y, oneThirdWidth * 1.5 - this.contents.measureTextWidth(rightBlockLabel), rightBlockAlign);
	};

	Window_MenuHelp.prototype.drawCurrency = function() {
		const y = !leftBlockLabel && !rightBlockLabel ? 0 : 24;
		const oneThirdWidth = Math.floor(this.innerWidth / 3);

		if (currencyWindowPosition == "helpWindowRightBottom") {
			// If the display position of the money in possession is "lower right of the help window", the money in possession is drawn.
			const currencyUnit = TextManager.currencyUnit;
			this.drawCurrencyValue($gameParty.gold(), currencyUnit, oneThirdWidth * 1.5, y, oneThirdWidth * 1.5);
		} else {
			// Otherwise, draw your own item
			if (!rightBottomBlockLabel) return;
			this.changeTextColor(this.systemColor());
			this.drawText(rightBottomBlockLabel, oneThirdWidth * 1.5, y, this.contents.measureTextWidth(rightBottomBlockLabel), rightBottomBlockAlign);
			this.resetTextColor();
			this.drawText(eval(rightBottomBlockValue), this.contents.measureTextWidth(rightBottomBlockLabel) + oneThirdWidth * 1.5, y, oneThirdWidth * 1.5 - this.contents.measureTextWidth(rightBottomBlockLabel), rightBottomBlockAlign);
		}
	};

	Window_MenuHelp.prototype.drawMenuHelp = function() {
		const y = !leftBlockLabel && !rightBlockLabel ? 0 : 24;
		const oneThirdWidth = Math.floor(this.innerWidth / 3);

		if (leftBottomBlockLabel != "") {
			// When displaying your own item in the lower left (v1.4.0)
			this.changeTextColor(this.systemColor());
			this.drawText(leftBottomBlockLabel, 0, y, this.contents.measureTextWidth(leftBottomBlockLabel), leftBottomBlockAlign);
			this.resetTextColor();
			this.drawText(eval(leftBottomBlockValue), this.contents.measureTextWidth(leftBottomBlockLabel), y, oneThirdWidth * 1.5 - this.contents.measureTextWidth(leftBottomBlockLabel), leftBottomBlockAlign);
		} else {
			// Show menu help
			this.resetTextColor();
			this.drawText(this._text ? this._text : "", 0, y, this.innerWidth - oneThirdWidth * 1.5, leftBottomBlockAlign);
		}
	};


	// Gauge width adjustment function (v1.3.0)
	const _Window_StatusBase_placeGauge = Window_StatusBase.prototype.placeGauge;
	Window_StatusBase.prototype.placeGauge = function(actor, type, x, y) {
		// Applies only to the top of the menu screen and the target actor selection screen
		if (this.constructor.name === "Window_MenuStatus" || this.constructor.name === "Window_MenuActor") {
			const key = "actor%1-gauge-%2".format(actor.actorId(), type);
			const sprite = this.createInnerSprite(key, Sprite_GaugeExMenuBase);
			sprite.setup(actor, type);
			sprite.move(x, y);
			sprite.show();
		} else {
			_Window_StatusBase_placeGauge.apply(this, arguments);
		}
	};

	//-----------------------------------------------------------------------------
	// Sprite_GaugeExMenuBase
	//
	// Define a new gauge sprite for gauge width adjustment.

	function Sprite_GaugeExMenuBase() {
		this.initialize(...arguments);
	}

	Sprite_GaugeExMenuBase.prototype = Object.create(Sprite_Gauge.prototype);
	Sprite_GaugeExMenuBase.prototype.constructor = Sprite_GaugeExMenuBase;

	Sprite_GaugeExMenuBase.prototype.bitmapWidth = function() {
		return gaugeWidth;
	};
})();
