export function checkPrimeNumber(num) {
  if (num < 2) return false;

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }

  return true;
}

export function generatePrimeNumbers(from = 1, to = 10) {
  if (to < 2 || from > to) return [];

  const sieve = new Array(to + 1).fill(true);
  sieve[0] = sieve[1] = false;

  for (let i = 2; i <= Math.sqrt(to); i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= to; j += i) {
        sieve[j] = false;
      }
    }
  }

  const primes = [];
  for (let i = Math.max(2, from); i <= to; i++) {
    if (sieve[i]) {
      primes.push(i);
    }
  }

  return primes;
}
