import NavItem from "./NavItem";

export default function NavHeader() {
  return (
    <>
      <nav className="bg-black-950  border-gray-200 text-black-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavItem pathLink="/about" itemName="About" />
          <NavItem pathLink="/" itemName="Home" />
          <NavItem pathLink="/entity1page" itemName="Entity1Page" />
        </div>
      </nav>
    </>
  );
}
