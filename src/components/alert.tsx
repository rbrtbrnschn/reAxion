import { ColorsNames } from "../interfaces/colors";

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
    <div className={`border-l-4 p-4 ${colorVariants[color]}`} role="alert">
      <p className="font-bold">{title}</p>
      <p>{description}</p>
    </div>
  );
};
