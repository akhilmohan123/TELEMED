import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
with open("C:/Users/user/Desktop/akhil/private.pem", "r") as f:
    private_key = f.read()
with open("C:/Users/user/Desktop/akhil/public.pem", "r") as f:
    public_key = f.read()
User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # auth_header = request.headers.get('Authorization')
        
        # if not auth_header:
        #     return None
        print("JWTAuthentication called")

        try:
            print(request.COOKIES)
            token = request.COOKIES.get('access_token')
            print("Extracted token:", token)
            print("private key is there ====",private_key)
            if not token:
                return None
            print("decoding started")
            payload = jwt.decode(token, public_key, algorithms=["RS256"])
            
            user = User.objects.get(id=payload['id'])
            print("user is ======",user)
            return (user, token)
        except jwt.ExpiredSignatureError as e:
            print("1",e)
            return None
        except jwt.DecodeError as e:
            print("2",e)
            return None
        except Exception as e:
            print("3",e)
            return None
        except User.DoesNotExist as e:
            print("4",e)
            return None
