from django.urls import path
from .views import PatientProfileCreateUpdateView,GetprofilePatient,Getspeceficpatient

urlpatterns=[
    path('api/profile-create/',PatientProfileCreateUpdateView.as_view(),name='patient-profile-create'),
    path('api/get-profile/',GetprofilePatient.as_view(),name='get-profile'),
    path('api/get-patient/<str:patient_id>',Getspeceficpatient.as_view(),name='get-patient')
]