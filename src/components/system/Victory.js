import Confetti from "react-confetti";

function ConfettiAnimation() {
  return (
    <Confetti
      numberOfPieces={200}
      recycle={false}
      colors={["#FFD700", "#FF1493", "#32CD32"]}
      run={true}
      timeout={3000}
    />
  );
}

export const Victory = () => {
  return (
    <div>
      <h1>YOU WON!</h1>
      <ConfettiAnimation />
    </div>
  );
};
