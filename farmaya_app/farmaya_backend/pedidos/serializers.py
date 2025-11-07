from rest_framework import serializers
from .models import Pedido
from productos.serializers import ProductoSerializer

class PedidoSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    farmacia_nombre = serializers.CharField(source='farmacia.nombre', read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente_nombre', 'farmacia_nombre', 'productos', 'fecha', 'estado']
