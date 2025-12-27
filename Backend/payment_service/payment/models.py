from django.db import models

class Payment(models.Model):
    appointment_id = models.CharField(max_length=100)

    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)

    amount = models.IntegerField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("CREATED", "CREATED"),
            ("PAID", "PAID"),
            ("FAILED", "FAILED"),
        ],
        default="CREATED"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.appointment_id} - {self.status}"
