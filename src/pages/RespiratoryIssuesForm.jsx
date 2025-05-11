import { useState } from "react";
import { motion } from "framer-motion";

export default function RespiratoryIssuesForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    cough: false,
    mucus: false,
    shortnessOfBreath: false,
    chestPain: false,
    wheezing: false,
    soreThroat: false,
    runnyNose: false,
    fever: false,
    fatigue: false,
    other: "",
    details: "",
    consent: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent) {
      alert("Please provide consent to submit.");
      return;
    }
    if (onSubmit) onSubmit(form);
    alert("Thank you! Your information has been submitted.");
    setForm({
      name: "",
      age: "",
      cough: false,
      mucus: false,
      shortnessOfBreath: false,
      chestPain: false,
      wheezing: false,
      soreThroat: false,
      runnyNose: false,
      fever: false,
      fatigue: false,
      other: "",
      details: "",
      consent: false,
    });
  };

  return (
    <div
      className="
        relative min-h-screen pb-10
        bg-gradient-to-br from-[#f0f4ff] to-[#cbeafe]
        dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg p-8 mx-auto mt-20 mb-10 bg-white border-t-8 shadow-2xl pt-14 dark:bg-gray-800 rounded-2xl border-primary-400"
      >
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-primary-600 dark:text-primary-400">
          Respiratory Health Survey
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name and Age */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label
                className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 text-gray-900 transition-all bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="w-32">
              <label
                className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                htmlFor="age"
              >
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                required
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full px-4 py-3 text-gray-900 transition-all bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Symptoms */}
          <fieldset className="p-4 border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
            <legend className="mb-2 text-lg font-semibold text-primary-600 dark:text-primary-400">
              Symptoms you are experiencing:
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { name: "cough", label: "Cough" },
                { name: "mucus", label: "Cough with mucus/phlegm" },
                { name: "shortnessOfBreath", label: "Shortness of breath" },
                { name: "chestPain", label: "Chest pain/tightness" },
                { name: "wheezing", label: "Wheezing" },
                { name: "soreThroat", label: "Sore throat" },
                { name: "runnyNose", label: "Stuffy/runny nose" },
                { name: "fever", label: "Fever" },
                { name: "fatigue", label: "Fatigue/tiredness" },
              ].map((symptom) => (
                <label
                  key={symptom.name}
                  className="flex items-center space-x-2 text-gray-700 cursor-pointer dark:text-white group"
                >
                  <input
                    type="checkbox"
                    name={symptom.name}
                    checked={form[symptom.name]}
                    onChange={handleChange}
                    className="transition-all form-checkbox accent-primary-500 group-hover:scale-110"
                  />
                  <span className="transition-colors group-hover:text-primary-600">
                    {symptom.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label
                className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                htmlFor="other"
              >
                Other symptoms (optional)
              </label>
              <input
                id="other"
                name="other"
                type="text"
                value={form.other}
                onChange={handleChange}
                placeholder="Describe any other symptoms"
                className="w-full px-4 py-2 text-gray-900 transition-all bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </fieldset>

          {/* Detailed Health Condition */}
          <div>
            <label
              htmlFor="details"
              className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
            >
              Tell us more about your health (optional)
            </label>
            <textarea
              id="details"
              name="details"
              rows={4}
              value={form.details}
              onChange={handleChange}
              placeholder="Share more about your respiratory health, recent issues, or anything else you'd like to add."
              className="w-full px-4 py-3 text-gray-900 transition-all bg-white border border-gray-300 rounded-lg shadow-sm resize-none dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Consent */}
          <div className="flex items-center space-x-2 text-gray-700 dark:text-white">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleChange}
              required
              className="transition-all form-checkbox accent-primary-500"
            />
            <label htmlFor="consent" className="select-none">
              I consent to my data being used for health research.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold tracking-wide text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
}
