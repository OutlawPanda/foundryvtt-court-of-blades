export class BladesLookup {

  static terms = [
    {
      aliases: ["ARREST"],
      details: "Bluecoats send detail to arrest you (scale = Shame LEVEL). Pay them off with Influence = Shame LEVEL, hand someone over for arrest, or attempt to evade them."
    },
    {
      aliases: ["COOPERATION"],
      details: "+3 status faction asks for a favor. Agree to do it, -1 Favor per Tier of friendly faction, or -1 status with friendly faction."
    },
    {
      aliases: ["DEMONIC NOTICE"],
      details: "Demon approaches house with a dark offer. Accept bargain, hide until it loses interest (-3 Favor), or deal with it another way."
    },
    {
      aliases: ["FLIPPED"],
      details: "Contact, patron, client, or group of customers is loyal to another gang now."
    },
    {
      aliases: ["GANG TROUBLE"],
      details: "Gang or cohort causes trouble. Lose Favor = TIER +1, make an example of one of the gang members, or face reprisals."
    },
    {
      aliases: ["INTERROGATION"],
      details: "Bluecoats round up a PC for questioning. How did they manage to capture you? Pay them with with 3 Influence, or they beat you up for 2 HARM + you tell them what they want to know for +3 Exposure. (Effects can be resisted separately.)"
    },
    {
      aliases: ["QUESTIONING"],
      details: "Bluecoats round up NPC house member or contact for questioning. Who do the Bluecoats think is most vulnerable? Make a fortune roll (1-3: +2 Exposure, 4/5: +1 Exposure) or pay them off with 2 Influence."
    },
    {
      aliases: ["REPRISALS"],
      details: "Enemy faction makes a move against you. Pay 1 Favor or 1 Influence, allow them to mess with yours, or fight back."
    },
    {
      aliases: ["RIVALS"],
      details: "Neutral faction threaten you, a friend, a contact, or vice purveyor. Forfeit 1 Favor or 1 Influence per rival Tier, or stand up to them and -1 faction status."
    },
    {
      aliases: ["SHOW OF FORCE"],
      details: "Faction with negative faction status targets your holdings. Lose 1 claim or go to war (drop to -3 status). If you have no claims, lose 1 hold."
    },
    {
      aliases: ["UNQUIET DEAD"],
      details: "Rogue spirit is drawn to you. Need Kiss or Rail Jack (as an asset) to deal with it, or deal with it yourself."
    },
    {
      aliases: ["USUAL SUSPECTS"],
      details: "Bluecoats grab someone in the periphery of house for questioning. Whose friend or vice purveyor is most likely to be taken? Make a fortune roll (1-3: +2 Exposure, 4/5: level 2 HARM) or pay them off with 1 Influence."
    }
  ];

  static getTerm(name){
    let matchingTerm = this.terms.find(term => term.aliases.map(alias => alias.toUpperCase()).includes(name.toUpperCase()));
    return matchingTerm.details;
  }
}
