from django.db import models
import os
def get_image_upload_path(instance, filename):
    # Ensure the user object is loaded
    user_id = instance.user.id if instance.user else 'unknown'
    # Define the path format
    return os.path.join('image', f'{user_id}_{filename}')
class DoctorModel(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("busy", "Busy"),
        ("offline", "Offline"),
        ("in_consultation", "In Consultation"),
       ]
    user_id = models.UUIDField()
    speciality = models.TextField(default="nill", blank=True, null=True)
    license_no = models.IntegerField(blank=True, null=True)
    organization_name = models.TextField(default="nill", blank=True, null=True)
    location = models.TextField(default="nill", blank=True, null=True)
    phone_number = models.IntegerField(blank=True, null=True)
    experiance = models.IntegerField(default=0, null=True)
    available_status=models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    image=models.ImageField(upload_to='image/',default='default_images/default_avatar.png')

    unique_together=("doctor","date","time")

    def __str__(self):
        return str(self.user_id)




