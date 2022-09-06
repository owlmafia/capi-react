import { toBytes } from "../common_functions/common";
import { toMaybeIpfsUrl } from "../ipfs/store";
import { toErrorMsg } from "../validation";

const wasmPromise = import("wasm");

export const getTeam = async (statusMsg, url, setTeam) => {
  try {
    const { bridge_get_team } = await wasmPromise;

    const team = await bridge_get_team({
      url: url,
    });

    console.log({ team });
    setTeam(team.team);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const addTeamMember = async (
  statusMsg,
  wallet,

  showProgress,

  daoId,
  myAddress,

  name,
  role,
  descr,
  picture,
  social_link,
  team,
  setTeam,

  setNameError,
  setRoleError,
  setDescrError,
  setPictureError,
  setSocialError
) => {
  try {
    const { bridge_add_team_member, bridge_set_team, bridge_submit_set_team } =
      await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    // update json + possible validations in wasm
    let addMemberRes = await bridge_add_team_member({
      inputs: {
        name,
        role,
        descr,
        picture,
        social_links: [social_link],
      },
      existing_members: team,
    });
    console.log("addMemberRes: " + JSON.stringify(addMemberRes));

    // save json to ipfs (ideally we'd do this in wasm too, but web3 sdk is js)
    const teamUrl = await toMaybeIpfsUrl(toBytes(await addMemberRes.to_save));

    // save the ipfs url in dao state
    let setTeamRes = await bridge_set_team({
      dao_id: daoId,
      owner_address: myAddress,
      url: teamUrl,
    });
    console.log("setTeamRes: " + JSON.stringify(setTeamRes));
    showProgress(false);

    let setTeamResSigned = await wallet.signTxs(setTeamRes.to_sign);
    console.log("withdrawResSigned: " + setTeamResSigned);

    showProgress(true);
    let submitTeamRes = await bridge_submit_set_team({
      txs: setTeamResSigned,
    });

    console.log("submitTeamRes: " + JSON.stringify(submitTeamRes));

    statusMsg.success("Update team submitted");

    // we wait for the complete process to succeed before showing the updated team
    setTeam(addMemberRes.team);

    showProgress(false);
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setNameError(toErrorMsg(e.name));
      setDescrError(toErrorMsg(e.description));
      setRoleError(toErrorMsg(e.share_supply));
      setPictureError(toErrorMsg(e.share_price));
      setSocialError(toErrorMsg(e.investors_share));

      // show a general message additionally, just in case
      statusMsg.error("Please fix the errors");
    } else {
      statusMsg.error(e);
    }

    showProgress(false);
  }
};
