import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../buttons";
import { FaArrowLeft, FaFileAlt, FaSpinner } from "react-icons/fa";
import { useSpeech } from "../../components/WebSpeech";

const IncidentReport2 = () => {
  const { speak } = useSpeech();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Speak the page title when the component mounts
  useEffect(() => {
    speak("Incident Report Follow-up Form");
  }, [speak]);

  return (
    <div className="pt-28 pb-10 px-4 sm:px-6">
      <div className="screen-max-width mx-auto">
        <div className="backdrop-blur-md bg-white/20 rounded-lg border border-white/30 shadow-lg p-6">
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-karla font-bold text-white text-shadow-lg">
              Incident Report Follow-up
            </h2>
            <p className="text-white font-inter">
              Provide additional information about your incident report
            </p>
          </div>

          <div className="my-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200">
              Use this form to add more details to your previously submitted
              incident report.
            </p>
          </div>

          {/* Sample content placeholder */}
          <div className="backdrop-blur-md bg-white/10 rounded-lg border border-white/30 shadow-lg p-6 mb-6">
            <h3 className="text-xl font-karla font-bold text-white mb-4 text-shadow">
              Additional Information
            </h3>
            <p className="text-white">Form content will be added here</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <BackButton
              onClick={() => {
                speak("Going back");
                navigate(-1);
              }}
              icon={<FaArrowLeft />}
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => speak("Submit button clicked")}
              className="flex items-center bg-green-500 hover:bg-green-900 text-white px-6 py-3 rounded-lg border border-green-500/50 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FaFileAlt className="mr-2" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport2;
