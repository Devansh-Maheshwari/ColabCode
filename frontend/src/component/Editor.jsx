import React from 'react';

const Editor = ({ userCode, setUserCode }) => (
  <div className="h-full flex flex-col flex-grow">
    <textarea
      className="w-full h-full p-4 text-gray-800 border rounded-lg resize-none min-h-[300px]"
      value={userCode}
      onChange={(e) => setUserCode(e.target.value)}
      placeholder="Write your code here..."
      style={{
        overflow: 'auto', 
      }}
    />
  </div>
);

export default Editor;
