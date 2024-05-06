import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateStory } from "./api"; // Ensure this is properly set up to call your Flask API

function StoryGenerator() {
  const [inputs, setInputs] = useState({
    paragraph: "",
    character: "",
    event: "",
    place: "",
  });
  const [data, setData] = useState([]);
  const [generateButton, setGenerateButton] = useState("Generate Story");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerateButton("Generating...");
    const storyData = await generateStory(inputs);
    console.log(storyData);
    setData([...storyData]);
    // Pass storyData via state to the /story route
    navigate("/story", { state: { data: [...storyData] } });
    setGenerateButton("Generate Story");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Generate Your Story
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Paragraph:
            </label>
            <textarea
              name="paragraph"
              value={inputs.paragraph}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Character:
            </label>
            <input
              type="text"
              name="character"
              value={inputs.character}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event:
            </label>
            <input
              type="text"
              name="event"
              value={inputs.event}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Place:
            </label>
            <input
              type="text"
              name="place"
              value={inputs.place}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={generateButton === "Generating..."}
          >
            {generateButton}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StoryGenerator;
