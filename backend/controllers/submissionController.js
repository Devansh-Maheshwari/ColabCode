const User = require('../models/user'); // Assuming User model is in ./models/user
const axios = require("axios");
const Problem = require("../models/problem");
const Submission = require("../models/submission");

// Piston API URL
const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

exports.submissionHistory=async (req, res) => {
  const { problemId, userId } = req.params;

  try {
    const submissions = await Submission.find({
      problem: problemId,
      user: userId
    }).exec();

    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send('Internal server error');
  }
};

exports.runCode = async (req, res) => {
  const { code, input, language = "cpp", version = "10.2.0" } = req.body;
  console.log(code);
  try {
    // Prepare payload for the Piston API
    const payload = {
      language,
      version,
      stdin: input,
      files: [
        {
          content: code,
        },
      ],
    };

    // Execute the code
    const response = await axios.post(PISTON_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    // console.log("user=",req.user); 
    // console.log(response);
    const { run, compile } = response.data;
    console.log(response.data)
    if (compile.code) {
      // Compilation error
      return res.status(400).json({
        error: "Compilation Error",
        details: compile.stderr,
      });
    }
    else if(run.stderr){
      return res.status(400).json({
        error: "Runtime Error",
        details: compile.stderr,
      });
    }
    else if(run.code===0){
      return res.json({
        error: "Success",
        details: run.stdout,
      });
    }
  
  } catch (error) {
    console.error("Error running code:", error.message);
    res.status(500).json({ error: "Error executing code." });
  }
};

// exports.submitCode = async (req, res) => {
//   const { problemId, code, input, language = "cpp", version = "10.2.0", userId } = req.body;

//   // Ensure user is authenticated and req.user is populated
//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized: User not logged in." });
//   }

//   try {
//     // Prepare payload for the Piston API
//     const payload = {
//       language,
//       version,
//       stdin: input,
//       files: [
//         {
//           content: code,
//         },
//       ],
//     };

//     // Execute the code
//     const response = await axios.post(PISTON_API_URL, payload, {
//       headers: { "Content-Type": "application/json" },
//     });

//     const { run, compile } = response.data;

//     let status = "Accepted";
//     let output = run.stdout;

//     // Handle errors
//     if (compile.stderr) {
//       status = "Compilation Error";
//       output = compile.stderr;
//     } else if (run.code !== 0) {
//       status = "Runtime Error";
//       output = run.stderr;
//     }

//     // Save the submission to the database
//     // const submission = new Submission({
//     //   problem: problemId,
//     //   user: userId, // Use authenticated user ID
//     //   code,
//     //   status,
//     // });

//     // await submission.save();

//     res.json({
//       status,
//       output,
//       // submissionId: submission._id,
//       message: "Code submission executed and saved!",
//     });
//   } catch (error) {
//     console.error("Error submitting code:", error.message);
//     res.status(500).json({ error: "Error saving submission or executing code." });
//   }
// };
// const Submission = require('./models/submission'); // Assuming Submission model is in ./models/submission

exports.submitCode = async (req, res) => {
  const { problemId, code, input, outputcase, language = "cpp", version = "10.2.0", userId } = req.body;
  console.log(req.body);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not logged in." });
  }
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  try {
    // Prepare payload for Piston API
    const payload = {
      language,
      version,
      files: [
        {
          content: code,
        },
      ],
    };

    let allCasesPassed = true;
    let testResults = [];

    // Process each test case
    for (let i = 0; i < input.length; i++) {
      const inputCase = input[i];
      const expectedOutput = outputcase[i];

      payload.stdin = inputCase;

      // Execute the code
      const response = await axios.post(PISTON_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { run, compile } = response.data;

      let status = "Accepted";
      let output = run.stdout;

      // Compilation Error
      if (compile && compile.code !== 0) {
        status = "Compilation Error";
        output = compile.stderr;
        testResults.push({ input: inputCase, output, status });
        allCasesPassed = false;
        break; // Stop further execution on compilation error
      }

      // Runtime Error
      if (run.code !== 0) {
        status = "Runtime Error";
        output = run.stderr;
        testResults.push({ input: inputCase, output, status });
        allCasesPassed = false;
        continue;
      }

      // Wrong Answer
      if (output.trim() !== expectedOutput.trim()) {
        status = "Wrong Answer";
        // output = `Expected: ${expectedOutput}, but got: ${output}`;
        output=output
        allCasesPassed = false;
      }

      // Add test case result
      testResults.push({ input: inputCase, output, status });
    }

    // Determine final submission status
    const finalStatus = allCasesPassed ? "Accepted" : testResults.find((result) => result.status !== "Accepted").status;

    // Save submission to database
    const submission =new Submission({
      problem: problemId,
      user: userId,
      code,
      status: finalStatus,
    });
    await submission.save();

// Update user's solved problems and counts
if (finalStatus === "Accepted") {
  const user = await User.findById(userId);

  if (!user.solvedProblems.includes(problemId)) {
    // Add the problem to solvedProblems and increment count
    user.solvedProblems.push(problemId);
    user.problemsSolved += 1;
    user.problemsSolvedByLevel[problem.level] += 1;
  }
  await user.save();
} 
// else {
//   // Increment submission count only
 
// }//i think submisiion cnt to increase for all submiisions 
    await User.findByIdAndUpdate(userId, { $inc: { submissionCount: 1 } });
    console.log(submission)
    // Respond with test results
    res.json({
      status: finalStatus,
      message: allCasesPassed ? "All test cases passed!" : "Some test cases failed.",
      testResults,
    });
  } catch (error) {
    console.error("Error submitting code:", error.message);
    res.status(500).json({ error: "Error saving submission or executing code." });
  }
};

