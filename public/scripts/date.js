
let old = document.getElementById('half-add-time');
let timeInMilli = old.innerText;

const addedTimeInMilli = parseInt(timeInMilli) + 2700000;
const addedTimeInLocale = (new Date(addedTimeInMilli)).toLocaleTimeString();


const [time, modifier] = addedTimeInLocale.split(" "); // Split into time and AM/PM
const [hours, minutes] = time.split(":"); // Split into hours and minute

const formattedTime = `${hours}:${minutes} ${modifier}`;
old.innerText = formattedTime;


// Fixed time showing XX even after 10:00 START
const todayNumberDailyElements = document.getElementsByClassName("display-none-on10:30");
if (addedTimeInLocale === "10:30:00 PM" || addedTimeInLocale === "10:30:00 pm") {
    // Loop through all elements with the class
    for (let i = 0; i < todayNumberDailyElements.length; i++) {
        todayNumberDailyElements[i].style.display = "none";
    }
}
// Fixed time showing XX even after 10:00 END
