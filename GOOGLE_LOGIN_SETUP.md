# การตั้งค่า Google Login ด้วย Supabase

## ขั้นตอนที่ 1: สร้างโปรเจค Supabase

1. ไปที่ https://supabase.com
2. สร้างบัญชีหรือเข้าสู่ระบบ
3. คลิก "New Project"
4. กรอกข้อมูลโปรเจค:
   - Project Name: poetry-contest-platform (หรือชื่อที่ต้องการ)
   - Database Password: สร้างรหัสผ่านที่แข็งแรง
   - Region: เลือกที่ใกล้ที่สุด (เช่น Southeast Asia)
5. คลิก "Create new project"

## ขั้นตอนที่ 2: ตั้งค่า Google OAuth Provider

1. ในหน้า Dashboard ของ Supabase ไปที่ **Authentication** > **Providers**
2. หา **Google** ในรายการและคลิกเพื่อเปิดการตั้งค่า
3. เปิดใช้งาน Google Provider

### สร้าง Google OAuth Credentials

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้างโปรเจคใหม่หรือเลือกโปรเจคที่มีอยู่
3. ไปที่ **APIs & Services** > **Credentials**
4. คลิก **Create Credentials** > **OAuth client ID**
5. ถ้ายังไม่เคยตั้งค่า OAuth consent screen:
   - คลิก **Configure Consent Screen**
   - เลือก **External**
   - กรอกข้อมูลที่จำเป็น:
     - App name: Poetry Contest Platform
     - User support email: อีเมลของคุณ
     - Developer contact information: อีเมลของคุณ
   - คลิก **Save and Continue**
   - ที่ **Scopes** คลิก **Save and Continue**
   - ที่ **Test users** เพิ่มอีเมลที่จะใช้ทดสอบ
   - คลิก **Save and Continue**

6. กลับไปที่ **Credentials** และสร้าง OAuth client ID:
   - Application type: **Web application**
   - Name: Poetry Contest Platform
   - Authorized JavaScript origins:
     ```
     http://localhost:4000
     https://your-domain.com
     ```
   - Authorized redirect URIs:
     ```
     https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
     ```
     (หา URL นี้ได้จากหน้าการตั้งค่า Google Provider ใน Supabase)
   
7. คลิก **Create**
8. คัดลอก **Client ID** และ **Client Secret**

### กลับไปที่ Supabase

1. กลับไปที่หน้า **Authentication** > **Providers** > **Google**
2. วาง **Client ID** และ **Client Secret** จาก Google Cloud Console
3. คลิก **Save**

## ขั้นตอนที่ 3: ตั้งค่า Environment Variables

1. สร้างไฟล์ `.env` ในโฟลเดอร์ `Poetry-Contest-Platform`:
   ```bash
   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

2. หาค่าเหล่านี้ได้จาก:
   - ไปที่ **Project Settings** > **API** ใน Supabase Dashboard
   - คัดลอก **Project URL** ไปใส่ใน `REACT_APP_SUPABASE_URL`
   - คัดลอก **anon public** key ไปใส่ใน `REACT_APP_SUPABASE_ANON_KEY`

https://supabase.com/dashboard/project/ekpstgavxcnmmrhqswmc
https://ekpstgavxcnmmrhqswmc.supabase.co


## ขั้นตอนที่ 4: ตั้งค่า Backend (Optional)

หากต้องการเก็บข้อมูล user ใน database ของคุณเอง ต้องสร้าง endpoint ใน Backend:

```go
// ตัวอย่าง endpoint ใน Go
func GoogleLoginHandler(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Email    string `json:"email"`
        FullName string `json:"full_name"`
        GoogleID string `json:"google_id"`
        Provider string `json:"provider"`
    }
    
    json.NewDecoder(r.Body).Decode(&req)
    
    // ตรวจสอบว่า user มีในระบบหรือไม่
    // ถ้าไม่มีให้สร้างใหม่
    // ถ้ามีอยู่แล้วให้ login
    // คืน token และข้อมูล user
}
```

## ขั้นตอนที่ 5: ทดสอบ

1. รัน React app:
   ```bash
   npm start
   ```

2. ไปที่หน้า Login: http://localhost:4000/login
3. คลิกปุ่ม "เข้าสู่ระบบด้วย Google"
4. จะถูก redirect ไปหน้า Google login
5. เลือกบัญชี Google
6. จะถูก redirect กลับมาที่แอพพลิเคชัน

## Troubleshooting

### Error: "redirect_uri_mismatch"
- ตรวจสอบว่า redirect URI ใน Google Cloud Console ตรงกับที่ Supabase ให้มา
- ต้องมี `https://` และ path `/auth/v1/callback` ท้ายสุด

### Error: "Access blocked: This app's request is invalid"
- ตรวจสอบว่าตั้งค่า OAuth consent screen เรียบร้อยแล้ว
- ถ้าอยู่ในโหมด Testing ต้องเพิ่มอีเมลที่จะใช้ทดสอบใน Test users

### Error: "Missing Supabase environment variables"
- ตรวจสอบว่าสร้างไฟล์ `.env` แล้ว
- ตรวจสอบว่ามี prefix `REACT_APP_` หน้าชื่อตัวแปร
- รีสตาร์ทเซิร์ฟเวอร์หลังจากเพิ่ม environment variables

## ไฟล์ที่ถูกสร้าง/แก้ไข

1. **src/config/supabase.js** - Supabase client configuration
2. **src/pages/auth/Login.jsx** - เพิ่มปุ่ม Google login
3. **src/pages/auth/AuthCallback.jsx** - หน้าสำหรับรับข้อมูลจาก Google OAuth
4. **src/styles/Auth.css** - เพิ่ม CSS สำหรับปุ่ม Google
5. **src/App.js** - เพิ่ม route สำหรับ `/auth/callback`
6. **.env.example** - ตัวอย่างไฟล์ .env
7. **package.json** - เพิ่ม @supabase/supabase-js

## หมายเหตุ

- อย่าลืม add `.env` ไปใน `.gitignore` เพื่อไม่ให้ commit ขึ้น git
- ใช้ค่า environment variables ที่แตกต่างกันสำหรับ development และ production
