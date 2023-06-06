import styles from "./QuickClick.module.scss";

export default function QuickClick({
  value,
  amount,
  setAmountHandler,
}: {
  value: number;
  amount: number;
  setAmountHandler: (value: number) => void;
}) {
  return (
    <span
      className={[
        styles.quickValue,
        amount === value ? styles.quickValueActive : null,
      ].join(" ")}
      onClick={() => setAmountHandler(value)}
    >
      {value}
    </span>
  );
}
