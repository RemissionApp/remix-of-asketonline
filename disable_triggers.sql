-- Отключаем триггеры на auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_create_onboarding_state ON auth.users;

-- Проверяем, остались ли триггеры
SELECT trigger_name, event_manipulation, action_statement, action_timing
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' AND event_object_table = 'users';
