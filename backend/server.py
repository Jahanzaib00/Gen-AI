from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os
import re

app = Flask(__name__)
CORS(app)

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)
fine_tuning_jobs = client.fine_tuning.jobs.list(limit=10)

@app.route('/generate', methods=['POST'])
def generate_story():
    data = request.json
    num_paragraphs = 2  # Number of paragraphs and images to generate

    data_res = []

    # Update the prompt for each iteration to include sequential numbering
    print(data)
    prompt = f'''
    You are supposed to generate paragraph number#{1} of a story (no more than 70 words).
    Consider that the first paragraph's description is: {data['paragraph']}. The characters involved are: {data['character']}.
    Write a creative, thrilling, and catchy paragraph (70 words only).
    '''
    for i in range(num_paragraphs):
        # Generate the text
        text_response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-3.5-turbo-0125"
        )
        story_paragraph = text_response.choices[0].message.content.strip()
        story_paragraph = re.sub(r'<[^>]+>', '', story_paragraph)

        # get the fine-tuned model
        model = fine_tuning_jobs.data[0].fine_tuned_model
        if model is not None:
            completion = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": story_paragraph}, # the output of gpt-3.5 (Storyline Generation) model
                {"role": "user", "content": "What is the next event in this context? Who is the main character in that event? What is the scene location? "}
            ]
            )
        prompt = completion.choices[0].message.content

        # Generate the image
        image_response = client.images.generate(
            model="dall-e-3",
            prompt=story_paragraph,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        image_url = image_response.data[0].url
        data_res.append({'paragraph': story_paragraph, 'image': image_url})

    text_response = client.chat.completions.create(
            messages=[{"role": "user", "content": 'conclude the story on this scene: ' +prompt}],
            model="gpt-3.5-turbo-0125"
        )
    story_paragraph = text_response.choices[0].message.content.strip()

    # Generate the image
    image_response = client.images.generate(
        model="dall-e-3",
        prompt=story_paragraph,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    image_url = image_response.data[0].url
    data_res.append({'paragraph': story_paragraph, 'image': image_url})

    print(data_res)
    # Return the array of paragraphs and images
    return jsonify(data_res)

if __name__ == '__main__':
    app.run(debug=True)
