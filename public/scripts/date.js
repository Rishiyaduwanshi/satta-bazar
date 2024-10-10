let today = document.getElementById('today');
const todayDate = new Date();


today.innerText = todayDate.toDateString();

const todayClass = document.querySelector(".today");
todayClass.innerText = todayDate.toDateString();


let old = document.getElementById('half-add-time');
let timeInMilli = old.innerText;

const addedTimeInMilli = parseInt(timeInMilli) + 1800000;
const addedTimeInLocale = (new Date(addedTimeInMilli)).toLocaleTimeString();


const [time, modifier] = addedTimeInLocale.split(" "); // Split into time and AM/PM
const [hours, minutes] = time.split(":"); // Split into hours and minute

const formattedTime = `${hours}:${minutes} ${modifier}`;
old.innerText = formattedTime;


// Fixed time showing XX even after 10:00 START
const todayNumberDaily = document.getElementById('today-number-daily')
if(addedTimeInLocale=="10:30:00 PM" || addedTimeInLocale=="10:30:00 pm"){
    todayNumberDaily.innerText="END";
}
// Fixed time showing XX even after 10:00 END
