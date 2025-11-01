from django.urls import path
from .views import PatientProfileCreateUpdateView,GetprofilePatient,Getspeceficpatient,Getspecificpatientuser

urlpatterns=[
    path('api/addprofile',PatientProfileCreateUpdateView.as_view(),name='patient-profile-create'),
    path('api/getprofile',GetprofilePatient.as_view(),name='get-profile'),
    path('api/get-patient/<str:patient_id>',Getspeceficpatient.as_view(),name='get-patient'),
    path('api/get-user-id/<str:user_id>/',Getspecificpatientuser.as_view(),name='get-patient-from-user'),
]