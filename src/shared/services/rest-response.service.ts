import { ValidationError } from 'class-validator';
import { ResponseError } from '../interfaces/response-error.interface';

export class RestResponseService {
  /**
   * build response error
   * @param status - http status code
   * @param message - message
   * @param errors - error message
   * @returns Response error
   */
  static buildResponseError(
    status: number,
    message: string,
    errors: Record<string, any> | string,
  ): ResponseError {
    return {
      status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * transforms class validator error to key value pair
   * @param validationErrors - ValidationError array from class validator
   * @returns transforms into key value pair error
   */
  static transformValidationError(
    validationErrors: Array<ValidationError>,
  ): Record<string, any> {
    const errors = {};

    validationErrors
      .map((error) => this.mapChildrenToValidationErrors(error))
      .flat()
      .filter((item) => !!item.constraints)
      .map((item) => {
        return {
          [item.property]: Object.values(item.constraints)[0],
        };
      })
      .map((item) => Object.assign(errors, item));

    return errors;
  }

  /**
   * maps validation error children to validation errors
   * @param error - ValidationError object
   * @returns children mapped to the validation error object
   */
  private static mapChildrenToValidationErrors(
    error: ValidationError,
  ): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }
    const validationErrors = [];
    for (const item of error.children) {
      if (item.children && item.children.length) {
        validationErrors.push(...this.mapChildrenToValidationErrors(item));
      }
      validationErrors.push(this.prependConstraintsWithParentProp(error, item));
    }
    return validationErrors;
  }

  /**
   * Prepend validator error constraints with the Parent
   * @param parentError - Parent ValidationError
   * @param error - Child ValidationError
   * @returns constraints mapped with the Parent object
   */
  private static prependConstraintsWithParentProp(
    parentError: ValidationError,
    error: ValidationError,
  ): ValidationError {
    const constraints = {};
    for (const key in error.constraints) {
      constraints[key] = `${parentError.property}.${error.constraints[key]}`;
    }

    return {
      ...error,
      property: parentError.property,
      constraints,
    };
  }
}
