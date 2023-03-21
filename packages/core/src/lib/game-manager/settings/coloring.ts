import { IColor } from "@reaxion/common";

export class DefaultColoring implements IColor {
    public readonly countdown = "bg-red-500";
    public readonly waiting = "bg-orange-500";
    public readonly end = "bg-green-500";
}

export class AlternateColoring implements IColor {
    public readonly countdown = "bg-pink-500";
    public readonly waiting = "bg-yellow-500";
    public readonly end = "bg-teal-500";
}

export class Alternate2Coloring implements IColor {
    public readonly countdown = "bg-blue-500";
    public readonly waiting = "bg-rose-500";
    public readonly end = "bg-amber-500";
}

export const colorings: Record<string, IColor> = {
    DEFAULT_COLOR: new DefaultColoring(),
    ALTERNATE_COLOR: new AlternateColoring(),
    ALTERNATE_2ND_COLOR: new Alternate2Coloring(),
};