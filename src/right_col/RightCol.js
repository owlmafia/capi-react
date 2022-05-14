import { MyAccount } from "../app_comps/MyAccount";

export const RightCol = ({ deps }) => {
  return (
    <div id="rightcol">
      <MyAccount
        deps={deps}
        // no dao here
        daoId={null}
      />
    </div>
  );
};
