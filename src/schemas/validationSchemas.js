import { z } from 'zod';

// Service Request Schema
export const serviceRequestSchema = z.object({
  // Step 1: Personal Info
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  
  // Step 2: Service Details
  serviceType: z.enum(['comprehensive', 'normal', 'quick'], {
    errorMap: () => ({ message: 'يرجى اختيار نوع الخدمة' }),
  }),
  rooms: z.number().min(1, 'عدد الغرف يجب أن يكون 1 على الأقل').max(20),
  workers: z.number().min(1, 'عدد العاملات يجب أن يكون 1 على الأقل').max(5),
  date: z.date({ required_error: 'يرجى اختيار التاريخ' }),
  time: z.string().min(1, 'يرجى اختيار الوقت'),
  
  // Step 3: Address
  address: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'يرجى اختيار المدينة'),
  district: z.string().min(1, 'يرجى إدخال الحي'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Step 4: Notes
  notes: z.string().optional(),
  hasPets: z.boolean().default(false),
  specialCleaning: z.boolean().default(false),
  spareKey: z.boolean().default(false),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
});

// Recruitment Application Schema
export const recruitmentSchema = z.object({
  // Basic Info
  arabicName: z.string().min(3, 'الاسم بالعربي يجب أن يكون 3 أحرف على الأقل'),
  englishName: z.string().min(3, 'الاسم بالإنجليزي يجب أن يكون 3 أحرف على الأقل'),
  birthDate: z.date({ required_error: 'يرجى اختيار تاريخ الميلاد' }),
  nationality: z.string().min(1, 'يرجى اختيار الجنسية'),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  idNumber: z.string().min(10, 'رقم الهوية/الإقامة غير صحيح'),
  
  // Work Info
  contractType: z.enum(['daily', 'monthly', 'yearly'], {
    errorMap: () => ({ message: 'يرجى اختيار نوع العقد' }),
  }),
  experience: z.number().min(0).max(20),
  skills: z.array(z.string()).min(1, 'يرجى اختيار مهارة واحدة على الأقل'),
  languages: z.array(z.string()).min(1, 'يرجى اختيار لغة واحدة على الأقل'),
  maritalStatus: z.string().min(1, 'يرجى اختيار الحالة الاجتماعية'),
  
  // Documents
  photos: z.array(z.any()).min(2, 'يرجى رفع صورتين على الأقل').max(7, 'الحد الأقصى 7 صور'),
  idPhoto: z.any().refine(file => file !== null, {
    message: 'يرجى رفع صورة الهوية',
  }),
  cv: z.any().optional(),
  
  // Notes
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
});

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  subject: z.string().min(1, 'يرجى اختيار الموضوع'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
});

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  rememberMe: z.boolean().default(false),
});

// Customer Schema
export const customerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
});

// Worker Schema
export const workerSchema = z.object({
  arabicName: z.string().min(3, 'الاسم بالعربي يجب أن يكون 3 أحرف على الأقل'),
  englishName: z.string().min(3, 'الاسم بالإنجليزي يجب أن يكون 3 أحرف على الأقل'),
  nationality: z.string().min(1, 'يرجى اختيار الجنسية'),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  idNumber: z.string().min(10, 'رقم الهوية/الإقامة غير صحيح'),
  birthDate: z.date({ required_error: 'يرجى اختيار تاريخ الميلاد' }),
  contractType: z.enum(['daily', 'monthly', 'yearly']),
  experience: z.number().min(0).max(20),
  skills: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  maritalStatus: z.string().min(1),
  status: z.enum(['available', 'busy', 'vacation']),
});

// Settings Schema
export const settingsSchema = z.object({
  companyName: z.string().min(1, 'اسم الشركة مطلوب'),
  companyNameEn: z.string().optional(),
  commercialRegister: z.string().optional(),
  taxNumber: z.string().optional(),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  workingHours: z.record(z.any()).optional(),
});

// Inquiry Schema
export const inquirySchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(7, 'رقم الهاتف يجب أن يكون 7 أرقام على الأقل').max(20, 'رقم الهاتف يجب أن يكون 20 رقم على الأكثر').regex(/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  notes: z.string().optional(),
  inquiryType: z.enum(['contract', 'booking', 'general'], {
    errorMap: () => ({ message: 'يرجى اختيار نوع الاستفسار' }),
  }),
  workerId: z.string().optional(),
  housemaidId: z.string().optional(),
});

