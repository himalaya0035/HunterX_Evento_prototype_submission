from django.urls import path

from . import views

urlpatterns = [
    path("", views.index),
    path('<str:room_name>/', views.room, name='room'),
    path('all/<int:event_id>', views.AllChatsView.as_view(), name='index'),
    path('get_chat_id', views.getYourChatID.as_view()),
    path('message', views.SendMessage.as_view())
]
