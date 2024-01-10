const test = {
  prop: 42,
  function blah() {
    return this.prop;
  },
};

console.log(test.func());
// Expected output: 42


