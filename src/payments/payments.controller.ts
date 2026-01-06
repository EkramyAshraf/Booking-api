import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/users/auth/decorators/roles.decorator';
import { RoleGuards } from 'src/guards/roles.guard';
import { CurrentUser } from 'src/users/auth/decorators/currentUser.decorator';

import express from 'express';
import { Request } from 'express';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @Get('/checkout-session/:bookingId')
  async checkoutSession(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Req() req: express.Request,
  ) {
    const protocol = req.protocol;
    const host = req.get('host');
    return await this.paymentsService.checkoutSession(
      user._id,
      bookingId,
      protocol,
      host,
    );
  }

  @Post('/webhook-checkout')
  async webhookCheckout(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    await this.paymentsService.webhookCheckout(req, res);
  }
}
