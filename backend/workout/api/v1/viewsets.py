from django.http import Http404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from workout.api.v1.serializers import WorkoutGroupSerializer, WorkoutDifficultySerializer, StandaloneWorkoutSerializer, \
    SeriesWorkoutSerializer, WorkoutHistorySerializer
from workout.models import WorkoutGroup, WorkoutDifficulty, StandaloneWorkout, SeriesWorkout, StandaloneWorkoutSetup, \
    WorkoutHistory


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


class WorkoutDifficultyViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = WorkoutDifficulty.objects.all()
    serializer_class = WorkoutDifficultySerializer


class StandaloneWorkoutViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = StandaloneWorkout.objects.all()
    serializer_class = StandaloneWorkoutSerializer


class SeriesWorkoutViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = SeriesWorkout.objects.all()
    serializer_class = SeriesWorkoutSerializer

    def get_standalone_workout(self, standalone_workout_id):
        try:
            return StandaloneWorkout.objects.get(pk=standalone_workout_id)
        except (TypeError, ValueError, StandaloneWorkout.DoesNotExist):
            raise Http404('Standalone workout not found')

    @action(detail=True, methods=['post'], url_path='add-standalone', url_name='add-standalone')
    def add_standalone(self, request, pk=None):
        series_workout = self.queryset.get(pk=pk)
        standalone_workout_id = self.request.data.get('standalone_workout_id', None)
        if not standalone_workout_id:
            return Response(data={'message': 'Standalone workout ID required.'}, status=status.HTTP_201_CREATED)
        standalone_workout = self.get_standalone_workout(standalone_workout_id)
        StandaloneWorkoutSetup.objects.create(
            standalone_workout=standalone_workout,
            series_workout=series_workout,
            repetition_number=self.request.data.get('repetition_number', None),
            disk_position=self.request.data.get('disk_position', None)
        )
        return Response(data={'message': 'Standalone workout added.'})


class WorkoutHistoryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = WorkoutHistory.objects.all()
    serializer_class = WorkoutHistorySerializer


class PerformanceMetrics(APIView):

    def get(self, request):
        user = self.request.user
        queryset = WorkoutHistory.objects.filter(user=user).filter(workout_end_time__isnull=False).order_by('-id')
        last_workout = queryset[0]
        second_last_workout = queryset[1]
        new_workout = {
            "workout_time": last_workout.workout_end_time - last_workout.workout_start_time,
            "calories_burnt": last_workout.burn_calories,
        }
        prev_workout = {
            "workout_time": second_last_workout.workout_end_time - second_last_workout.workout_start_time,
            "calories_burnt": second_last_workout.burn_calories,
        }
        return Response(data={
            'new_workout': new_workout,
            'previous_workout': prev_workout
        })
