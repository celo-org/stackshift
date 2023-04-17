import React from "react";

export default function auction() {
  return (
    <div>
      <div className="auction">
        <div className="text10">Create Auction</div>
        <div className="formflex">
          <div>
            <div>Upload Item</div>
          </div>
          <div className="formbox">
            <div className="input-box">
              <label className="label">Item Name</label>
              <input className="input" placeholder="Enter Item Name" />
            </div>
            <div className="input-box">
              <label className="label">Starting Bid</label>
              <input className="input" placeholder="Enter starting bid" />
            </div>
            <div className="input-box">
              <label className="label">Auction Duration</label>
              <input className="input" placeholder="Select duration" />
            </div>
            <div className="input-box">
              <label className="label">Reserve Price</label>
              <input className="input" placeholder="Reserve Price" />
            </div>
            <div className="input-box">
              <label className="label">Bid Type</label>
              <input className="input" placeholder="Reserve Price" />
            </div>

            <button className="aubut">Create Auction</button>
          </div>
        </div>
      </div>
    </div>
  );
}
