//=============================================================================
// Keke_ElementFullCustom - 属性フルカスタム
// Version: 1.3.0
//=============================================================================
// Copyright (c) 2021 ケケー
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Extend the elements in various ways
 * @author ケケー
 * @url http://kekeelabo.com
 *
 *
 *
 * @help
 * 【1.3.0】
 * Expand Elements in various ways
 * From here on elements are referred to as attributes
 *
 *
 * ◉ Features ◉
 *
* ■ Fixed value increase / decrease of attribute damage (of course, even at a rate)
* ■ Increase / decrease in attribute damage from the attacking side
* ■ Damage reversal by attribute (damage <==> recovery)
* ■ Multiple attributes. Calculation method can also be set (total, maximum value, average)
* ■ Detailed setting of attribute calculation method for each technique
*
*
*
* ◉ How to use ◉
*
* ■ Set attributes
*
* In the memo field of actor, occupation, equipment, skill, item, state
*
* If you want to change the attribute power (damage caused by the attribute)
* <Attribute power: (calculation symbol) (effect value) (r), (!) (Attribute name), (attribute name)>
*
* If you want to change the attribute resistance (damage caused by the attribute)
* <Attribute resistance: (calculation symbol) (effect value) (r), (!) (Attribute name), (attribute name)>
*
* If you want to add an attribute
* <property append: (property name), (property name)>
*
* * You can add as many attribute names as you like, separated by ,. Of course one is fine
* The following two are only the memo fields of skill items
*
* If you change the calculation order of attribute damage
* <Attribute calculation: (multiplication destination / addition destination)>
 
* If you want to change the calculation method for multiple attributes
* <Multiple attributes: (total / maximum / average)>
*
*
* ★ (calculation symbol) (effect value) (r)
* Damage fluctuation amount
* ◎ Calculation symbol is +  
* Fixed value addition. If it is 100, the damage is increased by 100. This is the case if the calculation symbol is omitted.
* ◎ The calculation symbol is-
* Fixed value subtraction. -100 reduces damage by 100
* ◎ Calculation symbol is *
* Multiply. * 2, the damage is doubled
* ◎ The calculation symbol is /
* Division. If it is / 2, the damage will be halved.
* ◎ Calculation symbol is + *  
* Percentage addition (multiplication). If + * 1, the damage is increased by 1 times the original damage.
* ◎ Calculation symbol is-*  
* Percentage subtraction (multiplication). -* 1 reduces damage by 1 times the original damage
* ◎ Calculation symbol is + /  
* Percentage addition (division). If + / 2, the damage is increased by 1/2 of the original damage.
* ◎ Calculation symbol is-/
* Percentage subtraction (division). -/ 2 reduces damage by 1/2 of the original damage
 * ◎ r 
