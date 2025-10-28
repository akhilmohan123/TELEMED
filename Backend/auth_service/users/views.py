from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from . serializers import PublicSerializer, RegisterSerializer,LoginSerializer,UserSerializer
from . models import User
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from . token_generation import generate_tokens
import jwt,datetime
from django.core.mail import send_mail
from django.conf import settings
class RegistrationView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        print(request.data)
        serializer=RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):  
        print("login view called")
        serializer=LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user=serializer.validated_data
        user=User.objects.get(id=user.id)
        userjson=UserSerializer(user)
        print(userjson.data)
        
        access_token,refresh_token=generate_tokens(user)
        response=Response()
        response.set_cookie(
         key='access_token',
         value=access_token,
         httponly=True,
         samesite='None',  # prevents CSRF
         secure=True        # True if using HTTPS
        )
        response.set_cookie(
         key='refresh_token',
         value=refresh_token,
         httponly=True,
         samesite='None',  # prevents CSRF
         secure=True        # True if using HTTPS
        )
        response.data={
            'message':'Login successfully',
            'user':userjson.data
        }
        return response
class UserView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):

     
        
        # Print the token for debugging

        try: 
            # Decode the JWT token
        
            user=request.user
            # Serialize the user data
            serializer = UserSerializer(user)
            
            return Response(serializer.data)
        
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")
        except Exception as e:
            # Catch any other exceptions and log them
            print(f"An error occurred: {e}")
            raise AuthenticationFailed("An error occurred while processing your request")
class LogoutView(APIView):
    permission_classes=[AllowAny]
    
    def post(self,request):
         response=Response({
            "message":"Logout successfully"
         })
         response.delete_cookie('access_token')
         response.delete_cookie('refresh_token')

         return response

#view for forgot password 

class ForgotPasswordView(APIView):
    permission_classes=[AllowAny]
    def post(Self,request):
        email=request.data.get('email')
        print("email is ",email)
        user=User.objects.filter(email=email).first()
        if not user:
            return Response({"Error":"user with this email does not exist"})
        
        #payload for generating the token
        payload={
            "id":user.id,
            "exp":timezone.now()+datetime.timedelta(minutes=5),
            "iat":timezone.now()

        }

        token=jwt.encode(payload,"secret",algorithm="HS256")
        reset_link=f"http://localhost:3000/reset-password/{token}"

        #send mail with token 
        send_mail(
            subject="Password Reset Request",
            message=f"Click the link to reset your password:{reset_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=["akhilmohan299@gmail.com"],
        )

        return Response({"message":"Password reset link has been sent to your email"})
    
#view for reset password
class ResetPasswordView(APIView):
    permission_classes=[AllowAny]
    def post(self,request,token):
        password=request.data.get('password')
        if not password:
            return Response({"Error":"Password is required"})
        try:
            payload=jwt.decode(token,'secret',algorithms=['HS256'])
            user=User.objects.get(id=payload['id'])
        except jwt.ExpiredSignatureError:
            return Response({"Error":"Link has expired please try again later"})
        except jwt.DecodeError:
            return Response({"Error":"Invalid token"})
        confirm_password=request.data.get('confirm_password')
        
        if password!=confirm_password:
            return Response({'Error':"password do not match"})
        user.set_password(password)
        user.save()
        return Response({"message":"Password reset successfully"})
    
        
        
class PublicUserView(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        try:
            user = User.objects.all()
            serializer = PublicSerializer(user,many=True)
            print(serializer.data)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        

class Getuserview(APIView):
    permission_classes=[AllowAny]
    def get(self,request,user_id):
        try:
            print("user id is ",user_id)
            user=User.objects.get(id=user_id)
            serializer=UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"Error":"User not found"},status=404)
