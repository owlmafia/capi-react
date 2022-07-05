import Modal from "../modal/Modal";
import Calendar from "react-calendar";
import moment from "moment";
import { SubmitButton } from "../app_comps/SubmitButton";

// endDate, setEndDate: moment.js date (converted internally to/from regular date for calendar)
export const SelectDateModal = ({ closeModal, endDate, setEndDate }) => {
  return (
    <Modal title={"Select end date"} onCloseClick={() => closeModal()}>
      <Calendar
        onChange={(value) => {
          setEndDate(moment(value)); // date -> moment
          closeModal();
        }}
        value={endDate.toDate()} // moment -> date
      />
      <div className="d-flex gap-40">
        <SubmitButton
          label={"Save"}
          className="button-primary"
          onClick={async () => {}}
        />
        <SubmitButton
          label={"Cancel"}
          className="button-cyan"
          onClick={async () => {}}
        />
      </div>
    </Modal>
  );
};
