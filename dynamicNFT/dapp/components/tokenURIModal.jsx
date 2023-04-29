const AddTokenURI = (props) => {

  const addTokenUri = async (e) => {
    e.preventDefault();
    
    let response;
    response = await props.contract.methods.setTokenURI().send({ from: ownerAddress });
    if (response) props.onClose;
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-lg">
      <div
        className="text-end p-3 text-3xl font-thin cursor-pointer"
        onClick={props.onClose}
      >
        x
      </div>
      <div className="flex flex-col justify-center items-center h-[555px]">
        <form onSubmit={addTokenUri}>
          <div className="w-[300px] rounded-md mb-2">
            <input
              type="text"
              className="outline-none rounded-md p-2 text-black w-full"
              placeholder="Enter token Id"
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </div>
          <div className="w-[300px] rounded-md mt-2">
            <input
              type="text"
              className="outline-none rounded-md p-2 text-black w-full"
              placeholder="Paste Token URI"
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </div>
          <div className="text-center mt-5">
            <button className="bg-blue-500 rounded-md py-2 px-4">
              Add NFT
            </button>
          </div>          
        </form>
      </div>
    </div>
  );
};

export default AddTokenURI;
