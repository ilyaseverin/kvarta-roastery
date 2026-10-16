export function CoffeeBag({ variant = 'ethiopia', small = false }: { variant?: 'ethiopia' | 'colombia' | 'brazil'; small?: boolean }) {
  const labels = {
    ethiopia: { country: 'Эфиопия', place: 'Иргачеффе', taste: 'Цветочный · бергамот', roast: 'Светлая обжарка' },
    colombia: { country: 'Колумбия', place: 'Уила', taste: 'Карамель · красное яблоко', roast: 'Свежая обжарка' },
    brazil: { country: 'Бразилия', place: 'Серрадо', taste: 'Орех · шоколад', roast: 'Под эспрессо' },
  };
  const item = labels[variant];
  return <div className={`coffee-bag bag-${variant} ${small ? 'bag-small' : ''}`} aria-hidden="true">
    <div className="bag-seam" /><div className="bag-valve" />
    <div className="bag-label"><span className="bag-logo">кварта</span><div className="bag-origin"><strong>{item.country}</strong><span>{item.place}</span></div><span className="bag-taste">{item.taste}</span><div className="bag-bottom"><span>{item.roast}</span><b>250 г</b></div></div>
    <span className="bag-footnote">Обжарено в Минске</span>
  </div>;
}
