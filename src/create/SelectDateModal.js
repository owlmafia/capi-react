import Modal from "../modal/Modal";
import Calendar from "react-calendar";
import moment from "moment";
import { SubmitButton } from "../app_comps/SubmitButton";
import { useState } from "react";

// endDate, setEndDate: moment.js date (converted internally to/from regular date for calendar)
export const SelectDateModal = ({ closeModal, endDate, setEndDate }) => {
  const [newEndDate, setNewEndDate] = useState(endDate);

  return (
    <Modal title={"Select end date"} onCloseClick={() => closeModal()}>
      <Calendar
        onChange={(value) => {
          setNewEndDate(moment(value)); // date -> moment
          // closeModal();
        }}
        value={newEndDate.toDate()} // moment -> date
      />
      <div className="d-flex gap-40">
        <SubmitButton
          label={"Save"}
          className="button-primary"
          onClick={() => {
            setEndDate(newEndDate);
            closeModal();
          }}
        />
        <SubmitButton
          label={"Cancel"}
          className="button-cyan"
          onClick={closeModal}
        />
      </div>
    </Modal>
  );
};
