// @ts-nocheck
import React from "react";
import img from "next/img";

export default function detail() {
  return (
    <div>
      <div className="detail">
        <div className="detail1">
          <img src="./a1.png" />
        </div>
        <div className="detail2">
          <div className="dtf">
            <div className="detail-text1 ">Roumanie</div>
            <div className="detail-text2">Ends in 4 days</div>
          </div>

          <div className="detail-text3">
            Roumanie is a stunning mixed media artwork created by the talented
            artist Sarah Smith. The piece features a richly textured and layered
            background, painted in deep shades of green and blue, which creates
            a sense of depth and mystery. The composition is further enhanced by
            the use of gold leaf accents, which add a touch of shimmering magic
            to the piece.
          </div>
          <div className="detail-text4 ">Current Bid</div>
          <div className="detail-text5">1.5 ETH/ $3800</div>
          <div>
            <input className="detail-input" placeholder="Enter bid price" />
          </div>
          <div className="detail-text6">You must bid at least 1.6 ETH</div>
          <button className="detailbut">Place a bid</button>
        </div>
      </div>
    </div>
  );
}
