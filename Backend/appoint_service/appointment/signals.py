# auth_service/signals.py
from django.db.backends.signals import connection_created

def set_search_path(sender, connection, **kwargs):
    # Only for the default database
    if connection.settings_dict['ENGINE'] == 'django.db.backends.postgresql':
        with connection.cursor() as cursor:
            cursor.execute('SET search_path TO appointment_service, public;')

connection_created.connect(set_search_path)
