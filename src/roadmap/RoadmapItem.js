export const RoadMapItem = ({ item }) => {
  return (
    <div className="roadmap_item">
      <div className="roadmap_item__line">
        <svg className="roadmap_item__line_svg">
          <circle cx="50%" cy="50%" r="4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" />
        </svg>
      </div>
      <a
        href={"https://testnet.algoexplorer.io/tx/" + item.tx_id}
        target="_blank"
        rel="noreferrer"
      >
        {item.text}
      </a>
    </div>
    // Note: not showing date for now. Not sure where - might not be necessary at all on the UI.
  );
};
