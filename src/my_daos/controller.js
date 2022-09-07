import { bridge_my_daos } from "../pkg";

export const loadMyDaos = async (statusMsg, myAddress, setMyDaos) => {
  try {
    const myDaosRes = await bridge_my_daos({
      address: myAddress,
    });
    console.log("myDaosRes: " + JSON.stringify(myDaosRes));

    setMyDaos(myDaosRes.daos);
  } catch (e) {
    statusMsg.error(e);
  }
};
