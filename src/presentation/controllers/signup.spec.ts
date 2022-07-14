import { SignUpController } from "./signup";
import { MissingParamError } from "../errors/missing-param-error";

const makeSut = (): SignUpController => {
  return new SignUpController();
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    //system under test
    const sut = makeSut();
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
    const sut = makeSut();
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

  test("Should return 400 if no password is provided", () => {
    //system under test
    const sut = makeSut();
    const httpRequest = {
      statusCode: 400,
      body: {
        name: "name",
        email: "email",
        passwordConfirm: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no password confirmation is provided", () => {
    //system under test
    const sut = makeSut();
    const httpRequest = {
      statusCode: 400,
      body: {
        name: "name",
        email: "email",
        password: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
});
