import { ColorsNames } from "../interfaces/colors.interface";

export interface AlertProps {
  color: ColorsNames & ("fuchsia" | "green" | "orange" | "red");
  title: string;
  description: string;
}
export const Alert = ({ color, title, description }: AlertProps) => {
  const colorVariants: Record<
    ColorsNames & ("fuchsia" | "green" | "orange" | "red"),
    string
  > = {
    green: "bg-green-100 border-green-500 text-green-700",
    red: "bg-red-100 border-red-500 text-red-700",
    orange: "bg-orange-100 border-orange-500 text-orange-700",
    fuchsia: "bg-fuchsia-100 border-fuchsia-500 text-fuchsia-700",
  };

  return (
    <div className={`rounded-full p-5 ${colorVariants[color]} text-center shadow-lg w-4/5`} role="alert">
      <div className="w-max m-auto">
        <p className="font-bold">{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};
