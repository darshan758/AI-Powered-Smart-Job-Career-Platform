import { useState } from 'react';
import { uploadResume, analyzeResume } from '../src/api/resumeApi';

function ResumeUpload({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | analyzing | done | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setStatus('idle');
    setErrorMsg('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setFile(null);
      setErrorMsg('Please select a PDF file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setErrorMsg('The PDF must be smaller than 5 MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setErrorMsg('Please select a PDF file first.');
      return;
    }
    setErrorMsg('');

    try {
      setStatus('uploading');
      await uploadResume(file);

      setStatus('analyzing');
      let analyzeRes;
      try {
        analyzeRes = await analyzeResume();
      } catch (err) {
        setStatus('error');
        setErrorMsg(
          `Resume uploaded, but analysis failed: ${err.response?.data?.message || 'Please try again.'}`
        );
        return;
      }

      setStatus('done');
      onAnalyzed(analyzeRes.data); // hand parsed data up to Dashboard
    } catch (err) {
      setStatus('error');
      setErrorMsg(`Upload failed: ${err.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Upload Your Resume</h2>

      <input
        id="resume-file"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="sr-only"
      />

      <label
        htmlFor="resume-file"
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-5 py-6 text-center transition-colors ${
          file
            ? 'border-green-500 bg-green-50'
            : 'border-blue-400 bg-blue-50 hover:border-blue-600 hover:bg-blue-100'
        }`}
      >
        <span className="text-sm font-semibold text-blue-800">
          {file ? 'PDF selected' : 'Choose your resume PDF'}
        </span>
        <span className="mt-1 text-xs text-gray-600">
          {file ? file.name : 'Click here to choose a PDF file, up to 5 MB'}
        </span>
        {!file && <span className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">Choose PDF file</span>}
      </label>

      <button
        onClick={handleUploadAndAnalyze}
        disabled={status === 'uploading' || status === 'analyzing'}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'uploading' && 'Uploading...'}
        {status === 'analyzing' && 'Analyzing with AI...'}
        {(status === 'idle' || status === 'done' || status === 'error') && 'Upload & Analyze'}
      </button>

      {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
      {status === 'done' && (
        <p className="text-green-600 text-sm mt-2">Resume analyzed successfully!</p>
      )}
    </div>
  );
}

export default ResumeUpload;