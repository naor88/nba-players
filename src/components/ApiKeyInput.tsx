import React, { useState } from "react";
import { useApiKey } from "../hooks/useApiKey";

const ApiKeyInput: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { setApiKey } = useApiKey();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setApiKey(inputValue);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title">API Key Required</h2>
          <p>Please enter your API key to continue.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">API Key</span>
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter API key"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm">
            <span>Don't have an API key? </span>
            <span>
              You can obtain an API key by creating a free account on{" "}
            </span>
            <a
              href="https://app.balldontlie.io"
              className="text-blue-500 underline"
            >
              https://app.balldontlie.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
