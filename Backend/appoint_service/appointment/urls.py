from django.urls import path
from . views import Appointmentview,DeleteAppointment,GetDoctorAppointment,GetSpeceficPatient,EditDoctorView,AddMedicineViews,GetMedicineView,GetSpeceficMedicine,GetReferAppointment
urlpatterns = [
   path('api/appointments',Appointmentview.as_view(),name='createdoctor'),
   path('api/createdoctor/<int:id>',Appointmentview.as_view(),name='createdoctor'),
   path('api/appointmentdelete/<int:id>',DeleteAppointment.as_view(),name='appointmentdelete') ,
   path('api/getdoctor-appointments',GetDoctorAppointment.as_view(),name='getdoctor-appointments'),
   path('api/getspecefic/<int:id>',GetSpeceficPatient.as_view(),name='getspecefic'),
   path('api/edit-patient/<int:id>',EditDoctorView.as_view(),name='edit-doctor'),
   path('api/add-medicine',AddMedicineViews.as_view(),name='add-medicine'),
   path('api/get-medicines',GetMedicineView.as_view(),name='get-medicine'),
   path('api/specefic-medicine/<int:id>',GetSpeceficMedicine.as_view(),name='get-specefic'),
   path('api/get-refer-appointments',GetReferAppointment.as_view(),name='get-refer-appointments'),
   path('api/appointment/<int:id>',Appointmentview.as_view(),name='appointment'),
   path('api/appointment-mark/<int:id>',Appointmentmarkview.as_view(),name='appointment-mark'),
]
