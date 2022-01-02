import moment from "moment";
export const RoadMapItem = ({ item, onEdit }) => {
  return (
    <div key={item.tx_id} className="withdrawal-cell">
      <p>
        <span className="key-val-key">{"Tx id:"}</span>
        <span className="key-val-val">
          <a href={item.tx_link}>{item.tx_id}</a>
        </span>
      </p>
      <p>
        <span className="key-val-key">{"Title:"}</span>
        <span className="key-val-val">
          <a href={item.title}>{item.title}</a>
        </span>
      </p>
      <p>
        <span className="key-val-key">{"Date:"}</span>
        <span className="key-val-val">{moment(item.date).format("LLL")}</span>
      </p>
      <button onClick={() => onEdit(item)}>{"Edit"}</button>
    </div>
  );
};
