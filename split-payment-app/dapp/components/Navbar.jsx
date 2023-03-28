const Navbar = (props) => {
  return (
    <header className="px-2">
      <ul className="flex justify-end px-2">
        <li>
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2" onClick={props.onOpen}>
            Split bill equally
          </button>
        </li>
        <li>
          <button className="bg-purple-500 text-white py-2 px-4 rounded-md ml-2" onClick={props.onOpenRatio}>
            Split bill by defined ratio
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
