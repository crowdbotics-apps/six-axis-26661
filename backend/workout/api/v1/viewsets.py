from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from workout.api.v1.serializers import WorkoutGroupSerializer
from workout.models import WorkoutGroup


class WorkoutGroupViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = WorkoutGroup.objects.all()
    serializer_class = WorkoutGroupSerializer

    def get_queryset(self):
        queryset = self.queryset
        workout_type = self.request.query_params.get('workout_type')
        if workout_type is not None:
            queryset = queryset.filter(workout_type=workout_type)
        return queryset