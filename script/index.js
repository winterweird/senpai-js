import act_1 from "./acts/act-1";

export function* index(__testAPI) {
  const characters = {
    Aya: new Character({
      name: "aya",
      displayName: "Aya Shameimaru",
      color: "black",
    }),
  };
  go(act_1, characters);
}