const Progress = () => {
  return (
    <div className="loader">
      <svg className="circular">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="5"
          stroke-miterlimit="10"
        ></circle>
      </svg>
    </div>
  );
};

export default Progress;
