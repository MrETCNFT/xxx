import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Max 20 Prime Apes/Mint Transaction.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "0x8A616E6C717F3117B48E9C6E55aaAFc9c706711d",
    SCAN_LINK: "https://blockscout.com/etc/mainnet/address/0x8A616E6C717F3117B48E9C6E55aaAFc9c706711d",
    NETWORK: {
      NAME: "Ethereum Classic",
      SYMBOL: "ETC",
      ID: 1,
    },
    NFT_NAME: "ETC Prime Apes Society",
    SYMBOL: "ETCPRIME",
    MAX_SUPPLY: 11111,
    WEI_COST: 350000000000000000,
    DISPLAY_COST: 0.35,
    GAS_LIMIT: 300000,
    MARKETPLACE: "ETC Planets",
    MARKETPLACE_LINK: "https://",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
    .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("🤔 Oops, something went wrong. Please try again.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `🦍 OoOo AhAh Congrats! Input NFT #ID(S) To View Your Apes In Metamask 🦊. You May Buy & Sell Apes on The High Quality ETC Planets & BitKeep NFT Marketplace!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.gif" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle> - Total Prime Apes Minted -
            <s.TextDescription 
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
              
            >
               <s.SpacerMedium />
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? ( 
              <> 
                <s.TextTitle 
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  🦍 1 {CONFIG.SYMBOL} = {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}/Mint 🦍
                
                </s.TextTitle>
                <s.SpacerLarge />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                ETC Army, The Time Is Now!
                <s.SpacerSmall />
                Oo Oo Ahh Ahh! The ETC Prime Apes Revolution Has Begun!!! 
                <s.SpacerSmall />
                 ( Connect Below For LIVE Mint Count ) 
                 <s.SpacerLarge />
                 <s.SpacerLarge />
                  x WELCOME TO THE HOME OF THE ETHEREUM CLASSIC PRIME APE SOCIETY x
                  <s.SpacerLarge />
                  🦍🔥🍌🔥🍌🔥🍌🔥🍌🦍
                  <s.SpacerLarge />
                 ---------------
               <s.SpacerMedium />
                 A Premium Collection of 11.1k Bad Ass, Epic Prime Apes - Unlocking Real Exclusive Communitys & Rewards! 
                  <s.SpacerLarge />
                  All 11.1k Prime Ape Society Members Have Been Unleashed on the Blockchain! Grab em' while you can - Let's Mint Out, Raise The Sale Volume & Send The Floor ! 🚀
                  <s.SpacerLarge />
                   The ETC Prime Apes are of The 1st Hi-Def Premium Quality ERC-721 Art Collections to Exist on The Immutable {CONFIG.NETWORK.NAME} Blockchain.💚
                  <s.SpacerLarge />
                 <s.SpacerLarge />
                  ---------------
                  <s.SpacerMedium />
                  ✅ - Blockscout Verified ERC-721 Smart Contract.
               <s.SpacerMedium />
                  ✅ - 100% Fair & Equal Distribution ALWAYS.
                  <s.SpacerMedium />
                  ✅ - Unique and Provably Rare Apes
                  <s.SpacerMedium />
                  ✅ - Legendary & Living on The Greatest Blockchain in History.
                  <s.SpacerMedium />
                  ✅ - Immediately Buy & Sell Your Apes on Our Epic BitKeep™️ NFT Marketplace - Simply Search & Add Our Contract Ox To View, List or Buy!
                  <s.SpacerMedium />
                  ✅ - Hold NFTs For Epic 1 of A Kind IRL Rewards (Q2 2023):
                  <s.SpacerSmall />
                  Frequent Giveaways, Airdrops, Plus Participation In An Ever Growing Jam-Packed Community!
                  <s.SpacerLarge />
                  <s.SpacerLarge />
                  <s.SpacerLarge />
              Apes Unite With A Collection For The ETCNFT Books!
               <s.SpacerXSmall />
                💚 🦍 APE FOLLOW APE 🦍 💚
               <s.SpacerXSmall />
               ---------------
               <s.SpacerMedium />
               We are beyond hyped to walk amongst the other great Primate Collections on ETC. All Apes Coexist on the ETC Blockchain Jungle. 
               What makes us special? Within our collection each and every Prime Ape is Unique and Sought after with no two single apes alike. 
               <s.SpacerMedium />
               - Over 288+ Insane Originally Hand Sketched Attributes 
               <s.SpacerMedium />
               - Each Prime Ape NFT Icludes 9 Layers of Traits - From Common to Extremely Rare!
               <s.SpacerMedium />
              - Out of 11,111 NFT's , there is > 40 Instances of some Extremely Rare Traits! 🦍🔥
              <s.SpacerMedium />
              - This Includes Ultra-Rare Unique Prime Apes Such as: Joker Ape, Predator Ape, Apacolyptic Ape, Cage Fighter, Squid Game Ape & More! 
                  <s.SpacerMedium />
             PERMA BOUNTY: Mint Any Ultra-Rare ETC Prime Ape above, Let Us Know & Get 1 ETC Airdropped!
               <s.SpacerLarge />
               <s.SpacerLarge />
               <s.SpacerLarge />
               🍀 MAY YOUR MINTS BE RARE, HAPPY MINTING!🍀
               <s.SpacerXSmall />
               Sincerely, The ETC Prime Apes Dev Team 🤝
               <s.SpacerLarge />
               <s.SpacerXSmall />
               ---------------
               <s.SpacerMedium />
               We Are Unstoppable! Thank You For The Massive Support!
               <s.SpacerMedium />
                </s.TextDescription>
                <s.SpacerLarge />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      <s.SpacerSmall />
                      <s.SpacerSmall />
                      ⏳ HURRY, APES GOING FAST! ⏳
                      <s.SpacerSmall />
                    </s.TextDescription>
                    <s.SpacerLarge />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >                 
                      Connect To Mint
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "Grabbing ETCPRIME.." : "Mint Apes Now!"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
             📍 Please Join The Ape Troop On Telegram To Keep Up 📍
             <s.SpacerMedium />
            <s.SpacerMedium />
             We Thank you, Sincerely.
             <s.SpacerLarge />
            Once Minted, this action is immutable.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
           Gas is set to {CONFIG.GAS_LIMIT} to ensure the contract to
            successfully Mint your Epic ETC Prime Apes.🦍
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
