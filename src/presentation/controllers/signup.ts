import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
} from "../protocols";
import { badRequest, serverError } from "../helpers/http-helper";
import { MissingParamError, InvalidParamError } from "../errors";
import { AddAccount } from "../../domain/usecases/add-account";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      if (httpRequest.body.password != httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }

      this.addAccount.add({
        name: "name",
        email: "email@email.com",
        password: "password",
      });
    } catch (error) {
      return serverError();
    }
  }
}
