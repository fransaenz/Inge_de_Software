from rest_framework import generics, permissions
from .models import Producto
from .serializers import ProductoSerializer

# 🔹 Listar y crear productos globalmente
class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(farmacia=self.request.user)


# 🔹 Ver, actualizar o eliminar un producto específico
class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]


# 🔹 Listar y crear productos asociados a una farmacia
class ProductosPorFarmaciaView(generics.ListCreateAPIView):
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        farmacia_id = self.kwargs['farmacia_id']
        return Producto.objects.filter(farmacia_id=farmacia_id)

    def perform_create(self, serializer):
        farmacia_id = self.kwargs['farmacia_id']
        serializer.save(farmacia_id=farmacia_id)


# ✅ Vista dedicada para crear un producto
class CrearProductoView(generics.CreateAPIView):
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(farmacia=self.request.user)
