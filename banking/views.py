import datetime

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView, exceptions

from events import models as event_models
from . import models
from . import serializers
from .utils import send_budget_update_notification, complete_kyc, a2atransfer


class SetEstimatedBudget(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = serializers.SetEstimatedAmount(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data

        curr_user = request.user

        participant_obj = get_object_or_404(event_models.Participant, is_host=True, event_id=data['event_id'],
                                            user=curr_user)
        event_obj = participant_obj.event

        event_obj.estimated_expense = data['amount']

        event_obj.save()
        send_budget_update_notification(curr_user, data['amount'], event_id=event_obj.pk,
                                        participant_id=participant_obj.pk)

        return Response({
            'message': 'Limit was updated successfully'
        })


class GetThirdPartyTransactions(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.ThirdPartyTransactions

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        curr_user = self.request.user
        event_obj = get_object_or_404(event_models.Event, pk=event_id)

        is_participant = event_obj.participant_set.filter(user=curr_user)
        if not is_participant.exists():
            raise exceptions.ValidationError(detail='You are not a participant', code=400)

        return event_obj.thirdpartytransaction_set.all()


class MakeTransactionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = serializers.TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        amount = data['amount']
        task_id = data.get('task_id')
        curr_user = request.user
        task_obj = None

        event_obj: event_models.Event = get_object_or_404(event_models.Event, pk=data['event_id'])
        from_participant = event_models.Participant.objects.filter(user=curr_user, is_host=True, event=event_obj)
        to_participant = event_models.Participant.objects.filter(pk=data['toUser'], event=event_obj)
        if not to_participant.exists() or not from_participant.exists():
            return Response({
                'message': 'Invalid Request'
            }, status=status.HTTP_400_BAD_REQUEST)

        from_bank_obj = get_object_or_404(models.BankAccount, pk=data['fromBankAcc'], user=curr_user)

        if task_id:
            task_obj = get_object_or_404(event_models.Task, pk=task_id, participant__event=event_obj)

        to_user_id = to_participant.first().user_id

        to_bank_acc = models.BankAccount.objects.filter(user_id=to_user_id)
        if not to_bank_acc.exists():
            return Response({
                'message': 'User has not linked their bank account'
            })

        to_bank_acc_obj = to_bank_acc.first()

        from_participant_obj = from_participant.first()
        to_participant_obj = to_participant.first()
        if task_obj:
            new_transaction = models.Transaction(fromBankAcc=from_bank_obj, toBankAcc=to_bank_acc_obj, amount=amount,
                                                 event=event_obj, task_id=task_id)

        else:
            new_transaction = models.Transaction(fromBankAcc=from_bank_obj, toBankAcc=to_bank_acc_obj, amount=amount,
                                                 event=event_obj)
        new_transaction.save()
        a2atransfer(amount, to_bank_acc_obj.accountNumber, from_bank_obj.accountNumber)
        from_participant_obj.available_amount -= amount
        to_participant_obj.available_amount += amount
        to_participant_obj.save()
        from_participant_obj.save()
        if task_obj:
            task_obj.available_balance += amount
            task_obj.amount_allocated += amount
            task_obj.save()

        return Response({
            'message': 'Transaction was successful'
        }, status=status.HTTP_201_CREATED)


class AddBankAccView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.BankAccountSerializer

    def get_queryset(self):
        curr_user = self.request.user
        return models.BankAccount.objects.filter(user=curr_user)


class EventTransactions(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.EventTransactionsListSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        curr_user = self.request.user
        event_obj = get_object_or_404(event_models.Event, pk=event_id)

        is_participant = event_obj.participant_set.filter(user=curr_user)
        if not is_participant.exists():
            raise exceptions.ValidationError(detail='You are not a participant', code=400)

        return event_obj.transaction_set.all()


class ThirdPartyTransaction(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = serializers.CreateThirdPartyTrascSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        event_id = data['event_id']
        task_id = data['task_id']
        amount = data['amount']

        curr_user = request.user
        event_obj: event_models.Event = get_object_or_404(event_models.Event, pk=event_id)
        from_participant = get_object_or_404(event_models.Participant, user=curr_user, event=event_obj)
        from_bank_acc = get_object_or_404(models.BankAccount, pk=data['from_acc'], user=curr_user)
        task_obj = get_object_or_404(event_models.Task, participant=from_participant, pk=task_id)
        print(task_obj)
        new_transaction = models.ThirdPartyTransaction(fromBankAcc=from_bank_acc, toBankAcc=data['upi_id'],
                                                       amount=amount,
                                                       event_id=event_id, task_id=task_id)

        # print(task_obj.available_balance)

        a2atransfer(amount, data['upi_id'], from_bank_acc.accountNumber, remarks=task_obj.title)

        # task_obj.available_balance -= amount
        event_obj.total_expense += amount
        from_participant.available_amount -= amount

        new_transaction.save()

        from_participant.save()
        task_obj.save()
        event_obj.save()

        return Response({
            'message': 'Transaction was successful'
        }, status=status.HTTP_201_CREATED)


User = get_user_model()


class completeKYC(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = serializers.completeKYCSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        dob = data['dob']
        dob = datetime.datetime.strptime(dob, "%Y-%m-%d").date()
        pancard_number = data['pancard_number']
        user = request.user

        try:
            res, resp = complete_kyc(user, pancard_number, dob.year, dob.month, dob.day)
            print(res, resp)

        except TypeError as _:

            return Response({
                "message": "Already Linked"
            })
        return Response({
            "message": "Linked Successfully"
        })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def kyc_status(request):
    return Response({
        "status": request.user.kyc_status
    })