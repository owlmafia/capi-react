import { signTx } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (projectUuid, setProject, statusMsg) => {
  try {
    const { init_log, bridge_load_project_user_view_with_uuid } =
      await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
    var project = await bridge_load_project_user_view_with_uuid(projectUuid);
    setProject(project);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadRoadmap = async (
  statusMsg,
  projectUuid,
  creatorAddress,
  setRoadmapItems
) => {
  try {
    const { bridge_load_roadmap } = await wasmPromise;

    const roadmapRes = await bridge_load_roadmap({
      creator_address: creatorAddress,
      project_uuid: projectUuid,
    });
    console.log("roadmapRes: " + JSON.stringify(roadmapRes));

    setRoadmapItems(roadmapRes.items);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const addRoadmapItem = async (
  statusMsg,
  showProgress,
  setMyBalance,
  projectUuid,
  creatorAddress,
  title
) => {
  try {
    const {
      bridge_add_roadmap_item,
      bridge_submit_add_roadmap_item,
      bridge_balance,
    } = await wasmPromise;

    statusMsg.clear();
    showProgress(true);

    const roadmapRes = await bridge_add_roadmap_item({
      creator_address: creatorAddress,
      project_uuid: projectUuid,
      title: title,
      parent: null,
    });
    showProgress(false);

    let addItemSigned = await signTx(roadmapRes.to_sign);
    console.log("addItemSigned: " + addItemSigned);

    showProgress(true);
    let submitAddItemRes = await bridge_submit_add_roadmap_item({
      tx: addItemSigned,
    });

    console.log("submitAddItemRes: " + JSON.stringify(submitAddItemRes));

    statusMsg.success(
      "Item added to roadmap. Tx id: " + submitAddItemRes.tx_id
    );
    showProgress(false);

    // TODO review this: we're assuming that my address is always creator's address here,
    // it should be ok since only the creator can/should be able to add items to roadmap, but review
    const balance = await bridge_balance({ address: creatorAddress });
    setMyBalance(balance.balance);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
