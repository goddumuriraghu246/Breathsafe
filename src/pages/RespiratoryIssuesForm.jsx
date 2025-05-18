import React, { useState } from "react";

const initialForm = {
  name: "",
  age: "",
  symptoms: [],
  other: "",
  consent: false,
};

const symptomOptions = [
  "Fever",
  "Cough",
  "Fatigue",
  "Shortness of breath",
  "Loss of taste/smell",
  "Sore throat",
  "Eye irritation",
  "Headache",
  "Sneezing",
  "Wheezing",
  "Chest tightness",
];

export default function ResponsiveHorizontalForm() {
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "symptoms") {
      setForm((prev) => ({
        ...prev,
        symptoms: checked
          ? [...prev.symptoms, value]
          : prev.symptoms.filter((s) => s !== value),
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    alert("Form submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl p-8 mx-auto mt-24 mb-12 space-y-8 transition-all bg-white border border-gray-200 shadow-2xl dark:bg-gray-800 dark:border-gray-700 rounded-2xl"
    >
      <h2 className="mb-8 text-2xl font-bold text-center text-primary-700 dark:text-primary-300">
        Health Symptoms Survey
      </h2>

      {/* Name and Age */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-col flex-1">
          <label
            htmlFor="name"
            className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="age"
            className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
          >
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min="0"
            value={form.age}
            onChange={handleChange}
            required
            placeholder="Age"
            className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          />
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <label className="block mb-3 font-semibold text-gray-700 dark:text-gray-200">
          Symptoms <span className="text-sm font-normal">(select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {symptomOptions.map((symptom) => (
            <label
              key={symptom}
              className="flex items-center gap-3 px-3 py-2 transition rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/40"
            >
              <input
                type="checkbox"
                name="symptoms"
                value={symptom}
                checked={form.symptoms.includes(symptom)}
                onChange={handleChange}
                className="form-checkbox accent-primary-500 focus:ring-primary-400"
              />
              <span className="text-gray-700 dark:text-gray-200">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Other symptoms (combined textarea) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <label
          htmlFor="other"
          className="font-semibold text-gray-700 dark:text-gray-200 sm:w-1/3"
        >
          Other symptoms <span className="text-sm font-normal">(optional)</span>
        </label>
        <textarea
          id="other"
          name="other"
          value={form.other}
          onChange={handleChange}
          rows={2}
          placeholder="Describe any other symptoms or details"
          className="w-full px-4 py-3 text-gray-900 transition border border-gray-300 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 sm:w-2/3"
        />
      </div>

      {/* Consent */}
      <div className="flex items-center gap-2 text-gray-700 dark:text-white">
        <input
          type="checkbox"
          name="consent"
          checked={form.consent}
          onChange={handleChange}
          required
          className="form-checkbox accent-primary-500 focus:ring-primary-400"
          id="consent"
        />
        <label htmlFor="consent" className="select-none">
          I consent to my data being used for health research.
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex">
        <button
          type="submit"
          className="w-full px-6 py-3 text-lg font-semibold tracking-wide text-white transition rounded-lg shadow-lg sm:w-auto bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
