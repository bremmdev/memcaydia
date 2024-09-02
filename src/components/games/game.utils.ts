export function generateRandomNumber(length: number) {
  let rnd = "";

  //don't allow the same number to be repeated
  while (rnd.length < length) {
    const newNumber = Math.floor(Math.random() * 10).toString();

    if (rnd.length > 0) {
      const lastNumber = rnd[rnd.length - 1];

      if (newNumber === lastNumber) {
        continue;
      }
    }

    rnd += newNumber;
  }

  return parseInt(rnd);
}
