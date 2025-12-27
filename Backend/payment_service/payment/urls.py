from django.urls import path
from .views import CreateOrderView ,VerifyOrderView

urlpatterns=[
    path('api/create-order',CreateOrderView.as_view(),name='create-order'),
    path('api/verify-order',VerifyOrderView.as_view(),name='verify-order')
]