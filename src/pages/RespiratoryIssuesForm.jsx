import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const validateForm = () => {
    if (!form.name.trim()) return false;
    if (!form.age || isNaN(form.age) || Number(form.age) < 0) return false;
    if (!form.symptoms.length) return false;
    if (!form.consent) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to submit health assessment');
        navigate('/login');
        return;
      }

      const response = await fetch("http://localhost:5000/api/health-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          age: Number(form.age),
          symptoms: form.symptoms,
          other: form.other.trim(),
          consent: form.consent,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        toast.success("Health assessment submitted successfully!");
        setForm(initialForm);
      } else {
        throw new Error(data.message || "Failed to submit health assessment");
      }
    } catch (error) {
      console.error("Error submitting health assessment:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
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

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 font-medium text-gray-700 transition duration-150 ease-in-out bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Reset Form
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 font-medium text-white transition duration-150 ease-in-out rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>
    </form>
  );
}
