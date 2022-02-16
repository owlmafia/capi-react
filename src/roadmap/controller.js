import { signTx } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (projectId, setProject, statusMsg) => {
  try {
    const { init_log, bridge_load_project_user_view_with_id } =
      await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
    var project = await bridge_load_project_user_view_with_id(projectId);
    setProject(project);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadRoadmap = async (
  statusMsg,
  projectId,
  creatorAddress,
  setRoadmapItems
) => {
  try {
    const { bridge_load_roadmap } = await wasmPromise;

    const roadmapRes = await bridge_load_roadmap({
      creator_address: creatorAddress,
      project_id: projectId,
    });
    console.log("roadmapRes: " + JSON.stringify(roadmapRes));

    setRoadmapItems(roadmapRes.items);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const addRoadmapItem = async (
  myAddress,
  statusMsg,
  showProgress,
  updateMyBalance,
  projectId,
  creatorAddress,
  title,
  // epoch milliseconds
  dateTimestamp
) => {
  try {
    const { bridge_add_roadmap_item, bridge_submit_add_roadmap_item } =
      await wasmPromise;

    statusMsg.clear();
    showProgress(true);

    const roadmapRes = await bridge_add_roadmap_item({
      creator_address: creatorAddress,
      project_id: projectId,
      title: title,
      parent: null,
      // in rust we use seconds - the fact that we get milliseconds from moment.js is seen as a js impl detail, so changed in js
      date: "" + dateTimestamp / 1000,
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
    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
