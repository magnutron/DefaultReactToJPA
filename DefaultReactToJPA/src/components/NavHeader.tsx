import NavItem from "./NavItem";

export default function NavHeader() {
  return (
    <>
      <nav className="bg-black-950  border-gray-200 text-black-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <NavItem pathLink="/about" itemName="About" />
          <NavItem pathLink="/" itemName="Home" />
          <NavItem pathLink="/participants" itemName="Participants" />
          <NavItem pathLink="/disciplines" itemName="Disciplines" />
          <NavItem pathLink="/results" itemName="Results" />
        </div>
      </nav>
    </>
  );
}
