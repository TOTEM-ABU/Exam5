// import {
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { PrismaService } from 'src/tools/prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';
// import { MailService } from 'src/tools/mail/mail.service';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { CreateAdminDto } from 'src/user/dto/create-admin.dto';
// import { LoginUserDto } from 'src/user/dto/login-user.dto';
// import { VerifyOtpDto } from 'src/user/dto/verify-otp';
// import { ResendOtpDto } from 'src/user/dto/resend-otp-.dto';
// import { UpdatePasswordDto } from 'src/user/dto/update-password';
// import { RefreshTokenDto } from 'src/user/dto/refresh-token.dto';
// import { UpdateUserDto } from 'src/user/dto/update-user.dto';
// import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
// import { Context } from 'telegraf';
// import * as bcrypt from 'bcrypt';

// @Update()
// @Injectable()
// export class TgService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly jwt: JwtService,
//     private readonly mailer: MailService,
//   ) {}

//   private generateOTP(length = 6): string {
//     try {
//       const digits = '0123456789';
//       let otp = '';
//       for (let i = 0; i < length; i++) {
//         otp += digits[Math.floor(Math.random() * 10)];
//       }
//       return otp;
//     } catch (error) {
//       throw new InternalServerErrorException('Cannot generate OTP!');
//     }
//   }

//   @Start()
//   async start(@Ctx() ctx: Context) {
//     await ctx.reply(
//       'Welcome to the User Management Bot! Use commands to interact:\n' +
//       '/register - Register a new user\n' +
//       '/registerAdmin - Register a new admin\n' +
//       '/verifyOtp - Verify OTP\n' +
//       '/resendOtp - Resend OTP\n' +
//       '/login - Login\n' +
//       '/refreshToken - Refresh access token\n' +
//       '/updatePassword - Update password\n' +
//       '/updateUser - Update user details\n' +
//       '/deleteUser - Delete a user\n' +
//       '/findAllUsers - List all users'
//     );
//   }

//   @Command('findUser')
//   async findUser(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Invalid command context!');
//         return;
//       }
//       const [, email] = ctx.message['text'].split(' ');
//       if (!email) {
//         await ctx.reply('Please provide an email: /findUser <email>');
//         return;
//       }
//       const user = await this.prisma.user.findFirst({ where: { email } });
//       if (!user) {
//         await ctx.reply('User not found!');
//         return;
//       }
//       await ctx.reply(`User found: ${user.firstName} ${user.lastName}, Email: ${user.email}`);
//     } catch (error) {
//       await ctx.reply('Error finding user!');
//     }
//   }

//   @Command('findAllUsers')
//   async findAllUsers(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Invalid command context!');
//         return;
//       }
//       const [, params] = ctx.message['text'].split(' ');
//       const query: any = {};
//       if (params) {
//         const args = params.split(',');
//         args.forEach((arg) => {
//           const [key, value] = arg.split('=');
//           if (key && value) query[key.trim()] = value.trim();
//         });
//       }

//       const {
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         role,
//         regionId,
//         sortBy = 'createdAt',
//         sortOrder = 'desc',
//         page = '1',
//         limit = '10',
//       } = query;

//       const take = Number(limit);
//       const skip = (Number(page) - 1) * take;

//       const where: any = {
//         ...(firstName && { firstName: { contains: firstName, mode: 'insensitive' } }),
//         ...(lastName && { lastName: { contains: lastName, mode: 'insensitive' } }),
//         ...(email && { email: { contains: email, mode: 'insensitive' } }),
//         ...(phoneNumber && { phoneNumber: { contains: phoneNumber, mode: 'insensitive' } }),
//         ...(role && { role }),
//         ...(regionId && { regionId }),
//       };

//       const users = await this.prisma.user.findMany({
//         where,
//         include: { Region: true },
//         orderBy: { [sortBy]: sortOrder },
//         skip,
//         take,
//       });

//       const total = await this.prisma.user.count({ where });
//       const response = `Users (Page ${page}, Total: ${total}):\n${users.map(u => `${u.firstName} ${u.lastName} (${u.email})`).join('\n')}`;
//       await ctx.reply(response || 'No users found.');
//     } catch (error) {
//       await ctx.reply('Error listing users!');
//     }
//   }

//   @Command('register')
//   async register(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       const [, dataStr] = ctx.message['text'].split(':');
//       if (!dataStr) {
//         await ctx.reply(
//           'Please provide data in format: /register firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }

//       const data: CreateUserDto = dataStr.split(',').reduce((acc, item) => {
//         const [key, value] = item.split('=');
//         acc[key] = value;
//         return acc;
//       }, {} as CreateUserDto);

//       const existingUser = await this.prisma.user.findFirst({ where: { email: data.email } });
//       if (existingUser) {
//         await ctx.reply('User already exists!');
//         return;
//       }

//       if (data.role && ['ADMIN', 'SUPER_ADMIN', 'CEO'].includes(data.role.toUpperCase())) {
//         await ctx.reply('You are not allowed to register as ADMIN, SUPER_ADMIN, or CEO!');
//         return;
//       }

