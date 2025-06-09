import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/tools/mail/mail.service';
import { TgService } from './bot.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '7844620475:AAHQzpipVeeYhlAU0rlfc57xtzyO32dwCJ0',
      middlewares: [session()],
    }),
  ],
  providers: [UserService, MailService, TgService],
})
export class TgModule {}
