import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from events.models import Event


@database_sync_to_async
def get_event(user, event_id):
    event = Event.objects.filter(pk=event_id)

    if not event.exists():
        return None
    event = event.first()
    participant = event.participant_set.filter(user=user)

    if not participant.exists():
        return None
    return event


from .models import ChatMessage


@database_sync_to_async
def create_message(user, event: Event, message):
    participant = event.participant_set.filter(user=user)
    if participant.exists():
        participant = participant.first()
        new_chat_message = ChatMessage(event=event, message=message, from_participant=participant)
        new_chat_message.save()
        data = {
            'id': new_chat_message.pk,
            'timestamp': new_chat_message.timestamp.isoformat(),
            'message': message,
            'from_user': {'full_name': user.full_name, 'id': participant.id}
        }
        return data


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        event_id = self.scope['url_route']['kwargs']['event_id']
        self.user = self.scope["user"]
        event = await get_event(self.user, event_id)
        if event is None:
            await self.close()
        else:
            self.group_name = 'event_%s' % event.pk
            self.event_obj = event

            # Join room group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )

            await self.accept()

    async def disconnect(self, close_code):
        # Leave room group

        try:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        except AttributeError as _:
            await self.close()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        user = self.user
        chat_message = await create_message(user, self.event_obj, message)

        await self.send(text_data=json.dumps({
            'chat_message': chat_message
        }))

    def notify(self, event):
        self.send(text_data=json.dumps(event["data"]))
