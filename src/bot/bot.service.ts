// // tg.service.ts
// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { Ctx, Command, On, Update } from 'nestjs-telegraf';
// import { Context } from 'telegraf';
// import axios from 'axios';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { CreateAdminDto } from 'src/user/dto/create-admin.dto';
// import { VerifyOtpDto } from 'src/user/dto/verify-otp';
// import { LoginUserDto } from 'src/user/dto/login-user.dto';
// import { CreateOrderDto } from 'src/order/dto/create-order.dto';
// import { UserService } from 'src/user/user.service';
// import { PrismaService } from 'src/tools/prisma/prisma.service';
// import { RoleType } from '@prisma/client';
// import { isUUID } from 'class-validator';

// // Extend Context to include typed session
// interface BotContext extends Context {
//   session: {
//     userState?: UserState;
//   };
// }

// interface UserState {
//   step:
//     | 'register'
//     | 'verifyOtp'
//     | 'enterOtp'
//     | 'login'
//     | 'loggedIn'
//     | 'createOrder'
//     | 'addOrderProducts'
//     | 'addOrderTools';
//   type?: 'user' | 'admin';
//   email?: string;
//   accessToken?: string;
//   refreshToken?: string;
//   userId?: string;
//   orderData?: Partial<CreateOrderDto>;
// }

// @Update()
// @Injectable()
// export class TgService {
//   private readonly API_URL: string =
//     process.env.API_URL || 'http://localhost:3000';

//   constructor(
//     private readonly userService: UserService,
//     private readonly prisma: PrismaService,
//   ) {}

//   private async apiRequest(
//     method: string,
//     endpoint: string,
//     data?: any,
//     token?: string,
//   ): Promise<any> {
//     try {
//       const config = {
//         method,
//         url: `${this.API_URL}${endpoint}`,
//         data,
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         timeout: 10000, // 10-second timeout to prevent hanging
//       };
//       console.log(`API Request: ${method} ${endpoint}`, { data, token });
//       const response = await axios(config);
//       console.log(`API Response: ${endpoint}`, response.data);
//       return response.data;
//     } catch (error) {
//       console.error(`API Error: ${endpoint}`, error);
//       if (axios.isAxiosError(error)) {
//         throw new HttpException(
//           error.response?.data?.message || 'API request failed',
//           error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
//         );
//       }
//       throw new HttpException(
//         'Network error occurred',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   @Command('start')
//   async start(@Ctx() ctx: BotContext) {
//     await ctx.reply(
//       'Welcome to the Order Management Bot! Use the following commands:\n' +
//         '/register - Register as a user\n' +
//         '/registerAdmin - Register as an admin\n' +
//         '/verifyOtp - Verify your email with OTP\n' +
//         '/login - Log in to your account\n' +
//         '/createOrder - Create a new order\n' +
//         '/myOrders - View your orders\n' +
//         '/getProducts - List available products\n' +
//         '/getTools - List available tools\n' +
//         '/getLevels - List available levels\n' +
//         '/cancelOrder <orderId> - Cancel an order',
//     );
//   }

//   @Command('register')
//   async register(@Ctx() ctx: BotContext) {
//     if (!ctx.session) ctx.session = {};
//     ctx.session.userState = { step: 'register', type: 'user' };
//     await ctx.reply(
//       'Please provide your details in the format:\n' +
//         'firstName lastName email password phoneNumber district regionId avatar',
//     );
//   }

//   @Command('registerAdmin')
//   async registerAdmin(@Ctx() ctx: BotContext) {
//     if (!ctx.session) ctx.session = {};
//     ctx.session.userState = { step: 'register', type: 'admin' };
//     await ctx.reply(
//       'Please provide your admin details in the format:\n' +
//         'firstName lastName email password phoneNumber district role regionId avatar',
//     );
//   }

//   @On('text')
//   async handleText(@Ctx() ctx: BotContext) {
//     if (!ctx.message || !('text' in ctx.message)) {
//       await ctx.reply('Please send a text message.');
//       return;
//     }
//     const userState = ctx.session?.userState;
//     const text = ctx.message.text.trim();
//     if (!userState) {
//       await ctx.reply(
//         'Session expired. Please start with /register or /registerAdmin.',
//       );
//       return;
//     }

