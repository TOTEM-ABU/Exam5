// tg.module.ts
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/tools/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/tools/prisma/prisma.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token:
        process.env.TELEGRAM_BOT_TOKEN ||
        '7844620475:AAHQzpipVeeYhlAU0rlfc57xtzyO32dwCJ0',
      middlewares: [session()],
    }),
  ],
  providers: [UserService, MailService, PrismaService, JwtService],
})
export class TgModule {}
