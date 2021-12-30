from django.urls import path, include
from rest_framework.routers import DefaultRouter

from workout.api.v1.viewsets import WorkoutGroupViewSet

router = DefaultRouter()
router.register("workout", WorkoutGroupViewSet, basename="workout")

urlpatterns = [
    path("", include(router.urls)),
]