//     if (userState.step === 'register') {
//       const parts = text.split(' ');
//       try {
//         if (userState.type === 'user' && parts.length === 8) {
//           const [
//             firstName,
//             lastName,
//             email,
//             password,
//             phoneNumber,
//             district,
//             regionId,
//             avatar,
//           ] = parts;
//           if (!isUUID(regionId)) throw new Error('Invalid regionId format.');
//           const data: CreateUserDto = {
//             firstName,
//             lastName,
//             email,
//             password,
//             phoneNumber,
//             district,
//             role: 'USER',
//             regionId,
//             avatar,
//           };
//           await this.apiRequest('post', '/users/register', data);
//           ctx.session.userState = { step: 'verifyOtp', email };
//           await ctx.reply(
//             'Registration successful! Please use /verifyOtp to enter your OTP code.',
//           );
//         } else if (userState.type === 'admin' && parts.length === 9) {
//           const [
//             firstName,
//             lastName,
//             email,
//             password,
//             phoneNumber,
//             district,
//             role,
//             regionId,
//             avatar,
//           ] = parts;
//           if (!isUUID(regionId)) throw new Error('Invalid regionId format.');
//           if (!Object.values(RoleType).includes(role as RoleType))
//             throw new Error(
//               `Invalid role. Must be one of: ${Object.values(RoleType).join(', ')}`,
//             );
//           const data: CreateAdminDto = {
//             firstName,
//             lastName,
//             email,
//             password,
//             phoneNumber,
//             district,
//             role: role as RoleType,
//             regionId,
//             avatar,
//           };
//           await this.apiRequest('post', '/users/registerAdmin', data);
//           ctx.session.userState = { step: 'verifyOtp', email };
//           await ctx.reply(
//             'Admin registration successful! Please use /verifyOtp to enter your OTP code.',
//           );
//         } else {
//           await ctx.reply(
//             'Invalid format. Please provide all required details.',
//           );
//         }
//       } catch (error) {
//         await ctx.reply(`Error: ${error.message || 'Registration failed.'}`);
//       }
//     } else if (userState.step === 'enterOtp') {
//       try {
//         if (!userState.email) {
//           await ctx.reply('Email is missing for OTP verification.');
//           return;
//         }
//         console.log(
//           'Entering OTP verification for email:',
//           userState.email,
//           'with OTP:',
//           text,
//         );
//         const data: VerifyOtpDto = { email: userState.email, otp: text };
//         const response = await this.apiRequest(
//           'post',
//           '/users/verify-otp',
//           data,
//         );
//         if (
//           response &&
//           (response.message === 'Email verified successfully!' ||
//             response.success)
//         ) {
//           await ctx.reply('OTP verified successfully!');
//         } else {
//           await ctx.reply(
//             response.message || 'OTP verification failed. Please try again.',
//           );
//         }
//         delete ctx.session.userState;
//       } catch (error) {
//         console.error('OTP Verification Error:', error);
//         const message =
//           error instanceof HttpException
//             ? error.getResponse()['message'] || error.message
//             : error.message || 'OTP verification failed.';
//         await ctx.reply(`Error: ${message}`);
//       }
//     } else if (userState.step === 'login') {
//       const [email, password] = text.split(' ');
//       if (!email || !password) {
//         await ctx.reply('Please provide both email and password.');
//         return;
//       }
//       try {
//         const data: LoginUserDto = { email, password };
//         const response = await this.apiRequest('post', '/users/login', data);
//         const user = await this.userService.findUser(email);
//         ctx.session.userState = {
//           step: 'loggedIn',
//           accessToken: response.access_token,
//           refreshToken: response.refresh_token,
//           userId: user.id,
//         };
//         await ctx.reply(
//           'Login successful! You can now use /createOrder or /myOrders.',
//         );
//       } catch (error) {
//         await ctx.reply(`Error: ${error.message || 'Login failed.'}`);
//       }
//     } else if (userState.step === 'createOrder') {
//       const parts = text.split(' ');
//       if (parts.length < 6) {
//         await ctx.reply('Invalid format. Please provide all required details.');
//         return;
//       }
//       try {
//         const [lat, long, address, date, paymentType, withDelivery, ...rest] =
//           parts;
//         const latNum = Number(lat);
//         const longNum = Number(long);
//         if (isNaN(latNum) || isNaN(longNum))
//           throw new Error('Latitude and longitude must be numbers.');
//         if (!['CASH', 'CARD'].includes(paymentType))
//           throw new Error('Payment type must be CASH or CARD.');
//         if (withDelivery !== 'true' && withDelivery !== 'false')
//           throw new Error('withDelivery must be true or false.');
//         userState.orderData = {
//           lat: latNum,
//           long: longNum,
//           address,
//           date,
//           paymentType: paymentType as 'CASH' | 'CARD',
//           withDelivery: withDelivery === 'true',
//           commentToDelivery: rest.length > 1 ? rest[0] : undefined,
//           promoCode: rest.length > 1 ? rest[1] : rest[0],
//           orderProducts: [],
//           orderTools: [],
//         };
//         userState.step = 'addOrderProducts';
//         await ctx.reply(
//           'Please add a product in the format:\nproductId levelId count measure(HOUR/DAY) meausureCount [toolId1 count1 toolId2 count2 ...]\nSend "done" when finished adding products.',
//         );
//       } catch (error) {
//         await ctx.reply(`Error: ${error.message || 'Invalid order details.'}`);
//       }
//     } else if (userState.step === 'addOrderProducts') {
//       if (text === 'done') {
//         userState.step = 'addOrderTools';
//         await ctx.reply(
//           'Please add a tool in the format:\ntoolId count\nSend "done" when finished adding tools.',
//         );
//         return;
//       }
//       const parts = text.split(' ');
//       if (parts.length < 5) {
//         await ctx.reply('Invalid product format.');
//         return;
//       }
//       try {
//         const [
//           productId,
//           levelId,
//           count,
//           measure,
//           meausureCount,
//           ...toolParts
//         ] = parts;
//         if (!isUUID(productId) || !isUUID(levelId))
//           throw new Error('Invalid productId or levelId format.');
//         const countNum = Number(count);
//         const meausureCountNum = Number(meausureCount);
//         if (isNaN(countNum) || isNaN(meausureCountNum))
//           throw new Error('Count and measureCount must be numbers.');
//         if (!['HOUR', 'DAY'].includes(measure))
//           throw new Error('Measure must be HOUR or DAY.');
//         const tools: { toolId: string; count: number }[] = [];
//         for (let i = 0; i < toolParts.length; i += 2) {
//           const toolId = toolParts[i];
//           const toolCount = Number(toolParts[i + 1]);
//           if (!isUUID(toolId)) throw new Error('Invalid toolId format.');
//           if (isNaN(toolCount)) throw new Error('Tool count must be a number.');
//           tools.push({ toolId, count: toolCount });
//         }
//         userState.orderData = userState.orderData || {
//           orderProducts: [],
//           orderTools: [],
//         };
//         userState.orderData.orderProducts =
//           userState.orderData.orderProducts || [];
//         userState.orderData.orderProducts.push({
//           productId,
//           levelId,
//           count: countNum,
//           measure: measure as 'HOUR' | 'DAY',
//           meausureCount: meausureCountNum,
//           tools,
//         });
//         await ctx.reply('Product added. Add another or send "done".');
//       } catch (error) {
//         await ctx.reply(
//           `Error: ${error.message || 'Invalid product details.'}`,
//         );
//       }
//     } else if (userState.step === 'addOrderTools') {
//       if (text === 'done') {
//         try {
//           const orderData = userState.orderData;
//           if (!orderData) throw new Error('No order data available.');
//           const response = await this.apiRequest(
//             'post',
//             '/order',
//             orderData,
//             userState.accessToken,
//           );
//           await ctx.reply(
//             `Order created successfully! Order ID: ${response.id}`,
//           );
//           delete userState.orderData;
//           userState.step = 'loggedIn';
//         } catch (error) {
//           await ctx.reply(
//             `Error: ${error.message || 'Order creation failed.'}`,
//           );
//         }
//         return;
//       }
//       const [toolId, count] = text.split(' ');
//       if (!toolId || !count) {
//         await ctx.reply('Invalid tool format.');
//         return;
//       }
//       try {
//         if (!isUUID(toolId)) throw new Error('Invalid toolId format.');
//         const countNum = Number(count);
//         if (isNaN(countNum)) throw new Error('Count must be a number.');
//         userState.orderData = userState.orderData || {
//           orderProducts: [],
//           orderTools: [],
//         };
//         userState.orderData.orderTools = userState.orderData.orderTools || [];
//         userState.orderData.orderTools.push({ toolId, count: countNum });
//         await ctx.reply('Tool added. Add another or send "done".');
//       } catch (error) {
//         await ctx.reply(`Error: ${error.message || 'Invalid tool details.'}`);
//       }
//     }
//   }

