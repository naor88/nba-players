import { PropsWithChildren, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useApiKey } from "../hooks/useApiKey";
import Header from "./Header";

export const Layout = ({ children }: PropsWithChildren) => {
  const { removeApiKey } = useApiKey();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handelLogout = (event: React.MouseEvent) => {
    event.preventDefault();
    removeApiKey();
  };

  return (
    <>
      <Header
        toggleSidebar={toggleModal}
        text="NBA Players App...🏀"
        height={30}
      />
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side z-10">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li
              className="btn btn-primary m-2"
              onClick={handelLogout}
            >
              <span>
                Logout <CiLogout />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto my-3 w-11/12">{children}</div>
    </>
  );
};
