import { OkCancelModal } from "../modal/OkCancelModal";
import { ProspectusView } from "./ProspectusView";

export const ProspectusModal = ({
  url,
  onAccept,
  closeModal,
  prospectusHash,
  setProspectusHash,
}) => {

  return (
    <OkCancelModal
      title={"Prospectus"}
      closeModal={closeModal}
      okLabel={"Acknowledge"}
      onSubmit={() => onAccept()}
    >
      <ProspectusView
        url={url}
        hash={prospectusHash}
        setHash={setProspectusHash}
      />
    </OkCancelModal>
  );
};
