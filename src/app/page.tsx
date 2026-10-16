import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Coffee, MapPin, Truck } from 'lucide-react';
import { CoffeeBag } from '@/components/coffee-bag';
import { LeadForm } from '@/components/lead-form';
import { Motion } from '@/components/motion';
import { OrderLink } from '@/components/order-link';
import { Button } from '@/components/ui/button';

const products = [
  { variant: 'ethiopia' as const, name: 'Эфиопия Иргачеффе', country: 'Эфиопия', place: 'Иргачеффе', tastes: ['Цветы', 'Бергамот'], note: 'Светлая обжарка', price: 32 },
  { variant: 'colombia' as const, name: 'Колумбия Уила', country: 'Колумбия', place: 'Уила', tastes: ['Карамель', 'Красное яблоко'], note: 'Для кофейной паузы', price: 29 },
  { variant: 'brazil' as const, name: 'Бразилия Серрадо', country: 'Бразилия', place: 'Серрадо', tastes: ['Орех', 'Шоколад'], note: 'Под эспрессо', price: 26 },
];

function Arrow() { return <span className="button-icon" aria-hidden="true"><ArrowUpRight /></span>; }

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a><Motion />
    <header className="site-header shell">
      <a href="#" className="wordmark" aria-label="Кварта, на главную">кварта<span className="wordmark-dot">.</span></a>
      <span className="header-location">Обжариваем сами.<br />Минск, с 2019</span>
      <nav aria-label="Основная навигация"><a href="#coffee">Кофе</a><a href="#subscription">Подписка</a><a href="#about">Мастерская</a><a href="#delivery">Доставка</a></nav>
      <OrderLink interest="subscription" className="header-order">Хочу кофе <ArrowUpRight aria-hidden="true" /></OrderLink>
    </header>
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-heading">
        <div className="hero-photo"><div className="hero-image-window"><Image className="hero-image" src="/images/roasting.webp" alt="Руки с кофейным зерном у охлаждающего барабана ростера" fill sizes="(max-width: 760px) 100vw, 60vw" priority quality={85} /></div></div>
        <div className="hero-copy">
          <p className="hero-intro"><span className="live-dot" />Своя обжарка. Минск, с 2019.</p>
          <h1 id="hero-heading">Ваш кофе<br />начинается<br />в четверг.</h1>
          <p className="hero-description">Обжариваем партиями по 5 кг.<br />В пятницу привозим по Минску.<br />На 1–3 день после обжарки.</p>
          <div className="hero-actions"><Button asChild className="button"><a href="#coffee">Выбрать кофе <Arrow /></a></Button><a className="hero-secondary" href="#subscription">Или по подписке <ArrowRight aria-hidden="true" /></a></div>
        </div>
        <div className="hero-product" aria-hidden="true"><CoffeeBag variant="ethiopia" /><span className="hero-product-note">Своя обжарка.<br />Ничего лишнего.</span></div>
        <div className="fresh-stamp"><span>У вас на</span><strong>1–3</strong><span>день после<br />обжарки</span></div>
        <div className="roast-route" aria-label="В четверг обжарка, в пятницу доставка"><div><strong>Чт</strong><span>Обжариваем</span></div><ArrowRight aria-hidden="true" /><div><strong>Пт</strong><span>Привозим</span></div></div>
        <span className="hero-footnote">Кофе с понятным днём рождения.</span>
      </section>

      <section id="coffee" className="coffee-section shell section-space" aria-labelledby="coffee-heading">
        <div className="section-heading"><div><span className="section-kicker"><Coffee aria-hidden="true" /> Из нашей мастерской</span><h2 id="coffee-heading">Какой вы<br />сегодня?</h2></div><p>Цветочный, карамельный, шоколадный.<br />Найдите вкус под своё утро.</p></div>
        <div className="product-grid">{products.map(product => <article className={`product product-${product.variant}`} key={product.variant}>
          <div className="product-scene"><span className="product-weight">Зерно · 250 г</span><span className="product-scene-note">{product.note}</span><CoffeeBag variant={product.variant} /></div>
          <div className="product-title"><h3>{product.country}<span>{product.place}</span></h3><p className="product-price">{product.price}<span> BYN</span></p></div>
          <div className="product-tastes">{product.tastes.map(taste => <span key={taste}>{taste}</span>)}</div>
          <OrderLink interest="order" product={product.name} className="product-order">Хочу эту пачку <ArrowUpRight aria-hidden="true" /></OrderLink>
        </article>)}</div>
        <article className="drips">
          <div className="drip-illustration" aria-hidden="true"><div className="drip-envelope back-envelope"><span>кварта</span></div><div className="drip-envelope front-envelope"><strong>кварта</strong><span>Кофе в дрипах</span><small>Заварите где угодно</small></div></div>
          <div className="drip-copy"><span className="drip-label">Хороший кофе без кофемолки</span><h3>Чашка. Вода.<br />Пять минут для себя.</h3><p>Дрип-пакеты, ассорти. На работу,<br />в дорогу или на ленивое утро.</p></div>
          <div className="drip-order"><span>10 дрип-пакетов</span><p className="product-price">18<span> BYN</span></p><OrderLink interest="order" product="Дрип-пакеты, ассорти — 10 штук" className="product-order">Хочу дрипы <ArrowUpRight aria-hidden="true" /></OrderLink></div>
        </article>
      </section>

      <section id="subscription" className="subscription-section shell" aria-labelledby="subscription-heading">
        <div className="subscription-copy"><p className="small-label">Ваш кофейный ритуал</p><h2 id="subscription-heading">Кофе кончился?<br />Уже едет.</h2><p className="subscription-description">Две пачки свежего зерна каждый месяц.<br />Вы ставите чайник — мы заботимся об остальном.</p><div className="subscription-price"><strong>54</strong><div>BYN / месяц<span>2 × 250 г · доставка бесплатно</span></div></div><OrderLink interest="subscription" className="button button-light">Хочу подписку <Arrow /></OrderLink><p className="subscription-fine">Состав и детали подписки обсудим по телефону.</p></div>
        <div className="subscription-still"><div className="subscription-orbit" aria-hidden="true" /><div className="subscription-bags"><CoffeeBag variant="colombia" /><CoffeeBag variant="brazil" /></div><span className="subscription-quantity">Утро начинается<br />не с поисков кофе.</span><span className="subscription-delivery"><Truck aria-hidden="true" /> Доставка за наш счёт</span></div>
      </section>

      <section id="about" className="about-section shell section-space" aria-labelledby="about-heading">
        <div className="about-photo"><Image src="/images/workshop.webp" alt="Кофейный ростер и рабочий стол в мастерской" fill sizes="(max-width: 760px) 100vw, 45vw" quality={80} /><div className="workshop-stamp">5 кг<span>за одну обжарку</span></div></div>
        <div className="about-copy"><p className="small-label">Сначала были бариста</p><h2 id="about-heading">Теперь<br />сами у ростера.</h2><p>Привет, мы Аня и Дмитрий. Раньше готовили кофе, разговаривали с гостями и всё чаще думали: а что, если обжаривать самим?</p><p>В 2019 году так и сделали. Теперь у нас маленькая мастерская на Короля, 9. Обжариваем партиями по 5 кг — достаточно мало, чтобы уделить внимание каждой.</p><p className="about-last">По четвергам у нас пахнет обжаркой.<br />По пятницам этот кофе едет к вам.</p><span className="founder-signature">Аня и Дмитрий <span>основатели «Кварты»</span></span></div>
      </section>

      <section id="delivery" className="delivery-section shell" aria-labelledby="delivery-heading">
        <div className="section-heading"><h2 id="delivery-heading">До встречи<br />за кофе.</h2><p>Развозим по Минску каждую пятницу.<br />А в мастерской рады вам каждый день.</p></div>
        <div className="delivery-grid"><article className="delivery-info"><span className="delivery-symbol"><Truck aria-hidden="true" /></span><div><h3>Кофе приедет к вам</h3><p>Доставка по Минску в пятницу.<br /><strong>От 50 BYN — бесплатно.</strong></p><p className="delivery-small">Для заказов до 50 BYN стоимость<br />доставки уточним при звонке.</p></div><span className="delivery-day" aria-hidden="true">Пт</span></article>
          <article className="pickup-info"><span className="delivery-symbol"><MapPin aria-hidden="true" /></span><div><h3>Или заходите сами</h3><a className="address-link" href="https://yandex.by/maps/?text=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D1%8F%2C%209" target="_blank" rel="noreferrer">Минск, ул. Короля, 9 <ArrowUpRight aria-hidden="true" /></a><dl className="opening-hours"><div><dt>Понедельник — пятница</dt><dd>8:00–20:00</dd></div><div><dt>Суббота — воскресенье</dt><dd>10:00–18:00</dd></div></dl></div></article></div>
      </section>

      <section id="request" className="request-section shell section-space" aria-labelledby="request-heading"><div className="request-copy"><p className="small-label">Давайте знакомиться</p><h2 id="request-heading">Какой кофе<br />будем пить?</h2><p>Оставьте номер. Поможем выбрать зерно,<br />расскажем о подписке и договоримся<br />о вашей первой доставке.</p><div className="request-cup" aria-hidden="true"><div className="cup-saucer"><div className="cup-coffee" /></div><span>Хороший разговор<br />начинается с кофе.</span></div></div><div className="form-surface"><LeadForm /></div></section>
    </main>
    <footer className="site-footer shell"><div className="footer-top"><p>Своя обжарка.<br />Минск, ул. Короля, 9.</p><a href="#coffee">Кофе для вашего четверга <ArrowUpRight aria-hidden="true" /></a><small>© 2026 Кварта</small></div><a href="#" className="footer-wordmark" aria-label="Кварта, в начало страницы">кварта<span>.</span></a></footer>
  </>;
}
