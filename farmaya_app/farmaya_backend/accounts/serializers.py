from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Producto, Pedido, Receta

User = get_user_model()


# -----------------------------
# USUARIO
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'tipo_usuario']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            tipo_usuario=validated_data.get('tipo_usuario', 'cliente')
        )
        return user


# -----------------------------
# PRODUCTO
# -----------------------------
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio', 'stock', 'requiere_receta']


# -----------------------------
# PEDIDO
# -----------------------------
class PedidoSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.email')
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre')

    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario', 'producto', 'producto_nombre',
            'cantidad', 'direccion_entrega', 'metodo_pago',
            'farmacia', 'fecha', 'estado'
        ]


# -----------------------------
# RECETA
# -----------------------------
class RecetaSerializer(serializers.ModelSerializer):
    pedido_info = PedidoSerializer(source='pedido', read_only=True)

    class Meta:
        model = Receta
        fields = ['id', 'pedido', 'pedido_info', 'imagen', 'fecha_subida']
