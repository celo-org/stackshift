// @ts-nocheck
import React, { useState } from "react";
import img from "next/img";

export default function Profile() {
  const [state, setState] = useState(true);

  return (
    <div>
      <div className="bbf">
        <button onClick={() => setState(true)} className="bb">
          Your Bid
        </button>
        <button onClick={() => setState(false)} className="bb">
          Auctions
        </button>
      </div>

      {state ? (
        <section className="profile-section1">
          <div className="home-section2-inner">
            <div className="text31">
              Find all items you have placed a bid on here
            </div>
          </div>
          <div className="live">
            <div className="card">
              <img className="" src="./a1.png" alt="hero" />
              <div className="textflex1">
                <div className="text5">Eyes of oasis</div>
                <div className="text6">Ends in 3 minutes</div>
              </div>
              <div className="text7">Current Bid - 1.5eth</div>
              <div className="bidflex">
                <button className="bidbut1">Edit Bid</button>
                <button className="bidbut2">Cancel Bid </button>
              </div>
            </div>
            <div className="card">
              <img className="" src="./a1.png" alt="hero" />
              <div className="textflex1">
                <div className="text5">Eyes of oasis</div>
                <div className="text6">Ends in 3 minutes</div>
              </div>
              <div className="text7">Current Bid - 1.5eth</div>
              <div className="bidflex">
                <button className="bidbut1">Edit Bid</button>
                <button className="bidbut2">Cancel Bid </button>
              </div>
            </div>
            <div className="card">
              <img className="" src="./a1.png" alt="hero" />
              <div className="textflex1">
                <div className="text5">Eyes of oasis</div>
                <div className="text6">Ends in 3 minutes</div>
              </div>
              <div className="text7">Current Bid - 1.5eth</div>
              <div className="bidflex">
                <button className="bidbut1">Edit Bid</button>
                <button className="bidbut2">Cancel Bid </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="profile-section1">
          <div className="home-section2-inner">
            <div className="text31">
              Find all items you have put up for auction here
            </div>
          </div>
          <div className="live">
            <div className="card">
              <img className="" src="./a1.png" alt="hero" />
              <div className="textflex1">
                <div className="text5">Eyes of oasis</div>
                <div className="text6">Ends in 3 minutes</div>
              </div>
              <div className="text7">Current Bid - 1.5eth</div>
              <div className="bidflex">
                <button className="bidbut1">Refund bid</button>
                <button className="bidbut2">2.3 ETH/$300</button>
              </div>
            </div>
            <div className="card">
              <img className="" src="./a1.png" alt="hero" />
              <div className="textflex1">
                <div className="text5">Eyes of oasis</div>
                <div className="text6">Ends in 3 minutes</div>
              </div>
              <div className="text7">Current Bid - 1.5eth</div>
              <div className="bidflex">
                <button className="bidbut1">Refund bid</button>
                <button className="bidbut2">2.3 ETH/$300 </button>
              </div>
            </div>
            <div className="card">
              <img className="" src="./a1.png" alt="hero" />
              <div className="textflex1">
                <div className="text5">Eyes of oasis</div>
                <div className="text6">Ends in 3 minutes</div>
              </div>
              <div className="text7">Current Bid - 1.5eth</div>
              <div className="bidflex">
                <button className="bidbut1">Refund bid</button>
                <button className="bidbut2">2.3 ETH/$300 </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
