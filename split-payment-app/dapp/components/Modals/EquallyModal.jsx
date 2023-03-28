import { useState } from "react";

const EqualModal = (props) => {
  const [participants, setParticipants] = useState("");

  const addParticipants = (e) => {
    e.preventDefault();
    const participantsArray = participants.split(", ");
    console.log(participantsArray);
    localStorage.setItem("addresses", JSON.stringify(participantsArray));
  };

  const splitBillEqually = (e) => {
    e.preventDefault();
    const participants = JSON.parse(localStorage.getItem("addresses"));
    console.log(participants);

    props.contract.methods.splitFunds(participants).send({from: props.address});
  }


  return (
    <div className="fixed flex flex-col items-center justify-center z-50 left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white px-4 py-2 rounded-sm w-[400px]">
        <div className="text-end text-lg">
          <p className="cursor-pointer" onClick={props.onClose}>
            x
          </p>
        </div>
        <h1 className="text-center text-xl font-semibold">
          Enter Payment Details
        </h1>
        <div className="mt-3">

          <form className="mt-10 w-full">
            <label>Submit Participants Address</label>
            <div className="mt-1 w-full">
              <input
                type="text"
                placeholder="Enter address of participant"
                className="border border-solid border-black rounded-sm py-2 px-4 outline-none w-full"
                onChange={(e) => setParticipants(e.target.value)}
                required
              />
              <p className="text-xs text-red-400">Note: Separate participant address by only a coma and space</p>
            </div>
            <div className="text-center mt-1">
              <button className="bg-yellow-500 rounded-sm py-1 px-2 text-white" onClick={addParticipants}>Add Participant</button>
            </div>
            <div className="mt-8">
                <button type="submit" className="w-full bg-green-500 rounded-sm text-white py-3" onClick={splitBillEqually}>Split Amount</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EqualModal;
