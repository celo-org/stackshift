import Coin from "@/components/Coin/Coin";
import styles from "@/styles/Home.module.scss";
import { useState } from "react";

export default function Home() {
  const [wager, setWager] = useState(0);
  const [isHead, setIsHead] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("submit");
  };

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
          <button disabled={false} type="submit">
            Place Bet
          </button>
        </form>
      </div>
      <div className={styles.History}>
        <h2>Bet History</h2>
      </div>
    </>
  );
}
