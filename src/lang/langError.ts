import { RegisteredError } from "@/types/errors";
import { lang } from "@/lang";
import type { IEntity } from "@/settings/entities";
import { capitalize } from "lodash";

export default {
  clientDuplicate: "Client with same name already exists",
  duplicateFound: "Duplicate found",
  entityWithSameNameExists: (name: IEntity): string =>
    `${lang.entity[name]} with the same name already exists`,
  entityShouldNotBeEmpty: (name: IEntity): string =>
    `${lang.entity[name]} should not be empty`,
  fieldError: (fieldName: string): string =>
    `${capitalize(fieldName)} is incorrect`,
  loginFailed: "Login failed",
  notCopiedToClipboard: (entityLabel: string) =>
    `${entityLabel} not copied to clipboard`,
  unknownError: "Unknown error",
  registeredErrors: {
    [RegisteredError.UnknownError]: "Something went wrong",
    [RegisteredError.ServerNotAccessible]: "Server is not accessible",
  },
  registerFailed: "User registration failed",
  secretKeyIsNotDefined: "Secret key is not defined",
  secretKeyIsWrong: "Secret key is wrong",
};
