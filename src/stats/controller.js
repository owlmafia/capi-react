import { bridge_load_dao } from "../pkg";

export const init = async (statusMsg, daoId, setDao) => {
  try {
    let dao = await bridge_load_dao(daoId);
    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
