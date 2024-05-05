from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from diffusers import StableDiffusionPipeline
import torch
import base64
import io


app = Flask(__name__)
CORS(app)

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_id)

@app.route('/generate', methods=['POST'])
def generate_story():
    # client = OpenAI(api_key=openai_api_key)
    # Retrieve data from POST request
    data = request.json
    paragraph_no = data.get('paragraph_no', 1)
    character_name = data.get('character', [])
    first_para_desc = data.get('paragraph', '')
    event_description = data.get('event', '')
    scene_location = data.get('place', '')

    # Generate prompt
    prompt = f'''
    You are supposed to generate paragraph number#{paragraph_no} of a story (no more than 70 words).
    Consider that the first paragraph's description is: {first_para_desc}. The characters involved are: {character_name}.
    Write a creative, thrilling, and catchy paragraph (70 words only).
    '''
    # Call OpenAI API
    # response = client.chat.completions.create(
    #     messages=[
    #         {"role": "user", "content": prompt}
    #     ],
    #     model = "gpt-3.5-turbo-0125"
    # )
    # print(response)

    # Extracting text from response
    # story_paragraph = response.choices[0].message.content.strip()
    
    # Generate the image

    # response = client.images.generate(
    #     model="dall-e-3",
    #     prompt=story_paragraph,
    #     size="1024x1024",
    #     quality="standard",
    #     n=1,
    # )

    # image_url = response.data[0].url
    # print(image_url)

    prompt = "a photo of an astronaut riding a horse on mars"
    image_data = pipe(prompt).images[0]  

    image_buffer = io.BytesIO()
    image_data.save(image_buffer, format='PNG')
    image_str = base64.b64encode(image_buffer.getvalue()).decode()

    # Return both story paragraph and image
    return jsonify({'story': 'story_paragraph', 'image': image_str})

if __name__ == '__main__':
    app.run(debug=True)