//   @Command('verifyOtp')
//   async verifyOtp(@Ctx() ctx: BotContext) {
//     console.log(
//       'VerifyOtp command received, checking user state:',
//       ctx.session?.userState,
//     );
//     if (!ctx.session) ctx.session = {};

//     const userState: UserState | undefined = ctx.session.userState;
//     if (!userState || !userState.email) {
//       await ctx.reply(
//         'No pending registration found. Please register first using /registerAdmin.',
//       );
//       return;
//     }

//     try {
//       const user = await this.prisma.user.findUnique({
//         where: { email: userState.email },
//       });
//       if (!user || user.isVerified) {
//         await ctx.reply(
//           'User not found or already verified. Please register again if needed.',
//         );
//         delete ctx.session.userState;
//         return;
//       }
//       userState.step = 'enterOtp';
//       await ctx.reply(
//         'Please enter your OTP code sent to ' + userState.email + '.',
//       );
//     } catch (error) {
//       console.error('Database check error:', error);
//       await ctx.reply('Error checking user status. Please try again later.');
//     }
//   }

//   @Command('login')
//   async login(@Ctx() ctx: BotContext) {
//     if (!ctx.session) ctx.session = {};
//     ctx.session.userState = { step: 'login' };
//     await ctx.reply(
//       'Please provide your email and password in the format:\nemail password',
//     );
//   }

