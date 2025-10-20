from django.urls import path
from .views import PatientProfileCreateUpdateView,GetprofilePatient

urlpatterns=[
    path('api/profile-create/',PatientProfileCreateUpdateView.as_view(),name='patient-profile-create'),
    path('api/get-profile/',GetprofilePatient.as_view(),name='get-profile')
]