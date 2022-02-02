import React, { useState, useEffect } from "react";
import { init, addRoadmapItem } from "./controller";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { LabeledInput } from "../common_comps/LabeledInput";

export const AddRoadmapItem = ({
  statusMsg,
  showProgress,
  setMyBalance,
  projectId,
  myAddress,
}) => {
  let params = useParams();

  const [itemTitle, setItemTitle] = useState("");
  const [project, setProject] = useState(null);
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    init(projectId, setProject, statusMsg);
  }, [projectId, statusMsg]);

  const view = () => {
    return (
      project && (
        <div>
          <LabeledInput
            label={"Label:"}
            inputValue={itemTitle}
            onChange={(input) => setItemTitle(input)}
            placeholder="Describe the item"
          />
          <Calendar onChange={onChange} value={value} />
          <button
            className="button__submit"
            disabled={myAddress === ""}
            onClick={async () => {
              await addRoadmapItem(
                statusMsg,
                showProgress,
                setMyBalance,
                params.id,
                myAddress,
                itemTitle,
                value.getTime()
              );
            }}
          >
            {"Add"}
          </button>
        </div>
      )
    );
  };

  return <div>{view()}</div>;
};
