from django.db import models
from accounts.models import User
from productos.models import Producto

class Pedido(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),           # Pedido creado, no confirmado aún
        ('confirmado', 'Confirmado'),         # Aprobado por la farmacia, esperando repartidor
        ('asignado', 'Asignado'),             # Tomado por un repartidor
        ('retirado', 'Retirado de farmacia'), # En camino al cliente
        ('entregado', 'Entregado al cliente'),
        ('rechazado', 'Rechazado por repartidor'),
        ('cancelado', 'Cancelado'),
    ]

    cliente = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='pedidos_cliente'
    )
    farmacia = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='pedidos_farmacia'
    )
    repartidor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='pedidos_repartidor'
    )

    productos = models.ManyToManyField(Producto, through='DetallePedido')  # 👈 relación intermedia
    direccion_entrega = models.CharField(max_length=255)
    direccion_farmacia = models.CharField(max_length=255, blank=True, null=True)  # útil para mapa
    metodo_pago = models.CharField(max_length=50)
    distancia = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, choices=ESTADOS, default='pendiente')

    def __str__(self):
        return f"Pedido #{self.id} - {self.farmacia.nombre} ({self.estado})"
    
    class Meta:
        ordering = ['-fecha']  # más reciente primero


class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.producto.nombre} x{self.cantidad}"
    
    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario
