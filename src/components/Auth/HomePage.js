// components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, FileText, CreditCard, Globe, Shield, Clock } from 'lucide-react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Навигационная панель с кнопками */}
      <nav className="navbar">
        <div className="logo">
          <Truck size={28} className="logo-icon" />
          <span className="logo-text">LogiPay Trans</span>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">
            Войти
          </Link>
          <Link to="/register" className="btn-register">
            Регистрация
          </Link>
        </div>
      </nav>

      {/* Герой-секция */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Комплексные <span className="highlight">логистические</span> решения
          </h1>
          <p className="hero-subtitle">
            Полный цикл услуг: от таможенного оформления до доставки и финансовых операций
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">
              Начать работу
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <Truck size={48} />
            <p>Доставка в 50+ стран</p>
          </div>
        </div>
      </section>

      {/* Информация о компании */}
      <section className="company-info">
        <div className="container">
          <h2 className="section-title">О компании</h2>
          <p className="company-description">
            <strong>LogiPay Trans</strong> — ведущий провайдер комплексных логистических 
            и финансовых решений. Мы объединяем транспортную логистику, таможенное 
            оформление и финансовые операции в единую экосистему для бизнеса.
          </p>
          
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">12+</div>
              <div className="stat-label">лет на рынке</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">клиентов</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">партнеров</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="services" id="services">
        <div className="container">
          <h2 className="section-title">Наши услуги</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <CreditCard size={32} />
              </div>
              <h3>Платежные решения</h3>
              <ul>
                <li>Переводы</li>
                <li>Таможенные платежи</li>
                <li>Финансовый мониторинг</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FileText size={32} />
              </div>
              <h3>Таможенное оформление</h3>
              <ul>
                <li>Подготовка деклараций</li>
                <li>Сертификация товаров</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Truck size={32} />
              </div>
              <h3>Транспортная логистика</h3>
              <ul>
                <li>Мультимодальные перевозки</li>
                <li>Складская логистика</li>
                <li>Трекинг грузов</li>
                <li>Страхование грузов</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Globe size={32} />
              </div>
              <h3>Международная логистика</h3>
              <ul>
                <li>Доставка по всему миру</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <Shield size={32} />
              </div>
              <h3>Безопасность и контроль</h3>
              <ul>
                <li>Финансовая безопасность</li>
                <li>Контроль качества</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="advantages">
        <div className="container">
          <h2 className="section-title">Почему выбирают нас</h2>
          <div className="advantages-content">
            <div className="advantage">
              <div className="advantage-number">01</div>
              <h3>Интегрированная платформа</h3>
              <p>Все услуги в одном месте: платежи, декларации и транспорт</p>
            </div>
            <div className="advantage">
              <div className="advantage-number">02</div>
              <h3>Прозрачность операций</h3>
              <p>Полный контроль над каждым этапом цепочки поставок</p>
            </div>
            <div className="advantage">
              <div className="advantage-number">03</div>
              <h3>Технологичность</h3>
              <p>Современные IT-решения для автоматизации процессов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Truck size={24} />
              <span>LogiPay Trans</span>
            </div>
            <div className="footer-info">
              <p>© 2026 LogiPay Trans. Все права защищены.</p>
              <p>logipaytrans@gmail.com | +375 (29) 123-45-67</p>
            </div>
            <div className="footer-auth">
              <Link to="/login" className="footer-login">
                Войти в систему
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;