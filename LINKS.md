# روابط الموقع

## روابط الدخول

### صفحة تسجيل الدخول (Login)
```
http://localhost:3000/login
```
أو في الإنتاج:
```
https://ardbk.com/login
```

### صفحة الداشبورد (Dashboard)
```
http://localhost:3000/dashboard
```
أو في الإنتاج:
```
https://ardbk.com/dashboard
```

## صفحات الداشبورد الفرعية

- **نظرة عامة:** `/dashboard`
- **الطلبات:** `/dashboard/orders`
- **العملاء:** `/dashboard/customers`
- **العاملات:** `/dashboard/workers`
- **الاستقدام:** `/dashboard/assistants`
- **الخصومات:** `/dashboard/discounts`
- **الرسائل:** `/dashboard/messages`
- **التقارير:** `/dashboard/reports`
- **الملف الشخصي:** `/dashboard/profile`
- **الإعدادات:** `/dashboard/settings` (للمدير فقط)

## ملاحظات

- صفحة الداشبورد محمية وتتطلب تسجيل الدخول
- إذا لم تكن مسجلاً، سيتم توجيهك تلقائياً إلى صفحة `/login`
- بعد تسجيل الدخول الناجح، سيتم توجيهك إلى `/dashboard`

