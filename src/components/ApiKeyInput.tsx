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
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-white shadow-xl text-black">
        <div className="card-body">
          <h2 className="card-title">API Key Required</h2>
          <p>Please enter your API key to continue.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label cursor-pointer" htmlFor="key_input">
                <span className="label-text text-black">API Key</span>
              </label>
              <input
                id="key_input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter API key"
                className="input input-bordered w-full focus:border-primary focus:border-4 text-white"
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
              You can obtain an API key by creating a free account at{" "}
              <a
                href="https://app.balldontlie.io"
                target="_blank"
                className="text-blue-500 underline"
              >
                https://app.balldontlie.io
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