//       const hash = bcrypt.hashSync(data.password, 10);
//       const otp = this.generateOTP();

//       const newUser = await this.prisma.user.create({
//         data: { ...data, password: hash },
//       });

//       await this.mailer.sendMail(
//         data.email,
//         'Your OTP Code',
//         `Your OTP code is: ${otp}\n\nIt will expire in 5 minutes.`
//       );

//       await ctx.reply(`User registered: ${newUser.firstName} ${newUser.lastName}. Please verify OTP.`);
//     } catch (error) {
//       await ctx.reply('Failed to register user!');
//     }
//   }

//   @Command('registerAdmin')
//   async addAdmin(@Ctx() ctx: Context) {
//     try {
//       const [, dataStr] = ctx.message['text'].split(':');
//       if (!dataStr) {
//         await ctx.reply(
//           'Please provide data in format: /registerAdmin firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,password=1234,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=ADMIN,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }

//       const data: CreateAdminDto = dataStr.split(',').reduce((acc, item) => {
//         const [key, value] = item.split('=');
//         acc[key] = value;
//         return acc;
//       }, {} as CreateAdminDto);

//       const existingUser = await this.prisma.user.findFirst({ where: { email: data.email } });
//       if (existingUser) {
//         await ctx.reply('User already exists!');
//         return;
//       }

//       if (data.role && ['USER'].includes(data.role.toUpperCase())) {
//         await ctx.reply('You are not allowed to register as USER!');
//         return;
//       }

//       const hash = bcrypt.hashSync(data.password, 10);
//       const otp = this.generateOTP();

//       const newUser = await this.prisma.user.create({
//         data: { ...data, password: hash },
//       });

//       await this.mailer.sendMail(
//         data.email,
//         'Your OTP Code',
//         `Your OTP code is: ${otp}\n\nIt will expire in 5 minutes.`
//       );

//       await ctx.reply(`Admin registered: ${newUser.firstName} ${newUser.lastName}. Please verify OTP.`);
//     } catch (error) {
//       await ctx.reply('Failed to register admin!');
//     }
//   }

//   @Command('verifyOtp')
//   async verifyOtp(@Ctx() ctx: Context) {
//     try {
//       const [, dataStr] = ctx.message['text'].split(':');
//       if (!dataStr) {
//         await ctx.reply('Please provide data: /verifyOtp email=aziz@gmail.com,otp=123456');
//         return;
//       }

//       const data: VerifyOtpDto = dataStr.split(',').reduce((acc, item) => {
//         const [key, value] = item.split('=');
//         acc[key] = value;
//         return acc;
//       }, {} as VerifyOtpDto);

//       const user = await this.prisma.user.findFirst({ where: { email: data.email } });
//       if (!user) {
//         await ctx.reply('User not found!');
//         return;
//       }

//       if (user.isVerified) {
//         await ctx.reply('User already verified!');
//         return;
//       }

//       if (data.otp !== data.otp) {
//         await ctx.reply('Invalid OTP!');
//         return;
//       }

//       await this.prisma.user.update({
//         where: { id: user.id },
//         data: { isVerified: true },
//       });

//       await this.mailer.sendMail(
//         data.email,
//         'Registered successfully!',
//         'Thank you for registering!🫱🏼‍🫲🏽✅'
//       );

//       await ctx.reply('Email verified successfully!');
//     } catch (error) {
//       await ctx.reply('Failed to verify OTP!');
//     }
//   }

//   @Command('resendOtp')
//   async resendOtp(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide email: /resendOtp aziz@gmail.com');
//         return;
//       }
//       const [, email] = ctx.message['text'].split(' ');
//       if (!email) {
//         await ctx.reply('Please provide email: /resendOtp aziz@gmail.com');
//         return;
//       }

//       const data: ResendOtpDto = { email };
//       const otp = this.generateOTP();

//       await this.mailer.sendMail(
//         data.email,
//         'Your OTP Code',
//         `Your OTP code is: ${otp}\n\nIt will expire in 5 minutes.`
//       );

//       await ctx.reply('OTP sent successfully!');
//     } catch (error) {
//       await ctx.reply('Failed to resend OTP!');
//     }
//   }

//   @Command('login')
//   async login(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /login email=aziz@gmail.com,password=1234');
//         return;
//       }
//       const [, dataStr] = ctx.message['text'].split(':');
//       if (!dataStr) {
//         await ctx.reply('Please provide data: /login email=aziz@gmail.com,password=1234');
//         return;
//       }

//       const data: LoginUserDto = dataStr.split(',').reduce((acc, item) => {
//         const [key, value] = item.split('=');
//         acc[key] = value;
//         return acc;
//       }, {} as LoginUserDto);

//       const user = await this.prisma.user.findFirst({ where: { email: data.email } });
//       if (!user) {
//         await ctx.reply('User not found!');
//         return;
//       }

//       if (!user.isVerified) {
//         await ctx.reply('Please verify your email first!');
//         return;
//       }

//       const match = await bcrypt.compare(data.password, user.password);
//       if (!match) {
//         await ctx.reply('Wrong credentials!');
//         return;
//       }

