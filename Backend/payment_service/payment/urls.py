from django.urls import path
from payment.views import CreateOrderView ,VerifyOrderView,CheckPaymentstatusview,Razorpay_WebhookView

urlpatterns=[
    path('api/create-order',CreateOrderView.as_view(),name='create-order'),
    path('api/verify-order',VerifyOrderView.as_view(),name='verify-order'),
    path('api/payment-status/<int:appointment_id>',CheckPaymentstatusview.as_view(),name='payment-status'),
    path('api/webhook',Razorpay_WebhookView.as_view(),name='webhook-status'),
]