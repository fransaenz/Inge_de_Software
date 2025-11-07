from django.urls import path
from . import views

urlpatterns = [
    # ✅ Ruta base: lista todos los pedidos (GET)
    path('', views.PedidoListView.as_view(), name='pedido-list'),

    # 🔹 Listar pedidos de una farmacia específica
    path('farmacia/<int:farmacia_id>/', views.PedidosPorFarmaciaView.as_view(), name='pedidos-por-farmacia'),

    # 🔹 Crear pedido (cliente → farmacia)
    path('crear/<int:farmacia_id>/', views.CrearPedidoView.as_view(), name='crear-pedido'),
    
    # 🔹 ver pedidos disponibles (repartidor)
    path('repartidor/', views.PedidosDisponiblesView.as_view(), name='pedidos-repartidor'),
    
    # 🔹 aceptar pedido (repartidor)
    path('<int:pk>/asignar/', views.AceptarPedidoView.as_view(), name='asignar-pedido'),

    # 🔹 rechazar pedido (repartidor)
    path('<int:pk>/rechazar/', views.RechazarPedidoView.as_view(), name='rechazar-pedido'),
]
