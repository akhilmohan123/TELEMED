from django.apps import AppConfig
from django.db.models.signals import pre_migrate
from django.conf import settings
import os
class AppointmentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "appointment"

    def ready(self):
        import appointment.signals
        pre_migrate.connect(set_search_path_before_migration, sender=self)
def set_search_path_before_migration(sender, **kwargs):
    from django.db import connection

    # only set schema in production
    if os.getenv("ENVIRONMENT") == "production":
        with connection.cursor() as cursor:
            cursor.execute("SET search_path TO appointment_service, public;")


