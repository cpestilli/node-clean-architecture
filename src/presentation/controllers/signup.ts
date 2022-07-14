import { HttpResponse, HttpRequest } from "../protocols/http";
import { badRequest } from "../helpers/http-helper";
import { MissingParamError } from "../errors/missing-param-error";
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpRequest {
    // if (!httpRequest.body.name) {
    //   return badRequest(new MissingParamError("name"));
    // }

    // if (!httpRequest.body.email) {
    //   return badRequest(new MissingParamError("email"));
    // }

    const requiredFields = ["name", "email"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
