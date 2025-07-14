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
    window = webview.create_window(
        'AI Chat Assistant', 
        'index.html', 
        js_api=api, 
        width=1000, 
        height=900,
        min_size=(600, 500),
        # Enable text selection and context menu
        text_select=True,
        # Allow right-click context menu for copy/paste
        # Note: this may not work in all webview implementations
    )
    
    # Start with debug mode to check for any issues
    webview.start()