//   @Command('getProducts')
//   async getProducts(@Ctx() ctx: BotContext) {
//     try {
//       const response = await this.apiRequest('get', '/product');
//       const products = response.data.map(
//         (p: any) =>
//           `${p.id}: ${p.name_en} (Hourly: ${p.priceHourly}, Daily: ${p.priceDaily})`,
//       );
//       await ctx.reply(products.join('\n') || 'No products found.');
//     } catch (error) {
//       await ctx.reply(`Error: ${error.message || 'Failed to fetch products.'}`);
//     }
//   }

//   @Command('getTools')
//   async getTools(@Ctx() ctx: BotContext) {
//     try {
//       const response = await this.apiRequest('get', '/tool');
//       const tools = response.data.map(
//         (t: any) => `${t.id}: ${t.name_en} (Price: ${t.price})`,
//       );
//       await ctx.reply(tools.join('\n') || 'No tools found.');
//     } catch (error) {
//       await ctx.reply(`Error: ${error.message || 'Failed to fetch tools.'}`);
//     }
//   }

//   @Command('getLevels')
//   async getLevels(@Ctx() ctx: BotContext) {
//     try {
//       const response = await this.apiRequest('get', '/level');
//       const levels = response.data.map(
//         (l: any) =>
//           `${l.id}: ${l.name} (Hourly: ${l.priceHourly}, Daily: ${l.priceDaily})`,
//       );
//       await ctx.reply(levels.join('\n') || 'No levels found.');
//     } catch (error) {
//       await ctx.reply(`Error: ${error.message || 'Failed to fetch levels.'}`);
//     }
//   }

//   @Command('myOrders')
//   async myOrders(@Ctx() ctx: BotContext) {
//     const userState: UserState | undefined = ctx.session?.userState;
//     if (userState?.step !== 'loggedIn') {
//       await ctx.reply('Please login first using /login.');
//       return;
//     }
//     try {
//       const response = await this.apiRequest(
//         'get',
//         '/order',
//         null,
//         userState.accessToken,
//       );
//       const orders = response
//         .filter((order: any) => order.userId === userState.userId)
//         .map((o: any) => `ID: ${o.id}, Status: ${o.status}, Total: ${o.total}`);
//       await ctx.reply(orders.join('\n') || 'No orders found.');
//     } catch (error) {
//       await ctx.reply(`Error: ${error.message || 'Failed to fetch orders.'}`);
//     }
//   }

//   @Command('cancelOrder')
//   async cancelOrder(@Ctx() ctx: BotContext) {
//     const userState: UserState | undefined = ctx.session?.userState;
//     if (!ctx.message || !('text' in ctx.message)) {
//       await ctx.reply('Please send a text message.');
//       return;
//     }
//     const text = ctx.message.text;
//     const match = text.match(/^\/cancelOrder\s+(.+)/);
//     if (!match) {
//       await ctx.reply('Please provide an order ID: /cancelOrder <orderId>');
//       return;
//     }
//     const orderId = match[1];
//     if (!isUUID(orderId)) {
//       await ctx.reply('Invalid orderId format. Must be a valid UUID.');
//       return;
//     }
//     if (userState?.step !== 'loggedIn') {
//       await ctx.reply('Please login first using /login.');
//       return;
//     }
//     try {
//       await this.apiRequest(
//         'delete',
//         `/order/cancel/${orderId}`,
//         null,
//         userState.accessToken,
//       );
//       await ctx.reply(`Order ${orderId} cancelled successfully.`);
//     } catch (error) {
//       await ctx.reply(`Error: ${error.message || 'Failed to cancel order.'}`);
//     }
//   }
// }
