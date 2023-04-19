export default function NFTPreview({ img }: { img: string }) {
  return (
    <div>
      <img
        src={img}
        alt="qr code"
        style={{
          borderRadius: "10px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