* Damage reversal (abbreviation for reverse). If it is damaged, it will heal, and if it is healed, it will be damaged.
* * What is rate addition?
* Calculation method that adds the original damage by a percentage
* If the original damage is 100 and the percentage addition is 0.1 and 0.2
* 100 + 100 * 0.1 + 100 * 0.2 = 130
*
*
* ★(attribute name)
* Applicable attributes
* Write the attribute name set in the database. Not an ID
* The following special format
* ◎ all/all
* Applies to all attributes
* ◎(!) 
* If i is added to the beginning of the attribute name, it applies to all attributes other than the written attribute.
*! Applies to all attributes except flame, ice, and lightning for fire, ice, and lightning.
*
*
* ★ Attribute calculation order
* Which to calculate first, multiply or add attribute damage
* Can be omitted. If omitted, the settings in the plug-in parameters will be applied.
* ◎ Multiply destination
* Calculate the product first
* ◎ Addition destination
* Calculate addition and subtraction first
* * What will change if the calculation order changes?
* Final damage changes
* If the original damage is 100, the addition is +50, and the multiplication is * 1.5,
* ◎ Multiply destination => 100 * 1.5 + 50 = 200
* ◎ Addition destination => (100 + 50) * 1.5 = 225
*
*
* ★ Multi-attribute calculation
* How to calculate the effect when there are multiple attributes
* Choose from 3
* * Can be omitted. If omitted, the settings in the plug-in parameters will be applied.
* ◎ Sum => Sum the effects of all attributes
* ◎ Maximum value => Apply only the effect of the most effective attribute
* ◎ Average => Average the effect of all attributes
*
*
* ⚫︎ Specific example
* Increases fire damage dealt by 100
* <Attribute Power: +100, Fire>
*
* Double the damage dealt by all attributes
* <attribute power: *2, all>
*
* Increases damage dealt by non-flame attribute by 1x
* <Attribute Power: +*1, !Flame>
*
* Reduced damage taken by ice and lightning attributes by 100
* <Attribute Resistance: -100, Ice, Thunder>
*
* Damage taken by all attributes 1/2
* <Attribute resistance: /2, all>
*
* Reduces damage taken by 1/2 times other than ice and lightning attributes
* <Attribute Resistance: -/2, !Ice, Thunder>
*
* Recovers when attacked by fire attribute
* <Attribute Resistance: r, Fire>
*
* Add light and dark attributes
* <Attribute added: light, dark>
*
* Make attribute calculation the multiplication destination
* <Attribute calculation: Multiply destination>
*
* Combine the effects of multiple attributes
* <Multiple attributes: Total>
* 
*
*
* ◉ Terms of Service ◉
* You can use it freely under the MIT license.
 *
 *
 *
 *
 *
 * @param property to calculate order
 * @desc Which to calculate first, multiplication or addition
 * @type select
 * @option Multiply destination
 * @option Addition destination
 * @default Multiply destination
 *
 * @param Multi-attribute calculation
 * @desc How to calculate the effect when there are multiple attributes. Can be set for each technique
 * @type select
 * @option total
 * @option Highest damage
 * @option average
 * @default total
 */
 
 
 
 
 
