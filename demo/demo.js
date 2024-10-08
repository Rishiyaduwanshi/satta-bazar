
// const times = ["12:00", "21:19", "13:11", "16:37", "11:00"]

// const date = new Date()

// // Extracting date and time
// const hours = date.getHours();
// const minutes = date.getMinutes();

// console.log(`Time: ${hours}:${minutes}`);


// const times = ["12:00", "21:19", "13:11", "16:37", "11:00"];
// const date = new Date(); // Current date

// // Convert the time strings into Date objects
// const timeObjects = times.map(time => {
//     const [hours, minutes] = time.split(':').map(Number);
//     const timeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
//     console.log(timeDate)
//     return timeDate;
// });

// // Sort the time objects in descending order
// timeObjects.sort((a, b) => b - a);

// // Get the latest two times
// const latestTwoTimes = timeObjects.slice(0, 2).map(time => {
//     const hours = time.getHours().toString().padStart(2, '0');
//     const minutes = time.getMinutes().toString().padStart(2, '0');
//     return `${hours}:${minutes}`;
// });

// console.log(`Latest two times: ${latestTwoTimes.join(', ')}`);



const date = new Date();
console.log(date.toLocaleDateString())
console.log(date.toDateString())
console.log(date.toLocaleString())
console.log(date.toISOString())
console.log(date.toLocaleTimeString())

// const date = new Date();

// // Get hours and minutes
// const hours = date.getHours();
// const minutes = date.getMinutes();

// // Format them to always show two digits
// const formattedHours = String(hours).padStart(2, '0');
// const formattedMinutes = String(minutes).padStart(2, '0');

// console.log(`${formattedHours}:${formattedMinutes}`); // Output will be in HH:mm format



// const date = new Date();

// const d = "12:45";
// const [hrs, min] = d.split(':');

// // Naye date object mai current din aur time set karna (12:45)
// const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hrs, min);

// // 30 minutes add karna
// newDate.setMinutes(newDate.getMinutes() + 30);

// // Updated time ko string format mai convert karna
// const updatedTime = newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// console.log("Original time:", `${hrs}:${min}`);  // Original time: 12:45
// console.log("Updated time (after 30 minutes):", updatedTime);  // Updated time: 13:15
// const date  = new Date("2024-10-05T18:29:59.999+00:00")
// console.log(date)
// console.log(date.toLocaleTimeString())
// console.log(date.toUTCString())