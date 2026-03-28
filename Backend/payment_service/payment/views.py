from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import razorpay
from dotenv import load_dotenv
from rest_framework.permissions import IsAuthenticated,AllowAny
from .authentication import JWTAuthentication
from . models import Payment,WebhookEvent
from . utils import mark_appoitment_details
import os
import hmac
import hashlib
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
load_dotenv()

# Create your views here.
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self,request):
        RAZORPAY_SECRET_KEY=os.getenv('RAZORPAY_SECRET_KEY', 'local')
        RAZORPAY_KEY_ID=os.getenv('RAZORPAY_KEY_ID', 'local')
        #logic to create order 
        appointment_id=request.data.get('appointment_id')
        amount=request.data.get('amount')
        if not appointment_id or not amount:
            return Response(
            {"error": "appointment_id and amount required"},
            status=status.HTTP_400_BAD_REQUEST
        )
        if appointment_id and amount:
            # Here you would typically create an order in your database
            
            amount_in_paise=int(amount)*100

            client=razorpay.Client(
                auth=(RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY)
            )
            order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": 1
            })
                    # CREATE PAYMENT RECORD
            Payment.objects.create(
            appointment_id=appointment_id,
            razorpay_order_id=order["id"],
            amount=amount,
            status="CREATED"
            )
            return Response({
             "razorpay_order_id": order["id"],
             "amount": order["amount"],
             "currency": order["currency"]
            }, status=status.HTTP_201_CREATED)
        

class VerifyOrderView(APIView):
    def post(self,request):
        RAZORPAY_SECRET_KEY=os.getenv('RAZORPAY_SECRET_KEY', 'local')
        RAZORPAY_KEY_ID=os.getenv('RAZORPAY_KEY_ID', 'local')
        appointment_id=request.data.get('appointment_id')
        razorpay_payment_id=request.data.get('razorpay_payment_id')
        razorpay_order_id=request.data.get('razorpay_order_id')
        razorpay_signature=request.data.get('razorpay_signature')
        client=razorpay.Client(
            auth=(RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY)
        )
        data = {
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_order_id": razorpay_order_id,
        "razorpay_signature": razorpay_signature
        }
        try:
            client.utility.verify_payment_signature(data)

            #mark appointment as paid
            

            ##logic to mark the appointment as paid in db for appointment model 
            payment = Payment.objects.filter(
                razorpay_order_id=razorpay_order_id
            ).first()
            if payment:
                payment.razorpay_payment_id=razorpay_payment_id
                payment.status="PAID"
                payment.save()
                mark_appoitment_details(payment.appointment_id)



            return Response({"message":"Payment verified successfully"},status=200)
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"error": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        



@method_decorator(csrf_exempt, name='dispatch')
class Razorpay_WebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            print("The view Razorpay_WebhookView is called ")


            # Get Razorpay signature
            razorpay_signature = request.headers.get("X-Razorpay-Signature")
            if not razorpay_signature:
                return Response(
                    {"error": "Missing Razorpay signature"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            body = request.body
            payload = request.data
            event_id = request.headers.get("X-Razorpay-Event-Id")
            if not event_id:
              return Response({"error": "Missing event id"}, status=400)
            if WebhookEvent.objects.filter(event_id=event_id).exists():
                return Response({"message": "Event already processed"}, status=200)
            WebhookEvent.objects.create(event_id=event_id)
            RAZORPAY_WEBHOOK_SECRET = os.getenv('RAZORPAY_WEBHOOK_SECRET', 'local')
            # Generate signature
            generated_signature = hmac.new(
                RAZORPAY_WEBHOOK_SECRET.encode(),
                body,
                hashlib.sha256
            ).hexdigest()

            # Verify signature
            if not hmac.compare_digest(generated_signature, razorpay_signature):
                return Response(
                    {"error": "Invalid signature"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payload = request.data
            event = payload.get("event")
            print("Webhook event:", event)

            # PAYMENT CAPTURED
            if event == "payment.captured":
                print("Webhook called ")
                payment = payload["payload"]["payment"]["entity"]
                payment_id = payment["id"]
                order_id = payment.get("order_id")
                amount = payment["amount"] // 100
                
                payment_record = Payment.objects.filter(
                    razorpay_order_id=order_id
                ).first()
                mark_appoitment=mark_appoitment_details(payment_record.appointment_id)

                if payment_record and payment_record.status == "PAID":
                    return Response({"message": "Payment already processed"}, status=200)

                if payment_record and payment_record.status != "PAID":
                    payment_record.razorpay_payment_id = payment_id
                    payment_record.amount = amount
                    payment_record.status = "PAID"
                    payment_record.save()


            # ---------------- PAYMENT FAILED ----------------
            elif event == "payment.failed":
                payment = payload["payload"]["payment"]["entity"]
                order_id = payment.get("order_id")

                payment_record = Payment.objects.filter(
                    razorpay_order_id=order_id
                ).first()

                if payment_record:
                    payment_record.status = "FAILED"
                    payment_record.save()
                return Response({"message":"Payment failure processed"},status=status.HTTP_200_OK)
                    

            # ---------------- REFUND PROCESSED ----------------
            elif event == "refund.processed":
                refund = payload["payload"]["refund"]["entity"]
                print("Refund processed:", refund["id"])
                # Update payment status to REFUNDED if needed

            return Response({"message": "refund processed"}, status=status.HTTP_200_OK)

        except Exception as e:
           
            print("Webhook processing error:", str(e))

            # Always return 200 so Razorpay doesn't retry infinitely
            return Response(
                {"message": "Webhook processing error"},
                status=status.HTTP_200_OK
            )
class CheckPaymentstatusview(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,appointment_id):
        try:
            print("check payment status view is called  ")
            payment_record = (
            Payment.objects
            .filter(appointment_id=appointment_id)
            .order_by('-id')
            .first()
            )
            if payment_record:
                return Response({
                    "appointment_id":payment_record.appointment_id,
                    "status":payment_record.status,
                    "amount":payment_record.amount,
                    "razorpay_order_id":payment_record.razorpay_order_id,
                    "razorpay_payment_id":payment_record.razorpay_payment_id
                },status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error":"Payment record not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        except Payment.DoesNotExist:
            return Response(
                {"error":"An error occurred while fetching payment status"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentPing(APIView):
    permission_classes = [AllowAny]
    def get(self):
        try:
            print("Ping !!")
            return Response({"message":"Pinged"})
        except Exception as e:
              return Response({"message":"An error occurred"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        