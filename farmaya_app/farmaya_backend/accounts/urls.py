from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterUserView,
    UserDetailView,
    FarmaciaListView,
)

urlpatterns = [
    # ============================================================
    # 🔹 AUTENTICACIÓN (JWT)
    # ============================================================
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ============================================================
    # 🔹 USUARIOS
    # ============================================================
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('usuarios/me/', UserDetailView.as_view(), name='user_detail'),

    # ============================================================
    # 🔹 FARMACIAS
    # ============================================================
    path('usuarios/farmacias/', FarmaciaListView.as_view(), name='farmacias_list'),
]
