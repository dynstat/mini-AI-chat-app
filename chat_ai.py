from langchain_core.output_parsers import PydanticOutputParser, StrOutputParser, JsonOutputParser
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, FewShotPromptTemplate
from pydantic import BaseModel, Field
from langchain.chat_models import init_chat_model

from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import (
    AIMessage, HumanMessage, SystemMessage
)

from dotenv import load_dotenv
import os

## IMPORTANT: Make sure to have a .env file with the required environment variables set. Gemini API key  should be in that file.
# Load environment variables from .env file
load_dotenv()


max_essay_length = 10000

class ModelResponse(BaseModel):
    """Model response schema."""
    model_name: str = Field(description="Name of the LLM model that you (AI) is using", max_length=20)
    response: str = Field(description="Response from the model, based on the question. Check the maximum limit mentioned in the prompt", max_length=max_essay_length)
    tagline: str = Field(description="response created by Vivek", max_length=50)
    status: int = Field(description="Status of the response, 0 for success and other values for error.", default=0)
    
    
    
class ErrorModelResponse(BaseModel):
    """Error response schema."""
    model_name: str = Field(description="Name of the LLM model used", max_length=20)
    response: str = Field(description="Response from the model, based on the question. Check the maximum limit mentioned in the prompt", default="Error while processing the request")
    tagline: str = Field(description="response created by Vivek", max_length=50)
    status: int = Field(description="Status of the response, 0 for success and other values for error.", default=1)
    
def getairesponse(input_by_user: str, model_name: str = "gemini-2.0-flash", max_essay_length: int = 10000) -> dict:
    model = init_chat_model(model="gemini-2.0-flash", model_provider="google_genai")
    # model = init_chat_model(model="gemini-2.5-pro", model_provider="google_genai")

    # Create the output parser
    resp_parser = PydanticOutputParser(pydantic_object=ModelResponse)
    resp_parser.get_format_instructions()

    messages = PromptTemplate(template="""You are a helpful assistant.Reqspond to the user's query: {query}. 
                            you Must follow these :{format_instruction}\n 
                            IMPORTANT: The max length allowed for the essay is {max_essay_length} CHARACTERS (not words). 
                            Keep your response concise and and well below under this limit unless necessary.
                            The text part of the response (in the response key of json) should be markdown formatted with points and subtopics.""",
                            input_variables=["query"],
                            partial_variables={"format_instruction": resp_parser.get_format_instructions()}
                            )


    # messages.pretty_print()
        
    prompt = messages.format(query=input_by_user, max_essay_length=max_essay_length)


    # chain = model | resp_parser
    # res = chain.invoke(prompt)
    model_response = model.invoke(prompt)
    print(model_response.content, f"\n\n\n length: {len(model_response.content)}")
        
        
    try:
        final_response = resp_parser.parse(model_response.content)
    except Exception as e:
        print(f"Error parsing response: {e}")
        final_response = ErrorModelResponse(model_name="gemini-2.0-flash", response=str(e), tagline="response created by Vivek", status=1)

        
    final_response.model_dump_json()
    response_dict = final_response.model_dump()
    return response_dict
        
        
        
        
        
        
        