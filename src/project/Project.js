import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { init, drain } from "./controller";
import { ProjectName } from "../ProjectName";

var QRCode = require("qrcode.react");

export const Project = (props) => {
  const [viewProject, setViewProject] = useState(null);
  const [funds, setFunds] = useState(null);
  const [customerBalance, setCustomerBalance] = useState(null);

  const [customerAddressDisplay, setCustomerAddressDisplay] = useState("");

  const [investingLinkIsCopied, setInvestingLinkIsCopied] = useState(false);
  const [paymentLinkIsCopied, setPaymentLinkIsCopied] = useState(false);
  const [paymentAddressIsCopied, setPaymentAddressIsCopied] = useState(false);

  console.log("props: " + JSON.stringify(props));

  const onCopyPaymentAddress = () => {
    setPaymentAddressIsCopied(true);
    setTimeout(() => {
      setPaymentAddressIsCopied(false);
    }, 1000);
  };

  const onCopyPaymentLink = () => {
    setPaymentLinkIsCopied(true);
    setTimeout(() => {
      setPaymentLinkIsCopied(false);
    }, 1000);
  };

  const onCopyInvestingLink = () => {
    setInvestingLinkIsCopied(true);
    setTimeout(() => {
      setInvestingLinkIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading project id: " + JSON.stringify(props.match.params));
      const viewProject = await init(
        props.match.params.id,
        setViewProject,
        setFunds,
        setCustomerBalance
      );

      const customerAddress = viewProject.project.customer_escrow_address;
      const short_chars = 3;
      const leading = customerAddress.substring(0, short_chars);
      const trailing = customerAddress.substring(
        customerAddress.length - short_chars
      );
      const shortAddress = leading + "..." + trailing;
      setCustomerAddressDisplay(shortAddress);
    }
    asyncInit();
  }, [props.match.params.id]);

  const projectView = () => {
    if (viewProject) {
      return (
        <div>
          <div className="container">
            <ProjectName project={viewProject.project} />
            <p>
              <span className="key-val-key">{"Shares available:"}</span>
              <span className="key-val-val">
                {viewProject.shares_available +
                  " / " +
                  viewProject.shares_supply}
              </span>
            </p>
            <p>
              <span className="key-val-key">{"Funds (Algo):"}</span>
              <span className="key-val-val">{funds}</span>
            </p>
            <button
              disabled={props.myAddress === "" || funds === 0}
              hidden={viewProject.project.creator_address !== props.myAddress}
              onClick={(_) => {
                props.history.push({
                  pathname: "/withdraw/" + viewProject.project.id,
                  state: viewProject.project,
                });
              }}
            >
              {"Withdraw"}
            </button>
            <p>
              <span className="key-val-key">{"Outstanding funds (Algo):"}</span>
              <span className="key-val-val">{customerBalance}</span>
            </p>
            <button
              // className="right-button"
              disabled={props.myAddress === "" || customerBalance === 0}
              hidden={props.myAddress === ""}
              onClick={async (_) => {
                await drain(
                  props.myAddress,
                  props.showProgress,
                  props.statusMsg,
                  props.match.params.id,
                  setFunds,
                  setCustomerBalance
                );
              }}
            >
              {"Transfer to funds"}
            </button>
            {/* <p>
              {"Outstanding funds:"}
              <a
                href="#"
                onClick={() =>
                  props.showModal({
                    title: "Drain",
                    body: (
                      <div>
                        <p>
                          {
                            "This transfers the funds from the customer payment address to the project's funding pot."
                          }
                        </p>
                        <p>{"Anyone can trigger this."}</p>
                      </div>
                    ),
                  })
                }
              >
                ?
              </a>
            </p> */}
            {/* TODO: substract min balance from funds to drain showed here (WASM) */}
            <div className="section-spacer" />
            <p className="subtitle">{"Customer payment data"}</p>
            <p>
              <span className="key-val-key">{"Address:"}</span>
              <span className="key-val-val">
                <CopyToClipboard
                  text={viewProject.project.customer_escrow_address}
                  onCopy={onCopyPaymentAddress}
                >
                  <span>
                    <a
                      href={
                        "https://testnet.algoexplorer.io/address/" +
                        viewProject.project.customer_escrow_address
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {customerAddressDisplay}
                    </a>
                    <span className="copy">
                      {paymentAddressIsCopied ? "copied!" : <MdContentCopy />}
                    </span>
                  </span>
                </CopyToClipboard>
              </span>
            </p>

            {/* <CopyToClipboard
              text={viewProject.project.customer_escrow_address}
              onCopy={onCopyPaymentAddress}
            >
              <div>
                <a
                  href={
                    "https://testnet.algoexplorer.io/address/" +
                    viewProject.project.customer_escrow_address
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {viewProject.project.customer_escrow_address}
                </a>

                <span className="copy">
                  {paymentAddressIsCopied ? "copied!" : <MdContentCopy />}
                </span>
              </div>
            </CopyToClipboard> */}

            <CopyToClipboard
              text={viewProject.customer_payment_deeplink}
              onCopy={onCopyPaymentLink}
            >
              <div>
                {"Payment link"}
                <span className="copy">
                  {paymentLinkIsCopied ? "copied!" : <MdContentCopy />}
                </span>
              </div>
            </CopyToClipboard>
            <p>{"Payment QR code:"}</p>
            <QRCode value={viewProject.customer_payment_deeplink} />

            <div className="section-spacer" />
            <p className="subtitle">{"Investor links"}</p>
            <CopyToClipboard
              text={viewProject.project.invest_link}
              onCopy={onCopyInvestingLink}
            >
              <p>
                <a
                  href={viewProject.project.invest_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {"Investing link"}
                </a>
                <span className="copy">
                  {investingLinkIsCopied ? "copied!" : <MdContentCopy />}
                </span>
              </p>
            </CopyToClipboard>
            <a
              href={viewProject.project.my_investment_link}
              target="_blank"
              rel="noreferrer"
            >
              {"My investment"}
            </a>
          </div>
          <div className="section-spacer" />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{projectView()}</div>
    </div>
  );
};
