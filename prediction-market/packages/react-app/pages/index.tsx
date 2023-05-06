import Coin from "@/components/Coin/Coin";
import TableComponent from "@/components/Table";
import styles from "@/styles/Home.module.scss";
import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { ethers, Contract } from "ethers";
import abi from "@/utils/abi.json";
import { TableRowType } from "@/type";
import { WrapperBuilder } from "redstone-evm-connector";

const CONTRACT_ABI = abi;
const celoscanBaseUrl = process.env.NEXT_PUBLIC_ALFAJORES_URL as string;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export default function Home() {
  const provider = useProvider();
  const { isConnected } = useAccount();
  const [wager, setWager] = useState(0);
  const [isHead, setIsHead] = useState(true);
  const [tableRows, setTableRows] = useState<TableRowType[]>([]);

  async function getContract() {
    let contract;

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any);
        const signer = provider.getSigner();

        console.log(signer);
        contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
    return contract;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      if (contract) {
        const wrappedContract = WrapperBuilder.wrapLite(
          contract
        ).usingPriceFeed("redstone", { asset: "ENTROPY" });

        let tx = await wrappedContract.placeBet(isHead ? 0 : 1, {
          value: ethers.utils.parseEther(wager.toString()),
        });

        alert("Transaction Submitted!");
      }
    } catch (error) {
      alert("Failed to process transaction!");
      console.log("ERROR:", error);
    }

    console.log({ wager, isHead });
  };

  const fetchEvents = async () => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      // Define the event filter
      const filter = contract.filters.BetResult();

      // Get past events
      const eventLogs = await contract.queryFilter(filter);

      // Process and store the events
      const fetchedEvents = await Promise.all(
        eventLogs.map(async (log) => {
          const parsedEvent = contract.interface.parseLog(log);

          // Construct the Etherscan URL for the transaction
          const txUrl = `${celoscanBaseUrl}/tx/${log.transactionHash}`;

          // Return the event data along with the transaction URL
          return {
            ...parsedEvent,
            txUrl: txUrl,
          };
        })
      );

      let parsedEvents = fetchedEvents.reverse().map((event) => {
        const parsedEvent = event.args;

        console.log(event.txUrl);
        return {
          user: parsedEvent.user as string,
          wager: parseFloat(ethers.utils.formatEther(parsedEvent.wager)),
          payout: parseFloat(ethers.utils.formatEther(parsedEvent.payout)),
          status: parsedEvent.win as boolean,
          timestamp: new Date(parsedEvent.timestamp * 1000),
          txUrl: event.txUrl,
        };
      });
      setTableRows(parsedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();

    let buyMeACoffee = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    buyMeACoffee.on("BetResult", fetchEvents);

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("BetResult", fetchEvents);
      }
    };
  }, []);

  return (
    <>
      <div className={styles.Home}>
        <div className={styles.HomeCoin}>
          <Coin isHead={isHead} />
        </div>
        <form className={styles.HomeForm} onSubmit={handleSubmit}>
          <div className={styles.HomeFormWager}>
            <label htmlFor="wager">Wager</label>
            <input
              type="number"
              id="wager"
              min={0}
              max={100}
              value={wager}
              onChange={(e) => setWager(parseInt(e.target.value))}
            />
          </div>
          <div className={styles.HomeFormAmount}>
            <div>
              <label>Payout</label>
              <input type="number" disabled value={wager * 2} />
            </div>
            <div>
              <label>Wager</label>
              <input type="number" disabled value={wager} />
            </div>
          </div>
          <div className={styles.HomeFormCoinSide}>
            <button
              onClick={() => setIsHead((prev) => !prev)}
              disabled={!isHead}
              type="button"
            >
              Tails
            </button>
            <button
              onClick={() => setIsHead((prev) => !prev)}
              disabled={isHead}
              type="button"
            >
              Heads
            </button>
          </div>
          <button disabled={!isConnected || !wager} type="submit">
            Place Bet
          </button>
        </form>
      </div>
      <div className={styles.History}>
        <h2>Bet History</h2>
        <TableComponent rows={tableRows} />
      </div>
    </>
  );
}
