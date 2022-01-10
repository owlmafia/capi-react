import React, { useState, useEffect, useMemo, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import {
  init,
  fetchHolderCount,
  fetchSharesDistribution,
  fetchIncomeVsSpendingChartData,
} from "./controller";
import { ProjectName } from "../ProjectName";
import renderPieChart from "../charts/renderPieChart";
import renderMultilineChart from "../charts/renderMultilineChart";

var QRCode = require("qrcode.react");

export const Project = (props) => {
  const [viewProject, setViewProject] = useState(null);
  const [funds, setFunds] = useState(null);

  const [holderCount, setHolderCount] = useState(null);

  const [customerAddressDisplay, setCustomerAddressDisplay] = useState("");

  const [investingLinkIsCopied, setInvestingLinkIsCopied] = useState(false);
  const [paymentLinkIsCopied, setPaymentLinkIsCopied] = useState(false);
  const [paymentAddressIsCopied, setPaymentAddressIsCopied] = useState(false);

  const sharesDistributionChart = useRef(null);
  const incomeVsSpendingChart = useRef(null);

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

  const project = useMemo(() => {
    if (viewProject) {
      return viewProject.project;
    }
  }, [viewProject]);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading project id: " + JSON.stringify(props.match.params));
      await init(
        props.match.params.id,
        setViewProject,
        setFunds,
        setCustomerAddressDisplay,
        props.statusMsg
      );
    }
    asyncInit();
  }, [props.match.params.id, props.statusMsg]);

  useEffect(() => {
    if (project) {
      fetchHolderCount(
        props.statusMsg,
        project.shares_asset_id,
        setHolderCount
      );
    }
  }, [project]);

  const sharesAssetId = useMemo(() => {
    if (project) {
      return project.shares_asset_id;
    }
  }, [project]);

  const sharesSupply = useMemo(() => {
    if (project) {
      return project.share_supply;
    }
  }, [project]);

  useEffect(async () => {
    if (sharesAssetId && sharesSupply && sharesDistributionChart.current) {
      const sharesDistribution = await fetchSharesDistribution(
        props.statusMsg,
        sharesAssetId,
        sharesSupply
      );

      renderPieChart(
        sharesDistributionChart.current,
        sharesDistribution,
        (d) => d[1].percentage_number
      );
    }
  }, [sharesAssetId, sharesSupply, sharesDistributionChart.current]);

  useEffect(async () => {
    if (incomeVsSpendingChart.current) {
      const chartData = await fetchIncomeVsSpendingChartData(
        props.statusMsg,
        props.match.params.id
      );

      if (chartData) {
        renderMultilineChart(
          incomeVsSpendingChart.current,
          chartData.flat_data_points,
          chartData.chart_lines
        );
      } else {
        console.error("Couldn't render income vs spending chart");
      }
    }
  }, [incomeVsSpendingChart.current]);

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
                  viewProject.project.share_supply}
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
                  pathname: "/withdraw/" + props.match.params.id,
                  state: viewProject.project,
                });
              }}
            >
              {"Withdraw"}
            </button>
            <p>
              <span className="key-val-key">
                {"Investor's part"}
                <a
                  href="#"
                  onClick={() =>
                    props.showModal({
                      title: "Investor's share",
                      body: (
                        <div>
                          <p>
                            {
                              "The % of the project's income reserved to investors"
                            }
                          </p>
                        </div>
                      ),
                    })
                  }
                >
                  ?:
                </a>
              </span>
              <span className="key-val-val">{viewProject.investors_share}</span>
            </p>
            <div className="section-spacer" />
            <p className="subtitle">{"Holders distribution"}</p>
            <div>
              <svg width={200} height={200} ref={sharesDistributionChart} />
            </div>
            <p>
              <span className="key-val-key">{"Total:"}</span>
              <span className="key-val-val">{holderCount}</span>
            </p>
            <p className="subtitle">{"Income and spending"}</p>
            <div>
              <svg width={200} height={200} ref={incomeVsSpendingChart} />
            </div>

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
                  {"Invest"}
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
