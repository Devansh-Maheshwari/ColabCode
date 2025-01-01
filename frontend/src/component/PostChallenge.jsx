import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
const PostChallenge = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState('');
    const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
    // const [userId, setUserId] = useState(); // Add userId to submit with the challenge
    const {user} = useAuth();
    // console.log(user);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputCases = testCases.map(tc => tc.input);
        const outputCases = testCases.map(tc => tc.output);
        const challenge = { title: name, description, level, inputCases, outputCases, userId:user.id };
        // console.log(challenge)
        try {
            await axios.post('https://colabcode-4vyd.onrender.com/challenges', challenge);
            alert('Challenge submitted successfully');
            setName('');
            setDescription('');
            setLevel('');
            setTestCases([{ input: '', output: '' }]);
        } catch (error) {
            console.error('Error submitting challenge:', error);
            alert('Failed to submit challenge');
        }
    };

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', output: '' }]);
    };

    const handleRemoveTestCase = (index) => {
        setTestCases(testCases.filter((_, i) => i !== index));
    };

    const handleTestCaseChange = (index, type, value) => {
        const updatedTestCases = testCases.map((testCase, i) =>
            i === index ? { ...testCase, [type]: value } : testCase
        );
        setTestCases(updatedTestCases);
    };

    return (
        <div className='bg-gray-700 h-screen pt-8 w-screen'>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gray-800 text-white shadow-md rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-green-400">Submit Problem</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                />
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                >
                    <option value="" disabled>
                        Select Level
                    </option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                {/* <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                /> */}
                <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-green-300">Test Cases</h4>
                    {testCases.map((testCase, index) => (
                        <div key={index} className="flex items-center mb-4 space-x-4">
                            <input
                                type="text"
                                placeholder={`Input ${index + 1}`}
                                value={testCase.input}
                                onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                className="w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder={`Output ${index + 1}`}
                                value={testCase.output}
                                onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                className="w-1/2 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveTestCase(index)}
                                className="p-2 h-12 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddTestCase}
                        className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Add Test Case
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                >
                    Submit Challenge
                </button>
            </form>
        </div>
    );
};

export default PostChallenge;
