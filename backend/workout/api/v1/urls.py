from django.urls import path, include
from rest_framework.routers import DefaultRouter

from workout.api.v1.viewsets import WorkoutGroupViewSet, WorkoutDifficultyViewSet, StandaloneWorkoutViewSet, \
    SeriesWorkoutViewSet, WorkoutHistoryViewSet, PerformanceMetrics

router = DefaultRouter()
router.register("workout", WorkoutGroupViewSet, basename="workout")
router.register("workout-difficulty", WorkoutDifficultyViewSet, basename="workout-difficulty")
router.register("standalone-workout", StandaloneWorkoutViewSet, basename="standalone-workout")
router.register("series-workout", SeriesWorkoutViewSet, basename="series-workout")
router.register("workout-history", WorkoutHistoryViewSet, basename="workout-history")

urlpatterns = [
    path("", include(router.urls)),
    path('performance-metrics/', PerformanceMetrics.as_view()),
]
