@echo off
echo Compilando e organizando assets...

REM Compilar Bootstrap
cd app\static\vendor\bootstrap-main
call npm install
call npm run dist

REM Criar estrutura organizada
cd ..\..\..\..\
mkdir app\static\vendor\bootstrap 2>nul
mkdir app\static\vendor\bootstrap\css 2>nul
mkdir app\static\vendor\bootstrap\js 2>nul
mkdir app\static\vendor\bootstrap\scss 2>nul

REM Copiar arquivos compilados do Bootstrap
copy app\static\vendor\bootstrap-main\dist\css\* app\static\vendor\bootstrap\css\
copy app\static\vendor\bootstrap-main\dist\js\* app\static\vendor\bootstrap\js\
xcopy app\static\vendor\bootstrap-main\scss app\static\vendor\bootstrap\scss\ /E /I


echo Compilação concluída!
echo.
echo Estrutura criada:
echo - app/static/vendor/bootstrap/
echo.
echo Agora você pode deletar:
echo - bootstrap-main/
echo - bootstrap_537/
pause