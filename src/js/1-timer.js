
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;

const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0].getTime();

        if (userSelectedDate <= Date.now()) {
            iziToast.error({ message: "Please choose a date in the future" });
            startBtn.disabled = true;
        } else {
            startBtn.disabled = false;
        }
        console.log(selectedDates[0]);
    },
};
flatpickr("#datetime-picker", options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

startBtn.addEventListener('click', startTimer);
const datetimePicker = document.querySelector('#datetime-picker');
let timeInterval = null;
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minElement = document.querySelector('[data-minutes]');
const secElement = document.querySelector('[data-seconds]');

function startTimer() {
    if (!userSelectedDate) return;
    startBtn.disabled = true;
    datetimePicker.disabled = true;

    timeInterval = setInterval(() => {
        const currentTime = new Date();
        const deltaTime = userSelectedDate - currentTime;

        if (deltaTime <= 0) {
            clearInterval(timeInterval);
            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            datetimePicker.disabled = false;
            return;
        }

        const timeComponents = convertMs(deltaTime);
        updateTimer(timeComponents);
    }, 1000);
}

function updateTimer({ days, hours, minutes, seconds }) {
    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minElement.textContent = addLeadingZero(minutes);
    secElement.textContent = addLeadingZero(seconds);
}