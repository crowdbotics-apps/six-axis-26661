from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet, PrivacyPolicy, TermsOfService,
)

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")

urlpatterns = [
    path("", include(router.urls)),
    path("privacy-policy/", view=PrivacyPolicy.as_view()),
    path("terms-of-service/", view=TermsOfService.as_view()),

]
