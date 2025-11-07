from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Pedido, Receta
from productos.models import Producto  # ✅ import correcto

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    ProductoSerializer,
    PedidoSerializer,
    RecetaSerializer,
    FarmaciaSerializer,  # ✅ Serializer para farmacias
)

User = get_user_model()

# ============================================================
# 🔹 REGISTRO DE USUARIOS
# ============================================================
class RegisterUserView(generics.CreateAPIView):
    """
    Endpoint: /api/register/
    Permite registrar nuevos usuarios (cliente, farmacia o repartidor)
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # 👈 acceso público


# ============================================================
# 🔹 LISTADO DE FARMACIAS (para el mapa en el frontend)
# ============================================================
class FarmaciaListView(generics.ListAPIView):
    """
    Endpoint: /api/farmacias/
    Devuelve todas las farmacias registradas con dirección y coordenadas.
    """
    serializer_class = FarmaciaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Filtra solo usuarios tipo farmacia con coordenadas
        return User.objects.filter(tipo_usuario='farmacia').exclude(latitud=None, longitud=None)


# ============================================================
# 🔹 PERFIL DEL USUARIO AUTENTICADO
# ============================================================
class UserDetailView(generics.RetrieveAPIView):
    """
    Endpoint: /api/usuarios/me/
    Devuelve la información del usuario autenticado
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# ============================================================
# 🔹 PRODUCTOS
# ============================================================
class ProductoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de productos.
    Rutas automáticas: /api/productos/
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]


# ============================================================
# 🔹 PEDIDOS
# ============================================================
class PedidoViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de pedidos.
    Rutas automáticas: /api/pedidos/
    """
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario autenticado al pedido
        serializer.save(usuario=self.request.user)


# ============================================================
# 🔹 RECETAS
# ============================================================
class RecetaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de recetas médicas asociadas a pedidos.
    Rutas automáticas: /api/recetas/
    """
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticated]
