import './style.css';
import TomSelect from 'tom-select';

const MAX_COMEDIANS = 6;

const bookingComediansList = document.querySelector('.booking__comedians-list');

const createComedianBlock = comedians => {
  const li = document.createElement('li');
  li.classList.add('booking__comedian');

  const selectComedian = document.createElement('select');
  selectComedian.classList.add('booking__select', 'booking__select_comedian');

  const selectTime = document.createElement('select');
  selectTime.classList.add('booking__select', 'booking__select_time');

  const inputHidden = document.createElement('input');
  inputHidden.type = 'hidden';
  inputHidden.name = 'booking';

  const btnHall = document.createElement('button');
  btnHall.classList.add('booking__hall');
  btnHall.type = 'button';

  li.append(selectComedian, selectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(selectComedian, {
    hideSelected: true,
    placeholder: 'Выбрать комика',
    options: comedians.map(item => ({
      value: item.id,
      text: item.comedian,
    })),
  });

  const bookingTomSelectTime = new TomSelect(selectTime, {
    hideSelected: true,
    placeholder: 'Время',
  });

  // изначально пока не выбран комик время закрыто
  bookingTomSelectTime.disable();

  //при выборе комика опция времени открывается
  bookingTomSelectComedian.on('change', id => {
    bookingTomSelectTime.enable(); // активируем
    bookingTomSelectComedian.blur(); // уводим пользователя с элемента

    const { performances } = comedians.find(item => item.id === id);

    bookingTomSelectTime.clear(); // очищение выбранного поля
    bookingTomSelectTime.clearOptions(); // очищение выбора времени

    bookingTomSelectTime.addOptions(
      performances.map(item => ({
        value: item.time,
        text: item.time,
      })),
    );

    btnHall.remove();
  });

  bookingTomSelectTime.on('change', time => {
    if (!time) {
      return;
    }

    const idComedian = bookingTomSelectComedian.getValue();
    const { performances } = comedians.find(item => item.id === idComedian);
    const { hall } = performances.find(item => item.time === time);

    inputHidden.value = `${idComedian}, ${time}`; // для отправки на сервер + подгрузка QR

    bookingTomSelectTime.blur(); // уводим пользователя с элемента
    btnHall.textContent = hall;
    li.append(btnHall);
  });

  const createNextBookingComedian = () => {
    // для выпадашки выбора доп комедиантов
    if (bookingComediansList.children.length < MAX_COMEDIANS) {
      const nextComediansBlock = createComedianBlock(comedians);
      bookingComediansList.append(nextComediansBlock);
    }

    bookingTomSelectTime.off('change', createNextBookingComedian);
  };

  bookingTomSelectTime.on('change', createNextBookingComedian);

  return li;
};

const getComedians = async () => {
  const response = await fetch('http://localhost:8080/comedians');
  return response.json();
};

const init = async () => {
  const countComedians = document.querySelector(
    '.event__info-item_comedians .event__info-number',
  );

  const comedians = await getComedians();

  // TODO: изменение окончания
  countComedians.textContent = comedians.length;

  const comedianBlock = createComedianBlock(comedians);
  bookingComediansList.append(comedianBlock);
};

init();
