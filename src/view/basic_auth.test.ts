import { verifyBasicAuth } from "./basic_auth";

const DummyUser = "vOTB98g3vkWdKj8l0N34t8u2"
const DummyPass = "N4Lc9fpFSkLs0cLZ3vvGxj8M"
const DummyToken = "dk9UQjk4ZzN2a1dkS2o4bDBOMzR0OHUyOk40TGM5ZnBGU2tMczBjTFozdnZHeGo4TQ=="

describe("Basic Auth", () => {
  describe("Required", () => {
    it("Use valid authorization header value", () => {
      process.env.BASIC_AUTH_USER = DummyUser
      process.env.BASIC_AUTH_PASS = DummyPass
      expect(verifyBasicAuth(`Basic ${DummyToken}`)).toBe(true);
    });

    it("Use invalid authorization header value", () => {
      process.env.BASIC_AUTH_USER = DummyUser
      process.env.BASIC_AUTH_PASS = DummyPass
      expect(verifyBasicAuth(`Basic AA${DummyToken}`)).toBe(false);
    });

    it("Use empty authorization header value", () => {
      process.env.BASIC_AUTH_USER = DummyUser
      process.env.BASIC_AUTH_PASS = DummyPass
      expect(verifyBasicAuth("")).toBe(false);
    });
  })

  describe("Not required", () => {
    it("Use valid authorization header value", () => {
      process.env.BASIC_AUTH_USER = ""
      process.env.BASIC_AUTH_PASS = ""
      expect(verifyBasicAuth(`Basic ${DummyToken}`)).toBe(true);
    });

    it("Use invalid authorization header value", () => {
      process.env.BASIC_AUTH_USER = ""
      process.env.BASIC_AUTH_PASS = ""
      expect(verifyBasicAuth(`Basic AA${DummyToken}`)).toBe(true);
    });

    it("Use empty authorization header value", () => {
      process.env.BASIC_AUTH_USER = ""
      process.env.BASIC_AUTH_PASS = ""
      expect(verifyBasicAuth("")).toBe(true);
    });
  })
})
