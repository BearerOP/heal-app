const otpStore = new Map(); // Use a Map to store OTPs

/**
 * Stores an OTP in memory with an expiration time.
 * @param {string} mobile - The mobile number associated with the OTP.
 * @param {number} otp - The OTP to store.
 * @param {number} expiresIn - Expiration time in milliseconds (default: 5 minutes).
 */
function storeOtp(mobile, otp, expiresIn = 5 * 60 * 1000) {
    otpStore.set(mobile, { otp, expiresAt: Date.now() + expiresIn });

    // Automatically delete the OTP after expiration
    setTimeout(() => {
        otpStore.delete(mobile);
    }, expiresIn);
}

/**
 * Retrieves the stored OTP for a given mobile number.
 * @param {string} mobile - The mobile number associated with the OTP.
 * @returns {number | null} - The OTP if it exists and is not expired, otherwise null.
 */
function getOtp(mobile) {
    const storedOtp = otpStore.get(mobile);
    if (!storedOtp || storedOtp.expiresAt <= Date.now()) {
        return null; // OTP not found or expired
    }
    return storedOtp.otp;
}

/**
 * Logs all stored OTPs for debugging purposes.
 */
function viewStoredOtps() {
    console.log("Stored OTPs:");
    otpStore.forEach((value, key) => {
        console.log(`Mobile: ${key}, OTP: ${value.otp}, Expires At: ${new Date(value.expiresAt).toLocaleString()}`);
    });
}

module.exports = { storeOtp, getOtp, viewStoredOtps };