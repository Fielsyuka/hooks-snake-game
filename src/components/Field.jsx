import React from 'react';

const Field = ({fields}) => {
  return (
    <div className="field">
      {
        fields.map((row) => {
          return row.map((col, index) => {
            return <div className={`dots ${col}`} key={index}></div>
          })
        })
      }
    </div>
  );
};

export default Field;