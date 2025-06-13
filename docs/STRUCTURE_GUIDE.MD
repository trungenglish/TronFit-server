# HƯỚNG DẪN CẤU TRÚC NESTJS CHI TIẾT

## 1. KHÁI NIỆM CƠ BAN

### Module là gì?
- **Module** = Khối xây dựng (building block) của ứng dụng NestJS
- Giống như một "phòng ban" trong công ty, mỗi phòng ban có chức năng riêng
- Ví dụ: Module Users quản lý người dùng, Module Posts quản lý bài viết

### Controller là gì?
- **Controller** = Người tiếp khách (receptionist)
- Nhận yêu cầu (request) từ client và trả về phản hồi (response)
- Định nghĩa các endpoint API (GET /users, POST /users, etc.)

### Service là gì?
- **Service** = Nhân viên xử lý công việc thực tế
- Chứa logic nghiệp vụ (business logic)
- Controller gọi Service để xử lý công việc

### Repository là gì?
- **Repository** = Thủ kho, quản lý dữ liệu
- Tương tác trực tiếp với database
- Service gọi Repository để lấy/lưu dữ liệu

## 2. CẤU TRÚC THƯ MỤC CHI TIẾT

### 📁 common/ - Những thứ dùng chung
**Giải thích**: Đây là "kho đồ dùng chung" của cả ứng dụng

#### decorators/ - Các nhãn dán thông minh
```typescript
// Thay vì viết:
if (user.role !== 'admin') {
  throw new Error('Không có quyền');
}

// Ta chỉ cần dán nhãn:
@Roles('admin')
getUserList() {
  // Code ở đây chỉ admin mới chạy được
}
```

#### dto/ - Khuôn mẫu dữ liệu
**DTO = Data Transfer Object** = Vật chuyển tải dữ liệu
```typescript
// Giống như form đăng ký, có các ô cần điền:
class CreateUserDto {
  email: string;     // Ô email (bắt buộc)
  password: string;  // Ô mật khẩu (bắt buộc)
  age?: number;      // Ô tuổi (không bắt buộc)
}
```

#### exceptions/ - Xử lý lỗi
```typescript
// Thay vì:
throw new Error('Lỗi gì đó');

// Ta tạo lỗi rõ ràng:
throw new BusinessException('Người dùng đã tồn tại');
```

#### filters/ - Bộ lọc lỗi
**Giải thích**: Giống như "bộ phận customer service"
- Khi có lỗi xảy ra → Filter bắt lỗi → Trả về thông báo đẹp cho user
- Không để user thấy lỗi kỹ thuật khó hiểu

#### guards/ - Bảo vệ
**Giải thích**: Giống như "bảo vệ cổng"
```typescript
// Guard kiểm tra trước khi vào:
@UseGuards(AuthGuard)  // Phải đăng nhập
@UseGuards(RoleGuard)  // Phải có quyền admin
deleteUser() {
  // Chỉ admin đăng nhập mới vào được đây
}
```

#### interceptors/ - Người can thiệp
**Giải thích**: Giống như "thư ký"
- **Trước khi xử lý**: Ghi log "Ông A đang gọi API X"
- **Sau khi xử lý**: Format kết quả đẹp trước khi trả về

#### middleware/ - Trung gian
**Giải thích**: Giống như "lễ tân khách sạn"
- Mọi request đều phải qua lễ tân trước
- Lễ tân ghi sổ, kiểm tra giấy tờ, rồi mới cho lên phòng

#### pipes/ - Đường ống xử lý
**Giải thích**: Giống như "máy lọc nước"
```typescript
// Dữ liệu vào bẩn → Pipe lọc → Dữ liệu ra sạch
Input: "123"        →  Pipe  →  Output: 123 (number)
Input: "abc123"     →  Pipe  →  Error: "Phải là số"
```

### 📁 config/ - Cấu hình ứng dụng
**Giải thích**: Giống như "bảng điều khiển" ô tô
```typescript
// database.config.ts - Cài đặt kết nối database
export const databaseConfig = {
  host: 'localhost',      // Địa chỉ máy chủ DB
  port: 5432,            // Cổng kết nối
  username: 'admin',      // Tên đăng nhập
  password: 'password',   // Mật khẩu
  database: 'myapp'       // Tên database
};
```

### 📁 database/ - Quản lý cơ sở dữ liệu

#### migrations/ - Lịch sử thay đổi DB
**Giải thích**: Giống như "sổ nhật ký thay đổi"
```typescript
// Migration 001: Tạo bảng users
- Ngày 1/1/2024: Tạo bảng users với cột id, email, password

// Migration 002: Thêm cột age
- Ngày 5/1/2024: Thêm cột age vào bảng users

// Migration 003: Tạo bảng posts
- Ngày 10/1/2024: Tạo bảng posts với cột id, title, content
```

