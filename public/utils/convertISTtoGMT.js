async function convertISTtoGMT(istTimestamp) {
    // Create a Date object from the input timestamp
    let date = new Date(istTimestamp);
  
    // IST is UTC+5:30, so subtract 5 hours and 30 minutes to get GMT
    let istOffset = 5 * 60 + 30; // Total minutes offset for IST
    date.setMinutes(date.getMinutes() - istOffset);
  
    // Format the date to 24-hour format
    let year = date.getUTCFullYear();
    let month = String(date.getUTCMonth() + 1).padStart(2, '0');
    let day = String(date.getUTCDate()).padStart(2, '0');
    let hours = String(date.getUTCHours()).padStart(2, '0');
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }

module.exports = { convertISTtoGMT }