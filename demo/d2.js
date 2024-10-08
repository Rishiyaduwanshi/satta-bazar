    const justInMilli = new Date("2013-12-09T12:27:00.000Z").getTime();
    console.log(justInMilli)
    const justTime = new Date(justInMilli);
    console.log(justTime.toLocaleTimeString())

    const halfHr = 1800000;
    const addedHalf = halfHr+justInMilli;
    
    const date = new Date(justInMilli)
    const newDate = new Date(addedHalf); 
    

    
    const updatedTime = newDate.toLocaleTimeString()
    console.log(updatedTime)
    const splitTime = updatedTime.split(":");
    const am_pm = splitTime[2].substring(3);

    const amPm = (updatedTime.substring(0,5),am_pm.toUpperCase())

    console.log(am_pm,amPm)