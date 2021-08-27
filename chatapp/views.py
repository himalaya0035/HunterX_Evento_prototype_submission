from django.shortcuts import render
from rest_framework.views import APIView


def index(request):
    return render(request, 'chat.html')


def room(request, room_name):
    return render(request, 'rooms.html', {
        'room_name': room_name
    })


from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from . import serializers
from . import models
from events.models import Event


class AllChatsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = models.ChatMessage.objects.all()
    serializer_class = serializers.ChatMessagesSerializer

    def get_queryset(self):
        curr_user = self.request.user
        event_id = self.kwargs['event_id']
        event_obj = get_object_or_404(Event, pk=event_id)
        is_participant = event_obj.participant_set.filter(user=curr_user)
        if not is_participant.exists():
            raise PermissionDenied()
        else:
            return event_obj.chatmessage_set.all()


class getYourChatID(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        curr_user = request.user
        event_id = self.kwargs['event_id']
        event_obj = get_object_or_404(Event, pk=event_id)
        is_participant = event_obj.participant_set.filter(user=curr_user)
        if not is_participant.exists():
            raise PermissionDenied()
        else:
            return is_participant.pk


class SendMessage(generics.CreateAPIView):
    serializer_class = serializers.ChatMessageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
