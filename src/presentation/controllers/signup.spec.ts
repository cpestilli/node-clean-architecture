import { SignUpController } from "./signup";
import { MissingParamError } from "../errors/missing-param-error";

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    //system under test
    const sut = new SignUpController();
    const httpRequest = {
      statusCode: 400,
      body: {
        email: "email",
        password: "password",
        passwordConfirm: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", () => {
    //system under test
    const sut = new SignUpController();
    const httpRequest = {
      statusCode: 400,
      body: {
        name: "name",
        password: "password",
        passwordConfirm: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
});
