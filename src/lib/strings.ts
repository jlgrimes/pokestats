export const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1, word.length).toLowerCase();

export const capitalizeEveryPhrase = (word: string) => word.split(' ').map((phrase) => capitalize(phrase)).join(' ');

export function ordinalSuffixOf(i: number) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

export function parseUsername(email: string) {
    return email?.split('@')[0];
}