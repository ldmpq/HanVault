import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../../config/database';
import { env } from '../../config/env';
import { users, userStreaks } from '../../shared/schema';
import { UserResponse } from '../../shared/types/user.type';
import { hashPassword, comparePassword } from '../../shared/utils/bcrypt.utility';
import { generateTokens, TokenPayload } from './auth.utility';
import { RegisterInput, LoginInput } from './auth.validation';

export class AuthService {
  /**
   * 1. ĐĂNG KÝ TÀI KHOẢN MỚI
   */
  static async register(input: RegisterInput): Promise<{ user: UserResponse; tokens: { accessToken: string; refreshToken: string } }> {
    const { email, password, displayName } = input;

    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS: Email này đã được đăng ký trong hệ thống!');
    }

    // Băm mật khẩu
    const hashedPassword = await hashPassword(password);

    // Sử dụng Transaction để tạo đồng thời User và UserStreak
    const newUser = await db.transaction(async (tx) => {
      // 1. Insert User mới
      const [insertedUser] = await tx
        .insert(users)
        .values({
          email: email.toLowerCase(),
          passwordHash: hashedPassword,
          displayName: displayName || email.split('@')[0], // Nếu không truyền tên thì lấy phần đầu của email
          currentHskLevel: 1,
          dailyGoal: 20,
        })
        .returning();

      // 2. Khởi tạo luôn bảng Streak cho user này (tránh lỗi NULL khi học sau này)
      await tx.insert(userStreaks).values({
        userId: insertedUser.id,
        currentStreak: 0,
        longestStreak: 0,
      });

      return insertedUser;
    });

    // Tạo JWT Tokens
    const tokenPayload: TokenPayload = {
      userId: newUser.id,
      email: newUser.email,
    };
    const tokens = generateTokens(tokenPayload);

    // Loại bỏ passwordHash trước khi trả về
    const { passwordHash, ...userResponse } = newUser;

    return {
      user: userResponse,
      tokens,
    };
  }

  /**
   * 2. ĐĂNG NHẬP HỆ THỐNG
   */
  static async login(input: LoginInput): Promise<{ user: UserResponse; tokens: { accessToken: string; refreshToken: string } }> {
    const { email, password } = input;

    // Tìm user theo email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user || !user.passwordHash) {
      throw new Error('INVALID_CREDENTIALS: Email hoặc mật khẩu không chính xác!');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS: Email hoặc mật khẩu không chính xác!');
    }

    // Cập nhật thời gian đăng nhập gần nhất (lastLoginAt)
    const [updatedUser] = await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    // Tạo JWT Tokens
    const tokenPayload: TokenPayload = {
      userId: updatedUser.id,
      email: updatedUser.email,
    };
    const tokens = generateTokens(tokenPayload);

    // Loại bỏ passwordHash
    const { passwordHash, ...userResponse } = updatedUser;

    return {
      user: userResponse,
      tokens,
    };
  }

  /**
   * 3. CẤP LẠI ACCESS TOKEN (REFRESH TOKEN)
   */
  static async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Giải mã và xác thực Refresh Token
      const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;

      // Kiểm tra xem user có còn tồn tại trong DB không (đề phòng user đã bị xóa hoặc khóa)
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId),
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND: Tài khoản không còn tồn tại.');
      }

      // Cập nhật cặp token mới
      const newPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
      };

      return generateTokens(newPayload);
    } catch (error) {
      throw new Error('INVALID_REFRESH_TOKEN: Refresh token không hợp lệ hoặc đã hết hạn.');
    }
  }

  /**
   * 4. LẤY THÔNG TIN PROFILE HIỆN TẠI (ME)
   */
  static async getMe(userId: string): Promise<UserResponse> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        streak: true, // Query lấy luôn thông tin streak của user nhờ Drizzle Relations!
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND: Không tìm thấy thông tin người dùng.');
    }

    const { passwordHash, ...userResponse } = user;
    return userResponse;
  }
}