# تشغيل محفظتي محلياً من repo واحد

يحتوي repo `p2` الواجهة React في `client/` والخلفية Django REST في `backend/`. يشغّل الملف [`compose.yaml`](../compose.yaml) الواجهة وAPI وPostgreSQL من المستودع نفسه.

## البدء

انسخ ملف إعدادات الخلفية ثم شغّل Compose من جذر المستودع:

```bash
cp .env.backend.local.example .env.backend.local
docker compose up --build
```

تُطبق ترحيلات Django تلقائياً. أنشئ مستخدم تطوير لمرة واحدة ثم سجّل الدخول من الواجهة:

```bash
docker compose exec api python manage.py createsuperuser
```

افتح `http://localhost:3000`. تُفحص صحة API عبر `http://localhost:8000/health/`.

## الاختبارات

```bash
docker compose exec api pytest finance/tests/test_finance_api.py -q
docker compose exec frontend pnpm run check
```

لإعادة ضبط بيانات التطوير فقط:

```bash
docker compose down -v
```
