// data/games.js

const games = [
  {
    id: 0,
    name: "Faridabad",
    frequency: "daily",
    resultCountPerDay: 1,
    expectedTimeRange: {
      from: "11:00 AM",
      to: "11:59 PM"
    }
  },
  {
    id: 1,
    name: "Ghaziabad",
    frequency: "daily",
    resultCountPerDay: 1,
    expectedTimeRange: {
      from: "11:00 AM",
      to: "11:59 PM"
    }
  },
  {
    id: 2,
    name: "Disawar",
    frequency: "daily",
    resultCountPerDay: 1,
    expectedTimeRange: {
      from: "05:00 AM",
      to: "07:00 AM"
    }
  },
  {
    id:3,
    name: "Delhi Bazar",
    frequency: "daily",
    resultCountPerDay: 1,
    expectedTimeRange: {
      from: "12:00 PM",
      to: "03:00 PM"
    }
  },
  {
    id: 4,
    name: "Gali",
    frequency: "daily",
    resultCountPerDay: 1,
    expectedTimeRange: {
      from: "10:00 PM",
      to: "12:00 AM"
    }
  },
  {
    id: 5,
    name: "Mumbai Starline",
    frequency: "interval-slot",
    resultCountPerDay: 24,
    intervalSlot: {
      start: "10:00",
      end: "22:00",
      everyMinutes: 30
    }
  },
  {
    id: 6,
    name: "Super Dubai",
    frequency: "interval-slot",   
    resultCountPerDay: 12,
    intervalSlot: {
      start: "10:00",
      end: "22:00",
      everyMinutes: 60
    }
  },
  {
    id: 7,
    name: "Super Faridabad",
    frequency: "interval-slot",   
    resultCountPerDay: 16,
    intervalSlot: {
      start: "10:00",
      end: "22:00",
      everyMinutes: 45
    }
  }
];

module.exports = games;