import React, { useEffect, useState } from "react";
import { SubmitButton } from "../common_comps/SubmitButton";
import twitter from "../images/svg/twitter.svg";
import { getTeam } from "./controller";
import { ContentTitle } from "../ContentTitle";
import { AddTeamMember } from "./AddTeamMember";

export const Team = ({ deps }) => {
  const [team, setTeam] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function asyncInit() {
      if (deps.dao?.team_url) {
        await getTeam(deps.statusMsg, deps.dao.team_url, setTeam);
      }
    }
    asyncInit();
  }, [deps.dao?.team_url, deps.statusMsg]);

  return (
    <div className="mt-80">
      <ContentTitle title={"Team"} />
      {!deps.dao?.team_url && <EmptyTeamView deps={deps} />}
      {team.map((member) => (
        <TeamMember key={member.uuid} data={member} />
      ))}
      {deps.myAddress && (
        <SubmitButton
          label={"Add a member"}
          className="button-primary w-100"
          onClick={async () => setIsAdding(true)}
        />
      )}
      {isAdding && (
        <AddTeamMember
          deps={deps}
          prefillData={dummyPrefillData()}
          team={team}
          setTeam={setTeam}
          onAdded={() => setIsAdding(false)}
        />
      )}
    </div>
  );
};

const dummyPrefillData = () => {
  return {
    name: "Foo Bar",
    role: "Founder",
    descr:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    picture: "https://placekitten.com/200/300",
    social: "https://twitter.com",
  };
};

const TeamMember = ({ data }) => {
  return (
    <div>
      <img src={data.picture} alt="" />
      <div>{data.name}</div>
      <div>{data.role}</div>
      <div>{data.descr}</div>
      <div>
        {data.social_links.map((url) => (
          <SocialLink key={url} url={url} />
        ))}
      </div>
    </div>
  );
};

const SocialLink = ({ url }) => {
  return (
    <a href={url}>
      <SocialMediaImage url={url} />
    </a>
  );
};

const SocialMediaImage = ({ url }) => {
  var src;
  if (url.includes("twitter")) {
    src = twitter;
    // TODO other social media
  } else {
    // TODO generic link default
    src = twitter;
  }
  return <img src={src} alt="" />;
};

const EmptyTeamView = () => {
  return <div>{"No team yet"}</div>;
};
