import { celebrate, Joi, Segments } from 'celebrate'
import { AuthedSessionData } from 'express-session'
import { StatusCodes } from 'http-status-codes'

import { createLoggerWithLabel } from '../../config/logger'
import { createReqMeta } from '../../utils/request'
import { ControllerHandler } from '../core/core.types'
import { findUserByApiKey } from '../user/user.service'

import { isUserInSession } from './auth.utils'

const logger = createLoggerWithLabel(module)
const BEARER_STRING = 'Bearer'
const BEARER_SEPARATOR = ' '

/**
 * Middleware that only allows authenticated users to pass through to the next
 * handler.
 * @returns next if user exists in session
 * @returns 401 if user does not exist in session
 */
export const withUserAuthentication: ControllerHandler = (req, res, next) => {
  if (isUserInSession(req.session)) {
    return next()
  }

  return res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: 'User is unauthorized.' })
}

/**
 * Logs all admin actions which change database state (i.e. non-GET requests)
 * @returns next
 */
export const logAdminAction: ControllerHandler<{ formId: string }> = async (
  req,
  res,
  next,
) => {
  const sessionUserId = (req.session as AuthedSessionData).user._id
  const body = req.body
  const method = req.method
  const query = req.query
  const { formId } = req.params

  if (req.method.toLowerCase() !== 'get') {
    logger.info({
      message: 'Admin attempting to make changes',
      meta: {
        action: 'logAdminAction',
        method,
        ...createReqMeta(req),
        sessionUserId,
        formId,
        query,
        body,
      },
    })
  }

  return next()
}

export const validateCheckUserParams = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Please enter a valid email')
      .lowercase(),
  }),
})

export const validateLoginSendOtpParams = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Please enter a valid email')
      .lowercase(),
  }),
})

export const validateVerifyOtpParams = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Please enter a valid email')
      .lowercase(),
    otp: Joi.string()
      .required()
      .regex(/^\d{6}$/)
      .message('Please enter a valid OTP'),
  }),
})

/**
 * Middleware that only allows users with a valid bearer token to pass through to the next handler
 */
export const authenticateApiKey: ControllerHandler<unknown, unknown, any> = (
  req,
  res,
  next,
) => {
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Authorisation header is missing' })
  }
  const [bearerString, apiKey] = authorizationHeader.split(BEARER_SEPARATOR)
  if (bearerString !== BEARER_STRING) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid authorisation header format' })
  }
  try {
    const user = findUserByApiKey(apiKey)
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Invalid API key' })
    }
    // req.body.userId = user._id
    return next()
  } catch {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid API key' })
  }
}
