import { Box } from '@catniplabs/box';

export class DomainError extends Box.HttpError {
  public constructor(
    message: string,
    code: string,
    status: number = Box.HttpStatus.BAD_REQUEST,
  ) {
    super(status, message, code);
  }
}

export class NotFoundError extends DomainError {
  public constructor(resource: string, id: string) {
    super(
      `${resource} with id ${id} not found`,
      `${resource.toLowerCase()}_not_found`,
      Box.HttpStatus.NOT_FOUND,
    );
  }
}

export class ValidationError extends DomainError {
  public constructor(message: string) {
    super(message, 'validation_error', Box.HttpStatus.BAD_REQUEST);
  }
}
