from django.urls import path
from . import views

urlpatterns = [
    # Listar pedidos de una farmacia
    path('farmacia/<int:farmacia_id>/', views.PedidosPorFarmaciaView.as_view(), name='pedidos-por-farmacia'),

    # Crear pedido (cliente → farmacia)
    path('crear/<int:farmacia_id>/', views.CrearPedidoView.as_view(), name='crear-pedido'),
]
