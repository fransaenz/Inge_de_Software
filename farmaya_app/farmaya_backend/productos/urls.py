from django.urls import path
from .views import (
    ProductoListCreateView,
    ProductoDetailView,
    ProductosPorFarmaciaView,
    CrearProductoView,
)

urlpatterns = [
    # 🔹 Crear producto
    path('crear/', CrearProductoView.as_view(), name='crear-producto'),

    # 🔹 Listar todos los productos / crear globalmente
    path('', ProductoListCreateView.as_view(), name='productos-list-create'),

    # 🔹 Listar productos por farmacia
    path('farmacia/<int:farmacia_id>/', ProductosPorFarmaciaView.as_view(), name='productos-por-farmacia'),

    # 🔹 Ver, editar o eliminar un producto específico
    path('<int:pk>/', ProductoDetailView.as_view(), name='producto-detail'),
]
