import React, { useEffect, useState } from 'react';
import { useAsyncError, useLocation } from 'react-router-dom';
import Editor from './Editor';
import { useAuth } from '../context/auth';
import SubmissionHistory from './SubmissionHistory'; // Import the new component
import io from 'socket.io-client';
const ProblemDetail = () => {
  console.log("hi")
  const location = useLocation();
  const problem = location.state?.problem; // Get the problem object from location state
  const [userCode, setUserCode] = useState(''); // User code state
  const [activeTab, setActiveTab] = useState('description'); // Default active tab
  const [customInput, setCustomInput] = useState('');
  const [runOutput, setRunOutput] = useState('');
  const [message,setMessage]=useState('');
  const [chats,setChats]=useState([]);
  const [testResults, setTestResults] = useState([]); // State for test case results
  const [isLoading, setIsLoading] = useState(false); // Loading indicator state
  const { user } = useAuth();
  const socket = io("http://localhost:4000");
  console.log(chats);
  useEffect(()=>{
    if(!problem)return ;
    socket.on('new_message',(newMessage)=>{
      setChats((prevChats)=>[...prevChats,newMessage]);
    });
    const fetchChats=async()=>{
      try{
        console.log("in fetch");
        const response=await fetch(`http://localhost:4000/api/chats/${problem._id}`);
        const data=await response.json();
        setChats(data);
      }catch(error){
        console.log('Error fetching chats',error);
      }
    };
    fetchChats();
    return ()=>{
      socket.disconnect();
    }
  },[problem])

  const handleSendMessage=async()=>{
    if(!message.trim())return;
    try {
      console.log("in send")
      const response = await fetch('http://localhost:4000/api/chats/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem._id,
          userId: user.id,
          message: message.trim(),
        }),
      });
      const data = await response.json();
      console.log(data)
      setMessage(''); // Clear the message input

      // Emit new message to all clients using socket.io
      socket.emit('new_message', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const handleRun = async () => {
    setIsLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch('http://localhost:4000/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          input: customInput,
          language: 'cpp', // Set default language for the editor
          version: '10.2.0', // Ensure the version matches the backend API
        }),
      });

      const data = await response.json();
      console.log(data);
      setRunOutput((data.error + ": " + data.details) || 'No output received.');
    } catch (error) {
      console.error('Run failed:', error);
      setRunOutput('Error running the code.');
    } finally {
      setIsLoading(false); // Set loading to false after the request finishes
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading to true when the request starts
    try {
      const response = await fetch('http://localhost:4000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem._id,
          code: userCode,
          input: problem.inputCases,
          outputcase: problem.outputCases,
          language: 'cpp',
          version: '10.2.0',
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (data.status === 'Accepted') {
        alert('Code Accepted!');
      } else {
        alert(`Code submission with status: ${data.status}`);
      }
      setTestResults(data.testResults);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Error submitting the code.');
    } finally {
      setIsLoading(false); // Set loading to false after the request finishes
    }
  };

  if (!problem) return <div>Loading...</div>; // Fallback in case of undefined problem

  return (
    <div className="flex p-10 bg-gray-200 h-full w-screen ">
      {/* Left Side - Problem Details */}
      <div className="w-1/2 pr-6">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{problem.title}</h2>

          {/* Tabs for switching views */}
          <ul className="tabs mb-4 flex space-x-4 border-b border-gray-200 pb-2">
            <li
              className={`tab cursor-pointer ${activeTab === 'description' ? 'text-green-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </li>
            <li
              className={`tab cursor-pointer ${activeTab === 'discussion' ? 'text-green-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('discussion')}
            >
              Discussion
            </li>
            <li
              className={`tab cursor-pointer ${activeTab === 'submissions' ? 'text-green-500 font-bold' : 'text-gray-400'}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </li>
          </ul>

          {/* Conditional rendering based on the selected tab */}
          <div className="tab-content">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-bold text-gray-700">Description:</h3>
                <p className="text-gray-600 mt-2">{problem.description}</p>

                {problem.inputCases.map((input, index) => (
                  <div key={index} className="mt-4">
                    <p className="text-gray-700 font-semibold">Case {index + 1}</p>
                    <p className="text-gray-600">Input: {input}</p>
                    <p className="text-gray-600">Expected Output: {problem.outputCases[index]}</p>
                  </div>
                ))}
              </div>
            )}
                 {activeTab === 'discussion' && (
              <div>
                <h3 className="text-lg font-bold text-gray-700">Discussion:</h3>
                <div className="overflow-y-auto max-h-64 p-4 bg-gray-100 rounded">
                  {chats.map((chat, index) => (
                    <div key={index} className="p-2 border-b border-gray-300">
                      <p className="font-semibold text-gray-800">{chat.userId.username}:</p>
                      <p className="text-gray-600">{chat.message}</p>
                    </div>
                  ))}
                </div>
                <textarea
                  placeholder="Type your message..."
                  className="w-full mt-2 p-2 border border-gray-300 rounded"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={handleSendMessage}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded shadow"
                >
                  Send
                </button>
              </div>
            )}
            {activeTab === 'submissions' && <SubmissionHistory problem={problem} setUserCode={setUserCode} />} {/* Use SubmissionHistory here */}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l border-gray-300 mx-6"></div>

      {/* Right Side - Code Editor and Custom Test Fields */}
      <div className="w-1/2 h-full flex flex-col">
        <div className="p-6 bg-white rounded-lg shadow-lg h-full flex-grow flex  flex-col">
          <Editor userCode={userCode} setUserCode={setUserCode} />
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Custom Test</h3>
            <textarea
              className="w-full p-1 mt-1 border rounded text-gray-700"
              placeholder="Enter custom input"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <p className="text-gray-700 mt-3">Output:</p>
            <div className="p-2 bg-gray-200 rounded mt-2 text-gray-800">
              {runOutput || 'Run to view output'}
            </div>
          </div>

          {/* Buttons for Run and Submit */}
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={handleRun}
              className="bg-blue-500 px-4 py-2 text-white rounded shadow hover:bg-blue-600"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 px-4 py-2 text-white rounded shadow hover:bg-green-600"
            >
              Submit
            </button>
          </div>

          {/* Loading Text */}
          {isLoading && (
            <div className="mt-4 text-center text-gray-600">Loading, please wait...</div>
          )}
          
          {/* Test case results display */}
          {testResults.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-700">Test Case Results</h3>
    {/* Add horizontal scrolling */}
    <div className="overflow-x-auto max-w-full">
      <table className="w-full mt-4 border border-gray-300 text-gray-700 table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300  py-1 w-12">#</th>
            <th className="border border-gray-300  py-1 w-1/4">Input</th>
            <th className="border border-gray-300  py-1 w-1/4">Expected Output</th>
            <th className="border border-gray-300  py-1 w-1/4">Your Output</th>
            <th className="border border-gray-300  py-1 w-1/4">Status</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((result, index) => (
            <tr
              key={index}
              className={`${result.status === 'Accepted' ? 'bg-green-100' : 'bg-red-100'}`}
            >
              <td className="border border-gray-300 px-1 py-1 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-1 py-1 text-center">{result.input}</td>
              <td className="border border-gray-300 px-1 py-1 text-center">{problem.outputCases[index]}</td>
              <td className="border border-gray-300 px-1 py-1 text-center">{result.output}</td>
              <td
                className={`border border-gray-300 px-4 py-2 text-center ${
                  result.status === 'Accepted' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
                }`}
              >
                {result.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
