from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Pedido, Receta
from productos.models import Producto  # ✅ import correcto


User = get_user_model()

# ============================================================
# 🔹 SERIALIZER DE USUARIO (para listar, editar y mostrar datos)
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'password', 'nombre',
            'tipo_usuario', 'direccion', 'telefono',
            'horarios', 'latitud', 'longitud'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# ============================================================
# 🔹 SERIALIZER DE REGISTRO (para crear nuevos usuarios)
# ============================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'nombre', 'tipo_usuario',
            'direccion', 'telefono', 'horarios',
            'latitud', 'longitud'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ============================================================
# 🔹 SERIALIZER ESPECIAL: LISTAR FARMACIAS
# ============================================================
class FarmaciaSerializer(serializers.ModelSerializer):
    """Usado para /accounts/usuarios/farmacias/"""
    class Meta:
        model = User
        fields = [
            'id', 'nombre', 'email', 'direccion', 'telefono',
            'horarios', 'latitud', 'longitud'
        ]


# ============================================================
# 🔹 PRODUCTOS
# ============================================================
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio',
            'stock', 'requiere_receta'
        ]


# ============================================================
# 🔹 PEDIDOS
# ============================================================
class PedidoSerializer(serializers.ModelSerializer):
    usuario_email = serializers.ReadOnlyField(source='usuario.email')
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre')

    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario_email', 'producto', 'producto_nombre',
            'cantidad', 'direccion_entrega', 'metodo_pago',
            'farmacia', 'repartidor', 'fecha', 'estado'
        ]


# ============================================================
# 🔹 RECETAS
# ============================================================
class RecetaSerializer(serializers.ModelSerializer):
    pedido_info = PedidoSerializer(source='pedido', read_only=True)

    class Meta:
        model = Receta
        fields = ['id', 'pedido', 'pedido_info', 'imagen', 'fecha_subida']
