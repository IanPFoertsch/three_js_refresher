expect.extend({
  toEqualZero(received) {
    if (received === 0) {
      return {
        pass: true,
        message: () => { return `Expected ${received} to equal zero` },
      }
    } else {
      return {
        pass: false,
        message: () => { return `Expected ${received} to equal zero` },
      }
    }
  },
});