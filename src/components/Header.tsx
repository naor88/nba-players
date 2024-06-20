import { CgMenu } from "react-icons/cg";

declare type SafeNumber = number | `${number}`;

const Header = (props: {
  text: string;
  toggleSidebar: () => void;
  height: SafeNumber;
}) => {
  const { height } = props;
  return (
    <div className="sticky top-0 z-10 bg-primary p-1">
      <div className="m-auto w-11/12">
        <div className="flex justify-start gap-3 align-middle leading-10">
          <label htmlFor="my-drawer">
            <CgMenu
              className="cursor-pointer h-10 leading-10"
              size={height}
              color="oklch(var(--pc))"
            />
          </label>
          <p className="text-l text-primary-content font-bold h-10 leading-10 text-center">
            {props.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
