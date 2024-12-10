import json
import os
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Meeting, ChatMessage
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY", ""),
)

class AIChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chat_history = []  # To store the chat context

    async def connect(self):
        await self.accept()
        await self.send(json.dumps({"message": "Welcome to AI Mentoring Chat! How can I help you today?"}))

    async def disconnect(self, close_code):
        # Clear chat history if needed, or persist it for analysis
        self.chat_history = []

    async def receive(self, text_data):
        data = json.loads(text_data)
        user_message = data.get("message", "")

        if user_message:
            # Add user message to chat history
            self.chat_history.append({"role": "user", "content": user_message})

            # Fetch AI response
            ai_response = await self.fetch_ai_response()

            # Send AI response back to the client
            await self.send(json.dumps({"message": ai_response, "sender": "AI"}))

            # Add AI response to chat history
            self.chat_history.append({"role": "assistant", "content": ai_response})

    async def fetch_ai_response(self):
        try:
            # Define the system prompt
            system_prompt = (
                "You are an AI educational mentor. Your primary goal is to help students "
                "learn, understand concepts, solve academic problems, and improve study techniques. "
                "Always explain concepts clearly, using a chain of thought reasoning to guide students step-by-step. "
                "Avoid overly complex language, and focus on fostering curiosity, critical thinking, and safe, respectful discussions. "
                "Strictly avoid any inappropriate, adult, or offensive content, and guide conversations back to academic topics if they diverge."
                "If you're unsure about something, say 'I'm not sure about that.' "
                "Avoid making up information or speculating on topics."
            )

            # Prepare the complete messages list with context
            messages = [{"role": "system", "content": system_prompt}] + self.chat_history

            # Make the API call to the AI model
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.2,  # Lower temperature for less randomness
                top_p=0.8,  # Limit the token range
                frequency_penalty=0.5,  # Avoid repeated phrases
            )

            # Return the AI's response content
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"



        
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.meeting_id = self.scope['url_route']['kwargs']['meeting_id']
        self.room_group_name = f"chat_{self.meeting_id}"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = self.scope['user']

        # Save message to the database
        meeting = Meeting.objects.get(id=self.meeting_id)
        ChatMessage.objects.create(
            meeting=meeting,
            sender=user,
            content=message
        )

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user.username
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user']
        }))
