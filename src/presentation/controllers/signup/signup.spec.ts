import { SignUpController } from "./signup";
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from "../../errors";
import {
  EmailValidator,
  AddAccount,
  AccountModel,
  AddAccountModel,
} from "./signup-protocols";

//factory
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

//factory
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

//factory
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

//factory
const makeSut = (): SutTypes => {
  /* Removido stub para uma factory */
  // class EmailValidatorStub implements EmailValidator {
  //   isValid(email: string): boolean {
  //     return true;
  //   }
  // }
  // const emailValidatorStub = new EmailValidatorStub();

  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name is provided", () => {
    //system under test
    const { sut } = makeSut();
    const httpRequest = {
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
    const { sut } = makeSut();
    const httpRequest = {
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
    const { sut } = makeSut();
    const httpRequest = {
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
    const { sut } = makeSut();
    const httpRequest = {
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

  test("Should return 400 if an invalid email is provided", () => {
    //system under test
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: "name",
        email: "email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should return 400 if no password confirmation is provided", () => {
    //system under test
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "name",
        email: "email@mail.com",
        password: "password",
        passwordConfirmation: "password_invalid",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });

  test("Should call email validator with correct email", () => {
    //system under test
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("email@email.com");
  });

  test("Should return 500 if emailValidator throws (using factory to instance it stub)", () => {
    const emailValidatorStub = makeEmailValidatorWithError();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    jest.spyOn(emailValidatorStub, "isValid");

    const httpRequest = {
      body: {
        name: "name",
        email: "email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if emailValidator throws (using jest mock to mocking stub", () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: "name",
        email: "email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if AddAccount throws error", () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: "name",
        email: "email@mail.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should call AddAccount with correct values", () => {
    //system under test
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password",
      },
    };
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "name",
      email: "email@email.com",
      password: "password",
    });
  });

  test("Should return 200 if addAccount data is valid", () => {
    //system under test
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    });
  });
});
