/**
 * Roll Dice.
 * @param {int} dice_amount 
 * @param {string} attribute_name 
 * @param {string} position
 * @param {string} effect
 */
export async function bladesRoll(dice_amount, attribute_name = "", position = "risky", effect = "standard") {

  // ChatMessage.getSpeaker(controlledToken)
  let zeromode = false;
  
  if ( dice_amount < 0 ) { dice_amount = 0; }
  if ( dice_amount == 0 ) { zeromode = true; dice_amount = 2; }

  let r = new Roll( `${dice_amount}d6`, {} );

  // show 3d Dice so Nice if enabled
  r.evaluate({async:true});
  await showChatRollMessage(r, zeromode, attribute_name, position, effect);
}

/**
 * Shows Chat message.
 *
 * @param {Roll} r 
 * @param {Boolean} zeromode
 * @param {String} attribute_name
 * @param {string} position
 * @param {string} effect
 */

// TODO: add rolls for downtime activities:
// Acquire asset (tier roll)
// Recover (clock roll)
// Reduce heat (action roll)
// Indulge Vice (clear stress = result)

async function showChatRollMessage(r, zeromode, attribute_name = "", position = "", effect = "") {
  
  let speaker = ChatMessage.getSpeaker();
  let rolls = (r.terms)[0].results;
  let attribute_label = BladesHelpers.getAttributeLabel(attribute_name);

  // Retrieve Roll status.
  let roll_status = getBladesRollStatus(rolls, zeromode);

  let result;
  if (BladesHelpers.isAttributeAction(attribute_name)) {
    let position_localize = '';
    switch (position) {
      case 'controlled':
        position_localize = 'COB.PositionControlled'
        break;
      case 'desperate':
        position_localize = 'COB.PositionDesperate'
        break;
      case 'risky':
      default:
        position_localize = 'COB.PositionRisky'
    }

    let effect_localize = '';
    switch (effect) {
      case 'limited':
        effect_localize = 'COB.EffectLimited'
        break;
      case 'great':
        effect_localize = 'COB.EffectGreat'
        break;
      case 'standard':
      default:
        effect_localize = 'COB.EffectStandard'
    }

    result = await renderTemplate("systems/court-of-blades/templates/chat/action-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, position: position, position_localize: position_localize, effect: effect, effect_localize: effect_localize});
  } else {
    let stress = getBladesRollStress(rolls, zeromode);
    
    result = await renderTemplate("systems/court-of-blades/templates/chat/resistance-roll.html", {rolls: rolls, roll_status: roll_status, attribute_label: attribute_label, stress: stress});
  }

  let messageData = {
    speaker: speaker,
    content: result,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: r
  }

  CONFIG.ChatMessage.documentClass.create(messageData, {})
}

/**
 * Get status of the Roll.
 *  - failure
 *  - partial-success
 *  - success
 *  - critical-success
 * @param {Array} rolls 
 * @param {Boolean} zeromode 
 */
export function getBladesRollStatus(rolls, zeromode = false) {

  // Sort roll values from lowest to highest.
  let sorted_rolls = rolls.map(i => i.result).sort();

  let roll_status = "failure"

  if (sorted_rolls[0] === 6 && zeromode) {
    roll_status = "critical-success";
  }
  else {
    let use_die;
    let prev_use_die = false;

    if (zeromode) {
      use_die = sorted_rolls[0];
    }
    else {
      use_die = sorted_rolls[sorted_rolls.length - 1];

      if (sorted_rolls.length - 2 >= 0) {
        prev_use_die = sorted_rolls[sorted_rolls.length - 2]
      }
    }

    // 1,2,3 = failure
    if (use_die <= 3) {
      roll_status = "failure";
    }
    // if 6 - check the prev highest one.
    else if (use_die === 6) {
      // 6,6 - critical success
      if (prev_use_die && prev_use_die === 6) {
        roll_status = "critical-success";
      }
      // 6 - success
      else {
        roll_status = "success";
      }
    }
    // else (4,5) = partial success
    else {
      roll_status = "partial-success";
    }

  }

  return roll_status;

}
/**
 * Get stress of the Roll.
 * @param {Array} rolls 
 * @param {Boolean} zeromode 
 */
export function getBladesRollStress(rolls, zeromode = false) {

  var stress = 6;

  // Sort roll values from lowest to highest.
  let sorted_rolls = rolls.map(i => i.result).sort();

  let roll_status = "failure"

  if (sorted_rolls[0] === 6 && zeromode) {
    stress = -1;
  }
  else {
    let use_die;
    let prev_use_die = false;

    if (zeromode) {
      use_die = sorted_rolls[0];
    }
    else {
      use_die = sorted_rolls[sorted_rolls.length - 1];

      if (sorted_rolls.length - 2 >= 0) {
        prev_use_die = sorted_rolls[sorted_rolls.length - 2]
      }
    }

    if (use_die === 6 && prev_use_die && prev_use_die === 6) {
      stress = -1;
    } else {
      stress = 6 - use_die;
    }

  }

  return stress;

}


/**
 * Call a Roll popup.
 */
export async function simpleRollPopup() {
  
  new Dialog({
    title: `Simple Roll`,
    content: `
      <h2>${game.i18n.localize("COB.RollSomeDice")}</h2>
      <p>${game.i18n.localize("COB.RollTokenDescription")}</p>
      <form>
        <div class="form-group">
          <label>${game.i18n.localize("COB.RollNumberOfDice")}:</label>
          <select id="qty" name="qty">
            ${Array(11).fill().map((item, i) => `<option value="${i}">${i}d</option>`).join('')}
          </select>
        </div>
      </form>
    `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Roll`,
        callback: async (html) => {
          let diceQty = html.find('[name="qty"]')[0].value;  
          await bladesRoll(diceQty);
        },
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: game.i18n.localize('Cancel'),
      },
    },
    default: "yes"
  }).render(true);
}
