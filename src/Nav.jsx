import { Button, Dialog, TextField, Autocomplete } from "@mui/material";
import { useState } from "react";
import { supabase } from "./supabaseClient";

const cities = [
  "Абакан", "Альметьевск", "Анапа", "Архангельск", "Астрахань", "Барнаул", "Белгород", "Брянск", "Великий Новгород", "Владивосток", 
  "Владимир", "Волгоград", "Волжский", "Вологда", "Воронеж", "Екатеринбург", "Иваново", "Ижевск", "Иркутск", "Йошкар-Ола", 
  "Казань", "Калининград", "Калуга", "Кемерово", "Киров", "Коломна", "Кострома", "Котельники", "Краснодар", "Красноярск", 
  "Курган", "Курск", "Липецк", "Магнитогорск", "Миасс", "Минеральные Воды", "Москва", "Мурманск", "Мытищи", "Набережные Челны", 
  "Нижневартовск", "Нижнекамск", "Нижний Новгород", "Нижний Тагил", "Новокузнецк", "Новомосковск", "Новороссийск", "Новосибирск", "Новый Уренгой", "Ногинск", 
  "Обнинск", "Октябрьский", "Омск", "Орёл", "Оренбург", "Пенза", "Пермь", "Петрозаводск", "Подольск", "Псков", 
  "Пятигорск", "Реутов", "Ростов-на-Дону", "Рязань", "Самара", "Санкт-Петербург", "Саранск", "Саратов", "Сергиев Посад", "Серпухов", 
  "Смоленск", "Сочи", "Ставрополь", "Старый Оскол", "Стерлитамак", "Сургут", "Сыктывкар", "Тамбов", "Тверь", "Тольятти", 
  "Томск", "Тула", "Тюмень", "Улан-Удэ", "Ульяновск", "Уфа", "Хабаровск", "Химки", "Чебоксары", "Челябинск", 
  "Череповец", "Чита", "Шахты", "Якутск", "Ярославль"
];

function extractContactInfo(input) {
  // Регулярные выражения для поиска телефона и электронной почты
  const phoneRegex =
    /(?:\+7|\+)?[\s(]*(\d{3})[\s)]*([0-9]{3})[-\s]?([0-9]{2})[-\s]?([0-9]{2})/g;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  // Поиск всех совпадений
  const phones = input.match(phoneRegex);
  const emails = input.match(emailRegex);

  // Преобразование первого найденного телефона
  let formattedPhone = phones ? phones[0].replace(/\D/g, "") : null;
  if (formattedPhone && formattedPhone.length >= 10) {
    formattedPhone = "7" + formattedPhone.slice(-10); // Заменяем на формат 7XXXXXXXXXX
  } else {
    formattedPhone = null; // Если телефон короче 10 цифр, устанавливаем в null
  }

  // Формируем объект с результатами
  const result = {
    phone: formattedPhone,
    email: emails ? emails[0] : null,
  };

  return result;
}

export const Nav = ({ fetchData, leeds }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Москва",
  });
  const [error, setError] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const onSubmit = async () => {
    setIsLoading(true);
    for (let key in data) {
      if (key !== "city" && leeds.find((info) => info[key] === data[key])) {
        setError((error) => ({ ...error, [key]: true }));
        setIsLoading(false);
        return;
      } else if (key === "phone" && data[key].length !== 11) {
        setError((error) => ({ ...error, [key]: true }));
        setIsLoading(false);
        return;
      }
    }
    if (!error.phone && !error.email) {
      await supabase.from("cpaex").insert(data);
      await fetchData();
      setOpen(false);
      setData({
        name: "",
        phone: "",
        email: "",
        city: "Москва",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="nav">
      <Button onClick={() => setOpen(true)}>Add</Button>
      <Dialog
        classes={{ paper: "dialog" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <TextField
          label="Recognize"
          onChange={(e) => {
            const value = e.target.value;
            const { phone, email } = extractContactInfo(value);
            setData((data) => ({ ...data, phone, email }));
          }}
        />
        <TextField
          label="Name"
          value={data.name}
          error={error.name}
          onChange={(e) => {
            setData((data) => ({ ...data, name: e.target.value }));
            setError((prev) => ({ ...prev, name: false }));
          }}
        />
        <TextField
          label="Phone"
          value={data.phone}
          error={error.phone}
          onChange={(e) => {
            setData((data) => ({ ...data, phone: e.target.value }));
            setError((prev) => ({ ...prev, phone: false }));
          }}
        />
        <TextField
          label="Email"
          value={data.email}
          error={error.email}
          onChange={(e) => {
            setData((data) => ({ ...data, email: e.target.value }));
            setError((prev) => ({ ...prev, email: false }));
          }}
        />
        <Autocomplete
          options={cities}
          onChange={(_, city) => setData((data) => ({ ...data, city }))}
          renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
          fullWidth
          value={data.city}
        />
        <Button
          variant="outlined"
          onClick={() => onSubmit()}
          disabled={isLoading}
        >
          Submit
        </Button>
      </Dialog>
    </div>
  );
};
