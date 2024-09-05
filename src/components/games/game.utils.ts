export function generateRandomNumber(length: number) {
  let rnd = "";

  // Generate the first digit separately to ensure it is not '0'
  while (rnd.length === 0) {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // Generates a number between 1 and 9
    rnd += firstDigit.toString();
  }

  // Generate the rest of the digits
  while (rnd.length < length) {
    const newNumber = Math.floor(Math.random() * 10).toString();

    if (newNumber !== rnd[rnd.length - 1]) {
      rnd += newNumber;
    }
  }

  return parseInt(rnd, 10);
}