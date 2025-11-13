@echo off
echo Updating database structure...
mysql -h 10.11.12.68 -u my_camp -pmy_camp my_camp < ../db/update_registration_names.sql
if %errorlevel% equ 0 (
    echo Database updated successfully
) else (
    echo Error updating database
)