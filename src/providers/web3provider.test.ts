import { ethers } from "ethers";
import Web3Provider from "./web3provider";

test("can be instanced", () => {
  const provider = new Web3Provider();
  expect(provider).toBeTruthy();
});

test("should have request method", () => {
  const provider = new Web3Provider();
  expect(provider).toHaveProperty("request");
});

test("should have event listener", () => {
  const provider = new Web3Provider();
  expect(provider).toHaveProperty("on");
});

test("should can remove event listener", () => {
  const provider = new Web3Provider();
  expect(provider).toHaveProperty("removeListener");
});

test("pass ethers test", () => {
  const provider = new Web3Provider();
  const p = new ethers.providers.Web3Provider(provider);
  console.log("web3provider.test--method, params", p.getSigner());
  expect(p).toBeTruthy();
});

export default {};
