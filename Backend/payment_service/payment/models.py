from django.db import models

# Create your models here.


class Payment(models.Model):
    appointment_id=models.Charfield(max_length=100)
    razorpay_order_id=models.CharField(max_length=100,null=True)
    razorpay_payment_id=models.CharField(max_length=100,null=True)
    amount=models.IntegerField()
    status=models.CharField(
        max_length=20,
        choices=[("CREATED","CREATED"),("PAID","PAID"),("FAILED","FAILED")]

    )

    created_at=models.DateTimeField(auto_now_add=True)
    