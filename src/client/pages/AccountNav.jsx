import logo from "../../assets/BSERS-logo.svg";

const AccountNav = () => {
  return (
    <header className="w-full fixed top-0 z-50 bg-black/40 backdrop-blur-md shadow-md">
      <nav className="flex items-center justify-between w-full px-5 sm:px-10">
        <Link to="/">
          <img src={logo} alt="BSERS Logo" width={100} height={100} />
        </Link>
        <h3 className="font-karla font-bold">Barangay Dulong Bayan</h3>
        <p>Dashboard</p>
        <p>Account</p>
        <button>Logout</button>
      </nav>
    </header>
  );
};

export default AccountNav;
