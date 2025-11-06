from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'farmacia', 'nombre', 'presentacion', 'descripcion', 'precio', 'necesita_receta']
        read_only_fields = ['id', 'farmacia']
