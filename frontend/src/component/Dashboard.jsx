import React, { useEffect, useState ,useCallback} from 'react';
import './a.css'
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { useAuth } from '../context/auth';
const Dashboard = () => {
  const [data, setData] = useState({
    dashboardData: null,
    heatmapData: [],
    loading: true,
  });
  console.log("hi")
  const { user } = useAuth();
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1); // Start of the year
  const endDate = new Date(today.getFullYear(), 11, 31);

  const generateYearHeatmap = (startDate, endDate, submissions) => {
    const dates = [];
    let currentDate = new Date(startDate);

    const submissionMap = new Map(submissions.map((s) => [s.date, s.count]));

    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        dates.push({
            date: dateStr,
            count: submissionMap.get(dateStr) || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dates;
};
  // Fetch dashboard data and heatmap data in parallel
  const fetchData = useCallback(async () => {
    console.log("in fetch")
    try {
      const [dashboardResponse, heatmapResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/dashboard', {
          params: { userId: user.id },
        }),
        axios.get(`http://localhost:4000/api/heatmap/${user.id}`, {
          params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        }),
      ]);
      const transformedHeatmapData = generateYearHeatmap(
        startDate,
        endDate,
        heatmapResponse.data
    );
      setData({
        dashboardData: dashboardResponse.data,
        heatmapData: transformedHeatmapData,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData((prevState) => ({ ...prevState, loading: false }));
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { dashboardData, heatmapData, loading } = data;
  console.log(dashboardData)
  if (loading) {
    return <div className="text-center mt-20 text-xl font-semibold">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="text-center mt-20 text-red-600">No data available.</div>;
  }

  // Destructure data for easy access
  const {
    username,
    email,
    totalSubmissions,
    submittedProblemsCount,
    problemsSolvedByLevel,
    submissionsByStatus,
    recentSubmissions,
  } = dashboardData;
  
  // Prepare Pie Chart Data for Submissions by Status
  const statusData = {
    labels: submissionsByStatus.map((s) => s._id), // e.g., Accepted, Wrong Answer
    datasets: [
      {
        label: 'Submissions by Status.',
        data: submissionsByStatus.map((s) => s.count),
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'], // green, red, yellow
      },
    ],
  };

  // Prepare Bar Chart Data for Solved Problems by Level
  const levelData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [
          problemsSolvedByLevel.Easy || 0,
          problemsSolvedByLevel.Medium || 0,
          problemsSolvedByLevel.Hard || 0,
        ],
        backgroundColor: ['#3b82f6', '#f97316', '#e11d48'], // blue, orange, red
      },
    ],
  };
  const statusOptions = {
    responsive: true,
    maintainAspectRatio: true, // Allow the chart to resize based on the container
    plugins: {
      legend: {
        position: 'top', // This will help keep the legend inside the chart area
      },
    },
  };
  
  const levelOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to resize based on the container
    scales: {
      y: {
        ticks: {
          stepSize: 1, // Force the y-axis to increment by 1
          callback: function (value) {
            return Number.isInteger(value) ? value : null; // Only show integers
          },
        },
      },
    },
  };
  
  
  return (
    <div className="container mx-auto p-8 h-full ">


      User Stats
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600">Username</h2>
          <p className="text-xl text-gray-800">{username}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600">Email</h2>
          <p className="text-xl text-gray-800">{email}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Submissions</h2>
          <p className="text-2xl font-bold text-blue-600">{totalSubmissions}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600">Problems Submitted</h2>
          <p className="text-2xl font-bold text-green-600">{submittedProblemsCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 h-100">
        <div className="p-2 bg-white shadow rounded-lg h-80 flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-gray-600  text-center">Submissions by Status</h3>
          <div className="w-full h-full flex justify-center items-center">
             <Pie data={statusData} options={statusOptions} />
          </div>
        </div>

        <div className="p-4 bg-white shadow rounded-lg h-80 flex flex-col justify-center items-center">
         <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">Problems Solved by Level</h3>
         <div className="w-full h-full flex justify-center items-center">
          <Bar data={levelData} options={levelOptions} />
         </div>
        </div>
      </div>


      {/* Recent Submissions */}
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Recent Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Problem Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{submission.problem.title}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{submission.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-gray-600 text-lg font-semibold mb-4">Submissions Heatmap</h3>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'heatmap-low';
            if (value.count < 3) return 'heatmap-medium';
            if (value.count < 5) return 'heatmap-high';
            return 'heatmap-very-high';
          }}
          
          
          tooltipDataAttrs={(value) => ({
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': value.count
              ? ` ${value.count} submissions`
              : 'No submissions',
          })}
        />
        <Tooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
};

export default Dashboard;
