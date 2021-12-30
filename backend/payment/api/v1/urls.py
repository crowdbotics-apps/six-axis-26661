from django.urls import path, include
from rest_framework.routers import DefaultRouter
from payment.api.v1.viewsets import PaymentViewSet

router = DefaultRouter()
router.register('payment', PaymentViewSet, basename='payment')

urlpatterns = [
    path("", include(router.urls)),

]
