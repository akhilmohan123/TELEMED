from django.urls import path
from .views import DoctorCreateView,GetDoctordata,GetAllDoctors,GetSpeceficDoctor

urlpatterns=[
    path('api/profile-create/',DoctorCreateView.as_view(),name='doctor-profile-create'),
    path('api/get-doctor/',GetDoctordata.as_view(),name='get-doctor-data'),
    path('api/get-all-doctors/',GetAllDoctors.as_view(),name='get-all-doctors'), 
    path('api/get-doctor/<str:doctor_id>/',GetSpeceficDoctor.as_view(),name='get-doctor'),       

]