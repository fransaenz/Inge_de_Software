from rest_framework import generics, permissions
from .models import Pedido
from .serializers import PedidoSerializer

# 🔹 Listar pedidos de una farmacia
class PedidosPorFarmaciaView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        farmacia_id = self.kwargs['farmacia_id']
        return Pedido.objects.filter(farmacia_id=farmacia_id)


# 🔹 Crear pedido (cuando un cliente realiza el pedido)
class CrearPedidoView(generics.CreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cliente = self.request.user
        farmacia_id = self.kwargs['farmacia_id']
        serializer.save(cliente=cliente, farmacia_id=farmacia_id)
