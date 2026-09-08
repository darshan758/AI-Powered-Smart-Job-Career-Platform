import { useState } from 'react';
import { createJobPosting } from '../src/api/jobPostingApi';

const emptyForm = {
  title: '',
  company: '',
  location: '',
  rawDescription: '',
};

function JobPostingForm({ onCreated }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await createJobPosting(formData);
      setSuccess(true);
      setFormData(emptyForm);
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Create Job Posting</h2>

      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3 text-sm">{error}</div>}
      {success && (
        <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-3 text-sm">
          Job posting created and analyzed successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            id="job-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Backend Developer"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="job-company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            id="job-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="e.g. Acme Corp"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="job-location" className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
        <input
          id="job-location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Remote, Bangalore, Hybrid"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          id="job-description"
          name="rawDescription"
          value={formData.rawDescription}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Paste the full job description here. Our AI will extract required skills and experience level automatically."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The AI will automatically extract skills and experience level from this text.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing with AI...' : 'Create Job Posting'}
      </button>
    </form>
  );
}

export default JobPostingForm;