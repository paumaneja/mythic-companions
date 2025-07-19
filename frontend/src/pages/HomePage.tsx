export default function HomePage() {
  const backgroundUrl = '/assets/images/welcome.png';

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      {/* Overlay fosc per a la llegibilitat del text */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
}