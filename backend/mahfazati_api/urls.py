from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.http import JsonResponse
from django.urls import include, path


def health(request):
    return JsonResponse({"status": "healthy", "service": "Mahfazati Finance API"})


urlpatterns = [
    path("health/", health, name="health"),
    path("django-admin/", admin.site.urls),
    path("accounts/login/", auth_views.LoginView.as_view(), name="login"),
    path("accounts/logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("api/v1/", include("finance.urls")),
]
