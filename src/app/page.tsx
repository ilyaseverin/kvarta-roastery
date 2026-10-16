import Image from 'next/image';
import { CoffeeBag } from '@/components/coffee-bag';
import { LeadForm } from '@/components/lead-form';
import { Motion } from '@/components/motion';
import { OrderLink } from '@/components/order-link';

const products = [
  { variant: 'ethiopia' as const, name: 'Эфиопия Иргачеффе', country: 'Эфиопия', place: 'Иргачеффе', taste: 'Цветочный, бергамот', note: 'Светлая обжарка', price: 32 },
  { variant: 'colombia' as const, name: 'Колумбия Уила', country: 'Колумбия', place: 'Уила', taste: 'Карамель, красное яблоко', note: 'Для ваших кофейных пауз', price: 29 },
  { variant: 'brazil' as const, name: 'Бразилия Серрадо', country: 'Бразилия', place: 'Серрадо', taste: 'Орех, шоколад', note: 'Под эспрессо', price: 26 },
];

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a><Motion />
    <header className="site-header shell">
      <a href="#" className="wordmark" aria-label="Кварта, на главную">кварта<span className="wordmark-dot">.</span></a>
      <span className="header-location">Своя обжарка.<br />Минск, с 2019 года</span>
      <nav aria-label="Основная навигация"><a href="#coffee">Кофе</a><a href="#about">Мастерская</a><a href="#delivery">Доставка</a></nav>
      <OrderLink interest="subscription" className="header-order">Оставить заявку <span aria-hidden="true">↗</span></OrderLink>
    </header>
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-heading">
        <div className="hero-copy"><p className="hero-intro"><span className="live-dot" />Маленькие партии. Хороший кофе.</p><h1 id="hero-heading">В четверг<br />обжариваем.<br />В пятницу<br />привозим.</h1><div className="hero-bottom"><p>Кофе у вас на <strong>1–3 день<br />после обжарки.</strong></p><a href="#coffee" className="button">Выбрать кофе <span aria-hidden="true">↗</span></a></div></div>
        <div className="hero-photo"><div className="hero-image-window"><Image className="hero-image" src="/images/roasting.webp" alt="Руки с кофейным зерном у охлаждающего барабана ростера" fill sizes="(max-width: 760px) 100vw, 46vw" priority quality={85} /></div><div className="photo-caption"><span>Каждую неделю — свежая партия</span></div><div className="calendar-badge" aria-label="В четверг обжарка, в пятницу доставка"><div className="week-card week-thursday"><span className="week-card-top">День обжарки</span><strong>Чт</strong><span className="week-card-bottom">Обжариваем<br />партиями по 5 кг</span></div><div className="week-card week-friday"><span className="week-card-top">День доставки</span><strong>Пт</strong><span className="week-card-bottom">Развозим<br />по Минску</span></div></div><span className="photo-footnote">Кофе с понятным днём рождения.</span></div>
        <div className="hero-signoff"><span>Обжарка «Кварта»</span><span>Кофе не должен ждать месяцами.</span><span className="scroll-note">Листайте, мы уже греем ростер <span aria-hidden="true">↓</span></span></div>
      </section>

      <section id="coffee" className="coffee-section shell section-space" aria-labelledby="coffee-heading">
        <div className="section-heading"><h2 id="coffee-heading">Что заварим?</h2><p>Три характера в зерне.<br />И дрипы, когда хочется проще.</p></div>
        <div className="product-grid">{products.map(product => <article className={`product product-${product.variant}`} key={product.variant}><div className="product-scene"><span className="product-weight">250 г зерна</span><CoffeeBag variant={product.variant} /><span className="product-scene-note">{product.note}</span></div><div className="product-title"><h3>{product.country}<span>{product.place}</span></h3><p className="product-price">{product.price}<span> BYN</span></p></div><p className="product-taste">{product.taste}</p><OrderLink interest="order" product={product.name} className="product-order">Хочу эту пачку <span aria-hidden="true">↗</span></OrderLink></article>)}</div>
        <article className="drips"><div className="drip-illustration" aria-hidden="true"><div className="drip-envelope back-envelope"><span>кварта</span></div><div className="drip-envelope front-envelope"><strong>кварта</strong><span>Кофе в дрипах</span><small>Заварите где угодно</small></div></div><div className="drip-copy"><h3>Кофе, чашка,<br />горячая вода.</h3><p>Дрип-пакеты, ассорти. На работу,<br />в дорогу или на ленивое утро.</p></div><div className="drip-order"><span>10 штук</span><p className="product-price">18<span> BYN</span></p><OrderLink interest="order" product="Дрип-пакеты, ассорти — 10 штук" className="product-order">Хочу дрипы <span aria-hidden="true">↗</span></OrderLink></div></article>
      </section>

      <section id="subscription" className="subscription-section" aria-labelledby="subscription-heading"><div className="shell subscription-inner"><div className="subscription-still"><span className="subscription-note">Для вашего следующего утра</span><div className="subscription-bags"><CoffeeBag variant="colombia" /><CoffeeBag variant="brazil" /></div><span className="subscription-quantity">2 × 250 г</span></div><div className="subscription-copy"><p className="small-label">Кофе по подписке</p><h2 id="subscription-heading">Две пачки.<br />Каждый месяц.</h2><p className="subscription-description">Чтобы дома всегда был повод<br />поставить чайник. Обжарим, упакуем<br />и привезём по Минску.</p><div className="subscription-price"><strong>54</strong><div>BYN / месяц<br /><span>Доставка бесплатно</span></div></div><OrderLink interest="subscription" className="button button-light">Хочу подписку <span aria-hidden="true">↗</span></OrderLink><p className="subscription-fine">Оставьте заявку — состав и детали<br />подписки обсудим по телефону.</p></div></div></section>

      <section id="about" className="about-section shell section-space" aria-labelledby="about-heading"><div className="about-photo"><Image src="/images/workshop.webp" alt="Кофейный ростер и рабочий стол в мастерской" fill sizes="(max-width: 760px) 100vw, 45vw" quality={80} /><div className="workshop-stamp" aria-hidden="true">5 кг<br /><span>за одну обжарку</span></div></div><div className="about-copy"><p className="small-label">За кофе — люди</p><h2 id="about-heading">Привет.<br />Мы — Аня<br />и Дмитрий.</h2><p>Раньше мы работали бариста. Готовили кофе, разговаривали с гостями и всё чаще думали: а что, если обжаривать самим?</p><p>В 2019 году так и сделали. Теперь у нас маленькая мастерская на Короля, 9. Обжариваем партиями по 5 кг — достаточно мало, чтобы уделить внимание каждой.</p><p className="about-last">По четвергам у нас пахнет обжаркой.<br />По пятницам этот кофе едет к вам.</p><span className="founder-signature">Аня и Дмитрий, «Кварта»</span></div></section>

      <section className="freshness-strip"><div className="shell freshness-inner"><span className="freshness-day">Чт</span><p>Сначала обжарим.</p><span className="freshness-arrow" aria-hidden="true">⟶</span><span className="freshness-day">Пт</span><p>Потом привезём.</p><span className="freshness-end">Свежесть —<br />в этом весь смысл.</span></div></section>

      <section id="delivery" className="delivery-section shell section-space" aria-labelledby="delivery-heading"><div className="section-heading"><h2 id="delivery-heading">Увидимся<br />в пятницу?</h2><p>Привезём по Минску.<br />Или заглядывайте в мастерскую.</p></div><div className="delivery-grid"><article className="delivery-info"><span className="delivery-symbol" aria-hidden="true">Пт</span><h3>До вашей двери</h3><p>Развозим заказы по Минску<br />каждую пятницу.</p><strong>От 50 BYN — бесплатно.</strong><p className="delivery-small">Для заказов до 50 BYN стоимость<br />доставки уточним при звонке.</p></article><article className="pickup-info"><span className="delivery-symbol" aria-hidden="true">↗</span><h3>Заходите за своей пачкой</h3><a className="address-link" href="https://yandex.by/maps/?text=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D1%8F%2C%209" target="_blank" rel="noreferrer">Минск, ул. Короля, 9 <span aria-hidden="true">↗</span></a><dl className="opening-hours"><div><dt>Понедельник — пятница</dt><dd>8:00–20:00</dd></div><div><dt>Суббота — воскресенье</dt><dd>10:00–18:00</dd></div></dl></article></div></section>

      <section id="request" className="request-section" aria-labelledby="request-heading"><div className="shell request-inner"><div className="request-copy"><p className="small-label">Давайте знакомиться</p><h2 id="request-heading">С вас — номер.<br />С нас —<br />хороший кофе.</h2><p>Расскажите, что вас интересует.<br />Мы перезвоним, поможем выбрать<br />и договоримся о доставке.</p><span className="request-aside">Можно просто спросить.<br />Мы любим говорить о кофе.</span></div><LeadForm /></div></section>
    </main>
    <footer className="site-footer shell"><a href="#" className="wordmark" aria-label="Кварта, в начало страницы">кварта<span className="wordmark-dot">.</span></a><p>Маленькая обжарка.<br />Минск, ул. Короля, 9.</p><span>С четверга — с любовью.</span><small>© 2026 Кварта</small></footer>
  </>;
}