#### seeds/ - Dữ liệu mẫu
**Giải thích**: Giống như "dữ liệu demo"
```typescript
// Tạo sẵn tài khoản admin để test
{
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
}
```

#### entities/ - Mô hình dữ liệu
**Giải thích**: Giống như "bản thiết kế bảng"
```typescript
// User.entity.ts = Thiết kế bảng users
@Entity('users')
class User {
  @Column()
  id: string;        // Cột id
  
  @Column()
  email: string;     // Cột email
  
  @Column()
  password: string;  // Cột password
}
```

### 📁 modules/ - Các tính năng chính

#### Cấu trúc 1 module (VD: users/)
```
users/
├── users.controller.ts    # Tiếp nhận request
├── users.service.ts       # Xử lý logic
├── users.module.ts        # Kết nối tất cả
├── dto/                   # Khuôn mẫu dữ liệu
├── entities/              # Mô hình database
├── repositories/          # Thao tác database
└── __tests__/            # Test cases
```

**Luồng xử lý:**
1. **Controller** nhận request từ client
2. **Controller** gọi **Service** để xử lý
3. **Service** gọi **Repository** để lấy dữ liệu
4. **Repository** truy vấn database
5. Kết quả trả ngược lại: Repository → Service → Controller → Client

#### auth/ - Xác thực người dùng
**Giải thích**: Giống như "hệ thống an ninh"
```typescript
// strategies/ - Chiến lược xác thực
- jwt.strategy.ts: Kiểm tra token JWT
- local.strategy.ts: Kiểm tra email/password

// guards/ - Bảo vệ routes
- jwt-auth.guard.ts: Chỉ user đăng nhập mới vào được

// dto/ - Form đăng nhập/đăng ký
- login.dto.ts: Form đăng nhập (email, password)
- register.dto.ts: Form đăng ký (email, password, name)
```

### 📁 shared/ - Chia sẻ giữa modules

#### services/ - Dịch vụ chung
```typescript
// email.service.ts - Dịch vụ gửi email
class EmailService {
  sendWelcomeEmail(email: string) {
    // Gửi email chào mừng
  }
  
  sendResetPasswordEmail(email: string) {
    // Gửi email reset mật khẩu
  }
}

// cache.service.ts - Dịch vụ cache
class CacheService {
  set(key: string, value: any) {
    // Lưu vào cache
  }
  
  get(key: string) {
    // Lấy từ cache
  }
}
```

#### constants/ - Hằng số ứng dụng
```typescript
// app.constants.ts
export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,        // Mỗi trang hiển thị 10 item
  MAX_FILE_SIZE: 5 * 1024 * 1024, // Tối đa upload 5MB
  SUPPORTED_FORMATS: ['jpg', 'png', 'pdf']
};

// roles.constants.ts
export enum UserRole {
  ADMIN = 'admin',       // Quản trị viên
  USER = 'user',         // Người dùng thường
  MODERATOR = 'moderator' // Người kiểm duyệt
}
```

#### types/ - Định nghĩa kiểu dữ liệu
```typescript
// auth.types.ts
interface JwtPayload {
  sub: string;      // ID người dùng
  email: string;    // Email người dùng
  roles: string[];  // Danh sách quyền
}

interface LoginResponse {
  access_token: string;  // Token để truy cập
  refresh_token: string; // Token để làm mới
  user: User;           // Thông tin user
}
```

### 📁 __tests__/ - Kiểm thử ứng dụng

#### e2e/ - Test toàn bộ luồng
**Giải thích**: Giống như "test thực tế"
```typescript
// auth.e2e-spec.ts
describe('Đăng nhập', () => {
  it('Đăng nhập thành công với email/password đúng', async () => {
    const result = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(result.status).toBe(200);
    expect(result.body.access_token).toBeDefined();
  });
});
```

#### fixtures/ - Dữ liệu test
```typescript
// user.fixture.ts - Dữ liệu user giả để test
export const userFixtures = {
  validUser: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  },
  
  invalidUser: {
    email: 'invalid-email',
    password: '123'  // Mật khẩu quá ngắn
  }
};
```

## 3. LUỒNG XỬ LÝ REQUEST

### Bước 1: Client gửi request
```
POST /users
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Bước 2: Đi qua Middleware
```typescript
// logger.middleware.ts
console.log('📝 Request: POST /users');
console.log('⏰ Time:', new Date());
```

### Bước 3: Đi qua Guards
```typescript
// auth.guard.ts
const token = request.headers.authorization;
if (!token) {
  throw new UnauthorizedException('❌ Chưa đăng nhập');
}
```

### Bước 4: Đến Controller
```typescript
// users.controller.ts
@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

