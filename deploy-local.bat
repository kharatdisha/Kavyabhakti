@echo off
echo 🏥 Kavyabhakti Pharmacy - Local Deploy Script (Windows)

echo [1/5] Backend dependencies...
cd Backend
call npm install

echo [2/5] Copy .env...
if not exist .env copy .env.example .env
echo Edit Backend\.env - Set JWT_SECRET before step 3!

echo [3/5] Create/Setup Database...
mysql -u root -p'rekha@83' -e "CREATE DATABASE IF NOT EXISTS kavyabhakti_medical;"
mysql -u root -p'rekha@83' kavyabhakti_medical < ..\database\schema.sql
echo ✅ Database ready!

echo [4/5] Start Backend...
start cmd /k "npm start"
timeout /t 3

echo [5/5] Open Frontend...
cd ..\Frontend
start index.html

echo 🚀 Deploy complete! Backend: http://localhost:3000 Frontend: Live Server 5500
echo Admin login: admin / admin123
pause
