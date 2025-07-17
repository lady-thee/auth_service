/**
 * Utility functions for APIs
 *
 * This module provides various utility functions that can be used across different APIs.
 * It includes functions for generating unique IDs, validating email addresses, and formatting dates.
 * Generates a standardized response object for API responses.
 *
 * @param {StatusCode} statusCode - The HTTP status code for the response.
 * @param {string} message - A message describing the response.
 * @param {object} [data] - Optional data to include in the response.
 * @param {number} [totalCount] - Optional total count of items (for pagination).
 * @param {number} [page] - Optional current page number (for pagination).
 * @param {number} [itemSize] - Optional size of each page (for pagination).
 * @param {StatusMesssage} [error] - Optional error message if applicable.
 * @returns {object} The standardized response object.
 */

import { ServerHTTPResponse } from './interfaces/respose.interface';

export enum StatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum StatusMesssage {
  SUCCESS = 'SUCCESSFUL',
  CREATED = 'CREATED',
  NO_CONTENT = 'NO CONTENT',
  BAD_REQUEST = 'BAD REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL SERVER ERROR',
}

export const StatusCode_ErrorMessage = {
  [StatusCode.OK]: StatusMesssage.SUCCESS,
  [StatusCode.Created]: StatusMesssage.CREATED,
  [StatusCode.NoContent]: StatusMesssage.NO_CONTENT,
  [StatusCode.BadRequest]: StatusMesssage.BAD_REQUEST,
  [StatusCode.Unauthorized]: StatusMesssage.UNAUTHORIZED,
  [StatusCode.Forbidden]: StatusMesssage.FORBIDDEN,
  [StatusCode.NotFound]: StatusMesssage.NOT_FOUND,
  [StatusCode.InternalServerError]: StatusMesssage.INTERNAL_SERVER_ERROR,
};
// if total_count is not None and page is not None and page_size is not None:
//     data = {
//         "count": total_count,
//         "page": page,
//         "next": page + 1 if total_count > page * page_size else None,
//         "previous": page - 1 if page > 1 else None,
//         "total_pages": (total_count + page_size - 1) // page_size,
//         "results": data,  # The actual data (i.e., list of items)
//     }

// response_content = {
//     "status": error.value,
//     "message": message,
//     "data": data,
//     "error": error.value if error else None,
// }

export function get_response(
  statusCode: StatusCode,
  message: string,
  data?: object,
  totalCount?: number,
  page?: number,
  itemSize?: number,
  error?: StatusMesssage,
): ServerHTTPResponse {
  if (!error && statusCode in Object(StatusCode_ErrorMessage)) {
    error = StatusCode_ErrorMessage[statusCode];
  }

  if (
    totalCount !== undefined &&
    page !== undefined &&
    itemSize !== undefined
  ) {
    data = {
      count: totalCount,
      page: page,
      next: totalCount > page * itemSize ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
      total_pages: Math.ceil(totalCount / itemSize),
      results: data, // The actual data (i.e., list of items)
    };
  }

  const response_obj = {
    status: statusCode,
    message: message,
    data: data || {},
    error: error || null,
  };

  return response_obj;
}
