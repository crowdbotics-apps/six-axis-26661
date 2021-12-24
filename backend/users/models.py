from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    # name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    height = models.CharField(_("Height"), blank=True, null=True, max_length=255)
    weight = models.CharField(_("Weight"), blank=True, null=True, max_length=255)
    profile_picture = models.ImageField(upload_to='user_profile_pictures', blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=150, null=True, blank=True)
    is_subscribe = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    @property
    def name(self):
        return self.first_name + " " + self.last_name