export const pengImIPAMap: Record<string, string> = {
  b: "p",
  p: "pʰ",
  bh: "b",
  d: "t",
  t: "tʰ",
  z: "ts",
  c: "tsʰ",
  g: "k",
  k: "kʰ",
  gh: "g",
  // Final should take care of this
  // "-h": "ʔ", // Final only
  m: "m",
  n: "n",
  ng: "ŋ",
  s: "s",
  h: "h",
  r: "z",
  l: "l",
  a: "a",
  o: "o",
  i: "i",
  u: "u",
  e: "ɯ",
  ê: "e",
};

export const pengImIPAMapFinals: Record<string, string> = {
  a: "a",
  ah: "aʔ",
  am: "am",
  ab: "ap",
  ang: "aŋ",
  ag: "ak",
  an: "ã",
  ai: "ai",
  ain: "ãĩ",
  ao: "au",
  aoh: "auʔ",
  aon: "ãũ",
  ê: "e",
  êh: "eʔ",
  êng: "eŋ",
  êg: "ek",
  ên: "ẽ",
  i: "i",
  ih: "iʔ",
  im: "im",
  ib: "ip",
  ing: "iŋ",
  ig: "ik",
  in: "ĩ",
  ia: "ia",
  iah: "iaʔ",
  iam: "iam",
  iab: "iap",
  iang: "iaŋ",
  iag: "iak",
  ian: "ĩã",
  iê: "ie",
  io: "io",
  iêh: "ieʔ",
  ioh: "ioʔ",
  iêng: "ieŋ",
  iong: "ioŋ",
  iêg: "iek",
  iog: "iok",
  iên: "ĩẽ",
  ion: "ĩõ",
  iou: "iou",
  iu: "iu",
  iun: "ĩũ",
  o: "o",
  oh: "oʔ",
  ong: "oŋ",
  og: "ok",
  on: "õ",
  oi: "oi",
  oih: "oiʔ",
  oin: "õĩ",
  ou: "ou",
  oun: "õũ",
  u: "u",
  uh: "uʔ",
  ung: "uŋ",
  ug: "uk",
  ua: "ua",
  uah: "uaʔ",
  uam: "uam",
  uab: "uap",
  uang: "uaŋ",
  uag: "uak",
  uan: "ũã",
  uai: "uai",
  uê: "ue",
  uêh: "ueʔ",
  uên: "ũẽ",
  ui: "ui",
  uin: "ũĩ",
  uain: "ũãĩ",
  e: "ɯ",
  eh: "ɯʔ",
  eng: "ɯŋ",
  eg: "ɯk",
  en: "ɯ̃",
  m: "m",
  ng: "ŋ",
};

export const syllables = [
  "iang",
  "iêng",
  "iong",
  "ieun",
  "ieuh",
  "uang",
  "uain",
  "uêng",
  "ang",
  "eng",
  "êng",
  "ing",
  "ong",
  "ung",
  "ain",
  "aon",
  "aoh",
  "iem",
  "ian",
  "ieb",
  "iag",
  "iah",
  "iên",
  "iêg",
  "iêh",
  "iog",
  "ieu",
  "iun",
  "iuh",
  "oin",
  "oih",
  "oun",
  "uam",
  "uan",
  "uab",
  "uag",
  "uah",
  "uai",
  "uên",
  "uêg",
  "uêh",
  "uin",
  "am",
  "an",
  "ab",
  "ag",
  "ah",
  "eg",
  "ên",
  "êk",
  "êh",
  "im",
  "in",
  "ib",
  "ig",
  "ih",
  "og",
  "oh",
  "ug",
  "uh",
  "ai",
  "ao",
  "ia",
  "iê",
  "iu",
  "oi",
  "ou",
  "ua",
  "uê",
  "ui",
  "a",
  "e",
  "ê",
  "i",
  "o",
  "u",
];

export const checkAgsinstFinals = function (
  str: string,
  count: number
): [string, string] | null {
  if (str.length === 0 || count === 0) {
    return null;
  }
  // Keep going down if length is not enough
  if (str.length < count) {
    return checkAgsinstFinals(str, count - 1);
  }

  const substring = str.substr(str.length - count);
  if (pengImIPAMapFinals[substring]) {
    return [substring, pengImIPAMapFinals[substring]];
  }
  return checkAgsinstFinals(str, count - 1);
};

export const convertPemgImToIPA = function (str: string): string {
  const numberSuffix = str.match(/\d$/g);
  const consonantStr = str.replace(/\d$/g, "");

  // 4 is the length of the longest substring
  const suffix = checkAgsinstFinals(consonantStr, 4);

  let subString: string;
  if (suffix) {
    subString = consonantStr.substring(
      0,
      consonantStr.length - suffix[0].length
    );
  } else {
    subString = consonantStr;
  }

  const prefix = subString
    .split("")
    .reverse()
    .map((l) => {
      return pengImIPAMap[l];
    })
    .join("");

  return (
    prefix +
    ((suffix && suffix[1]) || "") +
    ((numberSuffix && numberSuffix[0]) || "")
  );
};
