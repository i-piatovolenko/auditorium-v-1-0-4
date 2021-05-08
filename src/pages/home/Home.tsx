import React from "react";
import styles from "./home.module.css";
import Logo from "../../components/logo/Logo";
import {useMe} from "../../hooks/useMe";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import {conjugate} from "../../helpers/conjugate";

const Home = () => {
  const me = useMe();

  return (
    <div className={styles.home}>
      <Header/>
      {!me ? <Loader/> : <><Logo
        title="Auditorium"
        description="Система управління видачею аудиторій"
      />
      <h1 className={styles.welcome}>{conjugate(me?.firstName)}, вітаємо в Auditorium!</h1>
      <div className={styles.about}>
        <ul>
          <p>В цій програмі Ви можете:</p>
          <li>Переглядати в режимі онлайн наявність вільних аудиторий</li>
          <li>
            Переглядати інформацію про аудиторії та наявні в них інструменти,
            тощо
          </li>
          <li>Дивитись розклад як на сьогодні, так і на кожен день.</li>
          <li>Переглядати інформацію про викладачів</li>
        </ul>
        <ul>
          <p>Для учбової частини:</p>
          <li>
            Записувати і виписувати користувачів в аудиторії (як зареєстрованих
            в системі, так і незареєстрованих)
          </li>
          <li>Дивитись інформацію по кожному користувачу</li>
          <li>
            Автоматичне заповнення журналу відвідувань з можливістю
            роздрукування або збереження у форматі PDF
          </li>
          <li>Перегляд розкладу</li>
        </ul>
        <ul>
          <p>Для адміністратора:</p>
          <li>
            Створення/коригування/видалення аудиторій, користувачів,
            інструментів
          </li>
          <li>Створення та редагування розкладу</li>
        </ul>
      </div></>}
    </div>
  );
};

export default Home;
