import Modal from "../Modal";
import Calendar from "react-calendar";
import moment from "moment";

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
    </Modal>
  );
};
