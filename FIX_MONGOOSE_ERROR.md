# 🔧 حل مشكلة SyntaxError: Unexpected identifier 'mongoose'

## المشكلة:
```
SyntaxError: Unexpected identifier 'mongoose'
```

## السبب المحتمل:
1. mongoose غير مثبت في `node_modules`
2. مشكلة في إصدار Node.js
3. مشكلة في package.json

## الحل:

### 1. التحقق من تثبيت mongoose:

```bash
cd /var/www/cleaning/backend
npm list mongoose
```

### 2. إعادة تثبيت mongoose:

```bash
cd /var/www/cleaning/backend
npm uninstall mongoose
npm install mongoose@^8.0.3
```

### 3. إعادة تثبيت جميع dependencies:

```bash
cd /var/www/cleaning/backend
rm -rf node_modules package-lock.json
npm install
```

### 4. التحقق من إصدار Node.js:

```bash
node --version
# يجب أن يكون v16 أو أحدث
```

### 5. إعادة تشغيل PM2:

```bash
cd /var/www/cleaning
pm2 restart cleaning-backend
pm2 logs cleaning-backend --lines 50
```

### 6. إذا استمرت المشكلة:

```bash
# حذف العملية وإعادة إنشائها
pm2 delete cleaning-backend
cd /var/www/cleaning
pm2 start pm2-ecosystem.config.js
pm2 save
```

## التحقق من package.json:

تأكد من أن `package.json` يحتوي على:
```json
{
  "type": "module",
  "dependencies": {
    "mongoose": "^8.0.3"
  }
}
```

## إذا كان Node.js قديم:

```bash
# تحديث Node.js (على Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# أو استخدام nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

