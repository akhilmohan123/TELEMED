import jwt
from django.utils import timezone
import datetime
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .models import User
with open("C:/Users/user/Desktop/akhil/private.pem", "r") as f:
    private_key = f.read()
def generate_tokens(user):
    print("private key is ====",private_key)
    access_payload={
        "id":user.id,
        "email":user.email,
        "exp":timezone.now()+datetime.timedelta(minutes=15),
        "iat":timezone.now()
    }
    refresh_payload={
        "id":user.id,
        "exp":timezone.now()+datetime.timedelta(days=7),
        "iat":timezone.now()
    }

    access_token=jwt.encode(access_payload,private_key,algorithm="RS256")
    refresh_token=jwt.encode(refresh_payload,private_key,algorithm="RS256")

    return access_token,refresh_token

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 
    def post(self,request):
        refresh_token=request.COOKIES.get('refresh_token')
        print("refresh token is ===",refresh_token)
        if not refresh_token:
            print("inside the none")
            return Response(
                {"error": "Refresh token missing. Please log in again."},
                status=401
            )
        try:
            payload=jwt.decode(refresh_token,private_key,algorithms=["RS256"])
            user=User.objects.get(id=payload['id'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Refresh token has expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid token')
        
        access_token,_=generate_tokens(user)
        response=Response()
        response.set_cookie(key='access_token',value=access_token,httponly=True,secure=False,samesite='Strict')
        response.data={
            "message":"New access token issued"
        }
        return response

