import { useState } from 'react'
import './App.css'

// อินเทอร์เฟซสำหรับข้อมูลในฟอร์ม
interface FormData {
  username: string;
  email: string;
  password: string;
}

// อินเทอร์เฟซสำหรับข้อผิดพลาด
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    username: false,
    email: false,
    password: false,
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  // ฟังก์ชัน validate ทีละ field
  const validateField = (name: string, value: string): string | undefined => {
    if (name === 'username') {
      if (!value.trim()) return 'กรุณากรอกชื่อผู้ใช้';
      if (value.trim().length < 3) return 'ชื่อผู้ใช้ต้องอย่างน้อย 3 ตัวอักษร';
    }

    if (name === 'email') {
      if (!value.trim()) return 'กรุณากรอกอีเมล';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (name === 'password') {
      if (!value) return 'กรุณากรอกรหัสผ่าน';
      if (value.length < 8) return 'รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร';
      if (!/(?=.*[a-z])/.test(value)) return 'ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว';
      if (!/(?=.*[A-Z])/.test(value)) return 'ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว';
      if (!/(?=.*\d)/.test(value)) return 'ต้องมีตัวเลขอย่างน้อย 1 ตัว';
    }

    return undefined;
  };

  // ตรวจสอบว่าฟอร์มทั้งหมดถูกต้องหรือไม่
  const isFormValid = (): boolean => {
    const usernameError = validateField('username', formData.username);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);

    return !usernameError && !emailError && !passwordError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // validate ทันทีเมื่อพิมพ์ (หลังจาก touched แล้ว)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid()) {
      setSubmitStatus('success');
      // ในของจริงจะส่งไป API ที่นี่
    } else {
      // ถ้ายังไม่ valid ให้ mark ทุก field ว่า touched เพื่อแสดง error ทั้งหมด
      setTouched({ username: true, email: true, password: true });
      // และ validate ใหม่ทั้งหมด
      setErrors({
        username: validateField('username', formData.username),
        email: validateField('email', formData.email),
        password: validateField('password', formData.password),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">สมัครสมาชิก</h2>

        {submitStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center animate-in fade-in zoom-in duration-300">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">สมัครสมาชิกสำเร็จ!</h3>
            <p className="text-green-700 text-sm mb-4">ยินดีต้อนรับคุณ {formData.username}</p>
            <pre className="text-xs text-left bg-white p-3 rounded border overflow-auto max-h-40">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setFormData({ username: '', email: '', password: '' });
                setTouched({ username: false, email: false, password: false });
                setErrors({});
              }}
              className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              กลับหน้าสมัครสมาชิก
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${touched.username && errors.username
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${touched.email && errors.email
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${touched.password && errors.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
              )}
              <ul className="mt-2 text-[10px] text-gray-500 space-y-0.5">
                <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>• อย่างน้อย 8 ตัวอักษร</li>
                <li className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}>• ตัวใหญ่ 1 ตัว</li>
                <li className={/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}>• ตัวเลข 1 ตัว</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-lg font-bold text-lg text-white shadow-md transition-all transform active:scale-95 ${isFormValid()
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-200'
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              สมัครสมาชิก
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default App
