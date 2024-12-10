from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/chat/<int:meeting_id>/", consumers.ChatConsumer.as_asgi()),
    path("ws/ai-chat/", consumers.AIChatConsumer.as_asgi()),
]