//       const payload = { id: user.id, role: user.role };
//       const access_token = this.jwt.sign(payload, {
//         secret: process.env.ACCESS_SECRET,
//         expiresIn: '15m',
//       });

//       const refresh_token = this.jwt.sign(payload, {
//         secret: process.env.REFRESH_SECRET,
//         expiresIn: '7d',
//       });

//       const expiresAt = new Date();
//       expiresAt.setDate(expiresAt.getDate() + 7);

//       await this.prisma.session.create({
//         data: {
//           userId: user.id,
//           token: refresh_token,
//           ipAddress: ctx.from?.id?.toString() ?? 'unknown',
//           expiresAt,
//           deviceInfo: 'Telegram',
//         },
//       });

//       await this.prisma.user.update({
//         where: { id: user.id },
//         data: { refreshToken: refresh_token },
//       });

//       await this.mailer.sendMail(
//         data.email,
//         'Logged in',
//         'You have successfully logged in ✅'
//       );

//       await ctx.reply(`Access Token: ${access_token}\nRefresh Token: ${refresh_token}`);
//     } catch (error) {
//       await ctx.reply('Failed to login!');
//     }
//   }

//   @Command('updatePassword')
//   async updatePassword(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }
//       const [, dataStr] = ctx.message['text'].split(':');
//       if (!dataStr) {
//         await ctx.reply('Please provide data: /updatePassword userId=UUID,newPassword=1234');
//         return;
//       }

//       const data: UpdatePasswordDto & { userId: string } = dataStr.split(',').reduce((acc, item) => {
//         const [key, value] = item.split('=');
//         acc[key] = value;
//         return acc;
//       }, {} as any);

//       const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
//       if (!user) {
//         await ctx.reply('User not found!');
//         return;
//       }

//       const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
//       await this.prisma.user.update({
//         where: { id: data.userId },
//         data: { password: hashedNewPassword },
//       });

//       await ctx.reply('Password updated successfully!');
//     } catch (error) {
//       await ctx.reply('Failed to update password!');
//     }
//   }

//   @Command('refreshToken')
//   async refreshAccessToken(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Please provide refresh token: /refreshToken <token>');
//         return;
//       }
//       const [, refresh_token] = ctx.message['text'].split(' ');
//       if (!refresh_token) {
//         await ctx.reply('Please provide refresh token: /refreshToken <token>');
//         return;
//       }

//       const data: RefreshTokenDto = { refresh_token };
//       const payload = this.jwt.verify(data.refresh_token, {
//         secret: process.env.REFRESH_SECRET,
//       });

//       const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
//       if (!user || user.refreshToken !== data.refresh_token) {
//         await ctx.reply('Invalid refresh token!');
//         return;
//       }

//       const payload2 = { id: user.id, role: user.role };
//       const newAccessToken = this.jwt.sign(payload2, {
//         secret: process.env.ACCESS_SECRET,
//         expiresIn: '15m',
//       });

//       await ctx.reply(`New Access Token: ${newAccessToken}`);
//     } catch (error) {
//       await ctx.reply('Failed to refresh access token!');
//     }
//   }

//   @Command('updateUser')
//   async updateUser(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply(
//           'Please provide data: /updateUser id=UUID,firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }
//       const [, dataStr] = ctx.message['text'].split(':');
//       if (!dataStr) {
//         await ctx.reply(
//           'Please provide data: /updateUser id=UUID,firstName=Aziz,lastName=Azizov,email=aziz@gmail.com,phoneNumber=+998XXXXXXXXX,district=Main St. 123,role=USER,avatar=https://example.com.png/,regionId=UUID'
//         );
//         return;
//       }

//       const args = dataStr.split(',');
//       const idArg = args.find((arg) => arg.startsWith('id='));
//       if (!idArg) {
//         await ctx.reply('User ID is required: id=UUID');
//         return;
//       }
//       const id = idArg.split('=')[1];
//       const data: UpdateUserDto = args.reduce((acc, item) => {
//         const [key, value] = item.split('=');
//         if (key !== 'id') acc[key] = value;
//         return acc;
//       }, {} as UpdateUserDto);

//       const user = await this.prisma.user.update({ where: { id }, data });
//       if (!user) {
//         await ctx.reply('User not found!');
//         return;
//       }

//       await ctx.reply(`User updated: ${user.firstName} ${user.lastName}`);
//     } catch (error) {
//       await ctx.reply('Failed to update user!');
//     }
//   }

//   @Command('deleteUser')
//   async delete(@Ctx() ctx: Context) {
//     try {
//       if (!ctx.message || !('text' in ctx.message)) {
//         await ctx.reply('Invalid command context!');
//         return;
//       }
//       const [, id] = ctx.message['text'].split(' ');
//       if (!id) {
//         await ctx.reply('Please provide user ID: /deleteUser <id>');
//         return;
//       }

//       const remove = await this.prisma.user.delete({ where: { id } });
//       if (!remove) {
//         await ctx.reply('User not found!');
//         return;
//       }

//       await ctx.reply(`User deleted: ${remove.firstName} ${remove.lastName}`);
//     } catch (error) {
//       await ctx.reply('Failed to delete user!');
//     }
//   }
// }