### Bước 5: Đi qua Pipes (Validation)
```typescript
// validation.pipe.ts
if (!createUserDto.email.includes('@')) {
  throw new ValidationException('❌ Email không hợp lệ');
}
```

### Bước 6: Gọi Service
```typescript
// users.service.ts
async create(createUserDto: CreateUserDto): Promise<User> {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await this.userRepository.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new BusinessException('❌ Email đã được sử dụng');
  }
  
  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
  // Tạo user mới
  const user = await this.userRepository.create({
    ...createUserDto,
    password: hashedPassword
  });
  
  return user;
}
```

### Bước 7: Repository thao tác Database
```typescript
// user.repository.ts
async create(userData: CreateUserDto): Promise<User> {
  const user = this.userRepository.create(userData);
  return await this.userRepository.save(user);
}
```

### Bước 8: Đi qua Interceptors
```typescript
// transform.interceptor.ts
return {
  success: true,
  message: '✅ Tạo user thành công',
  data: user
};
```

### Bước 9: Trả về Client
```json
{
  "success": true,
  "message": "✅ Tạo user thành công",
  "data": {
    "id": "123",
    "email": "john@example.com",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

## 4. TẠI SAO CẦN CẤU TRÚC NÀY?

### 🎯 Separation of Concerns (Phân tách trách nhiệm)
- **Controller**: Chỉ lo tiếp nhận request và trả response
- **Service**: Chỉ lo xử lý logic nghiệp vụ
- **Repository**: Chỉ lo thao tác database
- **Guard**: Chỉ lo kiểm tra quyền truy cập

### 🔄 Tái sử dụng (Reusability)
```typescript
// EmailService có thể dùng ở nhiều nơi:
- UserService: Gửi email chào mừng khi đăng ký
- AuthService: Gửi email reset password
- OrderService: Gửi email xác nhận đơn hàng
```

### 🧪 Dễ test
```typescript
// Test UserService riêng biệt
describe('UserService', () => {
  it('Tạo user thành công', async () => {
    // Mock repository
    const mockRepository = {
      create: jest.fn().mockResolvedValue(mockUser),
      findByEmail: jest.fn().mockResolvedValue(null)
    };
    
    const userService = new UserService(mockRepository);
    const result = await userService.create(createUserDto);
    
    expect(result).toEqual(mockUser);
  });
});
```

### 📈 Mở rộng dễ dàng
```typescript
// Thêm tính năng mới chỉ cần tạo module mới
modules/
├── users/           # Đã có
├── posts/           # Đã có
├── comments/        # Thêm mới
├── notifications/   # Thêm mới
└── payments/        # Thêm mới
```

### 👥 Làm việc nhóm hiệu quả
- Dev A làm module Users
- Dev B làm module Posts
- Dev C làm module Payments
- Không xung đột code

## 5. QUY TẮC ĐẶT TÊN

### File naming
```
user.entity.ts        # Entity
user.service.ts       # Service
user.controller.ts    # Controller
user.repository.ts    # Repository
create-user.dto.ts    # DTO
user.service.spec.ts  # Test file
```

### Class naming
```typescript
class UserEntity { }      # Entity
class UserService { }     # Service
class UserController { }  # Controller
class UserRepository { }  # Repository
class CreateUserDto { }   # DTO
```

### Folder naming
```
kebab-case:
- user-profile/
- order-management/
- email-notifications/
```

## 6. BEST PRACTICES

### 1. Luôn sử dụng DTO cho validation
```typescript
// ❌ Không nên
@Post()
createUser(@Body() body: any) {
  // Không biết body có gì
}

// ✅ Nên
@Post()
createUser(@Body() createUserDto: CreateUserDto) {
  // Đã validate và type-safe
}
```

### 2. Tách biệt Business Logic và Data Access
```typescript
// ❌ Không nên - Logic nghiệp vụ trong Controller
@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
  const existingUser = await this.userRepository.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new BadRequestException('Email đã tồn tại');
  }
  // ... logic khác
}

// ✅ Nên - Logic nghiệp vụ trong Service
@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

### 3. Sử dụng Constants thay vì Hard-code
```typescript
// ❌ Không nên
if (user.role === 'admin') { }

// ✅ Nên
if (user.role === UserRole.ADMIN) { }
```

### 4. Error Handling nhất quán
```typescript
// Tạo custom exceptions rõ ràng
export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`Không tìm thấy user với ID: ${userId}`);
  }
}
```

### 5. Logging đầy đủ
```typescript
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Tạo user mới: ${createUserDto.email}`);
    
    try {
      const user = await this.userRepository.create(createUserDto);
      this.logger.log(`✅ Tạo user thành công: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`❌ Lỗi tạo user: ${error.message}`);
      throw error;
    }
  }
}
```

Cấu trúc này giúp code **sạch**, **dễ hiểu**, **dễ maintain** và **scalable**!