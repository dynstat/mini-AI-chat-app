import webview
from chat_ai import getairesponse

class Api:
    def __init__(self):
        self.history = []

    def send_message(self, message):
        # print(f"Received message: {message}")
        response = getairesponse(message)
        # print(f"AI response: {response}")
        
        if not response:
            response = {"response": "No response from AI", "status": 1}
        
        response_text = response['response']
        # print(f"Returning response: {response_text}")
        
        self.history.append({"user": message, "bot": response_text})
        return response_text

api = Api()

if __name__ == '__main__':
    webview.create_window('ChatGPT GUI', 'index.html', js_api=api, width=500, height=700)
    webview.start()