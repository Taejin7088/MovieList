const st = (n) => {
  let str = ""
  for (let i = 0; i < n / 2; i++) {
    str += "수박"
  }
  if (n % 2 !== 0) str.slice(0, -1);
  return str;
}

console.log(st(10));
