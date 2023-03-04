interface Props extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
}
export const Countdown = ({ value }: Props) => {
    return <span className="countdown font-mono text-6xl">
        {/*@ts-ignore*/}
        <span style={{ "--value": value }}></span>
    </span>
}