(() => {
    //- Plugin name
    const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
    
    
    
    
    
    
    //--  Receive parameters  --//
    
    
    const parameters = PluginManager.parameters(pluginName);
    
    const keke_elementCalcOrder = parameters["Attribute calculation order"];
    const keke_manyElementCalc = parameters["complex attribute calculation"];
    
    
    
    
    
    
    //--  Attribute full custom  --//
    
    
    //- Send attribute ID
    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        this._elementIdEddKe = this.item().damage.elementId;
        return _Game_Action_makeDamageValue.call(this, target, critical);
    };
    
    
    //- Add attribute damage to the basic damage value
    const _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula = function(target) {
        let result = _Game_Action_evalDamageFormula.call(this, target);
        const oriDamage = result;
        // get property
        const  elementId = this._elementIdEddKe;
        let elements = elementId < 0 ? this.subject().attackElements() : elementId > 0 ? [elementId] : [];
        // get additional properties
        let addElems = this.subject().totalAllMetaStringKeEmc(["Add attribute", "elemAdd"]);
        addElems = addElems.map(elem => $dataSystem.elements.indexOf(elem));
        addElems = addElems.filter(elem => elem);
        if (addElems) { elements = elements.concat(addElems); }
        // Remove duplicate attributes
        elements = elements.filter((e, i, self) => self.indexOf(e) == i);
        // Get attribute meta
        let atks = this.subject().totalAllMetaArrayKeEmc(["attribute power", "elemAtk"]);
        let defs = target.totalAllMetaArrayKeEmc(["attribute resistance", "elemDef"]);    
        // Get multiplication addition type
        let tpType = keke_elementCalcOrder;
        meta = this.subject().getMetaStrKe(this.item().note, ["attribute calculation", "elemCalc"]);
        if (meta) { tpType = meta; }
        // Meta-order sorting (power)
        atks = atks.sortByCalcSymbolKeEmc(tpType);
        // Meta-order sorting (tolerance)
        defs = defs.sortByCalcSymbolKeEmc(tpType);
        // property expansion
        const metaSet = [atks, defs];
        const pluss = [];
        const times = [];
        let reverse = false;
        elements.forEach((elemId, i) => {
            pluss[i] = 0;
            times[i] = 1;
            // Meta expansion
            metaSet.forEach((metas, type) => {
                if (!metas.length) { return; }
                const isAtk = type == 0;
                const isDef = type == 1;
                let isRev = 1;
                isRev *= oriDamage < 0 ? -1 : 1;
                metas.forEach(meta => {
                    if (!meta) { return; }
                    const strs = meta.split(",");
                    const targets = strs.slice(1);
                    const anti = targets[0].includes("!");
                    // Does the attribute match?
                    let ok = anti ? true : false;
                    let id = null;
                    for (const target of targets) {
                        if (target == "全") { ok = true;  break; }
                        id = $dataSystem.elements.indexOf(target);
                        if (elemId == id) { ok = anti ? false : true; break; }
                    }
                    if (!ok) { return; }
                    // Symbol calculation if they match
                    const calcs = strs[0].calcBySymbolKeEmc(isRev < 0, result);
                    pluss[i] += calcs[0] ? calcs[0] : 0;
                    times[i] *= calcs[1] ? calcs[1] : 1;
                    // Reverse judgment
                    reverse = reverse || (strs[0].includes("r") ? true : false);
                }, this);
            }, this); 
        }, this);
        // Reflect the attribute resistance of the feature
        elements.forEach((elemId, i) => {
            times[i] *= target.elementRate(elemId);
        }, this);
        // Get multiple attribute types
        let manyType = keke_manyElementCalc;
        meta = this.subject().getMetaStrKe(this.item().note, ["複数属性", "manyElem"]);
        if (meta) { manyType = meta; }
        // Multi-attribute effect (addition)
        result += pluss.totalByTypeKeEmc(manyType, "加算");
        // Multi-attribute effect (multiplication)
        result *= times.totalByTypeKeEmc(manyType, "乗算");
        // Set to 0 if the damage exceeds 0
        if (result * oriDamage < 0) { result = 0; }
        // reverse
        result *= reverse ? -1 : 1;
        return result;
    };
    
    
    
    
    
    
    //--  Meta string / Basic  --//
     
     
    //- Add all meta strings
    Game_Battler.prototype.totalAllMetaStringKeEmc = function(words) {
        // Init
        let data = null
        let str = "";
        // Battler value
        data = this.actorId ? this.actor() : this.enemy();
        if (data) { str += this.getMetaStrKe(data.note, words, true); }
        if (this._actorId) {
            // Occupation value
            data = this.currentClass();
            if (data) { str += this.getMetaStrKe(data.note, words, true); }
            // Equipment value
            this._equips.forEach(equip => {
                data = equip.object();
                if (data) { str += this.getMetaStrKe(data.note, words, true); }
            }, this);
        }
        // State value
        this._states.forEach(stateId => {
            data = $dataStates[stateId];
            if (data) { str += this.getMetaStrKe(data.note, words, true); }
        }, this);
        // Action value
        const actions = [BattleManager._action];
        const chainRun = BattleManager._chainRunActionKe;
        if (chainRun && chainRun != BattleManager._action) { actions.push(BattleManager._chainRunActionKe); }
        for (const action of actions) {
            if (!action) { continue; }
            data = action.item();
            if (data) { str += this.getMetaStrKe(data.note, words, true); }
        }
        // Delete space
        str = str.replace(/\s/g, "");
        // Delete the last,
        if (str.match(/,+$/)) { str = str.replace(/,+$/, ""); }
        return str.split(",");
    };
    
    //- Get meta string
    Game_Battler.prototype.getMetaStrKe= function(note, words, total = false) {
        // Init
        let str = "";
        // get calculation
        metas = $gameSystem.metaAllKeEmc(note, words);
        for (const meta of metas) {
            str += meta;
            if (total) { str += meta ? "," : ""; }
        }
        return str;
    };
    
    
    
    
    
    
    //--  Meta array / Basic  --//
    
    
    //- Add all meta arrays
    Game_Battler.prototype.totalAllMetaArrayKeEmc = function(words) {
        // Init
        let data = null
        let array = [];
        // battler value
        data = this.actorId ? this.actor() : this.enemy();
        if (data) { this.getMetaArrayKeEmc(data.note, words).forEach(e => array.push(e)); }
        if (this._actorId) {
            // class value
            data = this.currentClass();
            if (data) { this.getMetaArrayKeEmc(data.note, words).forEach(e => array.push(e)); }
            // Equipment value
            this._equips.forEach(equip => {
                data = equip.object();
                if (data) { this.getMetaArrayKeEmc(data.note, words).forEach(e => array.push(e)); }
            }, this);
        }
        // State value
        this._states.forEach(stateId => {
            data = $dataStates[stateId];
            if (data) { this.getMetaArrayKeEmc(data.note, words).forEach(e => array.push(e)); }
        }, this);
        // Action value
        const actions = [BattleManager._action];
        const chainRun = BattleManager._chainRunActionKe;
        if (chainRun && chainRun != BattleManager._action) { actions.push(BattleManager._chainRunActionKe); }
        for (const action of actions) {
            if (!action) { continue; }
            data = action.item();
            if (data) { this.getMetaArrayKeEmc(data.note, words).forEach(e => array.push(e)); }
        }
        // Delete space
        array = array.map(e => e.replace(/\s/g, ""));
        // Remove empty elements
        array = array.filter(e => e);
        return array;
    };
    
    //- Get meta array
    Game_Battler.prototype.getMetaArrayKeEmc= function(note, words) {
        return $gameSystem.metaAllKeEmc(note, words);
    };
    
    
    
    
    
    
    //--  All acquisition meta / basic  --//
     
     
    Game_System.prototype.metaAllKeEmc = function(note, words) {
        var result = [];
        words.forEach(word => {
            var regText = '\<' + word + ':([^\>]*)\>';
            var regExp_g = new RegExp(regText, 'g');
            var regExp = new RegExp(regText);
            var matches = note.match(regExp_g);
            var match = null;
            if (matches) {
                matches.forEach(function(line) {
                    result.push(line.match(regExp)[1]);
                }, this);
            }
        }, this);
        return result;
    };
    
    
    
    
    
    
    //--  Calculation Common / Basic  --//
    
    
    //- Sort by array symbol
    Array.prototype.sortByCalcSymbolKeEmc = function(type = "multiply destination") {
        array = this;
        array = array.map(a => !a.startsWith("+") && !a.startsWith("-") && !a.startsWith("*") && !a.startsWith("/") ? "+" + a : a);
        const plus = array.filter(a => a.startsWith("+") || a.startsWith("*+") || a.startsWith("/+") || a.startsWith("-") || a.startsWith("*-") || a.startsWith("/*"));
        const times = array.filter(a => (a.startsWith("*") && !a.startsWith("*+") && !a.startsWith("*-")) || (a.startsWith("/") && !a.startsWith("/+") && !a.startsWith("/-")));
        array = type == "addition destination" || type == "plus" ? plus.concat(times) : times.concat(plus);
        return array;
    }
    
    
    //- Calculation with string symbols
    String.prototype.calcBySymbolKeEmc = function(rev = false, oriVal = 0) {
        const nums = this.match(/^([\+\-\*\/]+)(\d*.?\d*)/);
        const symbol = nums[1];
        let num = Number(nums[2]) || 0;
        let plus = null;
        let times = null;
        if (symbol == "+" || symbol == "-") {
            num *= rev ? -1 : 1;
            num *= symbol == "-" ? -1 : 1;
            plus = num;
        } else if ((symbol.includes("+") || symbol.includes("-")) && (symbol.includes("*") || symbol.includes("/"))) {
            num =  symbol.includes("/") ? oriVal / num : oriVal * num;
            num *= rev ? -1 : 1;
            num *=  symbol.includes("-") ? -1 : 1;
            plus = num;
        } else {
            times = symbol == "/" ? 1 / num : num;
        }
        return [plus, times]
    };
    
    
    //- Total by type of array
    Array.prototype.totalByTypeKeEmc = function(type = "total", calc = "addition") {
        let total = calc == "multiplication" ? 1 : 0;
        const array = this;
        for (const val of array) {
            if (type == "highest value" || type == "total") {
                if (val > 0) { total = Math.max(val, total); }
                if (val < 0) { total = Math.min(val, total); }
            } else if (type == "average" || type == "average") {
                total += val;
            } else {
                if (calc == "Addition") { total += val;} else { total *= val; }
            }
        }
        if (type == "average" || type == "average") { total /= array.length; }
        return total;
    };
        
})();