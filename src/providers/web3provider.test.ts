import Web3Provider from "./web3provider";

test("can be instanced", () => {
  const provider = new Web3Provider();
  expect(provider).toBeTruthy();
});

export default {};
