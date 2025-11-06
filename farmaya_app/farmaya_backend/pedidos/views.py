from rest_framework import generics, permissions
from .models import Pedido
from .serializers import PedidoSerializer

# ✅ 1️⃣ Listar todos los pedidos (ruta base /api/pedidos/)
class PedidoListView(generics.ListAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ 2️⃣ Listar pedidos de una farmacia específica
class PedidosPorFarmaciaView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        farmacia_id = self.kwargs['farmacia_id']
        return Pedido.objects.filter(farmacia_id=farmacia_id)


# ✅ 3️⃣ Crear pedido (cuando un cliente realiza el pedido)
class CrearPedidoView(generics.CreateAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cliente = self.request.user
        farmacia_id = self.kwargs['farmacia_id']
        serializer.save(cliente=cliente, farmacia_id=farmacia_id)
