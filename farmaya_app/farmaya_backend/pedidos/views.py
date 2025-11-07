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
        
# ✅ 4️⃣ Listar pedidos disponibles para repartidor
class PedidosDisponiblesView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Devuelve los pedidos que están listos para asignarse
        return Pedido.objects.filter(estado="confirmado")


# ✅ 5️⃣ Aceptar pedido (asignarlo al repartidor)
from rest_framework.response import Response
from rest_framework import status

class AceptarPedidoView(generics.UpdateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        pedido = self.get_object()
        pedido.estado = "asignado"
        pedido.repartidor = request.user  # el repartidor logueado
        pedido.save()
        serializer = self.get_serializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ 6️⃣ Rechazar pedido
class RechazarPedidoView(generics.UpdateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        pedido = self.get_object()
        pedido.estado = "rechazado"
        pedido.repartidor = None
        pedido.save()
        serializer = self.get_serializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)
