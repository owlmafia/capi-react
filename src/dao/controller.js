import { bridge_description } from "../pkg";

export const loadDescription = async (statusMsg, dao, setDescription) => {
  try {
    if (dao && dao.descr_url) {
      let description = await bridge_description(dao.descr_url);
      setDescription(description);
    } else {
      setDescription("");
    }
  } catch (e) {
    statusMsg.error(e);
  }
};
