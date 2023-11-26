import './style.css';
import TomSelect from 'tom-select';

const bookingComediansList = document.querySelector('.booking__comedians-list');

const createComedianBlock = () => {
  const li = document.createElement('li');
  li.classList.add('booking__comedian');

  const selectComedian = document.createElement('select');
  selectComedian.classList.add('booking__select', 'booking__select_comedian');
  //selectComedian.setAttribute('name', 'comedian');

  const selectTime = document.createElement('select');
  selectTime.classList.add('booking__select', 'booking__select_time');
  //selectTime.setAttribute('name', 'time');

  const inputHidden = document.createElement('input');
  inputHidden.type = 'hidden';
  inputHidden.name = 'booking';

  const btnHall = document.createElement('button');
  btnHall.classList.add('booking__hall');

  li.append(selectComedian, selectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(selectComedian, {
    hideSelected: true,
    placeholder: 'Выбрать комика',
    options: [
      {
        value: 1,
        text: 'Юлия Ахмедова',
      },
      {
        value: 2,
        text: 'Слава Комиссаренко',
      },
    ],
  });

  const bookingTomSelectTime = new TomSelect(selectTime, {
    hideSelected: true,
    placeholder: 'Время',
  });

  // изначально пока не выбран комик время закрыто
  bookingTomSelectTime.disable();

  //при выборе комика опция времени открывается
  bookingTomSelectComedian.on('change', () => {
    bookingTomSelectTime.enable(); // активируем
    bookingTomSelectComedian.blur(); // уводим пользователя с элемента

    bookingTomSelectTime.addOptions([
      {
        value: 1,
        text: '19:00',
      },
      {
        value: 2,
        text: '20:00',
      },
    ]);
  });

  bookingTomSelectTime.on('change', () => {
    bookingTomSelectTime.blur(); // уводим пользователя с элемента
    btnHall.textContent = 'Зал 1';
    li.append(btnHall);
  });

  return li;
};

const init = async () => {
  const comedianBlock = await createComedianBlock();
  bookingComediansList.append(comedianBlock);
};

init();
