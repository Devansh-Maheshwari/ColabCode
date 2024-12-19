import React, { useState, useEffect ,useMemo} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce'
class SuffixTreeNode {
    constructor() {
        this.children = {};
        this.indexes = [];
    }
}

class SuffixTree {
    constructor(text) {
        this.text = text;
        this.root = new SuffixTreeNode();
        this.buildTree();
    }

    buildTree() {
        const n = this.text.length;
        for (let i = 0; i < n; i++) {
            let suffix = this.text.slice(i);
            let currentNode = this.root;
            for (let j = 0; j < suffix.length; j++) {
                let char = suffix[j];
                if (!currentNode.children[char]) {
                    currentNode.children[char] = new SuffixTreeNode();
                }
                currentNode = currentNode.children[char];
                currentNode.indexes.push(i);
            }
        }
    }

    search(pattern) {
        let currentNode = this.root;
        for (let i = 0; i < pattern.length; i++) {
            let char = pattern[i];
            if (!currentNode.children[char]) {
                return [];
            }
            currentNode = currentNode.children[char];
        }
        return currentNode.indexes;
    }
}

const Explore = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProblems, setFilteredProblems] = useState([]);
    const navigate = useNavigate();
    console.log("hi")
    const suffixTrees = useMemo(() => {
        console.log("in tree")
        const map = new Map();
        problems.forEach((problem) => {
            map.set(problem._id, new SuffixTree(problem.title));
        });
        return map;
    }, [problems]);

    // Debounced search function
    const debouncedSearch = useMemo(() =>
        debounce((query) => {
            if (!query) return setFilteredProblems(problems); // If no query, return all problems
            const filtered = problems.filter((problem) => {
                const suffixTree = suffixTrees.get(problem._id);
                return suffixTree.search(query).length > 0;
            });
            console.log("in debounce")
            setFilteredProblems(filtered);
        }, 600),
        [problems, suffixTrees] // dependencies: problems and suffixTrees
    );

    // Fetch problems from the backend
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                console.log("in fetchproblem")
                const response = await fetch('https://colabcode-4vyd.onrender.com/challenges/');
                const data = await response.json();
                setProblems(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Trigger search whenever the query changes
    useEffect(() => {
        console.log("in useeffect of debounce")
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    const handleViewProblem = (problem) => {
        navigate(`/explore/${problem._id}`, { state: { problem } });
    };

    if (loading) {
        return <div className="bg-black text-white p-10 w-screen">Loading...</div>;
    }

    if (error) {
        return <div className="bg-black text-white p-10 w-screen">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-900 text-white p-10 w-screen h-full">
            <h2 className="text-2xl font-bold mb-6">Explore Coding Challenges</h2>
            <input
                type="text"
                placeholder="Search challenges"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-1 rounded-lg mb-6 text-black w-1/4"
            />
            {filteredProblems.length === 0 ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <p className="text-gray-400">No challenges found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredProblems.map((problem) => (
                        <div key={problem._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                            <p className="text-gray-400 mb-2">{problem.level}</p>
                            <p className="text-gray-300 mb-2">{problem.description.substring(0, 100)}</p>
                            <div className="flex justify-between items-center">
                                {/* <span className="text-green-400">Unsolved</span> */}
                                <button
                                    onClick={() => handleViewProblem(problem)}
                                    className="block mt-4 bg-blue-500 text-white p-2 rounded-lg text-center"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Explore;
