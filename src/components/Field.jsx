import React from 'react';

const Field = ({fields}) => {
  return (
    <div className="field">
      {
        fields.map((row) => {
          return row.map((col) => {
            return <div className={`dots ${col}`}></div>
          })
        })
      }
    </div>
  );
};

export default Field;