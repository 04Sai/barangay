import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { LuSpeaker, LuSpeech } from "react-icons/lu";

// Create speech context
const SpeechContext = createContext();

// Custom hook to use the speech context
export const useSpeech = () => useContext(SpeechContext);

export const SpeechProvider = ({ children }) => {
  // State for speech settings - only keeping text-to-speech
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(
    localStorage.getItem("isSpeechEnabled") !== "false" // Default to true
  );

  // Reference to store the timeout ID for debouncing
  const timeoutRef = useRef(null);
  // Reference to track if speech is currently in progress
  const isSpeakingRef = useRef(false);
  // Reference to store speech queue
  const speechQueueRef = useRef([]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("isSpeechEnabled", isSpeechEnabled);
  }, [isSpeechEnabled]);

  // Process the speech queue
  const processSpeechQueue = useCallback(() => {
    if (speechQueueRef.current.length === 0 || isSpeakingRef.current) return;

    const nextText = speechQueueRef.current.shift();
    isSpeakingRef.current = true;

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(nextText);
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        isSpeakingRef.current = false;
        processSpeechQueue(); // Process next item in queue
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        processSpeechQueue(); // Process next item even if there's an error
      };

      window.speechSynthesis.speak(utterance);
    } else {
      isSpeakingRef.current = false; // Reset if speech synthesis isn't available
    }
  }, []);

  // Debounced text-to-speech function
  const speak = useCallback(
    (text, delay = 500) => {
      if (!isSpeechEnabled || !text) return;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout with delay
      timeoutRef.current = setTimeout(() => {
        // Cancel any ongoing speech if it's a new high-priority message
        if (speechQueueRef.current.length > 3) {
          speechQueueRef.current = [text]; // Reset queue if it's getting too long
          window.speechSynthesis.cancel();
          isSpeakingRef.current = false;
        } else {
          // Add to queue
          speechQueueRef.current.push(text);
        }

        processSpeechQueue();
      }, delay);
    },
    [isSpeechEnabled, processSpeechQueue]
  );

  // Form element narration functions
  const speakLabel = useCallback(
    (label, required = false, delay = 400) => {
      if (!isSpeechEnabled) return;
      const requiredText = required ? ", required field" : "";
      speak(`${label}${requiredText}`, delay);
    },
    [isSpeechEnabled, speak]
  );

  const speakInput = useCallback(
    (label, value, required = false, delay = 400) => {
      if (!isSpeechEnabled) return;
      const requiredText = required ? "required" : "optional";
      if (!value) {
        speak(
          `${label}, ${requiredText} field. Please enter information.`,
          delay
        );
      } else {
        speak(`${label}: ${value}`, delay);
      }
    },
    [isSpeechEnabled, speak]
  );

  const speakSelect = useCallback(
    (label, value, delay = 400) => {
      if (!isSpeechEnabled) return;
      speak(`${label} selected: ${value}`, delay);
    },
    [isSpeechEnabled, speak]
  );

  const speakCheckbox = useCallback(
    (label, checked, delay = 400) => {
      if (!isSpeechEnabled) return;
      speak(`${label} ${checked ? "selected" : "unselected"}`, delay);
    },
    [isSpeechEnabled, speak]
  );

  // Toggle functions
  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled((prev) => !prev);
    // Announce the state change
    const newState = !isSpeechEnabled;
    if (newState) {
      // Clear any existing speech and timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.speechSynthesis.cancel();

      // Use a small delay before announcing the status change
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(
          "Text to speech enabled"
        );
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }, [isSpeechEnabled]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const value = {
    isSpeechEnabled,
    speak,
    speakLabel,
    speakInput,
    speakSelect,
    speakCheckbox,
    toggleSpeech,
  };

  return (
    <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
  );
};

// Speech control component to be used in the NavBar
export const SpeechControls = () => {
  const { isSpeechEnabled, toggleSpeech, speak } = useSpeech();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggle = () => {
    toggleSpeech();
    // Speak the new state after toggling
    setTimeout(() => {
      speak(
        isSpeechEnabled ? "Text to speech disabled" : "Text to speech enabled",
        100
      );
    }, 100);
  };

  return (
    <div className="relative flex items-center">
      <button
        className={`p-1.5 rounded-full transition-all duration-300 ${
          isSpeechEnabled
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-500 hover:bg-gray-600"
        }`}
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={
          isSpeechEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"
        }
      >
        {isSpeechEnabled ? (
          <LuSpeech className="h-5 w-5 text-white" />
        ) : (
          <LuSpeech className="h-5 w-5 text-white" />
        )}
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {isSpeechEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-t-4 border-x-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export default SpeechControls;
