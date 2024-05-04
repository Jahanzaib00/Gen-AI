import React, { useState } from "react";
import { generateStory } from "./api";

function StoryGenerator() {
  const [inputs, setInputs] = useState({
    paragraph: "",
    character: "",
    event: "",
    place: "",
  });
  const [story, setStory] = useState(
    "Here the generated story will be displayed"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset input fields after submission
    // setInputs({
    //   paragraph: "",
    //   character: "",
    //   event: "",
    //   place: "",
    // });
    try {
      const storyData = await generateStory(inputs);
      setStory(storyData.story);
    } catch (error) {
      console.log("Failed to fetch story: " + error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-center mb-6">Story Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Initial Paragraph:
          </label>
          <textarea
            name="paragraph"
            value={inputs.paragraph}
            onChange={handleChange}
            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Character:
          </label>
          <input
            type="text"
            name="character"
            value={inputs.character}
            onChange={handleChange}
            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Event:
          </label>
          <input
            type="text"
            name="event"
            value={inputs.event}
            onChange={handleChange}
            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Place:
          </label>
          <input
            type="text"
            name="place"
            value={inputs.place}
            onChange={handleChange}
            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Generate Story
        </button>
      </form>

      {story && (
        <div className="mt-8 p-5 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Generated Story</h2>
          <p className="text-gray-700 mt-4">{story}</p>
        </div>
      )}
    </div>
  );
}

export default StoryGenerator;
