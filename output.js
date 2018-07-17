export async function* act321() {
  let __speaker;
  sm.hide("Aya");
  await sm.createLabel({[`label`]:`test`,[`text`]:`Please click me ${name} \``,[`font`]:`Puritain-Bold`,[`fontSize`]:16,});
}
export async function* index() {
  let __speaker;
  await sm.createCharacter({[`character`]:`Aya`,[`name`]:`aya`,[`displayName`]:`Aya Shameimaru`,[`color`]:`Yellow`,});
  sm.scene(`Black`);
  sm.show("Aya", {[`show`]:`Aya`,[`x`]:100,[`y`]:100,[`position`]:[`stageLeft`,`invisible`,],});
  __speaker = Aya;
  sm.say(__speaker, `How on this planet earth did I get $e+here$e- ...?`); yield sm.firstDown();
  sm.show("Aya", {[`show`]:`Aya`,[`position`]:[`center`,`visible`,],});
  sm.say(__speaker, `Oh goodness, I appear to be completely lost!`); yield sm.firstDown();
  yield sm.choices("flag", { [`choice`]: `flag`, [`choice_1`]: `What on this planet ${earth} are you thinking?`, [`choice_${2}`]: `I'll help you out! I swear!` });
}