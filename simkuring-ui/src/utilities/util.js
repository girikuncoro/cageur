export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export function compare(a,b) {
  // c: object property
  let c = 'value';
  if (a[c] < b[c])
    return -1;
  if (a[c] > b[c])
    return 1;
  return 0;
}
