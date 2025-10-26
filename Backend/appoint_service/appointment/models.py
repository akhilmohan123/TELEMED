from django.db import models
import random
class Appointmentmodel(models.Model):
    def create_new_ref_number():
        return str(random.randint(10000, 99999))  # 5-digit random number
    patient_id=models.IntegerField()
    doctor_id=models.IntegerField()
    date=models.DateField()
    time=models.TimeField()
    note=models.CharField(max_length=20)
    status=models.CharField(max_length=20,choices=[("completed","completed"),("pending","pending")],null=True,default='pending')
    refer_doctor_id = models.IntegerField(null=True, blank=True)
    referrence_no=models.CharField(max_length=10,blank=True,editable=False,default=create_new_ref_number)
    def save(self, *args, **kwargs):
        if not self.referrence_no:
            self.referrence_no = self.generate_unique_ref_no()
        super().save(*args, **kwargs)

    def generate_unique_ref_no(self):
        ref_number = self.create_new_ref_number()
        while Appointmentmodel.objects.filter(referrence_no=ref_number).exists():
            ref_number = create_new_ref_number()
        return ref_number
    def __str__(self):
        return f"{self.patient_id} booked {self.doctor_id} on {self.date} at {self.time}"
class Medicine(models.Model):
    appointment=models.ForeignKey(Appointmentmodel,related_name='medicines',on_delete=models.CASCADE)
    name=models.CharField(max_length=100)
    dosage=models.CharField(max_length=50)
    frequency=models.CharField(max_length=50)
    duration=models.CharField(max_length=50)
    additional_notes=models.TextField(blank=True,null=True)
    def __str__(self):
        return f"{self.name}-{self.appointment.patient_id}"

