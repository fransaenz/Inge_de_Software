from rest_framework import serializers
from .models import Pedido, DetallePedido
from productos.serializers import ProductoSerializer

class DetallePedidoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = DetallePedido
        fields = ['id', 'producto', 'cantidad', 'precio_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)
    detalles = DetallePedidoSerializer(many=True, read_only=True)

    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    farmacia_nombre = serializers.CharField(source='farmacia.nombre', read_only=True)
    repartidor_nombre = serializers.CharField(source='repartidor.nombre', read_only=True)


    class Meta:
        model = Pedido
        fields = [
            'id',
            'cliente_nombre',
            'farmacia_nombre',
            'repartidor_nombre',
            'productos',
            'detalles',
            'direccion_entrega',
            'direccion_farmacia',
            'distancia',
            'metodo_pago',
            'fecha',
            'estado',
        ]