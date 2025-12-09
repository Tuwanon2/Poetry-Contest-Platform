export const SelectCard = ({ label, selected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "18px",
      borderRadius: 10,
      border: selected ? "2px solid #009688" : "2px solid #ddd",
      cursor: "pointer",
      background: selected ? "#e9f7f5" : "#fff",
      marginBottom: 12,
      transition: "0.2s",
      display: "flex",
      alignItems: "center"
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: "2px solid #009688",
        marginRight: 12,
        background: selected ? "#009688" : "transparent"
      }}
    />
    
    <span style={{ fontSize: "1rem" }}>{label}</span>
  </div>
);
