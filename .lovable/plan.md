## Назначить info@remissionsoft.com администратором

Добавить запись в таблицу `user_roles` с ролью `admin` для пользователя с email `info@remissionsoft.com`.

### Шаги
1. Найти `user_id` в `auth.users` по email `info@remissionsoft.com`.
2. Вставить строку в `public.user_roles` (`user_id`, `role = 'admin'`). Уникальное ограничение `(user_id, role)` защитит от дублей.

### SQL
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'info@remissionsoft.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Проверка
- `SELECT` из `user_roles` для подтверждения, что роль создана.
- Если аккаунт ещё не зарегистрирован — операция ничего не вставит; нужно сначала зарегистрироваться, затем повторить.