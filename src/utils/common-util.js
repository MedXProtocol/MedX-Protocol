export const promisify = (inner) =>
    new Promise((resolve, reject) =>
    inner((err, res) => {
        if (err) { reject(err) }

        resolve(res);
    })
);

export const isNotEmptyString = (value) => {
    return value && value !== "";
};

export const msToTime = (duration) => {
    
        if (duration <= 0)
            return "Ended";
    
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
    
        return hours + " h : " + minutes + " m : " + seconds + " s";
        //return hours + " hours : " + minutes + " minutes";
    }