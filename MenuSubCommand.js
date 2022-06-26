//=============================================================================
// MenuSubCommand.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 4.1.0 2022/06/13 Added a setting to hide the sub window, and added a setting to animate the opening and closing of the sub window.
// 4.0.2 2022/06/10 Erase when selecting a command: OFF, with member selection: ON, fix the phenomenon that an error occurs when a subcommand with only one parent is selected.
// 4.0.1 2022/05/20 The default alignment of the command was centered, so the plugin side also changed the default to centering.
// 4.0.0 2022/02/11 Changed the parameter specification of the display position of the submenu so that it can be added to the desired position of the window.
// 3.1.0 2021/12/09 Changed to set the ID of the actor selected in the submenu even when the map is not transitioning.
// 3.0.1 2020/10/15 Added legend to script
// 3.0.0 Full refactoring for 2020/10/10 MZ
// 2.7.3 2020/08/18 Fixed to restore the erased state when moving to the subcommand map and returning after temporarily erasing the event
// 2.7.2 2020/04/03 Fixed so that the conflict resolution with MOG_SceneMenu.js applied in 2.5.0 and the conflict resolution with MOG_MenuCursor.js applied in 2.0.1 can be compatible.
// 2.7.1 2020/03/13 Fixed forgetting to pass arguments when initializing Window_MenuCommand
// 2.7.0 2019/10/25 Added the function to manage the display state of the picture of the menu map and the normal map separately.
// 2.6.1 2019/10/12 Fixed the problem that an error occurs when closing the menu without opening the subcommand even once after opening the menu with the fix of 2.6.0.
// Fix other minor bugs
// 2.6.0 2019/09/16 Added the function to return to the map after executing the subcommand script.
// Resolve conflict with MOG_MenuBackground.js
// Fixed an issue where after canceling a subcommand, selecting a skill or equipment command and returning will focus on the subcommand again.
// Changed the specification so that the setting becomes effective when either X or Y is set in the coordinate fixed value setting of the subcommand.
// 2.5.2 2019/09/08 Take measures in 2.0.1 and re-enable conflict measures that were restored in 2.5.0 for some reason.
// 2.5.1 2019/07/11 Changed method name to prevent conflict with FixCursorSeByMouse.js
// 2.5.0 2018/11/25 Added the function to set the absolute coordinates and alignment of the submenu.
// Resolve conflict with MOG_SceneMenu.js
// 2.4.1 2018/11/24 Described in the help how to work with the term dictionary plugin
// 2.4.0 2018/09/26 Added option to erase subcommands sequentially
// 2.3.0 2018/09/26 Added option to arrange subcommands side by side
// 2.2.1 2018/01/28 Fixed an issue where the first subcommand is expanded when returning to the menu after selecting a subcommand, selecting a normal command, and then returning to the menu.
// 2.2.0 2018/01/07 Added the function to specify the parent command with the same name.
// 2.1.0 2017/12/24 Added the process to replace the menu command with its name when selecting the subcommand that selects the target member.
// Changed to return to target member selection and subcommand selection when returning to the menu
// 2.0.1 2017/11/19 Resolving conflicts where the cursor is hidden under subcommands when used with MOG_MenuCursor.js
// 2.0.0 2017/09/04 Changed the parameter specifications so that you can add as many menu commands and subcommands as you like.
// 1.1.0 2017/05/14 Added the ability to remove default options and end-of-game commands
// Fixed an issue where scripts containing commas (,) could not be executed correctly
// 1.0.3 2017/04/09 Fixed so that the event position can be restored when returning from the subcommand map
// 1.0.2 2017/04/08 Fixed to restore follower position when returning from subcommand map
// 1.0.1 2017/04/08 When saving at the timing of returning from the subcommand map, the position at the time of loading becomes the subcommand map
// Fixed the problem that
// Set the menu to move the map to disabled during the retry when used in combination with the battle retry plugin.
// 1.0.0 2017/04/01 First Edition
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Menu screen subcommand plugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuSubCommand.js
 * @author トリアコンタン
 * @base PluginCommonBase
 *
 * @param subCommands
 * @text subcommand
 * @desc Subcommand information.
 * @default
 * @type struct<SubCommand>[]
 *
 * @param commandPosition
 * @text command addition position
 * @desc This is the position to add subcommands. If you specify 0, it will be added to the top of the window.
 * @default 0
 * @type number
 *
 * @param subMenuWidth
 * @text Submenu width
 * @desc The width of the window that displays the submenu. If not specified, the default value "240" is applied.
 * @default 0
 * @type number
 *
 * @param selectActorIdVariable
 * @text Select actor ID variable
 * @desc When an actor is selected from the subcommand, it is the variable number that stores the ID of that actor.
 * @default 0
 * @type variable
 *
 * @param windowSkin
 * @text window skin
 * @desc Set a dedicated skin for the window for the subcommand.
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param hideOption
 * @text Hide Option
 * @desc the option from the main menu.
 * @default false
 * @type boolean
 *
 * @param hideGameEnd
 * @text Hide Game End
 * @desc Clear the end of the game from the main menu.
 * @default false
 * @type boolean
 *
 * @param horizontalSubMenu
 * @text side by side
 * @desc the commands in the submenu side by side.
 * @default false
 * @type boolean
 *
 * @param clearSubMenuOneByObe
 * @text Close menu when command is selected
 * @desc Closes the menu when the command is selected
 * @default true
 * @type boolean
 *
 * @param subMenuX
 * @text Submenu X Coordinate
 * @desc If specified, the X coordinate of the subcommand will be a fixed value.
 * @default 0
 * @type number
 *
 * @param subMenuY
 * @text Submenu Y coordinate
 * @desc If specified, the Y coordinate of the subcommand will be a fixed value.
 * @default 0
 * @type number
 *
 * @param adjustX
 * @text Submenu X Coordinate adjusted
 * @desc Adjusts the X coordinate of the subcommand by the specified value.
 * @default 0
 * @type number
 * @min -9999
 *
 * @param adjustY
 * @text Submenu Y Coordinate adjusted
 * @desc Adjusts the Y coordinate of the subcommand by the specified value.
 * @default 0
 * @type number
 * @min -9999
 *
 * @param subMenuAlign
 * @text Submenu alignment
 * @desc Sets the alignment of subcommands.
 * @default
 * @type select
 * @option Left Alignment
 * @value left
 * @option Centered (default)
 * @value center
 * @option Right Alignment
 * @value right
 *
 * @param overlapOther
 * @text Overlay on other windows
 * @desc Makes the submenu window transparent so that the window behind it can be seen.
 * @type boolean
 * @default true
 *
 * @param openAnimation
 * @text open / close animation display
 * @desc Shows open / close animation when displaying a submenu window.
 * @type boolean
 * @default false
 *
 * @param anotherPicInMenuMap
 * @text Menu management by picture
 * @desc Manages the display status of menu maps and normal map pictures separately
 * @default false
 * @type boolean
 *
 * @param autoTransparent
 * @text Automatic transparency
 * @desc Automatically make the player transparent when moving the submap.
 * @default true
 * @type boolean
 *
 * @help MenuSubCommand.js
 *
