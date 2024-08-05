import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EUser } from 'src/app/user/db/entity/user.entity';

export const Jwt = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();  
  const eUser = new EUser();
  if (request.user) {
    eUser.no = request.user.no;
    eUser.snsNo = request.user.snsNo;
    eUser.userId = request.user.userId;
    return eUser;
  }
  
  return null;
});