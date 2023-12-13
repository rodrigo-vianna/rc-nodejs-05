import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>()
    return request.user as UserPayload
  },
)
