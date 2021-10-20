import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { init, drain } from "./controller";

var QRCode = require("qrcode.react");

export const Project = (props) => {
  const [viewProject, setViewProject] = useState(null);
  const [funds, setFunds] = useState(null);
  const [customerBalance, setCustomerBalance] = useState(null);

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
    //   console.log("loading project id: " + JSON.stringify(props.match.params));
    init(props.match.params.id, setViewProject, setFunds, setCustomerBalance);
  }, [props.match.params.id]);

  const projectView = () => {
    if (viewProject) {
      return (
        <div>
          <div className="container">
            <p>{"Project name:"}</p>
            {viewProject.project.name}
            <p>{"Total share supply:"}</p>
            {viewProject.shares_supply}
            <p>{"Shares for sale:"}</p>
            {viewProject.shares_available}
            <p>{"Funds (Algo):"}</p>
            {funds}
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
            <p>{"Outstanding funds (Algo):"}</p>
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
            {customerBalance}
            {/* TODO: substract min balance from funds to drain showed here (WASM) */}
            <button
              disabled={props.myAddress === "" || customerBalance === 0}
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
            <p>{"Customer payment address:"}</p>

            <CopyToClipboard
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
            </CopyToClipboard>

            <CopyToClipboard
              text={viewProject.customer_payment_deeplink}
              onCopy={onCopyPaymentLink}
            >
              <div>
                {"Customer payment link"}
                <span className="copy">
                  {paymentLinkIsCopied ? "copied!" : <MdContentCopy />}
                </span>
              </div>
            </CopyToClipboard>

            <br />
            <p>{"Customer payment QR code:"}</p>
            <QRCode value={viewProject.customer_payment_deeplink} />
            <br />

            <CopyToClipboard
              text={viewProject.project.invest_link}
              onCopy={onCopyInvestingLink}
            >
              <div>
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
              </div>
            </CopyToClipboard>
            <br />
            <a
              href={viewProject.project.my_investment_link}
              target="_blank"
              rel="noreferrer"
            >
              {"My investment"}
            </a>
          </div>
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