* A command with any name and a command on the main menu screen
* You can add as many subcommands as you like to be displayed in the tree.
* When the subcommand is executed (determined), any script is executed or
* Or move to the specified map. (Both are possible)
*
* The script is mainly used when transitioning to another screen composed by the script.
* Of course, you can also transition to screens added by other plugins.
* Map movement is mainly used when transitioning to the self-made menu screen due to an event.
* When returning from the self-made menu screen, please open the menu again.
* You do not need to be aware of the location where the menu was originally opened because it is saved separately.
*
* In addition to the normal vertical layout and menu screen,
* It also supports the horizontal layout menu screen by the plug-in.
*
* If all subcommands are hidden, the parent item itself will also be hidden.
* Similarly, if all are prohibited, the parent item itself will also be prohibited.
*
* If there is only one subcommand, the subcommand window will not be displayed.
* Executes the subcommand when the parent command is selected.
*
* There are no plugin commands for this plugin.
*
* terms of service:
* Can be modified and redistributed without the permission of the author, and usage form (commercial, 18 prohibited use, etc.)
There are no restrictions on *.
* This plugin is yours already.
 */

/*~struct~SubCommand:
 *
 * @param CommandId
 * @text command ID
 * @desc Subcommand identification number. The commands are grouped by this number and name. Normally, all 0s are fine.
 * @default 0
 *
 * @param Name
 * @text command name
 * @desc The name displayed as the subcommand
 * @default subcommand 1
 *
 * @param ParentName
 * @text Parent Name
 * @desc The parent name of the subcommand displayed in the main command. Subcommands that have parents with the same name are grouped together.
 * @default parent command 1
 *
 * @param HiddenSwitchId
 * @text Hidden switch ID number
 * @desc Switch ID that hides the command when is ON
 * @default 0
 * @type switch
 *
 * @param DisableSwitchId
 * @text Disable switch ID number
 * @desc Switch ID whose command is disabled when is ON
 * @default 0
 * @type switch
 *
 * @param Script
 * @text script
 * @desc Script executed when the command is determined
 * @default
 * @type combo
 * @option this.commandItem(); // Open the item screen
 * @option this.commandSave(); // Open the save screen
 * @option this.commandOptions(); // Open the options screen
 * @option this.commandGlossary(1); // Call the term dictionary (when using the term dictionary plugin)
 * @option $gameSwitches.setValue(1, true); // Turn on switch [1]
 * @option $gameVariables.setValue(1, 10); // Substitute [10] for variable [1]
 * @option $gameTemp.reserveCommonEvent(1); // Call the common event [1] after returning to the map
 *
 * @param ReturnMap
 * @text Whether to return to the map
 * @desc Return to the map after executing the script.
 * @default false
 * @type boolean
 *
 * @param MapId
 * @text Transition destination map ID
 * @desc Map ID to move when the command is determined
 * @default 0
 *
 * @param SelectMember
 * @text member selection available
 * @desc Whether to select the target member before executing the command
 * @default false
 * @type boolean
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.subCommands) {
        param.subCommands = [];
    }

    //=============================================================================
    // Game_Temp
    //  Build and hold menu command information.
    //=============================================================================
    const _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this.createMenuCommands();
    };

    Game_Temp.prototype.createMenuCommands = function() {
        this._menuParentCommands = new Map();
        param.subCommands.forEach(function(commands) {
            this.createMenuCommand(commands);
        }, this);
        /* 最後に選択したサブコマンド */
        this._lastSubCommand = {
            parent: null,
            index : 0
        };
    };

    Game_Temp.prototype.createMenuCommand = function(commands) {
        const parentName = commands.ParentName + commands.CommandId;
        if (!this._menuParentCommands.has(parentName)) {
            this._menuParentCommands.set(parentName, []);
        }
        const parent = this._menuParentCommands.get(parentName);
        parent.push(new Game_MenuSubCommand(commands));
    };

    Game_Temp.prototype.iterateMenuParents = function(callBackFunc, thisArg) {
        this._menuParentCommands.forEach(callBackFunc, thisArg);
    };

    Game_Temp.prototype.getSubMenuCommands = function(parentName) {
        return this._menuParentCommands.get(parentName);
    };

    /**
     * 最後に選択したサブコマンドを取得する
     */
    Game_Temp.prototype.getLastSubCommand = function() {
        return this._lastSubCommand;
    };

    Game_Temp.prototype.setLastSubCommandParent = function(parentName) {
        this._lastSubCommand.parent = parentName;
    };

    Game_Temp.prototype.setLastSubCommandIndex = function(index) {
        this._lastSubCommand.index = index;
    };

    /**
     * 最後に選択したサブコマンドをリセットする
     */
    Game_Temp.prototype.resetLastSubCommand = function() {
        this._lastSubCommand = {
            parent: null,
            index : 0
        };
    };

    //=============================================================================
    // Game_CharacterBase
    //  サブコマンドマップへ移動します。
    //=============================================================================
    Game_CharacterBase.prototype.savePosition = function() {
        this._originalX         = this.x;
        this._originalY         = this.y;
        this._originalDirection = this.direction();
    };

    Game_CharacterBase.prototype.restorePosition = function() {
        this.locate(this._originalX, this._originalY);
        this.setDirection(this._originalDirection);
    };

    //=============================================================================
    // Game_Player
    //  サブコマンドマップへ移動します。
    //=============================================================================
    Game_Player.prototype.reserveTransferToSubCommandMap = function(subCommandMapId) {
        this.saveOriginalMap();
        this.reserveTransfer(subCommandMapId, 0, 0, 0, 2);
        if (param.autoTransparent) {
            this.setTransparent(true);
            this._followers.data().forEach(follower => follower.setTransparent(true));
        }
        if (param.anotherPicInMenuMap) {
            $gameScreen.setupMenuMapPictures();
        }
        this._originalMapData = $dataMap;
    };

    Game_Player.prototype.reserveTransferToOriginalMap = function() {
        $dataMap = this._originalMapData;
        this.reserveTransfer(this._originalMapId, this._originalX, this._originalY, this._originalDirection, 2);
        if (param.autoTransparent) {
            this.setTransparent(this._originalTransparent);
            this._followers.data().forEach(follower => follower.setTransparent(this._originalTransparent));
        }
        this._originalMapId             = 0;
        this._transferringToOriginalMap = true;
        if (param.anotherPicInMenuMap) {
            $gameScreen.restoreNormalMapPictures();
        }
    };

    Game_Player.prototype.isInSubCommandMap = function() {
        return this._originalMapId > 0;
    };

    Game_Player.prototype.isTransferringToOriginalMap = function() {
        return this._transferringToOriginalMap;
    };

    Game_Player.prototype.saveOriginalMap = function() {
        this._originalMapId       = $gameMap.mapId();
        this._originalTransparent = this._transparent;
        this.savePosition();
    };

    const _Game_Player_performTransfer      = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.apply(this, arguments);
        if (this.isTransferringToOriginalMap()) {
            this.restorePosition();
            this._transferringToOriginalMap = false;
        }
    };

    Game_Player.prototype.savePosition = function() {
        Game_CharacterBase.prototype.savePosition.call(this, arguments);
        this._followers.data().forEach(follower => follower.savePosition());
        $gameMap.saveAllEventPosition();
    };

    Game_Player.prototype.restorePosition = function() {
        Game_CharacterBase.prototype.restorePosition.call(this, arguments);
        this._followers.data().forEach(follower => follower.restorePosition());
        $gameMap.restoreAllEventPosition();
    };

    //=============================================================================
    // Game_Map
    //  すべてのイベントの位置を保存します。
    //=============================================================================
    Game_Map.prototype.saveAllEventPosition = function() {
        this._eventPositions = [];
        this._eventErases = [];
        this.events().forEach(function(event) {
            const position                          = {};
            position.x                            = event.x;
            position.y                            = event.y;
            position.direction                    = event.direction();
            this._eventPositions[event.eventId()] = position;
            this._eventErases[event.eventId()]    = event._erased;
        }, this);
    };

    Game_Map.prototype.restoreAllEventPosition = function() {
        this.events().forEach(function(event) {
            const position = this._eventPositions[event.eventId()];
            if (position) {
                event.locate(position.x, position.y);
                event.setDirection(position.direction);
            }
            const erase = this._eventErases[event.eventId()];
            if (erase) {
                event.erase();
            }
        }, this);
        this._eventPositions = [];
    };

    //=============================================================================
    // Game_Party
    //  無効なアクター設定時のエラーを回避します。
    //=============================================================================
    const _Game_Party_setMenuActor      = Game_Party.prototype.setMenuActor;
    Game_Party.prototype.setMenuActor = function(actor) {
        if (!actor) return;
        _Game_Party_setMenuActor.apply(this, arguments);
    };

    Game_Screen.prototype.setupMenuMapPictures = function() {
        this._normalMapPictures = this._pictures;
        this.clearPictures();
    };

    Game_Screen.prototype.restoreNormalMapPictures = function() {
        if (this._normalMapPictures) {
            this._pictures = this._normalMapPictures;
        }
        this._normalMapPictures = null;
    };

    //=============================================================================
    // AudioManager
    //  システム効果音を消音します。
    //=============================================================================
    AudioManager.stopAllStaticSe = function() {
        this._staticBuffers.forEach(function(buffer) {
            buffer.stop();
        });
        this._staticBuffers = [];
    };

    //=============================================================================
    // SceneManager
    //  メニュー用マップではキャプチャを無効にします。
    //=============================================================================
    const _SceneManager_snapForBackground = SceneManager.snapForBackground;
    SceneManager.snapForBackground      = function() {
        if ($gamePlayer.isInSubCommandMap()) return;
        _SceneManager_snapForBackground.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Map
    //  自作ゲーム用マップ遷移の場合、一部演出を無効化します。
    //=============================================================================
    const _Scene_Map_callMenu      = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        _Scene_Map_callMenu.apply(this, arguments);
        if ($gamePlayer.isInSubCommandMap()) {
            AudioManager.stopAllStaticSe();
            SoundManager.playCancel();
        }
    };

    const _Scene_Map_onMapLoaded      = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.apply(this, arguments);
        if ($gamePlayer.isInSubCommandMap()) {
            this._transfer = false;
        }
    };

    //=============================================================================
    // Scene_Menu
    //  メインメニューにコマンドを追加します。
    //=============================================================================
    const _Scene_Menu_create      = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.apply(this, arguments);
        this.loadSubCommandWindowSkin();
        if ($gamePlayer.isInSubCommandMap()) {
            $gamePlayer.reserveTransferToOriginalMap();
        }
        if (this._isSubCommandOkAfterCreate) {
            this.onSubCommandOk();
        }
    };

    Scene_Menu.prototype.loadSubCommandWindowSkin = function() {
        if (param.windowSkin) {
            ImageManager.loadSystem(param.windowSkin);
        }
    };

    const _Scene_Menu_isReady      = Scene_Menu.prototype.isReady;
    Scene_Menu.prototype.isReady = function() {
        return _Scene_Menu_isReady.apply(this, arguments) &&
            (!$gamePlayer.isTransferringToOriginalMap() || DataManager.isMapLoaded());
    };

    const _Scene_Menu_start      = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.apply(this, arguments);
        if ($gamePlayer.isTransferringToOriginalMap()) {
            $gamePlayer.performTransfer();
        }
    };

    const _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        $gameTemp.iterateMenuParents((subCommands, parentName) => {
            this._commandWindow.setHandler('parent' + parentName, this.commandParent.bind(this));
        });
        this._commandWindow.rightInputMode = this.isRightInputMode();
        this.selectLastCommand();
    };

    Scene_Menu.prototype.commandParent = function() {
        const parentName  = this._commandWindow.currentExt();
        const subCommands = $gameTemp.getSubMenuCommands(parentName);
        $gameTemp.setLastSubCommandParent(parentName);
        if (subCommands.length === 1) {
            this.onSubCommandOk(subCommands[0]);
        } else {
            if (!param.clearSubMenuOneByObe && this._subMenuWindow) {
                this._subMenuWindow.activate();
            } else {
                this.createSubMenuCommandWindow(parentName);
            }
        }
    };

    Scene_Menu.prototype.createSubMenuCommandWindow = function(parentName) {
        this._subMenuWindow = new Window_MenuSubCommand(this.createSubCommandRect(), parentName);
        this._subMenuWindow.updatePlacement(this._commandWindow);
        this._subMenuWindow.setHandler('ok', this.onSubCommandOk.bind(this));
        this._subMenuWindow.setHandler('cancel', this.onSubCommandCancel.bind(this));
        // for MOG_MenuBackground.js
        if (typeof this._subMenuWindow.updateBackgroundOpacity === 'function') {
            this._subMenuWindow.updateBackgroundOpacity();
        }
        this.addWindow(this._subMenuWindow);
        if (this._subMenuClosing) {
            this._windowLayer.removeChild(this._subMenuClosing);
            this._subMenuClosing = null;
        }
    };

    Scene_Menu.prototype.createSubCommandRect = function() {
        return new Rectangle(this.x, this.y, 1, 1);
    };

    Scene_Menu.prototype.removeSubMenuCommandWindow = function() {
        if (this._subMenuWindow) {
            if (param.openAnimation) {
                this._subMenuWindow.close();
                this._subMenuClosing = this._subMenuWindow;
            } else {
                this._windowLayer.removeChild(this._subMenuWindow);
            }
        }
        this._subMenuWindow = null;
    };

    Scene_Menu.prototype.onSubCommandOk = function(subCommand) {
        this._subCommand = (this._subMenuWindow ? this._subMenuWindow.currentExt() : subCommand);
        $gameTemp.setLastSubCommandIndex(this._subMenuWindow ? this._subMenuWindow.index() : 0);
        if (this._subCommand.isNeedSelectMember()) {
            if (this._subMenuWindow) {
                this._commandWindow.maskCommand(this._subCommand.getName());
                if (param.clearSubMenuOneByObe) {
                    this.removeSubMenuCommandWindow();
                } else {
                    this._subMenuWindow.deactivate();
                }
            }
            this._statusWindow.selectLast();
            this._statusWindow.activate();
            this._statusWindow.setHandler('ok', this.executeSubCommand.bind(this));
            this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
        } else {
            this.executeSubCommand();
        }
    };

    Scene_Menu.prototype.onSubCommandCancel = function() {
        this.removeSubMenuCommandWindow();
        $gameTemp.resetLastSubCommand();
        this._commandWindow.activate();
    };

    const _Scene_Menu_onPersonalCancel      = Scene_Menu.prototype.onPersonalCancel;
    Scene_Menu.prototype.onPersonalCancel = function() {
        _Scene_Menu_onPersonalCancel.apply(this);
        this._commandWindow.maskOff();
        this.selectLastCommand();
    };

    Scene_Menu.prototype.selectLastCommand = function() {
        const lastSubCommand = $gameTemp.getLastSubCommand();
        if (lastSubCommand.parent) {
            this._commandWindow.selectSymbol('parent' + lastSubCommand.parent);
            const subCommands = $gameTemp.getSubMenuCommands(lastSubCommand.parent);
            if (subCommands.length !== 1) {
                this.commandParent();
                this._commandWindow.deactivate();
                this._subMenuWindow.select(lastSubCommand.index);
                /* 別シーンからキャラ選択に戻った時 */
                const subCommand = subCommands[lastSubCommand.index];
                if (subCommand.isNeedSelectMember()) {
                    this._isSubCommandOkAfterCreate = true;
                }
            }
        }
        $gameTemp.resetLastSubCommand();
    };

    Scene_Menu.prototype.executeSubCommand = function() {
        this.executeSubScript();
        this.moveSubCommandMap();
        if (param.selectActorIdVariable && this._subCommand.isNeedSelectMember()) {
            $gameVariables.setValue(param.selectActorIdVariable, this._statusWindow.getSelectedActorId());
        }
        if (!SceneManager.isSceneChanging()) {
            this.onSubCommandCancel();
            this._statusWindow.deselect();
            this._commandWindow.maskOff();
        } else {
            this._subCommandSelected = true;
        }
    };

    Scene_Menu.prototype.executeSubScript = function() {
        const script = this._subCommand.getSelectionScript();
        if (!script) return;
        try {
            eval(script);
        } catch (e) {
            SoundManager.playBuzzer();
            console.error(`実行スクリプトエラー[${script}] メッセージ[${e.message}]`);
        }
        if (this._subCommand.isReturnMap()) {
            SceneManager.pop();
        }
    };

    Scene_Menu.prototype.moveSubCommandMap = function() {
        const mapId = this._subCommand.getMoveTargetMap();
        if (mapId <= 0) {
            return;
        }
        $gamePlayer.reserveTransferToSubCommandMap(mapId);
        SceneManager.pop();
    };

    const _Scene_Menu_terminate      = Scene_Menu.prototype.terminate;
    Scene_Menu.prototype.terminate = function() {
        _Scene_Menu_terminate.apply(this, arguments);
        if (this._subCommand && this._subCommand.getMoveTargetMap() <= 0) {
            $gameTemp.resetLastSubCommand();
        }
    };

    const _Scene_Menu_createField      = Scene_Menu.prototype.createField;
    Scene_Menu.prototype.createField = function() {
        _Scene_Menu_createField.apply(this, arguments);
        if (this._subMenuWindow) {
            this.addChild(this._subMenuWindow);
        }
    };

    //=============================================================================
    // Window_MenuCommand
    //  サブコマンドを追加します。
    //=============================================================================
    const _Window_MenuCommand_initialize          = Window_MenuCommand.prototype.initialize;
    Window_MenuCommand.prototype.initialize     = function() {
        this._maskedName = {};
        this.rightInputMode = true;
        _Window_MenuCommand_initialize.apply(this, arguments);
    };

    const _Window_MenuCommand_initCommandPosition = Window_MenuCommand.initCommandPosition;
    Window_MenuCommand.initCommandPosition      = function() {
        if ($gamePlayer.isInSubCommandMap()) return;
        _Window_MenuCommand_initCommandPosition.apply(this, arguments);
    };

    const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        _Window_MenuCommand_makeCommandList.apply(this, arguments);
        this.makeSubCommandList();
    };

    const _Window_MenuCommand_addGameEndCommand      = Window_MenuCommand.prototype.addGameEndCommand;
    Window_MenuCommand.prototype.addGameEndCommand = function() {
        if (this.needsCommand('gameEnd')) {
            _Window_MenuCommand_addGameEndCommand.apply(this, arguments);
        }
    };

    const _Window_MenuCommand_needsCommand      = Window_MenuCommand.prototype.needsCommand;
    Window_MenuCommand.prototype.needsCommand = function(name) {
        const need = _Window_MenuCommand_needsCommand.apply(this, arguments);
        if (name === 'options' && param.hideOption) {
            return false;
        }
        if (name === 'gameEnd' && param.hideGameEnd) {
            return false;
        }
        return need;
    };

    Window_MenuCommand.prototype.makeSubCommandList = function() {
        let addCount = 0;
        $gameTemp.iterateMenuParents((subCommands, parentName) => {
            this._subCommands = subCommands;
            if (this.checkSubCommands('isVisible')) {
                const commandName = this._maskedName[parentName] ? this._maskedName[parentName] : subCommands[0].getParentName();
                this.addCommand(commandName, 'parent' + parentName, this.checkSubCommands('isEnable'), parentName);
                const command = this._list.pop();
                this._list.splice(param.commandPosition + addCount, 0, command);
                addCount++;
            }
        });
    };

    Window_MenuCommand.prototype.checkSubCommands = function(methodName) {
        return this._subCommands.some(function(subCommand) {
            return subCommand[methodName]();
        });
    };

    Window_MenuCommand.prototype.calculateSubCommandX = function(width) {
        if (param.subMenuX) {
            return param.subMenuX;
        }
        let x = this.x;
        if (this.isHorizontalMenu()) {
            x += this._cursorRect.x;
        } else {
            x += this.rightInputMode ? -width : this.width;
        }
        x += param.adjustX || 0;
        return x.clamp(0, $dataSystem.advanced.uiAreaWidth - width);
    };

    Window_MenuCommand.prototype.calculateSubCommandY = function(height) {
        if (param.subMenuY) {
            return param.subMenuY;
        }
        let y = this.y;
        if (this.isHorizontalMenu()) {
            y += this.height;
        } else {
            y += this._cursorRect.y;
        }
        y += param.adjustY || 0;
        return y.clamp(0, $dataSystem.advanced.uiAreaHeight - height);
    };

    Window_MenuCommand.prototype.isHorizontalMenu = function() {
        return this.maxCols() >= this.maxPageRows();
    };

    Window_MenuCommand.prototype.maskCommand = function(maskName) {
        this._maskedName                                 = {};
        this._maskedName[this.commandName(this.index())] = maskName;
        this.refresh();
    };

    Window_MenuCommand.prototype.maskOff = function() {
        this._maskedName = {};
        this.refresh();
    };

    //=============================================================================
    // Window_MenuStatus
    //  選択しているアクターのIDを取得します。
    //=============================================================================
    Window_MenuStatus.prototype.getSelectedActorId = function() {
        return $gameParty.members()[this._index].actorId();
    };

    //=============================================================================
    // Window_MenuSubCommand
    //  サブコマンドウィンドウのクラスです。
    //=============================================================================
    function Window_MenuSubCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_MenuSubCommand.prototype             = Object.create(Window_Command.prototype);
    Window_MenuSubCommand.prototype.constructor = Window_MenuSubCommand;

    Window_MenuSubCommand.prototype.initialize = function(rectangle, parentName) {
        this._parentName = parentName;
        Window_Command.prototype.initialize.call(this, rectangle);
        if (param.overlapOther) {
            this._isWindow = false;
        }
        if (param.openAnimation) {
            this._openness = 0;
            this.open();
        }
    };

    Window_MenuSubCommand.prototype.makeCommandList = function() {
        const subMenus = $gameTemp.getSubMenuCommands(this._parentName);
        subMenus.forEach(subMenu => {
            if (subMenu.isVisible()) {
                this.addCommand(subMenu.getName(), 'ok', subMenu.isEnable(), subMenu);
            }
        });
        this.width = this.windowWidth();
        this.height = this.fittingHeight(this.numVisibleRows());
        this.createContents();
    };

    Window_MenuSubCommand.prototype.numVisibleRows = function() {
        return param.horizontalSubMenu ? 1 : this.maxItems();
    };

    Window_MenuSubCommand.prototype.maxCols = function() {
        return param.horizontalSubMenu ? this.maxItems() : 1;
    };

    Window_MenuSubCommand.prototype.windowWidth = function() {
        return param.subMenuWidth || 240;
    };

    Window_MenuSubCommand.prototype.updatePlacement = function(commandWindow) {
        this.x = commandWindow.calculateSubCommandX(this.width);
        this.y = commandWindow.calculateSubCommandY(this.height);
    };

    Window_MenuSubCommand.prototype.standardFontSize = function() {
        return userSetting.subCommandWindow.fontSize || Window_Command.prototype.standardFontSize.call(this);
    };

    Window_MenuSubCommand.prototype.standardPadding = function() {
        return userSetting.subCommandWindow.padding || Window_Command.prototype.standardPadding.call(this);
    };

    Window_MenuSubCommand.prototype.loadWindowskin = function() {
        if (param.windowSkin) {
            this.windowskin = ImageManager.loadSystem(param.windowSkin);
        } else {
            Window_Command.prototype.loadWindowskin.call(this);
        }
    };

    const _Window_MenuSubCommand_itemTextAlign      = Window_MenuSubCommand.prototype.itemTextAlign;
    Window_MenuSubCommand.prototype.itemTextAlign = function() {
        return param.subMenuAlign || _Window_MenuSubCommand_itemTextAlign.apply(this, arguments);
    };

    //=============================================================================
    // Game_MenuSubCommand
    //  サブコマンドを扱うクラスです。
    //=============================================================================
    class Game_MenuSubCommand {
        constructor(subCommandData) {
            this._data = subCommandData;
        }

        getName() {
            return this._data.Name;
        }

        getParentName() {
            return this._data.ParentName;
        }

        isReturnMap() {
            return (!this.getMoveTargetMap()) && this._data.ReturnMap;
        }

        isVisible() {
            return !$gameSwitches.value(this._data.HiddenSwitchId);
        }

        isEnable() {
            return !$gameSwitches.value(this._data.DisableSwitchId) &&
                !(SceneManager.isSceneRetry && SceneManager.isSceneRetry() && this.getMoveTargetMap() > 0);
        }

        isNeedSelectMember() {
            return this._data.SelectMember;
        }

        getSelectionScript() {
            return this._data.Script;
        }

        getMoveTargetMap() {
            return this._data.MapId;
        }
    }
})();

